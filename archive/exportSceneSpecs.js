#!/usr/bin/env node
/**
 * Export scene specifications from scenario JS files to JSON for Unreal
 * 
 * Reads scenario files, extracts sceneSetup from each step, and creates
 * a JSON file that Unreal Python scripts can consume.
 */

const fs = require('fs');
const path = require('path');

function extractSceneSetups(scenarioId) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Extracting scene specs: ${scenarioId}`);
    console.log('='.repeat(60));

    const scenarioPath = path.join(__dirname, '..', 'scenarios', `${scenarioId}.js`);

    if (!fs.existsSync(scenarioPath)) {
        console.error(`❌ Scenario not found: ${scenarioPath}`);
        process.exit(1);
    }

    // Load scenario file
    const scenarioCode = fs.readFileSync(scenarioPath, 'utf-8');

    // Create a sandbox to execute the scenario code
    const sandbox = { window: { SCENARIOS: {} } };
    const script = new Function('window', scenarioCode);
    script(sandbox.window);

    const scenario = sandbox.window.SCENARIOS[scenarioId];

    if (!scenario) {
        console.error(`❌ Scenario not loaded: ${scenarioId}`);
        process.exit(1);
    }

    // Extract all steps with sceneSetup
    const steps = [];
    const stepIds = Object.keys(scenario.steps);

    console.log(`\nFound ${stepIds.length} steps`);

    for (const stepId of stepIds) {
        const step = scenario.steps[stepId];

        if (step.sceneSetup) {
            steps.push({
                stepId: stepId,
                title: step.title,
                sceneSetup: step.sceneSetup
            });
            console.log(`  ✓ ${stepId}: ${step.title}`);
        } else {
            console.log(`  ⚠ ${stepId}: No sceneSetup (skipped)`);
        }
    }

    if (steps.length === 0) {
        console.error(`\n❌ No steps with sceneSetup found`);
        process.exit(1);
    }

    // Create output JSON
    const output = {
        scenarioId: scenarioId,
        scenarioTitle: scenario.meta.title,
        steps: steps
    };

    // Write to temp file for Unreal to consume
    const outputPath = path.join(process.env.TEMP || 'D:\\temp', `${scenarioId}_spec.json`);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Scene specs exported:`);
    console.log(`   ${outputPath}`);
    console.log(`   Steps: ${steps.length}`);

    return outputPath;
}

// Main
if (require.main === module) {
    const scenarioId = process.argv[2];

    if (!scenarioId) {
        console.error('Usage: node exportSceneSpecs.js <scenarioId>');
        console.error('Example: node exportSceneSpecs.js directional_light');
        process.exit(1);
    }

    extractSceneSetups(scenarioId);
}

module.exports = { extractSceneSetups };
