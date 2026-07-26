from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from playwright.sync_api import sync_playwright


BASE_URL = "http://localhost:9002"
OUT_DIR = Path(".omx/state/site-redesign/browser-trace")
ROUTES = ["/", "/about/", "/projects/", "/writing/", "/notes/", "/atlas/", "/card-lab/"]
THEMES = ["light", "dark"]
VIEWPORTS = [
    ("desktop", {"width": 1672, "height": 941}),
    ("macbook", {"width": 1440, "height": 900}),
    ("mobile", {"width": 390, "height": 844}),
]


def safe_name(route: str, viewport_name: str, theme_name: str) -> str:
    name = "home" if route == "/" else route.strip("/").replace("/", "-")
    return f"{theme_name}-{viewport_name}-{name}"


def audit_metrics(page: Any, route: str, viewport_name: str, theme_name: str) -> dict[str, Any]:
    return page.evaluate(
        """({ route, viewportName, themeName }) => {
          const doc = document.documentElement;
          const headerShell = document.querySelector("header > div")?.getBoundingClientRect();
          const mainChild = document.querySelector("main > div")?.getBoundingClientRect();
          const firstHeading = document.querySelector("main h1")?.getBoundingClientRect();
          const coordinate = document.querySelector("[data-tooltip='Cambridge MA']");
          const atlasRibbon = Array.from(document.querySelectorAll("a"))
            .find((el) => (el.textContent || "").replace(/\\s+/g, " ").includes("THE ATLAS"));
          const missionText = (document.body.textContent || "").includes("MISSION");
          const compassText = Array.from(document.querySelectorAll("svg text"))
            .some((el) => (el.textContent || "").trim() === "N");
          const activeNav = document.querySelector("header a[data-active='true']");
          const activeNavRect = activeNav?.getBoundingClientRect();
          const activeNavUnderlineBottom = activeNavRect ? Math.round(activeNavRect.bottom) : null;
          const visibleElements = Array.from(document.querySelectorAll("body *")).filter((el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
          });
          const overflowers = visibleElements
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              if (style.position === "fixed") return false;
              if (style.pointerEvents === "none") return false;
              if (window.SVGElement && el instanceof SVGElement) return false;
              return rect.left < -1 || rect.right > window.innerWidth + 1;
            })
            .slice(0, 20)
            .map((el) => {
              const rect = el.getBoundingClientRect();
              return {
                tag: el.tagName.toLowerCase(),
                className: typeof el.className === "string" ? el.className : "",
                text: (el.textContent || "").trim().slice(0, 80),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              };
            });
          const navBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
          const splash = document.querySelector("[aria-label='Loading']");
          return {
            route,
            viewportName,
            themeName,
            url: window.location.href,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            scrollWidth: doc.scrollWidth,
            scrollHeight: doc.scrollHeight,
            belowFoldPx: Math.max(0, doc.scrollHeight - window.innerHeight),
            horizontalOverflow: doc.scrollWidth > window.innerWidth + 1,
            overflowers,
            headerLeft: headerShell ? Math.round(headerShell.left) : null,
            headerRight: headerShell ? Math.round(headerShell.right) : null,
            contentLeft: mainChild ? Math.round(mainChild.left) : null,
            contentRight: mainChild ? Math.round(mainChild.right) : null,
            firstHeadingLeft: firstHeading ? Math.round(firstHeading.left) : null,
            firstHeadingTop: firstHeading ? Math.round(firstHeading.top) : null,
            headingAboveHeader: firstHeading ? firstHeading.top < navBottom - 1 : false,
            hasCoordinateTooltip: Boolean(coordinate),
            hasAtlasRibbon: Boolean(atlasRibbon),
            missionText,
            compassText,
            activeNavUnderlineBottom,
            splashStillMounted: Boolean(splash),
            bodyClass: document.body.className
          };
        }""",
        {"route": route, "viewportName": viewport_name, "themeName": theme_name},
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    console_messages: list[dict[str, str]] = []
    page_errors: list[str] = []
    results: list[dict[str, Any]] = []

    with sync_playwright() as p:
        browser = p.webkit.launch()

        splash_context = browser.new_context(
            viewport={"width": 1672, "height": 941},
            color_scheme="light",
            service_workers="allow",
        )
        splash_page = splash_context.new_page()
        splash_page.on("console", lambda msg: console_messages.append({"type": msg.type, "text": msg.text}))
        splash_page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        splash_page.goto(f"{BASE_URL}/", wait_until="domcontentloaded")
        splash_page.wait_for_timeout(250)
        splash_initial = {
            "mounted": splash_page.locator("[aria-label='Loading']").count() > 0,
            "visible": splash_page.locator("[aria-label='Loading'][data-visible='true']").count() > 0,
        }
        splash_page.wait_for_timeout(3400)
        splash_final = {
            "mounted": splash_page.locator("[aria-label='Loading']").count() > 0,
            "visible": splash_page.locator("[aria-label='Loading'][data-visible='true']").count() > 0,
        }
        splash_context.close()

        for theme_name in THEMES:
            context = browser.new_context(
                viewport={"width": 1672, "height": 941},
                color_scheme=theme_name,
                service_workers="allow",
            )
            context.add_init_script(
                f"""
                localStorage.setItem('theme', '{theme_name}');
                localStorage.setItem('splashLastShownAt', String(Date.now()));
                """
            )
            context.tracing.start(screenshots=True, snapshots=True, sources=True)
            page = context.new_page()
            page.on("console", lambda msg: console_messages.append({"type": msg.type, "text": msg.text}))
            page.on("pageerror", lambda exc: page_errors.append(str(exc)))

            for viewport_name, viewport in VIEWPORTS:
                for route in ROUTES:
                    page.set_viewport_size(viewport)
                    page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
                    page.wait_for_timeout(450)
                    screenshot = OUT_DIR / f"{safe_name(route, viewport_name, theme_name)}.png"
                    page.screenshot(path=str(screenshot), full_page=True)
                    metrics = audit_metrics(page, route, viewport_name, theme_name)
                    metrics["screenshot"] = str(screenshot)
                    results.append(metrics)

            context.tracing.stop(path=str(OUT_DIR / f"playwright-trace-{theme_name}.zip"))
            context.close()

        browser.close()

    failures = []
    if not splash_initial["mounted"] or not splash_initial["visible"]:
        failures.append("Splash overlay was not visible during the initial load.")
    if splash_final["visible"]:
        failures.append("Splash overlay remained visible after the expected fade-out.")

    for result in results:
        if result["horizontalOverflow"]:
            failures.append(f"{result['themeName']} {result['viewportName']} {result['route']} has horizontal overflow.")
        if result["headingAboveHeader"]:
            failures.append(f"{result['themeName']} {result['viewportName']} {result['route']} heading overlaps the header.")
        if result["overflowers"]:
            failures.append(f"{result['themeName']} {result['viewportName']} {result['route']} has overflowing elements.")
        if result["route"] == "/" and result["viewportName"] == "macbook" and result["belowFoldPx"] > 240:
            failures.append(f"{result['themeName']} macbook homepage leaves {result['belowFoldPx']}px below the fold.")
        if result["route"] == "/" and not result["hasCoordinateTooltip"]:
            failures.append(f"{result['themeName']} {result['viewportName']} homepage is missing the Cambridge tooltip coordinate.")
        if result["route"] == "/" and not result["hasAtlasRibbon"]:
            failures.append(f"{result['themeName']} {result['viewportName']} homepage is missing the Atlas ribbon.")
        if result["route"] == "/" and result["missionText"]:
            failures.append(f"{result['themeName']} {result['viewportName']} homepage still renders mission text.")
        if result["route"] == "/" and result["compassText"]:
            failures.append(f"{result['themeName']} {result['viewportName']} homepage still renders the compass watermark.")

    console_errors = [
        message for message in console_messages
        if message["type"] in {"error", "warning"}
        and "favicon" not in message["text"].lower()
        and "service worker" not in message["text"].lower()
    ]
    for message in console_errors:
        failures.append(f"Console {message['type']}: {message['text'][:160]}")
    for error in page_errors:
        failures.append(f"Page error: {error[:160]}")

    report = {
        "tool": "browser-trace fallback via Playwright tracing",
        "note": "The browse CLI required by the browser-trace skill was not installed, so this run used Playwright tracing, screenshots, DOM snapshots, console capture, and layout probes.",
        "baseUrl": BASE_URL,
        "splash": {
            "initial": splash_initial,
            "afterFade": splash_final,
        },
        "routes": results,
        "consoleMessages": console_messages,
        "pageErrors": page_errors,
        "failures": failures,
        "pass": len(failures) == 0,
        "artifacts": {
            "traces": [str(OUT_DIR / f"playwright-trace-{theme_name}.zip") for theme_name in THEMES],
            "screenshotsDir": str(OUT_DIR),
        },
    }

    (OUT_DIR / "report.json").write_text(json.dumps(report, indent=2))
    print(json.dumps({"pass": report["pass"], "failures": failures, "artifact": str(OUT_DIR / "report.json")}, indent=2))


if __name__ == "__main__":
    main()
