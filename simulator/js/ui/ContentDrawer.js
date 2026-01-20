/**
 * ContentDrawer.js - UE5 Slide-up Asset Explorer
 */
class ContentDrawer {
  constructor() {
    this.isOpen = false;
    this.container = null;
    this._init();
  }

  _init() {
    this._createDrawerUI();
    this._bindEvents();
  }

  _createDrawerUI() {
    this.container = document.createElement("div");
    this.container.id = "ue-content-drawer";
    this.container.className = "content-drawer-hidden";

    this.container.innerHTML = `
            <div class="drawer-header">
                <div class="drawer-header-left">
                    <img src="icons/ue5/icon_tab_ContentBrowser_16x.png" class="drawer-icon">
                    <span>Content Drawer</span>
                </div>
                <div class="drawer-header-right">
                    <div class="drawer-search">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search Content">
                    </div>
                    <button class="drawer-settings"><i class="fas fa-cog"></i></button>
                    <button class="drawer-dock"><i class="fas fa-thumbtack"></i> Dock in Layout</button>
                </div>
            </div>
            <div class="drawer-body">
                <div class="drawer-sidebar">
                    <div class="tree-root">
                        <i class="fas fa-folder-open"></i> All
                    </div>
                    <div class="tree-item indent-1">
                        <i class="fas fa-folder"></i> Content
                    </div>
                    <div class="tree-item indent-2">
                        <i class="fas fa-folder"></i> Assets
                    </div>
                    <div class="tree-item indent-2">
                        <i class="fas fa-folder"></i> Blueprints
                    </div>
                    <div class="tree-item indent-2">
                        <i class="fas fa-folder"></i> Materials
                    </div>
                </div>
                <div class="drawer-content-grid">
                    <!-- Placeholder assets -->
                    <div class="asset-item">
                        <div class="asset-preview material"></div>
                        <div class="asset-name">M_Ground_Grass</div>
                    </div>
                    <div class="asset-item">
                        <div class="asset-preview mesh"></div>
                        <div class="asset-name">SM_Rock_Large</div>
                    </div>
                    <div class="asset-item">
                        <div class="asset-preview blueprint"></div>
                        <div class="asset-name">BP_PlayerCharacter</div>
                    </div>
                </div>
            </div>
        `;

    const appContainer = document.getElementById("app-container");
    if (appContainer) {
      appContainer.appendChild(this.container);
    }
  }

  _bindEvents() {
    // Ctrl+Space to toggle
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault();
        this.toggle();
      }
    });

    // Click outside to close (if not docked)
    document.addEventListener("mousedown", (e) => {
      if (this.isOpen && !this.container.contains(e.target)) {
        // If it wasn't a click on the toggle button
        if (
          !e.target.closest(".content-drawer-toggle") &&
          !e.target.closest(".content-browser-btn")
        ) {
          this.close();
        }
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.container.classList.remove("content-drawer-hidden");
    this.container.classList.add("content-drawer-visible");
    this.isOpen = true;

    // Update toggle button state if exists
    const toggle = document.querySelector(".content-drawer-toggle");
    if (toggle) toggle.classList.add("active");
  }

  close() {
    this.container.classList.add("content-drawer-hidden");
    this.container.classList.remove("content-drawer-visible");
    this.isOpen = false;

    const toggle = document.querySelector(".content-drawer-toggle");
    if (toggle) toggle.classList.remove("active");
  }
}

// Global init or export
if (typeof window !== "undefined") {
  window.ContentDrawer = new ContentDrawer();
}
