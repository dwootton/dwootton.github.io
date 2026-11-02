"use strict";
document.getElementById("copy-citation").addEventListener("click", async () => {
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText(document.getElementById("citation-text").textContent);
    status.textContent = "Copied.";
  } catch {
    status.textContent = "Select the citation above and copy it manually.";
  }
});
