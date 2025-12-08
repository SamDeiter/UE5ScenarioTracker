window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS['directional_light'] = {
  "scenario_id": "directional_light",
  "steps": [
    {
      "step_id": "step-1",
      "prompt": "",
      "image_path": "directional_light/images/step-1.bmp",
      "scene_data": {
        "actors": [
          {
            "label": "SkyAtmosphere",
            "type": "SkyAtmosphere",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "ExponentialHeightFog",
            "type": "ExponentialHeightFog",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "PlayerStart",
            "type": "PlayerStart",
            "transform": {
              "location": [
                0.0,
                -300.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "landscape",
            "type": "Landscape",
            "transform": {
              "location": [
                -25200.0,
                -25200.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                100.0,
                100.0,
                100.0
              ]
            }
          }
        ],
        "lighting": [
          {
            "label": "directional_light",
            "type": "DirectionalLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                500.0
              ],
              "rotation": [
                0.0,
                0.0,
                -45.0
              ],
              "scale": [
                2.5,
                2.5,
                2.5
              ]
            },
            "lightType": "Directional",
            "intensity": 3.0,
            "color": [
              1.0,
              0.9473065137863159,
              0.8962693214416504
            ]
          },
          {
            "label": "Actor",
            "type": "SkyLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            },
            "lightType": "Sky",
            "intensity": 1.0,
            "color": [
              0.7991027235984802,
              0.8962693214416504,
              1.0
            ]
          }
        ],
        "camera": {
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
          "fov": 90,
          "note": "Camera state from viewport (simplified)"
        },
        "level": "BlackMaterial_Level",
        "image_path": "directional_light/images/step-1.bmp"
      }
    },
    {
      "step_id": "step-2",
      "prompt": "",
      "image_path": "directional_light/images/step-2.bmp",
      "scene_data": {
        "actors": [
          {
            "label": "SkyAtmosphere",
            "type": "SkyAtmosphere",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "ExponentialHeightFog",
            "type": "ExponentialHeightFog",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "PlayerStart",
            "type": "PlayerStart",
            "transform": {
              "location": [
                0.0,
                -300.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "landscape",
            "type": "Landscape",
            "transform": {
              "location": [
                -25200.0,
                -25200.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                100.0,
                100.0,
                100.0
              ]
            }
          }
        ],
        "lighting": [
          {
            "label": "directional_light",
            "type": "DirectionalLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                500.0
              ],
              "rotation": [
                0.0,
                0.0,
                -45.0
              ],
              "scale": [
                2.5,
                2.5,
                2.5
              ]
            },
            "lightType": "Directional",
            "intensity": 3.0,
            "color": [
              1.0,
              0.9473065137863159,
              0.8962693214416504
            ]
          },
          {
            "label": "Actor",
            "type": "SkyLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            },
            "lightType": "Sky",
            "intensity": 1.0,
            "color": [
              0.7991027235984802,
              0.8962693214416504,
              1.0
            ]
          }
        ],
        "camera": {
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
          "fov": 90,
          "note": "Camera state from viewport (simplified)"
        },
        "level": "BlackMaterial_Level",
        "image_path": "directional_light/images/step-2.bmp"
      }
    },
    {
      "step_id": "step-3",
      "prompt": "",
      "image_path": "directional_light/images/step-3.bmp",
      "scene_data": {
        "actors": [
          {
            "label": "SkyAtmosphere",
            "type": "SkyAtmosphere",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "ExponentialHeightFog",
            "type": "ExponentialHeightFog",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "PlayerStart",
            "type": "PlayerStart",
            "transform": {
              "location": [
                0.0,
                -300.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "landscape",
            "type": "Landscape",
            "transform": {
              "location": [
                -25200.0,
                -25200.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                100.0,
                100.0,
                100.0
              ]
            }
          }
        ],
        "lighting": [
          {
            "label": "directional_light",
            "type": "DirectionalLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                500.0
              ],
              "rotation": [
                0.0,
                0.0,
                -45.0
              ],
              "scale": [
                2.5,
                2.5,
                2.5
              ]
            },
            "lightType": "Directional",
            "intensity": 3.0,
            "color": [
              1.0,
              0.9473065137863159,
              0.8962693214416504
            ]
          },
          {
            "label": "Actor",
            "type": "SkyLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            },
            "lightType": "Sky",
            "intensity": 1.0,
            "color": [
              0.7991027235984802,
              0.8962693214416504,
              1.0
            ]
          }
        ],
        "camera": {
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
          "fov": 90,
          "note": "Camera state from viewport (simplified)"
        },
        "level": "BlackMaterial_Level",
        "image_path": "directional_light/images/step-3.bmp"
      }
    },
    {
      "step_id": "conclusion",
      "prompt": "",
      "image_path": "directional_light/images/conclusion.bmp",
      "scene_data": {
        "actors": [
          {
            "label": "SkyAtmosphere",
            "type": "SkyAtmosphere",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "ExponentialHeightFog",
            "type": "ExponentialHeightFog",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "PlayerStart",
            "type": "PlayerStart",
            "transform": {
              "location": [
                0.0,
                -300.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            }
          },
          {
            "label": "landscape",
            "type": "Landscape",
            "transform": {
              "location": [
                -25200.0,
                -25200.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                100.0,
                100.0,
                100.0
              ]
            }
          }
        ],
        "lighting": [
          {
            "label": "directional_light",
            "type": "DirectionalLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                500.0
              ],
              "rotation": [
                0.0,
                0.0,
                -45.0
              ],
              "scale": [
                2.5,
                2.5,
                2.5
              ]
            },
            "lightType": "Directional",
            "intensity": 3.0,
            "color": [
              1.0,
              0.9473065137863159,
              0.8962693214416504
            ]
          },
          {
            "label": "Actor",
            "type": "SkyLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                0.0,
                0.0,
                0.0
              ],
              "scale": [
                1.0,
                1.0,
                1.0
              ]
            },
            "lightType": "Sky",
            "intensity": 1.0,
            "color": [
              0.7991027235984802,
              0.8962693214416504,
              1.0
            ]
          }
        ],
        "camera": {
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
          "fov": 90,
          "note": "Camera state from viewport (simplified)"
        },
        "level": "BlackMaterial_Level",
        "image_path": "directional_light/images/conclusion.bmp"
      }
    }
  ]
};
