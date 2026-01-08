const fs = require("fs");
const path = require("path");

const iconDir = path.join(__dirname, "simulator", "icons", "ue5");
const files = fs
  .readdirSync(iconDir)
  .filter((f) => f.endsWith(".png") || f.endsWith(".svg"));

let html =
  '<html><body style="background: #222; color: #ccc; font-family: sans-serif;">';
html +=
  '<h1>UE5 Icon Gallery</h1><div style="display: flex; flex-wrap: wrap;">';

files.forEach((file) => {
  html += `<div style="margin: 10px; text-align: center; width: 150px; border: 1px solid #444; padding: 10px;">
    <img src="icons/ue5/${file}" style="background: #333; padding: 5px;">
    <div style="font-size: 10px; word-break: break-all; margin-top: 5px;">${file}</div>
  </div>`;
});

html += "</div></body></html>";

fs.writeFileSync(path.join(__dirname, "simulator", "icon_gallery.html"), html);
console.log("Gallery created at simulator/icon_gallery.html");
