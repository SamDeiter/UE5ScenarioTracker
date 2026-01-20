const fs = require('fs');
const path = require('path');

// Adjusted path since this script is now in tools/js/
const SCENARIOS_DIR = path.join(__dirname, '../../scenarios');

function analyzeScenarios() {
    try {
        if (!fs.existsSync(SCENARIOS_DIR)) {
            console.error(`Directory '${SCENARIOS_DIR}' not found.`);
            return;
        }

        const files = fs.readdirSync(SCENARIOS_DIR).filter(file => file.endsWith('.js') && file !== '00_manifest.js');

        console.log(`\nAnalyzing ${files.length} scenarios...\n`);
        console.log(`${"SCENARIO FILE".padEnd(40)} | ${"STEPS".padEnd(6)} | ${"EST. TIME".padEnd(10)} | ${"STATUS"}`);
        console.log("-".repeat(75));

        let totalTime = 0;
        let totalSteps = 0;
        const shortScenarios = [];

        files.forEach(file => {
            const content = fs.readFileSync(path.join(SCENARIOS_DIR, file), 'utf8');

            // Extract Estimate using Regex
            const estimateMatch = content.match(/estimate:\s*([\d.]+)/);
            const estimate = estimateMatch ? parseFloat(estimateMatch[1]) : 0;

            // Extract Step Count (matches "step_1", 'step-1', etc.)
            // We only count the main numbered steps to get the scenario length
            const stepsMatch = content.match(/['"]step[-_]\d+['"]\s*:/g);
            const stepCount = stepsMatch ? stepsMatch.length : 0;

            let status = "OK";
            if (stepCount < 10) {
                status = "SHORT (<10)";
                shortScenarios.push({ file, stepCount });
            }

            console.log(`${file.padEnd(40)} | ${stepCount.toString().padEnd(6)} | ${estimate.toFixed(2)} hrs | ${status}`);

            totalTime += estimate;
            totalSteps += stepCount;
        });

        console.log("-".repeat(75));
        console.log(`${"TOTALS".padEnd(40)} | ${totalSteps.toString().padEnd(6)} | ${totalTime.toFixed(2)} hrs |`);
        console.log("\n");

        if (shortScenarios.length > 0) {
            console.log("⚠️  SHORT SCENARIOS FOUND (< 10 STEPS):");
            console.log("=======================================");
            shortScenarios.forEach(item => {
                console.log(`- ${item.file}: ${item.stepCount} steps`);
            });
            console.log("\n");
        } else {
            console.log("✅ All scenarios have 10 or more steps.");
        }

    } catch (err) {
        console.error("Error:", err.message);
    }
}

analyzeScenarios();
