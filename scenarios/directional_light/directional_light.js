window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS['directional_light'] = {
    "scenario_id": "directional_light",
    "meta": {
        "title": "Directional Light Test",
        "description": "Test scenario for directional lighting",
        "estimateHours": 0.5
    },
    "start": "step_1",
    "steps": {
        "step_1": {
            "title": "Test Step",
            "prompt": "This is a test step.",
            "image_path": "directional_light/images/step_1.bmp",
            "choices": [
                {"text": "Option A", "type": "correct", "feedback": "Correct!", "next": null}
            ]
        }
    }
};
