/* Display saved Ptolemy analyses and coordinates without recomputing the map. */
(() => {
  "use strict";

  const width = 800;
  const height = 460;
  const padding = 24;
  const svgNamespace = "http://www.w3.org/2000/svg";

  function validatePoints(data) {
    if (!data || !Array.isArray(data.points) || data.points.length === 0) {
      throw new Error("The saved analysis map does not contain any points.");
    }

    const ids = new Set();
    for (const point of data.points) {
      if (!point || typeof point.id !== "string" || !point.id.trim()
        || ids.has(point.id) || typeof point.title !== "string"
        || !point.title.trim() || !Number.isFinite(point.x)
        || !Number.isFinite(point.y)
        || (point.code !== undefined && typeof point.code !== "string")
        || (point.description !== undefined && typeof point.description !== "string")
        || (point.image !== undefined && (typeof point.image !== "string"
          || !/^plots\/[A-Za-z0-9_.-]+\.png$/.test(point.image)))
        || (point.fields !== undefined && (!Array.isArray(point.fields)
          || point.fields.some((field) => typeof field !== "string")))) {
        throw new Error("The saved analysis map contains invalid point data.");
      }
      ids.add(point.id);
    }
    return data.points;
  }

  function fitCoordinates(points) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const point of points) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }

    const spanX = maxX - minX;
    const spanY = maxY - minY;
    const scale = Math.min(
      spanX ? (width - padding * 2) / spanX : Infinity,
      spanY ? (height - padding * 2) / spanY : Infinity,
    );
    const uniformScale = Number.isFinite(scale) ? scale : 1;
    const offsetX = (width - spanX * uniformScale) / 2;
    const offsetY = (height - spanY * uniformScale) / 2;

    return points.map((point) => ({
      x: offsetX + (point.x - minX) * uniformScale,
      y: offsetY + (point.y - minY) * uniformScale,
    }));
  }

  const playground = document.getElementById("playground");
  const map = document.getElementById("map");
  const status = document.getElementById("map-status");
  const title = document.getElementById("analysis-title");
  const description = document.getElementById("analysis-description");
  const code = document.getElementById("analysis-code");
  const fields = document.getElementById("analysis-fields");
  const plot = document.getElementById("analysis-plot");
  const clearButton = document.getElementById("clear-selection");
  if ([playground, map, status, title, description, code, fields]
    .some((element) => !element)) return;

  let pinnedId = null;
  let pointCount = 0;
  let activeImage;
  const circles = new Map();

  function showAnalysis(point) {
    title.textContent = point ? point.title : "Explore the analysis map";
    description.textContent = point?.description || "";
    description.hidden = !description.textContent;
    fields.textContent = point?.fields?.length ? `Fields: ${point.fields.join(", ")}` : "";
    fields.hidden = !fields.textContent;
    code.textContent = point?.code || "";
    code.hidden = !code.textContent;
    if (code.parentElement?.tagName === "PRE") {
      code.parentElement.hidden = code.hidden;
    }

    const nextImage = point?.image || null;
    if (plot && nextImage !== activeImage) {
      plot.hidden = true;
      plot.removeAttribute("src");
      plot.setAttribute("alt", nextImage ? `Saved analysis output: ${point.title}` : "");
      activeImage = nextImage;
      if (nextImage) plot.setAttribute("src", nextImage);
    }

    for (const [id, circle] of circles) {
      circle.classList.toggle("selected", id === point?.id);
      circle.classList.toggle("pinned", id === pinnedId);
      circle.setAttribute("aria-pressed", String(id === pinnedId));
    }
    if (clearButton) {
      clearButton.disabled = pinnedId === null;
      clearButton.hidden = pinnedId === null;
    }
  }

  function showInstructions() {
    status.textContent = `${pointCount} saved analyses. Hover or focus to inspect; click or tap to keep an analysis selected.`;
  }

  function clearSelection() {
    pinnedId = null;
    showAnalysis(null);
    showInstructions();
  }

  function pinAnalysis(point) {
    if (pinnedId === point.id) {
      clearSelection();
      return;
    }
    pinnedId = point.id;
    showAnalysis(point);
    status.textContent = `${pointCount} saved analyses. Selection pinned. Click it again, choose another point, or press Escape to clear.`;
  }

  function makePoint(point, position) {
    const hitArea = document.createElementNS(svgNamespace, "circle");
    hitArea.setAttribute("class", "point-hit");
    hitArea.setAttribute("cx", String(position.x));
    hitArea.setAttribute("cy", String(position.y));
    hitArea.setAttribute("r", "4.5");
    hitArea.setAttribute("fill", "transparent");
    hitArea.setAttribute("stroke", "transparent");
    hitArea.setAttribute("stroke-width", "24");
    hitArea.setAttribute("vector-effect", "non-scaling-stroke");
    hitArea.setAttribute("aria-hidden", "true");

    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("class", "point");
    circle.setAttribute("cx", String(position.x));
    circle.setAttribute("cy", String(position.y));
    circle.setAttribute("r", "7.5");
    circle.setAttribute("data-id", point.id);
    circle.setAttribute("data-x", String(point.x));
    circle.setAttribute("data-y", String(point.y));
    circle.setAttribute("tabindex", "0");
    circle.setAttribute("role", "button");
    circle.setAttribute("aria-label", point.title);
    circle.setAttribute("aria-pressed", "false");
    const tooltip = document.createElementNS(svgNamespace, "title");
    tooltip.textContent = point.title;
    circle.append(tooltip);

    const inspect = () => {
      if (pinnedId === null) showAnalysis(point);
    };
    for (const target of [hitArea, circle]) {
      target.addEventListener("pointerenter", inspect);
      target.addEventListener("click", () => pinAnalysis(point));
    }
    circle.addEventListener("focus", inspect);
    circle.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
        event.preventDefault();
        pinAnalysis(point);
      }
    });
    circles.set(point.id, circle);
    return { hitArea, circle };
  }

  if (clearButton) clearButton.addEventListener("click", clearSelection);
  if (plot) {
    plot.addEventListener("load", () => {
      plot.hidden = !activeImage || plot.getAttribute("src") !== activeImage;
    });
    plot.addEventListener("error", () => { plot.hidden = true; });
  }
  playground.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      clearSelection();
    }
  });

  map.setAttribute("viewBox", `0 0 ${width} ${height}`);
  map.setAttribute("preserveAspectRatio", "xMidYMid meet");
  showAnalysis(null);
  status.textContent = "Loading the saved analysis map…";

  async function loadMap() {
    let data;
    try {
      const response = await fetch("./bird-strikes.json");
      if (!response.ok) throw new Error("Map request failed.");
      data = await response.json();
    } catch {
      status.textContent = "The saved analysis map could not be loaded. Please try refreshing the page.";
      return;
    }

    let points;
    try {
      points = validatePoints(data);
    } catch (error) {
      status.textContent = error.message;
      return;
    }

    const positions = fitCoordinates(points);
    const hitLayer = document.createElementNS(svgNamespace, "g");
    const pointLayer = document.createElementNS(svgNamespace, "g");
    points.forEach((point, index) => {
      const { hitArea, circle } = makePoint(point, positions[index]);
      hitLayer.append(hitArea);
      pointLayer.append(circle);
    });
    // Keep visible points above every expanded hit area in dense regions.
    map.append(hitLayer, pointLayer);
    pointCount = points.length;
    showInstructions();
  }

  loadMap();
})();
