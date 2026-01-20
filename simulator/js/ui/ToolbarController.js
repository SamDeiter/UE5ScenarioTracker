/**
 * ToolbarController.js - UE5 Editor Top UI Controller
 *
 * Manages the Menu Bar and the Main Toolbar.
 * Achieves 1:1 parity with UE5.6 Level Editor layout.
 */

class ToolbarController {
  constructor(options = {}) {
    this.menuBarContainer =
      options.menuBarContainer || document.getElementById("menu-bar");
    this.mainToolbarContainer =
      options.mainToolbarContainer || document.getElementById("main-toolbar");

    this.activeMenu = null;
    this._init();
  }

  _init() {
    this.renderMenuBar();
    this.renderMainToolbar();
    this._bindGlobalEvents();
  }

  /**
   * Render the Top Menu Bar (File, Edit, etc.)
   */
  renderMenuBar() {
    if (!this.menuBarContainer) return;

    this.menuBarContainer.innerHTML = `
        <div class="menu-left">
            <img src="icons/ue5/UE-Icon-2023-White.svg" class="ue-logo-main" alt="UE">
            <div class="menu-items"></div>
        </div>
        
        <div class="menu-center">
            <div class="warning-indicator">
                <img src="icons/ue5/icon_tab_Levels_16x.png" class="warning-icon">
                <span class="warning-text">D1*</span>
            </div>
        </div>

        <div class="menu-bar-right">
            <span class="project-name">UEScenarioFactory</span>
            <div class="window-controls">
                <button class="win-btn win-min">
                    <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
                </button>
                <button class="win-btn win-max">
                    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M0,0V10H10V0ZM1,1H9V9H1Z" fill="currentColor"/></svg>
                </button>
                <button class="win-btn win-close">
                    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M0,0L10,10M0,10L10,0" stroke="currentColor" stroke-width="1.2"/></svg>
                </button>
            </div>
        </div>
    `;

    const menuItemsContainer =
      this.menuBarContainer.querySelector(".menu-items");
    const menus = [
      {
        label: "File",
        items: [
          "New Project...",
          "Open Project...",
          "Recent Projects >",
          "Zip Project Up",
          { separator: true },
          "New Level...",
          "Open Level...",
          "Save Current Level",
          "Save Current Level As...",
          "Save All",
          { separator: true },
          "Import into Level...",
          "Export All...",
          "Export Selected...",
          { separator: true },
          "Project Packaging >",
        ],
      },
      {
        label: "Edit",
        items: [
          "Undo",
          "Redo",
          "Undo History",
          { separator: true },
          "Editor Preferences...",
          "Project Settings...",
          "Plugins",
        ],
      },
      {
        label: "Window",
        items: [
          "Cinematics",
          "Content Browser >",
          "Details >",
          "World Settings",
          "Output Log",
          "Place Actors",
          { separator: true },
          "Load Layout >",
        ],
      },
      {
        label: "Tools",
        items: [
          "New C++ Class...",
          "Generate Visual Studio Project",
          "Merge Actors",
          { separator: true },
          "Blueprint Debugger",
          "Widget Reflector",
          "Unreal Insights",
          "Session Frontend",
          "Statistics",
        ],
      },
      {
        label: "Build",
        items: [
          "Build All Levels",
          "Build Lighting Only",
          "Build Reflection Captures",
          "Lighting Quality >",
        ],
      },
      {
        label: "Select",
        items: [
          "Select All",
          "Invert Selection",
          "Select Immediate Children",
          "Select All With Same Material",
        ],
      },
      {
        label: "Actor",
        items: ["Group", "Snap >", "Merge"],
      },
      { label: "Help", items: ["Documentation", "About Unreal Editor"] },
    ];

    menus.forEach((menu) => {
      const menuBtn = document.createElement("div");
      menuBtn.className = "menu-bar-item";
      menuBtn.textContent = menu.label;

      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this._showMenu(menuBtn, menu);
      });

      menuBtn.addEventListener("mouseenter", () => {
        if (this.activeMenu) {
          this._showMenu(menuBtn, menu);
        }
      });

      menuItemsContainer.appendChild(menuBtn);
    });
  }

  /**
   * Render the Main Toolbar (Save, Selection Mode, Play, etc.)
   */
  renderMainToolbar() {
    if (!this.mainToolbarContainer) return;

    this.mainToolbarContainer.innerHTML = `
        <!-- Group: Basics (Save, Content) -->
        <div class="toolbar-group">
            <button class="toolbar-btn" title="Save Current Level">
                <img src="icons/ue5/icon_tab_SaveLayout_16x.png" class="toolbar-icon">
            </button>
            <button class="toolbar-btn content-browser-btn" id="toolbar-content-browser" title="Content Drawer (Ctrl+Space)">
                <img src="icons/ue5/icon_tab_ContentBrowser_16x.png" class="toolbar-icon">
            </button>
        </div>

        <div class="toolbar-separator"></div>

        <!-- Group: Selection Mode -->
        <div class="toolbar-group">
            <div class="toolbar-dropdown-btn" id="selection-mode-btn">
                <img src="icons/ue5/icon_tab_SelectionDetails_16x.png" class="toolbar-icon">
                <span>Selection Mode</span>
                <i class="fas fa-caret-down" style="font-size: 8px; opacity: 0.5;"></i>
            </div>
        </div>

        <div class="toolbar-separator"></div>

        <!-- Group: Create & Logic -->
        <div class="toolbar-group">
             <div class="toolbar-btn has-dropdown" title="Quickly add to the project">
                <div style="position: relative; display: flex; align-items: center;">
                    <img src="icons/ue5/icon_tab_BuildSubmit_16x.png" class="toolbar-icon" style="filter: brightness(1.5);">
                    <i class="fas fa-plus" style="font-size: 7px; color: #4CAF50; position: absolute; right: -2px; bottom: -2px; text-shadow: 0 0 2px black;"></i>
                </div>
                <i class="fas fa-caret-down dropdown-arrow"></i>
            </div>
            <div class="toolbar-btn has-dropdown" title="Blueprints">
                <img src="icons/ue5/icon_tab_BlueprintDebugger_16x.png" class="toolbar-icon">
                <i class="fas fa-caret-down dropdown-arrow"></i>
            </div>
            <div class="toolbar-btn has-dropdown" title="Cinematics">
                <img src="icons/ue5/icon_tab_Cinematics_16x.png" class="toolbar-icon">
                <i class="fas fa-caret-down dropdown-arrow"></i>
            </div>
        </div>

        <div class="toolbar-separator"></div>

        <!-- Group: Play Controls (Integrated Capsule) -->
        <div class="toolbar-group">
            <div class="play-controls-group">
                <button class="play-main-btn" title="Play">
                    <img src="icons/ue5/icon_play_40x.png" class="toolbar-icon" style="filter: brightness(0) invert(1);">
                </button>
                <div class="play-dropdown-trigger">
                    <i class="fas fa-caret-down" style="font-size: 8px; color: rgba(0,0,0,0.5);"></i>
                </div>
                
                <button class="toolbar-btn-sm" title="Pause">
                     <div style="display: flex; gap: 2px;">
                        <div style="width: 2px; height: 10px; background: currentColor;"></div>
                        <div style="width: 2px; height: 10px; background: currentColor;"></div>
                     </div>
                </button>
                <button class="toolbar-btn-sm" title="Stop">
                    <img src="icons/ue5/icon_stop_40x.png" class="toolbar-icon" style="opacity: 0.6;">
                </button>
                <div class="toolbar-more-btn">
                    <i class="fas fa-ellipsis-v" style="font-size: 10px; opacity: 0.4;"></i>
                </div>
            </div>
        </div>

        <div class="toolbar-separator"></div>

        <!-- Group: Platforms & Settings -->
        <div class="toolbar-group right">
            <div class="toolbar-dropdown-btn platforms-btn">
                <img src="icons/ue5/icon_tab_DeviceManager_16x.png" class="toolbar-icon">
                <span style="font-size: 11px;">Platforms</span>
                <i class="fas fa-caret-down" style="font-size: 8px; opacity: 0.5;"></i>
            </div>
            <div class="toolbar-separator" style="margin: 0 4px; height: 16px; opacity: 0.3;"></div>
            <button class="toolbar-btn icon-only settings-btn" title="Settings">
                <img src="icons/ue5/icon_Editor_ProjectSettings_16x.png" class="toolbar-icon" style="opacity: 0.7;">
            </button>
        </div>
    `;
  }

  _showMenu(anchor, menuData) {
    if (this.activeMenu) {
      this.activeMenu.close();
    }

    if (typeof ContextMenu !== "undefined") {
      const menu = new ContextMenu({
        items: menuData.items.map((item) => ({
          label: item,
          action: () => console.log(`Menu Item Clicked: ${item}`),
        })),
      });

      const rect = anchor.getBoundingClientRect();
      menu.show(rect.left, rect.bottom);
      this.activeMenu = menu;
      anchor.classList.add("active");

      // Clean up when menu closes
      const originalClose = menu.close.bind(menu);
      menu.close = () => {
        originalClose();
        anchor.classList.remove("active");
        if (this.activeMenu === menu) this.activeMenu = null;
      };
    }
  }

  _bindGlobalEvents() {
    document.addEventListener("click", () => {
      if (this.activeMenu) {
        this.activeMenu.close();
      }
    });
  }
}

// Export or global attach
if (typeof window !== "undefined") {
  window.ToolbarController = ToolbarController;
}
