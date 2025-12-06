window.SCENARIOS['directional_light'] = {
    meta: {
        title: "Abrupt Shadow Disappearance in Distant View",
        description: "Outdoor shadows cut off abruptly at 50 meters, making the distant landscape look flat. The goal is to extend shadows to 500 meters.",
        estimateHours: 0.75,
        category: "Lighting"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Diagnosing the Shadow Cutoff',
            sceneSetup: {
            "level": "ScenarioCapture_Level",
            "actors": [
                        {
                                    "id": "directional_light",
                                    "type": "DirectionalLight",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            500
                                                ],
                                                "rotation": [
                                                            -45,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            1,
                                                            1,
                                                            1
                                                ]
                                    },
                                    "intensity": 3.0,
                                    "lightColor": [
                                                1.0,
                                                0.95,
                                                0.9
                                    ],
                                    "selected": true
                        },
                        {
                                    "id": "landscape",
                                    "type": "Landscape",
                                    "material": "/Game/ScenarioAssets/Materials/M_Grass_Simple",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "rotation": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            100,
                                                            100,
                                                            100
                                                ]
                                    },
                                    "terrainSize": [
                                                127,
                                                127
                                    ]
                        },
                        {
                                    "id": "sky_sphere",
                                    "type": "BP_Sky_Sphere",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "rotation": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            1,
                                                            1,
                                                            1
                                                ]
                                    }
                        }
            ],
            "lighting": [
                        {
                                    "type": "SkyLight",
                                    "intensity": 1.0,
                                    "color": [
                                                0.8,
                                                0.9,
                                                1.0
                                    ]
                        }
            ],
            "camera": {
                        "location": [
                                    0,
                                    -800,
                                    200
                        ],
                        "rotation": [
                                    -10,
                                    0,
                                    0
                        ],
                        "fov": 90
            },
            "postProcess": {
                        "exposureCompensation": 0,
                        "autoExposure": true
            },
            "ui": {
                        "hideUI": true,
                        "showGrid": false,
                        "showOutliner": false
            },
            "uiTemplate": "viewport_only",
            "notes": "Show shadow cutoff at ~50m distance. Shadows should be visible close to camera but disappear abruptly."
},
            image: {
                url: "assets/generated/directional_light_step-1.png",
                alt: "UE5 Viewport showing shadow cutoff",
                prompt: "Unreal Engine 5 editor interface, Viewport showing a directional light selected in the outliner. The shadows in the scene cut off abruptly at a short distance. Dark UI theme."
            },
            prompt: "<p>You observe that shadows from the Directional Light disappear completely after about 50 meters. You select the Directional Light in the Outliner.</p><strong>Which setting controls the maximum range of dynamic shadows for a Movable light?</strong>",
            choices: [
                {
                    text: "Increase 'Dynamic Shadow Distance Movable Light' to 50000 (500m).",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This directly controls the cascade shadow map distance.</p>",
                    next: 'step-2'
                },
                {
                    text: "Increase the 'Shadow Distance Fadeout Fraction'.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> This only controls the softness of the fade, not the distance itself.</p>",
                    next: 'step-1'
                },
                {
                    text: "Increase 'Shadow Quality' in Engine Scalability Settings.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Scalability settings scale existing values but don't override the actor's hard limit.</p>",
                    next: 'step-1'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Fixing Low Resolution Shadows',
            sceneSetup: {
            "level": "ScenarioCapture_Level",
            "actors": [
                        {
                                    "id": "directional_light",
                                    "type": "DirectionalLight",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            500
                                                ],
                                                "rotation": [
                                                            -45,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            1,
                                                            1,
                                                            1
                                                ]
                                    },
                                    "intensity": 3.0,
                                    "lightColor": [
                                                1.0,
                                                0.95,
                                                0.9
                                    ],
                                    "dynamicShadowDistance": 50000,
                                    "selected": false
                        },
                        {
                                    "id": "landscape",
                                    "type": "Landscape",
                                    "material": "/Game/ScenarioAssets/Materials/M_Grass_Simple",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "rotation": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            100,
                                                            100,
                                                            100
                                                ]
                                    },
                                    "terrainSize": [
                                                127,
                                                127
                                    ]
                        },
                        {
                                    "id": "sky_sphere",
                                    "type": "BP_Sky_Sphere",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "rotation": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            1,
                                                            1,
                                                            1
                                                ]
                                    }
                        }
            ],
            "lighting": [
                        {
                                    "type": "SkyLight",
                                    "intensity": 1.0,
                                    "color": [
                                                0.8,
                                                0.9,
                                                1.0
                                    ]
                        }
            ],
            "camera": {
                        "location": [
                                    0,
                                    -800,
                                    200
                        ],
                        "rotation": [
                                    -10,
                                    0,
                                    0
                        ],
                        "fov": 90
            },
            "postProcess": {
                        "exposureCompensation": 0,
                        "autoExposure": true
            },
            "ui": {
                        "hideUI": true,
                        "showGrid": false
            },
            "uiTemplate": "viewport_only",
            "notes": "Shadows extended to 500m but appearing pixelated/blocky in distance. Need to show low resolution artifacts."
},
            prompt: "<p>You increased the distance to 500m, but now the distant shadows look blocky and pixelated because the same shadow map resolution is stretched over a larger area.</p><strong>How do you restore shadow sharpness?</strong>",
            choices: [
                {
                    text: "Increase 'Num Dynamic Shadow Cascades' from 4 to 8.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> More cascades distribute the resolution better over long distances.</p>",
                    next: 'step-3'
                },
                {
                    text: "Increase 'r.Shadow.MaxCSMResolution' in the console.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> This costs global performance. Increasing cascades is the intended workflow for distance.</p>",
                    next: 'step-2'
                },
                {
                    text: "Increase the Light Source Angle.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This softens shadows (penumbra) but does not fix resolution artifacts.</p>",
                    next: 'step-2'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'Final Verification',
            sceneSetup: {
            "level": "ScenarioCapture_Level",
            "actors": [
                        {
                                    "id": "directional_light",
                                    "type": "DirectionalLight",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            500
                                                ],
                                                "rotation": [
                                                            -45,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            1,
                                                            1,
                                                            1
                                                ]
                                    },
                                    "intensity": 3.0,
                                    "lightColor": [
                                                1.0,
                                                0.95,
                                                0.9
                                    ],
                                    "dynamicShadowDistance": 50000,
                                    "numDynamicShadowCascades": 8,
                                    "selected": false
                        },
                        {
                                    "id": "landscape",
                                    "type": "Landscape",
                                    "material": "/Game/ScenarioAssets/Materials/M_Grass_Simple",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "rotation": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            100,
                                                            100,
                                                            100
                                                ]
                                    },
                                    "terrainSize": [
                                                127,
                                                127
                                    ]
                        },
                        {
                                    "id": "sky_sphere",
                                    "type": "BP_Sky_Sphere",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "rotation": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            1,
                                                            1,
                                                            1
                                                ]
                                    }
                        }
            ],
            "lighting": [
                        {
                                    "type": "SkyLight",
                                    "intensity": 1.0,
                                    "color": [
                                                0.8,
                                                0.9,
                                                1.0
                                    ]
                        }
            ],
            "camera": {
                        "location": [
                                    0,
                                    -800,
                                    200
                        ],
                        "rotation": [
                                    -10,
                                    0,
                                    0
                        ],
                        "fov": 90
            },
            "postProcess": {
                        "exposureCompensation": 0,
                        "autoExposure": true
            },
            "ui": {
                        "hideUI": true,
                        "showGrid": false,
                        "showPIEButton": true
            },
            "uiTemplate": "viewport_only",
            "notes": "Shadows clean and extended to full 500m. Quality maintained throughout range."
},
            prompt: "<p>The shadows look correct in the viewport.</p><strong>What is the final step to ensure the fix works in-game?</strong>",
            choices: [
                {
                    text: "Play in Editor (PIE) and check 'r.Shadow.DistanceScale' to ensure no overrides.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Always verify in-game to ensure runtime settings don't override editor settings.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Build Lighting.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This is a Dynamic (Movable) light; building static lighting does nothing.</p>",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'lighting',
            title: 'Scenario Complete',
            sceneSetup: {
            "level": "ScenarioCapture_Level",
            "actors": [
                        {
                                    "id": "directional_light",
                                    "type": "DirectionalLight",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            500
                                                ],
                                                "rotation": [
                                                            -45,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            1,
                                                            1,
                                                            1
                                                ]
                                    },
                                    "intensity": 3.0,
                                    "lightColor": [
                                                1.0,
                                                0.95,
                                                0.9
                                    ],
                                    "dynamicShadowDistance": 50000,
                                    "numDynamicShadowCascades": 8
                        },
                        {
                                    "id": "landscape",
                                    "type": "Landscape",
                                    "material": "/Game/ScenarioAssets/Materials/M_Grass_Simple",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "rotation": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            100,
                                                            100,
                                                            100
                                                ]
                                    },
                                    "terrainSize": [
                                                127,
                                                127
                                    ]
                        },
                        {
                                    "id": "sky_sphere",
                                    "type": "BP_Sky_Sphere",
                                    "transform": {
                                                "location": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "rotation": [
                                                            0,
                                                            0,
                                                            0
                                                ],
                                                "scale": [
                                                            1,
                                                            1,
                                                            1
                                                ]
                                    }
                        }
            ],
            "lighting": [
                        {
                                    "type": "SkyLight",
                                    "intensity": 1.0,
                                    "color": [
                                                0.8,
                                                0.9,
                                                1.0
                                    ]
                        }
            ],
            "camera": {
                        "location": [
                                    200,
                                    -1000,
                                    300
                        ],
                        "rotation": [
                                    -15,
                                    10,
                                    0
                        ],
                        "fov": 90
            },
            "postProcess": {
                        "exposureCompensation": 0.5,
                        "autoExposure": true
            },
            "ui": {
                        "hideUI": true,
                        "showGrid": false
            },
            "uiTemplate": "viewport_only",
            "notes": "Final beauty shot showing full 500m shadow range. Wide angle, elevated camera."
},
            prompt: "You have successfully extended the shadow distance and maintained quality. The scene now looks correct at range.",
            choices: []
        }
    }
};
