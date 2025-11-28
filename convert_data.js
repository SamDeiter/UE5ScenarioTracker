const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const INPUT_FILE = 'raw_data.json';
const OUTPUT_DIR = 'output_scenarios';

// --- TEMPLATE ---
const SCENARIO_TEMPLATE = (id, title, desc, category, estimate, steps) => `
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['${id}'] = {
    meta: {
        title: "${title.replace(/"/g, '\\"')}",
        description: "${desc.replace(/"/g, '\\"')}",
        difficulty: "medium",
        category: "${category}",
        estimate: ${estimate}
    },
    start: "step_1",
    steps: ${JSON.stringify(steps, null, 4)}
};
`;

// --- HELPER: SANITIZE FILENAMES ---
function sanitizeFilename(str) {
    return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// --- CONVERTER LOGIC ---
function convertData() {
    try {
        if (!fs.existsSync(INPUT_FILE)) {
            console.error(`Input file ${INPUT_FILE} not found.`);
            return;
        }

        const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
        let parsedData;

        try {
            parsedData = JSON.parse(rawData);
        } catch (e) {
            console.error("Error parsing JSON. Please ensure raw_data.json contains a valid JSON array.");
            return;
        }

        if (!Array.isArray(parsedData)) {
            parsedData = [parsedData];
        }

        // Create output directory
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }

        console.log(`Found ${parsedData.length} scenarios to process...`);

        parsedData.forEach((item, index) => {
            const scenarioData = item.scenario;

            if (!scenarioData) {
                console.warn(`Skipping item ${index}: Missing 'scenario' property.`);
                return;
            }

            // 1. Extract Metadata
            const id = scenarioData.scenario_id || `scenario_${index}`;
            const title = scenarioData.title || "Untitled Scenario";
            const desc = scenarioData.problem_description || "No description provided.";
            const category = scenarioData.focus_area || "General";
            const estimate = scenarioData.estimated_hours || 0.5;

            // 2. Build Sequential Steps
            const steps = {};
            const correctSteps = scenarioData.correct_solution_steps || [];
            const wrongStepsPool = scenarioData.common_wrong_steps || [];

            if (correctSteps.length === 0) {
                // Fallback if no steps provided
                steps["step_1"] = {
                    prompt: desc,
                    choices: [{ text: "Resolve Issue", next: "conclusion", type: "correct", time_cost: 0.5 }]
                };
            } else {
                correctSteps.forEach((step, i) => {
                    const stepNum = i + 1;
                    const stepId = `step_${stepNum}`;
                    const nextStepId = (i === correctSteps.length - 1) ? "conclusion" : `step_${stepNum + 1}`;

                    // Determine Prompt
                    let prompt = "";
                    if (i === 0) {
                        prompt = desc; // First step shows the problem
                    } else {
                        // Subsequent steps show context
                        prompt = `Step ${stepNum}: What is the next logical action?`;
                    }

                    const choices = [];

                    // A. Add the Correct Choice
                    choices.push({
                        text: step.step_description,
                        next: nextStepId,
                        type: "correct",
                        time_cost: step.time_cost || 0.1
                    });

                    // B. Add 1-2 Distractors (Wrong Choices)
                    // We pick randomly from the pool to ensure variety
                    if (wrongStepsPool.length > 0) {
                        const numDistractors = Math.min(wrongStepsPool.length, 2);
                        // Simple shuffle of pool indices
                        const poolIndices = Array.from({ length: wrongStepsPool.length }, (_, k) => k);
                        for (let k = poolIndices.length - 1; k > 0; k--) {
                            const j = Math.floor(Math.random() * (k + 1));
                            [poolIndices[k], poolIndices[j]] = [poolIndices[j], poolIndices[k]];
                        }

                        for (let d = 0; d < numDistractors; d++) {
                            const wrongStep = wrongStepsPool[poolIndices[d]];
                            choices.push({
                                text: wrongStep.step_description,
                                next: stepId, // Wrong answers keep you on the same step (retry)
                                type: "misguided",
                                time_cost: wrongStep.time_penalty || 0.5
                            });
                        }
                    }

                    // Shuffle the choices for this step
                    for (let c = choices.length - 1; c > 0; c--) {
                        const j = Math.floor(Math.random() * (c + 1));
                        [choices[c], choices[j]] = [choices[j], choices[c]];
                    }

                    steps[stepId] = {
                        prompt: prompt,
                        choices: choices
                    };
                });
            }

            // 3. Generate File Content
            const fileContent = SCENARIO_TEMPLATE(id, title, desc, category, estimate, steps);

            // 4. Write File
            const filenameStr = item.key || id;
            const filename = `${sanitizeFilename(filenameStr)}.js`;
            const outputPath = path.join(OUTPUT_DIR, filename);

            fs.writeFileSync(outputPath, fileContent);
            console.log(`Generated: ${outputPath}`);
        });

        console.log(`\nSuccess! Created ${parsedData.length} scenario files in '${OUTPUT_DIR}/'.`);

    } catch (err) {
        console.error("Error:", err.message);
    }
}

convertData();
