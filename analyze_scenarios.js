const fs = require('fs');
const path = require('path');

const SCENARIOS_DIR = 'scenarios';

function analyzeScenarios() {
    try {
        if (!fs.existsSync(SCENARIOS_DIR)) {
            console.error(`Directory '${SCENARIOS_DIR}' not found.`);
            return;
        }

        const files = fs.readdirSync(SCENARIOS_DIR).filter(file => file.endsWith('.js') && file !== '00_manifest.js');

        console.log(`\nAnalyzing ${files.length} scenarios...\n`);
        console.log(`${"SCENARIO FILE".padEnd(40)} | ${"STEPS".padEnd(6)} | ${"EST. TIME".padEnd(10)}`);
        console.log("-".repeat(60));

        let totalTime = 0;
        let totalSteps = 0;

        files.forEach(file => {
            const content = fs.readFileSync(path.join(SCENARIOS_DIR, file), 'utf8');

            // Extract Estimate using Regex
            const estimateMatch = content.match(/estimate:\s*([\d.]+)/);
            const estimate = estimateMatch ? parseFloat(estimateMatch[1]) : 0;

            // Extract Step Count (rough count of "step_X" keys)
            const stepsMatch = content.match(/"step_\d+":/g);
            const stepCount = stepsMatch ? stepsMatch.length : 0;

            console.log(`${file.padEnd(40)} | ${stepCount.toString().padEnd(6)} | ${estimate.toFixed(2)} hrs`);

            totalTime += estimate;
            totalSteps += stepCount;
        });

        console.log("-".repeat(60));
        console.log(`${"TOTALS".padEnd(40)} | ${totalSteps.toString().padEnd(6)} | ${totalTime.toFixed(2)} hrs`);
        console.log("\n");

    } catch (err) {
        console.error("Error:", err.message);
    }
}

analyzeScenarios();
