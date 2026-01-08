const fs = require('fs');
const path = require('path');

const SCENARIOS_DIR = path.join(__dirname, '../../scenarios');

function analyzeScenarios() {
    try {
        if (!fs.existsSync(SCENARIOS_DIR)) {
            console.error(`Directory '${SCENARIOS_DIR}' not found.`);
            return;
        }

        const files = fs.readdirSync(SCENARIOS_DIR).filter(file => file.endsWith('.js') && file !== '00_manifest.js');

        console.log(`\n${'='.repeat(100)}`);
        console.log(`DETAILED SCENARIO ANALYSIS REPORT`);
        console.log(`${'='.repeat(100)}\n`);

        const shortScenarios = [];
        const scenarioDetails = [];

        files.forEach(file => {
            const content = fs.readFileSync(path.join(SCENARIOS_DIR, file), 'utf8');

            // Extract metadata
            const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
            const estimateMatch = content.match(/estimateHours?:\s*([\d.]+)/);
            const descMatch = content.match(/description:\s*["']([^"']+)["']/);

            const title = titleMatch ? titleMatch[1] : 'Unknown';
            const estimate = estimateMatch ? parseFloat(estimateMatch[1]) : 0;
            const description = descMatch ? descMatch[1] : 'No description';

            // Count steps
            const stepsMatch = content.match(/['"]step[-_]\d+['"]\s*:/g);
            const stepCount = stepsMatch ? stepsMatch.length : 0;

            // Count choices per step (average)
            const choicesMatches = content.match(/choices:\s*\[/g);
            const choicesCount = choicesMatches ? choicesMatches.length : 0;
            const avgChoices = stepCount > 0 ? (choicesCount / stepCount).toFixed(1) : 0;

            // Identify skills covered
            const skillMatches = content.match(/skill:\s*['"]([^'"]+)['"]/g);
            const skills = skillMatches ? [...new Set(skillMatches.map(s => s.match(/['"]([^'"]+)['"]/)[1]))] : [];

            const detail = {
                file,
                title,
                description,
                stepCount,
                estimate,
                avgChoices,
                skills: skills.join(', '),
                status: stepCount < 10 ? 'SHORT' : 'OK'
            };

            scenarioDetails.push(detail);

            if (stepCount < 10) {
                shortScenarios.push(detail);
            }
        });

        // Sort by step count
        scenarioDetails.sort((a, b) => a.stepCount - b.stepCount);

        // Print summary table
        console.log(`SUMMARY TABLE (Sorted by Step Count)`);
        console.log(`${'-'.repeat(100)}`);
        console.log(`${"FILE".padEnd(40)} | ${"STEPS".padEnd(6)} | ${"EST".padEnd(6)} | ${"AVG CHOICES".padEnd(12)} | ${"STATUS"}`);
        console.log(`${'-'.repeat(100)}`);

        scenarioDetails.forEach(detail => {
            console.log(
                `${detail.file.padEnd(40)} | ${detail.stepCount.toString().padEnd(6)} | ${detail.estimate.toFixed(1).padEnd(6)} | ${detail.avgChoices.padEnd(12)} | ${detail.status}`
            );
        });

        console.log(`${'-'.repeat(100)}\n`);

        // Print detailed analysis of short scenarios
        if (shortScenarios.length > 0) {
            console.log(`\n${'='.repeat(100)}`);
            console.log(`⚠️  SHORT SCENARIOS REQUIRING EXPANSION (< 10 STEPS)`);
            console.log(`${'='.repeat(100)}\n`);

            shortScenarios.forEach((detail, index) => {
                console.log(`${index + 1}. ${detail.file}`);
                console.log(`   Title: ${detail.title}`);
                console.log(`   Description: ${detail.description.substring(0, 80)}${detail.description.length > 80 ? '...' : ''}`);
                console.log(`   Current Steps: ${detail.stepCount}`);
                console.log(`   Estimated Hours: ${detail.estimate}`);
                console.log(`   Skills Covered: ${detail.skills || 'None specified'}`);
                console.log(`   Expansion Needed: ${10 - detail.stepCount} more steps`);
                console.log('');
            });

            console.log(`\nTotal scenarios needing expansion: ${shortScenarios.length}`);
            console.log(`Average steps in short scenarios: ${(shortScenarios.reduce((sum, s) => sum + s.stepCount, 0) / shortScenarios.length).toFixed(1)}`);
        } else {
            console.log(`\n✅ All scenarios have 10 or more steps.\n`);
        }

        // Statistics
        const totalSteps = scenarioDetails.reduce((sum, s) => sum + s.stepCount, 0);
        const totalTime = scenarioDetails.reduce((sum, s) => sum + s.estimate, 0);
        const avgSteps = (totalSteps / scenarioDetails.length).toFixed(1);
        const avgTime = (totalTime / scenarioDetails.length).toFixed(1);

        console.log(`\n${'='.repeat(100)}`);
        console.log(`OVERALL STATISTICS`);
        console.log(`${'='.repeat(100)}`);
        console.log(`Total Scenarios: ${scenarioDetails.length}`);
        console.log(`Total Steps: ${totalSteps}`);
        console.log(`Total Estimated Hours: ${totalTime.toFixed(1)}`);
        console.log(`Average Steps per Scenario: ${avgSteps}`);
        console.log(`Average Hours per Scenario: ${avgTime}`);
        console.log(`Scenarios Meeting 10+ Step Goal: ${scenarioDetails.length - shortScenarios.length} (${((scenarioDetails.length - shortScenarios.length) / scenarioDetails.length * 100).toFixed(1)}%)`);
        console.log(`${'='.repeat(100)}\n`);

    } catch (err) {
        console.error("Error:", err.message);
    }
}

analyzeScenarios();
