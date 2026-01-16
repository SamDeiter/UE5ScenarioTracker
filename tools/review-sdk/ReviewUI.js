/**
 * ReviewUI Module
 * Implements the user interface for the ReviewCore SDK using Web Components.
 */

class ReviewBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = { currentIndex: 0, itemStatuses: {} };
    this.items = [];
    this.onPrev = null;
    this.onNext = null;
    this.onVerify = null;
    this.onIssue = null;
    this.onExport = null;
  }

  connectedCallback() {
    this.render();
  }

  update(state, items) {
    this.state = state;
    this.items = items;
    this.render();
  }

  render() {
    const currentItem = this.items[this.state.currentIndex];
    const status = (
      this.state.itemStatuses[currentItem?.id]?.status || "pending"
    ).toUpperCase();
    const progress =
      this.items.length > 0
        ? Math.round(((this.state.currentIndex + 1) / this.items.length) * 100)
        : 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #0a0a0a;
          border-top: 1px solid #333;
          color: #eee;
          font-family: 'Inter', system-ui, sans-serif;
          z-index: 10000;
          padding: 8px 16px;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .info {
          flex: 1;
        }
        .title {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
        .meta {
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn {
          background: #252525;
          border: 1px solid #444;
          color: #ccc;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn:hover {
          background: #333;
          border-color: #666;
          color: #fff;
        }
        .btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .btn-primary {
          background: #3b82f6;
          border-color: #2563eb;
          color: #fff;
        }
        .btn-primary:hover {
          background: #2563eb;
        }
        .btn-success {
          background: #10b981;
          border-color: #059669;
          color: #fff;
        }
        .btn-danger {
          background: #ef4444;
          border-color: #dc2626;
          color: #fff;
        }
        .status-badge {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 99px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-pending { background: #444; color: #aaa; }
        .status-verified { background: #065f46; color: #34d399; }
        .status-issue { background: #7f1d1d; color: #f87171; }

        .progress-container {
          width: 150px;
          height: 4px;
          background: #222;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s;
        }
      </style>
      <div class="container">
        <div class="info">
          <div class="meta">Reviewing ${this.state.currentIndex + 1} of ${this.items.length} | <span class="status-badge status-${status.toLowerCase()}">${status}</span></div>
          <div class="title">${currentItem?.title || "Unknown Item"}</div>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${progress}%"></div>
          </div>
        </div>
        
        <div class="controls">
          <button class="btn" id="prev-btn" ${this.state.currentIndex === 0 ? "disabled" : ""}>← Prev</button>
          <button class="btn" id="next-btn" ${this.state.currentIndex === this.items.length - 1 ? "disabled" : ""}>Next →</button>
          
          <div style="width: 1px; height: 24px; background: #333; margin: 0 8px;"></div>
          
          <button class="btn ${status === "VERIFIED" ? "btn-success" : ""}" id="verify-btn">✓ Verify</button>
          <button class="btn ${status === "ISSUE" ? "btn-danger" : ""}" id="issue-btn">⚠️ Issue</button>
          
          <div style="width: 1px; height: 24px; background: #333; margin: 0 8px;"></div>
          
          <button class="btn btn-primary" id="export-sdk-btn">📤 Export Report</button>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById("prev-btn").onclick = () => this.onPrev?.();
    this.shadowRoot.getElementById("next-btn").onclick = () => this.onNext?.();
    this.shadowRoot.getElementById("verify-btn").onclick = () =>
      this.onVerify?.();
    this.shadowRoot.getElementById("issue-btn").onclick = () =>
      this.onIssue?.();
    this.shadowRoot.getElementById("export-sdk-btn").onclick = () =>
      this.onExport?.();
  }
}

customElements.define("review-bar", ReviewBar);

window.ReviewUI = {
  createBar: (core) => {
    const bar = document.createElement("review-bar");

    bar.onPrev = () => core.showItem(core.state.currentIndex - 1);
    bar.onNext = () => core.showItem(core.state.currentIndex + 1);
    bar.onVerify = () => core.updateCurrentStatus("verified");
    bar.onIssue = () => {
      const note = prompt("What is the issue?");
      if (note !== null) core.updateCurrentStatus("issue", note);
    };
    bar.onExport = () => core.storage.save("report", core.exportData());

    document.body.appendChild(bar);
    return bar;
  },
};
