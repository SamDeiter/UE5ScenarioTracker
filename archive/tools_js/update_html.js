const fs = require('fs');
const path = require('path');

const HTML_FILE = 'index.html';
const SCENARIOS_DIR = 'scenarios';

// Markers to identify where to inject the scripts
const START_MARKER = '<!-- SCENARIO_SCRIPTS_START -->';
const END_MARKER = '<!-- SCENARIO_SCRIPTS_END -->';

function updateHTML() {
    try {
        // 1. Get list of all JS files in scenarios/
        if (!fs.existsSync(SCENARIOS_DIR)) {
            console.error(`Directory '${SCENARIOS_DIR}' not found.`);
            return;
        }

        const files = fs.readdirSync(SCENARIOS_DIR)
            .filter(file => file.endsWith('.js') && file !== '00_manifest.js')
            .sort(); // Alphabetical order

        console.log(`Found ${files.length} scenario files.`);

        // 2. Generate HTML script tags
        const scriptTags = files.map(file => `    <script src="scenarios/${file}" defer></script>`).join('\n');

        // 3. Read index.html
        let htmlContent = fs.readFileSync(HTML_FILE, 'utf8');

        // 4. Replace content between markers
        const regex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`, 'g');

        const newScripts = `${START_MARKER}\n    <script src="scenarios/00_manifest.js" defer></script>\n${scriptTags}\n    ${END_MARKER}`;

        htmlContent = htmlContent.replace(regex, newScripts);

        // 5. Write back to index.html
        fs.writeFileSync(HTML_FILE, htmlContent);
        console.log(`Successfully updated ${HTML_FILE} with ${files.length + 1} scenarios.`);

    } catch (err) {
        console.error("Error:", err.message);
    }
}

updateHTML();
