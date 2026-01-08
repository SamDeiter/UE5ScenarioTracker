#!/usr/bin/env node
/**
 * Generate scenario assets by running Unreal Python automation
 * 
 * This script:
 * 1. Exports scene specs from scenario JS files
 * 2. Launches Unreal Engine with Python automation
 * 3. Waits for generation to complete
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { extractSceneSetups } = require('./exportSceneSpecs');

// Configuration
const UE_PROJECT_PATH = process.env.UESCENARIO_FACTORY || 'D:\\UE5_Projects\\UEScenarioFactory';
const UE_EDITOR_CMD = process.env.UE_EDITOR_PATH || 'D:\\Fortnite\\UE_5.6\\Engine\\Binaries\\Win64\\UnrealEditor-Cmd.exe';
const UE_PROJECT_FILE = path.join(UE_PROJECT_PATH, 'UEScenarioFactory.uproject');

function generateScenarioAssets(scenarioId) {
    console.log('\n╔' + '='.repeat(68) + '╗');
    console.log('║' + ' '.repeat(15) + 'Scenario Asset Generation' + ' '.repeat(28) + '║');
    console.log('╚' + '='.repeat(68) + '╝\n');

    // Step 1: Export scene specs
    console.log('[1/3] Exporting scene specifications...\n');
    const specPath = extractSceneSetups(scenarioId);

    // Step 2: Prepare Unreal command
    console.log('\n[2/3] Launching Unreal Engine automation...\n');

    const outputPath = path.join(UE_PROJECT_PATH, 'Content', 'Scenarios');
    const pythonScript = path.join(
        __dirname,
        '..',
        'unreal_scripts',
        'AutoGenerateScenarios.py'
    );

    // Copy Python scripts to UE project if not already there
    const ueScriptsPath = path.join(UE_PROJECT_PATH, 'Content', 'Python');
    if (!fs.existsSync(ueScriptsPath)) {
        fs.mkdirSync(ueScriptsPath, { recursive: true });
    }

    // Copy all Python scripts
    const scriptsDir = path.join(__dirname, '..', 'unreal_scripts');
    const scripts = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.py'));

    for (const script of scripts) {
        const src = path.join(scriptsDir, script);
        const dest = path.join(ueScriptsPath, script);
        fs.copyFileSync(src, dest);
        console.log(`  Copied: ${script}`);
    }

    // Build Python command that imports module and calls function
    const tempSpecPath = specPath;  // Use the exported spec path
    const unrealOutputPath = path.join(UE_PROJECT_PATH, 'Content', 'Scenarios');
    
    // Build Python import command - avoid backslash issues by using forward slashes
    const pyPath = ueScriptsPath.replace(/\\/g, '/');
    const pySpec = tempSpecPath.replace(/\\/g, '/');
    const pyOut = unrealOutputPath.replace(/\\/g, '/');
    
    const pythonCmd = `import sys; sys.path.append(r'${pyPath}'); import AutoGenerateScenarios; AutoGenerateScenarios.generate_scenario_assets(r'${pySpec}', r'${pyOut}')`;
    
    const args = [
        UE_PROJECT_FILE,
        `-ExecutePythonScript=${pythonCmd}`,
        '-stdout',
        '-unattended',
        '-nopause'
    ];
    
    console.log(`\nUnreal Editor: ${UE_EDITOR_CMD}`);
    console.log(`Project: ${UE_PROJECT_FILE}`);
    console.log(`Python Script: ${pythonScript}\n`);

    // Step 3: Run Unreal automation
    console.log('[3/3] Running automation (this may take several minutes)...\n');

    const ueProcess = spawn(UE_EDITOR_CMD, args, {
        stdio: 'inherit',
        shell: true
    });

    ueProcess.on('close', (code) => {
        if (code === 0) {
            console.log('\n╔' + '='.repeat(68) + '╗');
            console.log('║' + ' '.repeat(20) + 'Generation Complete!' + ' '.repeat(26) + '║');
            console.log('╚' + '='.repeat(68) + '╝');
            console.log(`\nAssets generated in: ${outputPath}\\${scenarioId}`);
            console.log('\nNext step: Run import script');
            console.log('  node tools/importScenarioAssets.js\n');
        } else {
            console.error(`\n❌ Unreal process exited with code ${code}`);
            process.exit(code);
        }
    });
}

// Main
if (require.main === module) {
    const scenarioId = process.argv[2];

    if (!scenarioId) {
        console.error('Usage: node generateScenarioAssets.js <scenarioId>');
        console.error('Example: node generateScenarioAssets.js directional_light');
        process.exit(1);
    }

    // Check if UE project exists
    if (!fs.existsSync(UE_PROJECT_FILE)) {
        console.error(`\n❌ UEScenarioFactory project not found at:`);
        console.error(`   ${UE_PROJECT_FILE}`);
        console.error(`\nSet UESCENARIO_FACTORY environment variable to correct path.`);
        process.exit(1);
    }

    generateScenarioAssets(scenarioId);
}

module.exports = { generateScenarioAssets };
