/* Original, hand-authored walkthrough fixtures. Positions are schematic, and
 * the Python examples are illustrative text: no analysis or model is executed. */
(() => {
  "use strict";

  const questions = [
    {
      id: "damage-cost",
      title: "How do repair costs vary by damage level?",
      description: "Compare reported repair costs across damage categories. This question connects the severity recorded for a strike with its reported financial consequences.",
      fields: ["DAMAGE_LEVEL", "REPAIR_COST"],
      x: 20, y: 23,
      code: `df.groupby("DAMAGE_LEVEL")["REPAIR_COST"].agg(
    ["count", "median", "mean"]
)`,
    },
    {
      id: "ingestion-cost",
      title: "How do repair costs differ across ingestion reports?",
      description: "Group reported repair costs by the ingestion field to explore whether the recorded categories warrant a closer comparison. Missing costs and reporting coverage would need inspection before interpreting a result.",
      fields: ["INGESTED", "REPAIR_COST"],
      x: 36, y: 16,
      code: `df.groupby("INGESTED")["REPAIR_COST"].agg(
    ["count", "median", "mean"]
)`,
    },
    {
      id: "phase-damage",
      title: "Which damage levels are reported in each flight phase?",
      description: "Cross-tabulate flight phase and recorded damage level to inspect the mix of reports. Report counts alone do not establish the risk of a phase of flight.",
      fields: ["PHASE_OF_FLIGHT", "DAMAGE_LEVEL"],
      x: 17, y: 48,
      code: `df.groupby(
    ["PHASE_OF_FLIGHT", "DAMAGE_LEVEL"]
).size().unstack(fill_value=0)`,
    },
    {
      id: "monthly-reports",
      title: "How are strike reports distributed through the year?",
      description: "Extract the month from each incident date and count reports to explore a possible seasonal pattern. A full analysis would also examine the years covered and differences in reporting volume.",
      fields: ["INCIDENT_DATE"],
      x: 72, y: 20,
      code: `import pandas as pd

dates = pd.to_datetime(df["INCIDENT_DATE"], errors="coerce")
dates.dt.month.value_counts().sort_index()`,
    },
    {
      id: "time-damage",
      title: "How does the reported damage mix vary by time of day?",
      description: "Compare the distribution of damage categories within each recorded time-of-day category. This opens a question about reporting patterns without treating those patterns as measured exposure or risk.",
      fields: ["TIME_OF_DAY", "DAMAGE_LEVEL"],
      x: 86, y: 42,
      code: `import pandas as pd

pd.crosstab(
    df["TIME_OF_DAY"],
    df["DAMAGE_LEVEL"],
    normalize="index",
)`,
    },
    {
      id: "species-cost",
      title: "How do reported repair costs vary by species category?",
      description: "Summarize the costs attached to each species category. The number of available cost observations is included so sparse categories can be identified before making comparisons.",
      fields: ["SPECIES_CATEGORY", "REPAIR_COST"],
      x: 49, y: 34,
      code: `df.groupby("SPECIES_CATEGORY")["REPAIR_COST"].agg(
    ["count", "median", "mean"]
)`,
    },
    {
      id: "class-damage",
      title: "How do damage reports differ across aircraft classes?",
      description: "Compare aircraft classes using counts of their reported damage categories. Differences in fleet size and flight activity would be needed to move from report counts to a risk comparison.",
      fields: ["AIRCRAFT_CLASS", "DAMAGE_LEVEL"],
      x: 30, y: 66,
      code: `df.groupby(
    ["AIRCRAFT_CLASS", "DAMAGE_LEVEL"]
).size().unstack(fill_value=0)`,
    },
    {
      id: "type-cost",
      title: "How do repair-cost summaries vary by aircraft type?",
      description: "Explore the number and typical size of reported repair costs for each aircraft type. This is a starting point for checking category definitions and sample sizes, rather than ranking aircraft safety.",
      fields: ["AIRCRAFT_TYPE", "REPAIR_COST"],
      x: 48, y: 81,
      code: `df.groupby("AIRCRAFT_TYPE")["REPAIR_COST"].agg(
    ["count", "median", "mean"]
)`,
    },
    {
      id: "engines-ingestion",
      title: "How are ingestion reports distributed across engine counts?",
      description: "Cross-tabulate engine count with the recorded ingestion categories. The table would help identify combinations worth inspecting, with aircraft design and reporting context left for further analysis.",
      fields: ["ENGINE_COUNT", "INGESTED"],
      x: 52, y: 58,
      code: `df.groupby(
    ["ENGINE_COUNT", "INGESTED"]
).size().unstack(fill_value=0)`,
    },
    {
      id: "airport-reports",
      title: "Which airports appear most often in the strike reports?",
      description: "Count reports associated with each airport to explore where the dataset is concentrated. This describes the submitted records; comparing airport risk would require flight activity and reporting context.",
      fields: ["AIRPORT"],
      x: 75, y: 70,
      code: `df["AIRPORT"].value_counts().head(15)`,
    },
    {
      id: "operator-cost",
      title: "How do reported repair-cost summaries vary by operator?",
      description: "Group repair costs by operator to inspect the coverage and distribution of recorded costs. Fleet composition, operations, and missing values would be important context for any interpretation.",
      fields: ["OPERATOR", "REPAIR_COST"],
      x: 87, y: 86,
      code: `df.groupby("OPERATOR")["REPAIR_COST"].agg(
    ["count", "median", "mean"]
)`,
    },
    {
      id: "phase-ingestion",
      title: "How are ingestion reports distributed by flight phase?",
      description: "Connect flight phase with the ingestion field to inspect another view of the same records. This question shares a field with several neighboring analysis ideas, illustrating how an exploration can branch.",
      fields: ["PHASE_OF_FLIGHT", "INGESTED"],
      x: 12, y: 85,
      code: `df.groupby(
    ["PHASE_OF_FLIGHT", "INGESTED"]
).size().unstack(fill_value=0)`,
    },
  ];

  const points = document.getElementById("map-points");
  const select = document.getElementById("analysis-select");
  const title = document.getElementById("detail-title");
  const description = document.getElementById("detail-description");
  const fields = document.getElementById("detail-fields");
  const code = document.getElementById("detail-code");
  const visitButton = document.getElementById("visit-button");
  const resetButton = document.getElementById("reset-demo");
  const visitedCount = document.getElementById("visited-count");
  const history = document.getElementById("history-list");
  const status = document.getElementById("map-status");

  if ([points, select, title, description, fields, code, visitButton,
    resetButton, visitedCount, history, status].some((element) => !element)) {
    return;
  }

  const reviewed = new Set();
  const buttons = new Map();
  let selectedId = questions[0].id;

  function chooseQuestion(id, announce = true) {
    const question = questions.find((item) => item.id === id);
    if (!question) return;

    selectedId = id;
    select.value = id;
    title.textContent = question.title;
    description.textContent = question.description;
    fields.textContent = `Fields: ${question.fields.join(" · ")}`;
    code.textContent = "# Illustrative Python; not executed here.\n"
      + "# df represents a wildlife-strike table.\n\n" + question.code;
    visitButton.disabled = reviewed.has(id);
    visitButton.textContent = reviewed.has(id) ? "Reviewed" : "Mark as reviewed";

    for (const [buttonId, button] of buttons) {
      const selected = buttonId === id;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    }

    if (announce) {
      status.textContent = `Selected: ${question.title} ${reviewed.has(id)
        ? "You have reviewed this question."
        : "Read the example, then mark it as reviewed."}`;
    }
  }

  points.replaceChildren();
  select.replaceChildren();

  questions.forEach((question, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-point";
    button.style.left = `${question.x}%`;
    button.style.top = `${question.y}%`;
    button.style.width = "40px";
    button.style.height = "40px";
    button.textContent = String(index + 1);
    button.title = question.title;
    button.setAttribute("aria-label", `Question ${index + 1}: ${question.title}`);
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => chooseQuestion(question.id));
    points.append(button);
    buttons.set(question.id, button);

    const option = document.createElement("option");
    option.value = question.id;
    option.textContent = `${index + 1}. ${question.title}`;
    select.append(option);
  });

  select.addEventListener("change", () => chooseQuestion(select.value));

  visitButton.addEventListener("click", () => {
    if (reviewed.has(selectedId)) return;

    const question = questions.find((item) => item.id === selectedId);
    reviewed.add(selectedId);
    buttons.get(selectedId).classList.add("visited");
    visitedCount.textContent = String(reviewed.size);

    const item = document.createElement("li");
    const revisit = document.createElement("button");
    revisit.type = "button";
    revisit.textContent = question.title;
    revisit.addEventListener("click", () => chooseQuestion(question.id));
    item.append(revisit);
    history.append(item);

    chooseQuestion(selectedId, false);
    status.textContent = reviewed.size === questions.length
      ? "You have reviewed all 12 example questions. Reset to explore them again."
      : `Marked as reviewed. ${reviewed.size} of ${questions.length} example questions reviewed.`;
  });

  resetButton.addEventListener("click", () => {
    reviewed.clear();
    history.replaceChildren();
    visitedCount.textContent = "0";
    for (const button of buttons.values()) button.classList.remove("visited");
    chooseQuestion(questions[0].id, false);
    status.textContent = "Walkthrough reset. Choose a question to explore its illustrative analysis idea.";
  });

  history.replaceChildren();
  visitedCount.textContent = "0";
  chooseQuestion(selectedId, false);
  status.textContent = "Choose a question to explore its illustrative analysis idea. No code runs in this walkthrough.";
  document.getElementById("demo-controls").hidden = false;
})();
