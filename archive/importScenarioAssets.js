/**
 * UEScenarioFactory Asset Import Script
 * 
 * Synchronizes PNG screenshots and JSON scene specifications from the
 * UEScenarioFactory Unreal project to the UE5ScenarioTracker web project.
 * 
 * Source: D:\UE5_Projects\UEScenarioFactory\Content\Scenarios\<scenarioId>\
 * Target: public/scenarios/<scenarioId>/ (PNG files)
 *         public/sceneSpecs/<scenarioId>/ (JSON files)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_SOURCE_ROOT = 'D:\\UE5_Projects\\UEScenarioFactory';
const SOURCE_ROOT = process.env.UESCENARIO_FACTORY || DEFAULT_SOURCE_ROOT;
const SOURCE_SCENARIOS_DIR = path.join(SOURCE_ROOT, 'Content', 'Scenarios');

const TARGET_ROOT = __dirname + '\\..'; // Project root
const TARGET_PNG_DIR = path.join(TARGET_ROOT, 'public', 'scenarios');
const TARGET_JSON_DIR = path.join(TARGET_ROOT, 'public', 'sceneSpecs');

// Statistics
let stats = {
    scenariosProcessed: 0,
    pngsCopied: 0,
    jsonsCopied: 0,
    errors: 0
};

/**
 * Ensures a directory exists, creating it if necessary
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`  Created directory: ${dirPath}`);
    }
}

/**
 * Copies a file from source to destination
 */
function copyFile(sourcePath, destPath) {
    try {
        fs.copyFileSync(sourcePath, destPath);
        const fileName = path.basename(sourcePath);
        const scenarioId = path.basename(path.dirname(sourcePath));
        console.log(`  [${scenarioId}] ${fileName} → ${path.relative(TARGET_ROOT, destPath)}`);
        return true;
    } catch (err) {
        console.error(`  ERROR copying ${sourcePath}: ${err.message}`);
        stats.errors++;
        return false;
    }
}

/**
 * Processes a single scenario directory
 */
function processScenario(scenarioId, scenarioPath) {
    console.log(`\n[${scenarioId}]`);

    // Create target directories
    const targetPngDir = path.join(TARGET_PNG_DIR, scenarioId);
    const targetJsonDir = path.join(TARGET_JSON_DIR, scenarioId);
    ensureDir(targetPngDir);
    ensureDir(targetJsonDir);

    // Get all files in the scenario directory
    let files;
    try {
        files = fs.readdirSync(scenarioPath);
    } catch (err) {
        console.error(`  ERROR reading directory: ${err.message}`);
        stats.errors++;
        return;
    }

    // Process each file
    files.forEach(file => {
        const sourcePath = path.join(scenarioPath, file);

        // Check if it's a file (not a directory)
        if (!fs.statSync(sourcePath).isFile()) {
            return;
        }

        const ext = path.extname(file).toLowerCase();

        if (ext === '.png' && file.match(/^step\d+\.png$/i)) {
            // Copy PNG to scenarios directory
            const destPath = path.join(targetPngDir, file);
            if (copyFile(sourcePath, destPath)) {
                stats.pngsCopied++;
            }
        } else if (ext === '.json' && file.match(/^step\d+\.json$/i)) {
            // Copy JSON to sceneSpecs directory
            const destPath = path.join(targetJsonDir, file);
            if (copyFile(sourcePath, destPath)) {
                stats.jsonsCopied++;
            }
        }
    });

    stats.scenariosProcessed++;
}

/**
 * Main import function
 */
function importAssets() {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         UEScenarioFactory Asset Import Script                 ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log(`Source Root: ${SOURCE_ROOT}`);
    console.log(`Source Scenarios: ${SOURCE_SCENARIOS_DIR}`);
    console.log(`Target PNG Dir: ${TARGET_PNG_DIR}`);
    console.log(`Target JSON Dir: ${TARGET_JSON_DIR}\n`);

    // Verify source directory exists
    if (!fs.existsSync(SOURCE_SCENARIOS_DIR)) {
        console.error(`\n❌ ERROR: Source directory not found!`);
        console.error(`   Expected: ${SOURCE_SCENARIOS_DIR}`);
        console.error(`\n   Set the UESCENARIO_FACTORY environment variable to the correct path.`);
        console.error(`   Example: set UESCENARIO_FACTORY=D:\\UE5_Projects\\UEScenarioFactory\n`);
        process.exit(1);
    }

    // Ensure target directories exist
    ensureDir(TARGET_PNG_DIR);
    ensureDir(TARGET_JSON_DIR);

    // Get all scenario directories
    console.log('\n📂 Discovering scenarios...');
    let scenarioDirs;
    try {
        scenarioDirs = fs.readdirSync(SOURCE_SCENARIOS_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch (err) {
        console.error(`\n❌ ERROR reading scenarios directory: ${err.message}\n`);
        process.exit(1);
    }

    console.log(`   Found ${scenarioDirs.length} scenario(s)`);

    // Process each scenario
    console.log('\n📋 Processing scenarios...');
    scenarioDirs.forEach(scenarioId => {
        const scenarioPath = path.join(SOURCE_SCENARIOS_DIR, scenarioId);
        processScenario(scenarioId, scenarioPath);
    });

    // Print summary
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                      Import Summary                            ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log(`  Scenarios Processed: ${stats.scenariosProcessed}`);
    console.log(`  PNG Files Copied:    ${stats.pngsCopied}`);
    console.log(`  JSON Files Copied:   ${stats.jsonsCopied}`);
    console.log(`  Total Files:         ${stats.pngsCopied + stats.jsonsCopied}`);
    if (stats.errors > 0) {
        console.log(`  ⚠️  Errors:           ${stats.errors}`);
    }
    console.log('');

    if (stats.errors > 0) {
        console.log('⚠️  Import completed with errors. Review messages above.\n');
        process.exit(1);
    } else {
        console.log('✅ Import completed successfully!\n');
    }
}

// Run the import
importAssets();
