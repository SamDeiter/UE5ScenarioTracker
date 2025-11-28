const fs = require('fs');
const path = require('path');

const SCENARIOS_DIR = 'scenarios';

function validateScenarios() {
    try {
        if (!fs.existsSync(SCENARIOS_DIR)) {
            console.error(`Directory '${SCENARIOS_DIR}' not found.`);
            return;
        }

        const files = fs.readdirSync(SCENARIOS_DIR).filter(file =>
            file.endsWith('.js') && file !== '00_manifest.js'
        );

        console.log(`\nValidating ${files.length} scenarios for time data consistency...\n`);
        console.log(`${"FILE".padEnd(45)} | ${"ESTIMATE".padEnd(10)} | ${"CALCULATED".padEnd(12)} | ${"STATUS".padEnd(10)}`);
        console.log("-".repeat(85));

        let issuesFound = 0;
        let filesChecked = 0;

        files.forEach(file => {
            const content = fs.readFileSync(path.join(SCENARIOS_DIR, file), 'utf8');

            // Extract estimate (handle both 'estimate' and 'estimateHours')
            const estimateMatch = content.match(/estimate(?:Hours)?:\s*([\d.]+)/);
            const declaredEstimate = estimateMatch ? parseFloat(estimateMatch[1]) : null;

            // Calculate actual time from all time_cost values in choices
            const timeCostMatches = content.match(/time_cost:\s*([\d.]+)/g);
            let calculatedTime = 0;

            if (timeCostMatches) {
                timeCostMatches.forEach(match => {
                    const value = parseFloat(match.match(/[\d.]+/)[0]);
                    calculatedTime += value;
                });
            }

            // Determine status
            let status = "OK";
            let statusColor = "";

            if (declaredEstimate === null) {
                status = "NO ESTIMATE";
                statusColor = "⚠️";
                issuesFound++;
            } else if (calculatedTime === 0) {
                status = "NO COSTS";
                statusColor = "⚠️";
                issuesFound++;
            } else {
                const difference = Math.abs(declaredEstimate - calculatedTime);
                const percentDiff = (difference / declaredEstimate) * 100;

                if (percentDiff > 10) {
                    status = `MISMATCH ${percentDiff.toFixed(0)}%`;
                    statusColor = "❌";
                    issuesFound++;
                } else if (percentDiff > 5) {
                    status = `MINOR ${percentDiff.toFixed(0)}%`;
                    statusColor = "⚠️";
                }
            }

            const estDisplay = declaredEstimate !== null ? declaredEstimate.toFixed(2) : "N/A";
            const calcDisplay = calculatedTime.toFixed(2);

            console.log(`${file.padEnd(45)} | ${estDisplay.padEnd(10)} | ${calcDisplay.padEnd(12)} | ${statusColor} ${status}`);
            filesChecked++;
        });

        console.log("-".repeat(85));
        console.log(`\nChecked ${filesChecked} files. Found ${issuesFound} issue(s).\n`);

        if (issuesFound === 0) {
            console.log("✅ All scenarios have consistent time data!\n");
        } else {
            console.log("⚠️  Some scenarios need attention. Review the mismatches above.\n");
        }

    } catch (err) {
        console.error("Error:", err.message);
    }
}

validateScenarios();
