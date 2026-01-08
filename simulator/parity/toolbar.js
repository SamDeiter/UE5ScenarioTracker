/**
 * UE5 Toolbar Behavior
 * Forensic Reconstruction - Vanilla JS
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(
    ".toolbar-dropdown, .icon-dropdown"
  );

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();

      // Toggle active state
      const isActive = dropdown.classList.contains("active");

      // Close others
      closeAllDropdowns();

      if (!isActive) {
        dropdown.classList.add("active");
        // In a real app, this would show a menu
      }
    });
  });

  document.addEventListener("click", () => {
    closeAllDropdowns();
  });

  function closeAllDropdowns() {
    dropdowns.forEach((d) => d.classList.remove("active"));
  }

  // Window controls (for simulation)
  const winBtns = document.querySelectorAll(".win-btn");
  winBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // Toolbar buttons active state
  const toolbarBtns = document.querySelectorAll(".icon-btn");
  toolbarBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Highlight active tool if needed
    });
  });
});
