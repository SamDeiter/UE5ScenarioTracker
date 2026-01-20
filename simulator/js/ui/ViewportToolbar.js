/**
 * ViewportToolbar.js - Internal Viewport Toolbar Controller
 *
 * Manages the overlay toolbar within the viewport panel.
 */

class ViewportToolbar {
  constructor(options = {}) {
    this.container =
      options.container || document.getElementById("viewport-toolbar");
    this._init();
  }

  _init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    // Viewport Tab Bar (Topmost)
    const tabBar = document.createElement("div");
    tabBar.className = "viewport-tab-bar";
    tabBar.innerHTML = `
        <div class="viewport-tab">
            <img src="icons/ue5/icon_tab_Viewports_16x.png" class="tab-icon">
            <span>Viewport 1</span>
            <i class="fas fa-times close-btn"></i>
        </div>
    `;

    // Main Overlaid Toolbar
    const toolbar = document.createElement("div");
    toolbar.id = "viewport-toolbar-main";
    toolbar.innerHTML = `
        <!-- Group 1: Modes & Transforms -->
        <div class="v-toolbar-group">
            <div class="v-toolbar-item" title="Modes">
                 <img src="icons/ue5/icon_tab_SelectionDetails_16x.png" class="v-toolbar-icon" style="filter: brightness(1.5);">
                 <i class="fas fa-caret-down" style="font-size: 7px; opacity: 0.5;"></i>
            </div>
            <div class="v-toolbar-item active" title="Select (Q)">
                <i class="fas fa-mouse-pointer"></i>
            </div>
            <div class="v-toolbar-item" title="Translate (W)">
                <i class="fas fa-arrows-alt"></i>
            </div>
            <div class="v-toolbar-item" title="Rotate (E)">
                <i class="fas fa-redo"></i>
            </div>
            <div class="v-toolbar-item" title="Scale (R)">
                <i class="fas fa-expand"></i>
            </div>
        </div>

        <div class="v-toolbar-separator"></div>

        <!-- Group 2: Coordinate System -->
        <div class="v-toolbar-group">
            <div class="v-toolbar-item" title="Cycle Coordinate System">
                <i class="fas fa-globe"></i>
            </div>
            <div class="v-toolbar-item" style="padding: 0 2px;">
                <i class="fas fa-ellipsis-v" style="font-size: 8px; opacity: 0.4;"></i>
            </div>
        </div>

        <div class="v-toolbar-separator"></div>

        <!-- Group 3: Snapping Toggles -->
        <div class="v-toolbar-group">
            <div class="v-toolbar-capsule">
                <div class="v-toolbar-item" title="Surface Snapping">
                    <i class="fas fa-magnet"></i>
                    <i class="fas fa-caret-down" style="font-size: 7px; opacity: 0.5;"></i>
                </div>
            </div>
             <div class="v-toolbar-capsule" style="margin-left: 2px;">
                <div class="v-toolbar-item" title="Vertex Snapping">
                    <i class="fas fa-anchor"></i>
                    <i class="fas fa-caret-down" style="font-size: 7px; opacity: 0.5;"></i>
                </div>
            </div>
        </div>

        <div class="v-toolbar-separator"></div>

        <!-- Group 4: Transform Snapping Values -->
        <div class="v-toolbar-group">
            <div class="v-toolbar-capsule">
                <div class="v-toolbar-item" title="Grid Snapping Type">
                    <i class="fas fa-th"></i>
                    <span class="v-toolbar-val">10</span>
                     <i class="fas fa-caret-down" style="font-size: 7px; opacity: 0.5;"></i>
                </div>
            </div>
            <div class="v-toolbar-capsule" style="margin-left: 2px;">
                <div class="v-toolbar-item" title="Rotation Snapping Type">
                    <i class="fas fa-sync"></i>
                    <span class="v-toolbar-val">10°</span>
                     <i class="fas fa-caret-down" style="font-size: 7px; opacity: 0.5;"></i>
                </div>
            </div>
            <div class="v-toolbar-capsule" style="margin-left: 2px;">
                <div class="v-toolbar-item" title="Scale Snapping Type">
                    <i class="fas fa-compress-arrows-alt"></i>
                    <span class="v-toolbar-val">0.25</span>
                     <i class="fas fa-caret-down" style="font-size: 7px; opacity: 0.5;"></i>
                </div>
            </div>
        </div>

        <div class="v-toolbar-separator"></div>

        <!-- Group 5: View Options -->
        <div class="v-toolbar-group">
            <div class="v-toolbar-item" title="Perspective">
                 <img src="icons/ue5/icon_Editor_Viewport_16x.png" class="v-toolbar-icon" style="margin-right: 4px;">
                 <span>Perspective</span>
                 <i class="fas fa-caret-down" style="font-size: 7px; opacity: 0.5;"></i>
            </div>
            <div class="v-toolbar-item" title="View Mode">
                 <i class="fas fa-circle" style="color: #888; margin-right: 4px;"></i>
                 <span>Lit</span>
                 <i class="fas fa-caret-down" style="font-size: 7px; opacity: 0.5;"></i>
            </div>
            <div class="v-toolbar-item" title="Show Options">
                 <i class="fas fa-eye" style="margin-right: 4px;"></i>
                <i class="fas fa-caret-down" style="font-size: 7px; opacity: 0.5;"></i>
            </div>
        </div>

        <!-- Right Side: Camera Tools -->
        <div class="v-toolbar-right">
            <div class="v-toolbar-capsule" title="Camera Speed">
                <div class="v-toolbar-item" style="gap: 4px; padding: 0 6px;">
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="v-toolbar-val" style="margin-left: 0;">4</span>
                    <i class="fas fa-chevron-down" style="font-size: 7px; opacity: 0.4;"></i>
                </div>
            </div>
            
            <div class="v-toolbar-capsule" title="Viewport Settings" style="margin-left: 4px;">
                <div class="v-toolbar-item" style="gap: 4px; padding: 0 6px;">
                    <i class="fas fa-cog"></i>
                    <i class="fas fa-chevron-down" style="font-size: 7px; opacity: 0.4;"></i>
                </div>
            </div>
            
            <div class="v-toolbar-separator" style="margin: 0 8px;"></div>
            
            <div class="v-toolbar-capsule" title="Maximize/Restore Viewport">
                <div class="v-toolbar-item" style="gap: 5px; padding: 0 6px;">
                    <i class="fas fa-ellipsis-v" style="font-size: 9px; opacity: 0.3;"></i>
                    <i class="fas fa-th-large" style="font-size: 11px;"></i>
                </div>
            </div>
        </div>
    `;

    this.container.innerHTML = "";
    this.container.appendChild(tabBar);
    this.container.appendChild(toolbar);
  }
}

// Export or global attach
if (typeof window !== "undefined") {
  window.ViewportToolbar = ViewportToolbar;
}
