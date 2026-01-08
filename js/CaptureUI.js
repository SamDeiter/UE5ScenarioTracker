/**
 * CaptureUI.js
 * Centralized coordination for UE5 captures.
 * Prevents implicit capture and enforces explicit manual triggers.
 */

window.CaptureUI = {
  active: false,
  readinessInterval: null,

  init() {
    console.log("[CaptureUI] Initializing...");
    this.setupEventListeners();
    this.startReadinessPolling();
  },

  setupEventListeners() {
    const btnCapture = document.getElementById("btn-capture-now");
    const btnDryRun = document.getElementById("btn-capture-dry");

    btnCapture.addEventListener("click", () => this.triggerCapture(false));
    btnDryRun.addEventListener("click", () => this.triggerCapture(true));

    // Update metadata preview when scenario or step changes
    window.addEventListener("scenario:step", (e) =>
      this.updateMetadata(e.detail)
    );
  },

  updateMetadata(detail) {
    document.getElementById("meta-scenario-id").innerText =
      detail.scenarioId || "N/A";
    document.getElementById("meta-recipe-id").innerText =
      detail.stepId || "setup";
    document.getElementById(
      "meta-path-preview"
    ).innerText = `.../assets/generated/${detail.scenarioId}/`;
  },

  startReadinessPolling() {
    if (this.readinessInterval) clearInterval(this.readinessInterval);

    this.readinessInterval = setInterval(async () => {
      await this.pollReadiness();
    }, 2000); // Poll every 2 seconds
  },

  async pollReadiness() {
    try {
      // We use ActionRegistry to send a specialized readiness query
      const response = await ActionRegistry.execute({ type: "GET_READINESS" });

      // This response comes back from Python return value via the bridge
      // Expecting { ready: bool, reason: string }
      this.updateReadinessUI(
        response || { ready: false, reason: "No response from Bridge" }
      );
    } catch (err) {
      this.updateReadinessUI({ ready: false, reason: "Bridge Offline" });
    }
  },

  updateReadinessUI(status) {
    const dot = document.getElementById("capture-status-dot");
    const text = document.getElementById("capture-status-text");
    const btnCapture = document.getElementById("btn-capture-now");
    const btnDryRun = document.getElementById("btn-capture-dry");

    text.innerText = status.reason.toUpperCase();
    dot.className =
      "w-3 h-3 rounded-full shadow-lg transition-colors duration-500";

    if (status.ready) {
      dot.classList.add("ready");
      text.className = "text-emerald-500 font-bold";
      btnCapture.disabled = false;
      btnDryRun.disabled = false;
    } else {
      dot.classList.add("bg-red-600");
      if (status.reason === "No response from Bridge")
        dot.classList.add("pulse-red");
      text.className = "text-red-500";
      btnCapture.disabled = true;
      btnDryRun.disabled = true;
    }
  },

  async triggerCapture(dryRun = false) {
    const mode = document.getElementById("capture-mode").value;
    const scenarioId = document.getElementById("meta-scenario-id").innerText;
    const recipeId = document.getElementById("meta-recipe-id").innerText;

    this.log(
      `[REQ] ${
        dryRun ? "DRY RUN" : "CAPTURE"
      } | MODE: ${mode} | ID: ${scenarioId}`
    );

    const payload = {
      type: "CAPTURE_REQUEST",
      scenarioId: scenarioId,
      recipeId: recipeId,
      mode: mode,
      dryRun: dryRun,
    };

    try {
      const result = await ActionRegistry.execute(payload);
      this.log(`[RES] Request sent. Check UE5 Output Log.`);
    } catch (err) {
      this.log(`[ERR] Failed to communicate with UE5: ${err.message}`);
    }
  },

  log(msg) {
    const logPanel = document.getElementById("capture-log");
    const entry = document.createElement("div");
    const time = new Date().toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    entry.innerText = `[${time}] ${msg}`;
    logPanel.prepend(entry);
  },
};

// Start logic
document.addEventListener("DOMContentLoaded", () => CaptureUI.init());
