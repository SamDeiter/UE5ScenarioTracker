window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS['test_light_colors'] = {
  "scenario_id": "test_light_colors",
  "steps": [
    {
      "step_id": "step-1",
      "prompt": "Red directional light",
      "image_path": "test_light_colors/images/step-1.png",
      "scene_data": {
        "actors": [
          {
            "label": "SkyAtmosphere",
            "type": "SkyAtmosphere",
            "transform": {
              "location": [
                0.0,
                0.0,
                -6000.0
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
                -5600.0,
                -50.0,
                -6850.0
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
            "label": "VolumetricCloud",
            "type": "VolumetricCloud",
            "transform": {
              "location": [
                0.0,
                0.0,
                700.0
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
                0.0,
                92.0
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
            "label": "Actor",
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
          },
          {
            "label": "Cube",
            "type": "StaticMeshActor",
            "transform": {
              "location": [
                -380.0,
                20.0,
                50.0
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
            "mesh": "/Engine/BasicShapes/Cube.Cube",
            "materials": [
              "/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"
            ]
          },
          {
            "label": "Cube2",
            "type": "StaticMeshActor",
            "transform": {
              "location": [
                830.0,
                20.0,
                50.0
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
            "mesh": "/Engine/BasicShapes/Cube.Cube",
            "materials": [
              "/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"
            ]
          },
          {
            "label": "Cube3",
            "type": "StaticMeshActor",
            "transform": {
              "location": [
                3600.0,
                20.0,
                50.0
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
            "mesh": "/Engine/BasicShapes/Cube.Cube",
            "materials": [
              "/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"
            ]
          }
        ],
        "lighting": [
          {
            "label": "MainLight",
            "type": "DirectionalLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                -13.07235717773437,
                -97.36935424804688,
                163.37743949890137
              ],
              "scale": [
                2.5,
                2.5,
                2.5
              ]
            },
            "lightType": "Directional",
            "intensity": 50.0,
            "color": [
              1.0,
              0.0,
              0.0
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
        "level": "GroundTruth",
        "image_path": "test_light_colors/images/step-1.png"
      }
    },
    {
      "step_id": "step-2",
      "prompt": "Green directional light",
      "image_path": "test_light_colors/images/step-2.png",
      "scene_data": {
        "actors": [
          {
            "label": "SkyAtmosphere",
            "type": "SkyAtmosphere",
            "transform": {
              "location": [
                0.0,
                0.0,
                -6000.0
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
                -5600.0,
                -50.0,
                -6850.0
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
            "label": "VolumetricCloud",
            "type": "VolumetricCloud",
            "transform": {
              "location": [
                0.0,
                0.0,
                700.0
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
                0.0,
                92.0
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
            "label": "Actor",
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
          },
          {
            "label": "Cube",
            "type": "StaticMeshActor",
            "transform": {
              "location": [
                -380.0,
                20.0,
                50.0
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
            "mesh": "/Engine/BasicShapes/Cube.Cube",
            "materials": [
              "/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"
            ]
          },
          {
            "label": "Cube2",
            "type": "StaticMeshActor",
            "transform": {
              "location": [
                830.0,
                20.0,
                50.0
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
            "mesh": "/Engine/BasicShapes/Cube.Cube",
            "materials": [
              "/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"
            ]
          },
          {
            "label": "Cube3",
            "type": "StaticMeshActor",
            "transform": {
              "location": [
                3600.0,
                20.0,
                50.0
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
            "mesh": "/Engine/BasicShapes/Cube.Cube",
            "materials": [
              "/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"
            ]
          }
        ],
        "lighting": [
          {
            "label": "MainLight",
            "type": "DirectionalLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                -13.07235717773437,
                -97.36935424804688,
                163.37743949890137
              ],
              "scale": [
                2.5,
                2.5,
                2.5
              ]
            },
            "lightType": "Directional",
            "intensity": 50.0,
            "color": [
              0.0,
              1.0,
              0.0
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
        "level": "GroundTruth",
        "image_path": "test_light_colors/images/step-2.png"
      }
    },
    {
      "step_id": "step-3",
      "prompt": "Blue directional light",
      "image_path": "test_light_colors/images/step-3.png",
      "scene_data": {
        "actors": [
          {
            "label": "SkyAtmosphere",
            "type": "SkyAtmosphere",
            "transform": {
              "location": [
                0.0,
                0.0,
                -6000.0
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
                -5600.0,
                -50.0,
                -6850.0
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
            "label": "VolumetricCloud",
            "type": "VolumetricCloud",
            "transform": {
              "location": [
                0.0,
                0.0,
                700.0
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
                0.0,
                92.0
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
            "label": "Actor",
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
          },
          {
            "label": "Cube",
            "type": "StaticMeshActor",
            "transform": {
              "location": [
                -380.0,
                20.0,
                50.0
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
            "mesh": "/Engine/BasicShapes/Cube.Cube",
            "materials": [
              "/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"
            ]
          },
          {
            "label": "Cube2",
            "type": "StaticMeshActor",
            "transform": {
              "location": [
                830.0,
                20.0,
                50.0
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
            "mesh": "/Engine/BasicShapes/Cube.Cube",
            "materials": [
              "/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"
            ]
          },
          {
            "label": "Cube3",
            "type": "StaticMeshActor",
            "transform": {
              "location": [
                3600.0,
                20.0,
                50.0
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
            "mesh": "/Engine/BasicShapes/Cube.Cube",
            "materials": [
              "/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"
            ]
          }
        ],
        "lighting": [
          {
            "label": "MainLight",
            "type": "DirectionalLight",
            "transform": {
              "location": [
                0.0,
                0.0,
                0.0
              ],
              "rotation": [
                -13.07235717773437,
                -97.36935424804688,
                163.37743949890137
              ],
              "scale": [
                2.5,
                2.5,
                2.5
              ]
            },
            "lightType": "Directional",
            "intensity": 50.0,
            "color": [
              0.0,
              0.0,
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
        "level": "GroundTruth",
        "image_path": "test_light_colors/images/step-3.png"
      }
    }
  ]
};
