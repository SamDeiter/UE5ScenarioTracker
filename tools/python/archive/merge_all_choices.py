"""
Script to merge ALL LLM-generated choices into both scenario files.
"""

import re

def format_choice(choice):
    """Format a choice object as JavaScript code."""
    # Clean up the feedback to ensure proper HTML formatting
    feedback = choice['feedback'].replace('<p>', '<p>').replace('</p>', '</p>')
    
    return f"""                {{
                    text: "{choice['text']}",
                    type: '{choice['type']}',
                    feedback: "{feedback}",
                    next: '{choice['next']}'
                }}"""

def add_choices_to_step(content, step_id, new_choices_list):
    """Add new choices to an existing step's choices array."""
    
    # Find the step's choices array
    pattern = rf"('{step_id}':\s*{{.*?choices:\s*\[)(.*?)(\])"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print(f"❌ Could not find step {step_id}")
        return content
    
    before = match.group(1)
    existing_choices = match.group(2).strip()
    after = match.group(3)
    
    # Format new choices
    formatted_new_choices = [format_choice(choice) for choice in new_choices_list]
    
    # Combine existing and new choices
    if existing_choices:
        # Add comma after existing choices
        all_choices = existing_choices.rstrip() + ',\n' + ',\n'.join(formatted_new_choices)
    else:
        all_choices = '\n'.join(formatted_new_choices)
    
    # Reconstruct the step
    new_step = before + '\n' + all_choices + '\n            ' + after
    
    # Replace in content
    new_content = content[:match.start()] + new_step + content[match.end():]
    
    print(f"✅ Added {len(new_choices_list)} choice(s) to {step_id}")
    return new_content

# ============================================================================
# LUMEN_GI.JS CHOICES
# ============================================================================

lumen_gi_choices = {
    'step-3W': [
        {
            'text': "Toggle the Lumen Global Illumination setting off and back on in Project Settings without restarting the editor.",
            'type': 'partial',
            'feedback': "<p>You flip the Lumen GI setting off and on again, hoping the engine will hot-reload it. The UI updates, but under the hood the renderer still behaves as if the old setting is active. You realize a restart is probably still required.</p>",
            'next': 'step-3W'
        },
        {
            'text': "Tweak the Post Process Volume exposure and contrast to compensate for the dark GI.",
            'type': 'misguided',
            'feedback': "<p>You crank up exposure and contrast until the scene looks brighter, but shadows and bounce lighting still feel wrong. A teammate points out that you're masking the underlying GI issue rather than fixing it. You're still stuck chasing the real problem.</p>",
            'next': 'step-3W'
        },
        {
            'text': "Start reauthoring several key materials, increasing their emissive and base color values.",
            'type': 'wrong',
            'feedback': "<p>You spend a long time pushing emissive and brightening albedo on multiple materials. The look of the level drifts away from the art direction and the GI still feels inconsistent. This sends you down a rabbit hole that ultimately doesn't solve the renderer state issue.</p>",
            'next': 'step-3W'
        }
    ],
    'step-4': [
        {
            'text': "Inspect the room's meshes for thin walls, flipped normals, and light leaks that could confuse Lumen.",
            'type': 'correct',
            'feedback': "<p>You orbit around the room and check each wall mesh, quickly spotting paper-thin geometry and a few inverted normals. It explains why indirect lighting is bleeding and breaking down. You decide to fix the geometry before touching any more global settings.</p>",
            'next': 'step-5'
        }
    ],
    'step-4M': [
        {
            'text': "Increase the intensity of all point lights in the room to overpower the dark areas.",
            'type': 'misguided',
            'feedback': "<p>You crank up the light intensities and the room looks blown out while the GI still behaves oddly in corners. A lighting artist points out that if the bounce is wrong, flooding the scene with direct light just hides the real issue. You're still not addressing the geometry.</p>",
            'next': 'step-4M'
        },
        {
            'text': "Add additional fill lights near the problem corners instead of touching the meshes.",
            'type': 'wrong',
            'feedback': "<p>You start sprinkling small fill lights into every dark corner. The level becomes overlit and visually noisy, and performance starts to dip. You've made the lighting setup harder to maintain without resolving the underlying GI discrepancy.</p>",
            'next': 'step-4M'
        },
        {
            'text': "Use the Lumen scene visualizer to confirm where geometry is missing or too thin before making changes.",
            'type': 'partial',
            'feedback': "<p>You open the Lumen visualizer and immediately see that some walls barely show up or have gaps. You still haven't edited the meshes, but now you have clear evidence that geometry is at fault. The next logical step is to actually fix those meshes.</p>",
            'next': 'step-5'
        }
    ],
    'step-5': [
        {
            'text': "Replace problematic wall planes with solid box meshes that have proper thickness.",
            'type': 'correct',
            'feedback': "<p>You swap out the ultra-thin planes for box meshes with actual volume. After rebuilding the level, Lumen's GI behaves much more predictably and the light leaks disappear. This directly addresses the core visibility and distance field issues.</p>",
            'next': 'step-6'
        },
        {
            'text': "Add simple blocking volumes behind thin walls instead of touching the original meshes.",
            'type': 'partial',
            'feedback': "<p>You drop in blocking volumes to give Lumen something more solid to work with. The GI improves in most areas, but the setup is now a bit hacky and hard to reason about. Long term, the meshes themselves still need to be cleaned up.</p>",
            'next': 'step-5W'
        }
    ],
    'step-5W': [
        {
            'text': "Enable Two Sided on the wall material and hope Lumen treats the room as closed.",
            'type': 'misguided',
            'feedback': "<p>You flip the material to Two Sided and the walls do render from both sides, but Lumen's representation of the scene is still based on geometry, not material tricks. Some artifacts shift around, yet the core GI problem remains.</p>",
            'next': 'step-5W'
        },
        {
            'text': "Increase the material opacity mask or shadow-related settings to try to block more light.",
            'type': 'wrong',
            'feedback': "<p>You dig into opacity and shadow settings, trying to force the material to occlude more light. This adds complexity and can introduce shadow artifacts without changing the underlying mesh thickness. You lose time without meaningful GI improvement.</p>",
            'next': 'step-5W'
        },
        {
            'text': "Ask the environment artist to review the meshes and propose a proper geometry fix.",
            'type': 'partial',
            'feedback': "<p>You pull in the environment artist, who immediately calls out the paper-thin walls and suggests replacing them with solid assets. You haven't made the change yet, but you now have clear direction to move away from material hacks and fix the meshes.</p>",
            'next': 'step-6'
        }
    ],
    'step-6': [
        {
            'text': "Verify that Generate Mesh Distance Fields is enabled for the affected meshes and rebuild distance fields.",
            'type': 'correct',
            'feedback': "<p>You open the mesh settings and see that distance fields aren't generated for a few key assets. After enabling them and rebuilding, Lumen's indirect lighting becomes more stable and accurate in those areas.</p>",
            'next': 'step-7'
        },
        {
            'text': "Increase the global distance field resolution in Project Settings to try to sharpen GI details.",
            'type': 'partial',
            'feedback': "<p>You raise the overall distance field resolution, which helps some small details but comes with a noticeable performance cost. The scene looks better, but you suspect per-mesh settings would have been a cleaner, more targeted solution.</p>",
            'next': 'step-6M'
        }
    ],
    'step-6M': [
        {
            'text': "Tweak roughness and specular on wall materials to try to smooth out noisy GI.",
            'type': 'misguided',
            'feedback': "<p>You adjust roughness and specular values, which changes how highlights and reflections look but doesn't fix the underlying GI structure. The indirect lighting remains unstable in problem areas, and you're still ignoring distance field settings.</p>",
            'next': 'step-6M'
        },
        {
            'text': "Increase emissive contribution on a few materials so they 'light up' the space more.",
            'type': 'wrong',
            'feedback': "<p>You push emissive values and the room starts to glow unnaturally. While Lumen does pick up some extra bounce, the lighting now fights the art direction and still feels inconsistent. You've traded one problem for another without addressing the real cause.</p>",
            'next': 'step-6M'
        },
        {
            'text': "Open the Lumen visualizer and compare how the distance fields look for problem meshes versus working ones.",
            'type': 'partial',
            'feedback': "<p>You bring up the visualizer and immediately notice that some meshes barely register in the distance field. This gives you a clear hint that mesh distance field settings are the culprit, nudging you toward the correct configuration work.</p>",
            'next': 'step-7'
        }
    ],
    'step-7': [
        {
            'text': "Use the Lumen scene and surface cache visualizers to confirm GI coverage across the room.",
            'type': 'correct',
            'feedback': "<p>You step through the visualizers and see that the room is now represented cleanly in Lumen's data. Bounce lighting looks continuous and surfaces cache correctly. With the base behavior validated, you're ready to test more dynamic scenarios.</p>",
            'next': 'step-8'
        },
        {
            'text': "Rely on a quick eyeball pass in Lit mode without any debug visualizers.",
            'type': 'partial',
            'feedback': "<p>You fly around in Lit mode and the scene seems fine, but you're essentially guessing. Without debug overlays, you could easily miss subtle coverage issues or cache problems. You decide you should still run more aggressive, dynamic tests.</p>",
            'next': 'step-8'
        }
    ],
    'step-8': [
        {
            'text': "In Play In Editor, animate a key light's intensity and color while watching how Lumen updates in real time.",
            'type': 'correct',
            'feedback': "<p>You hook the light up to a simple curve and watch the GI respond smoothly as the light ramps and shifts color. There are no obvious hitches or stale lighting, confirming that dynamic changes are propagating correctly.</p>",
            'next': 'step-9'
        },
        {
            'text': "Only scrub the light's transform in the editor viewport without actually entering Play mode.",
            'type': 'partial',
            'feedback': "<p>You drag the light around in the editor and things look okay, but this doesn't fully match runtime behavior. Without testing in PIE or a packaged build, you might miss frame-to-frame issues or streaming interactions. You still need a proper dynamic test pass.</p>",
            'next': 'step-8W'
        }
    ],
    'step-8W': [
        {
            'text': "Capture a single before/after screenshot and assume dynamic GI is fine if they look similar.",
            'type': 'misguided',
            'feedback': "<p>You compare static screenshots and conclude everything is okay, but this doesn't reveal temporal issues, hitches, or late updates. Your lead reminds you that dynamic systems need time-based testing, not just still images.</p>",
            'next': 'step-8W'
        },
        {
            'text': "Blame Nanite or Virtual Shadow Maps without collecting any profiling data.",
            'type': 'wrong',
            'feedback': "<p>You start pointing at Nanite and VSM as likely culprits, but you haven't actually profiled or isolated the issue. This sends the team on a wild goose chase until someone insists on re-running proper dynamic Lumen tests.</p>",
            'next': 'step-8W'
        },
        {
            'text': "Set up a simple Blueprint-driven light flicker test and run it in PIE to validate dynamic GI updates.",
            'type': 'partial',
            'feedback': "<p>You wire the light to a Blueprint that rapidly changes its intensity and color during PIE. The GI reacts correctly, confirming the system behaves as expected under stress. You finally have the evidence you need to move forward.</p>",
            'next': 'step-9'
        }
    ],
    'step-9': [
        {
            'text': "Profile the scene using stat GPU and Lumen console variables to measure the cost of your GI setup.",
            'type': 'correct',
            'feedback': "<p>You run stat GPU and adjust r.Lumen settings while watching frame time. You get a clear picture of how much Lumen is costing you and where you can safely dial quality up or down. This closes the loop between quality and performance.</p>",
            'next': 'conclusion'
        },
        {
            'text': "Lower all Lumen quality settings to their minimum values to guarantee better performance.",
            'type': 'misguided',
            'feedback': "<p>You slam the quality sliders down and FPS improves, but the scene looks noticeably worse and QA immediately flags the regression. You've improved performance at the expense of visual targets, and now you need a more measured tuning approach.</p>",
            'next': 'step-9'
        }
    ]
}

# ============================================================================
# BLUEPRINTSLOGIC_ADVANCED.JS CHOICES
# ============================================================================

blueprints_choices = {
    'step-1W': [
        {
            'text': "Spend time rearranging nodes and adding reroute nodes so the Blueprint graph looks cleaner.",
            'type': 'wrong',
            'feedback': "<p>You tidy up the graph and it's definitely easier on the eyes, but nothing changes at runtime. The dispatcher still sometimes fails to fire because you haven't touched initialization or binding order at all.</p>",
            'next': 'step-1W'
        },
        {
            'text': "Group related nodes into comment boxes and rename them, assuming this will reveal the bug.",
            'type': 'misguided',
            'feedback': "<p>You improve organization with comments and clearer labels, which helps future readability but doesn't fix the underlying logic. The race condition remains, and events are still occasionally missed.</p>",
            'next': 'step-1W'
        }
    ],
    'step-1M': [
        {
            'text': "Create a second dispatcher and broadcast from both, hoping one of them will always catch the event.",
            'type': 'wrong',
            'feedback': "<p>You duplicate the dispatcher and wire up extra broadcasts. The graph becomes more confusing and you still see intermittent failures. You've increased complexity without fixing the real timing issue.</p>",
            'next': 'step-1M'
        },
        {
            'text': "Move the existing dispatcher into a different Blueprint class without changing when it's bound.",
            'type': 'misguided',
            'feedback': "<p>You relocate the dispatcher to another class, thinking architecture is the problem. At runtime the behavior is unchanged: the event sometimes fires before anything has bound to it. The core issue is still the binding timing.</p>",
            'next': 'step-1M'
        },
        {
            'text': "Add detailed log messages around both the bind and broadcast calls to see which happens first.",
            'type': 'partial',
            'feedback': "<p>You sprinkle Print Strings or logging nodes around the dispatcher calls and run the game. The logs clearly show the broadcast occasionally happening before the bind. You now have solid evidence that this is an initialization order problem.</p>",
            'next': 'step-2'
        }
    ],
    'step-2': [
        {
            'text': "Map out a simple timeline of when the dispatcher is bound versus when it is broadcast during startup.",
            'type': 'correct',
            'feedback': "<p>You sketch or mentally trace the startup order and realize the broadcast can fire while the listener is still uninitialized. This confirms the failure is a race condition tied to initialization. You're now ready to explore how to fix the ordering.</p>",
            'next': 'step-2W'
        }
    ],
    'step-2W': [
        {
            'text': "Insert a Delay node before broadcasting, hoping it gives listeners time to bind.",
            'type': 'misguided',
            'feedback': "<p>You add a Delay and it appears to work in some cases, but fails in others depending on frame rate and load. The fix feels fragile and you know you're just papering over a timing issue with a magic number.</p>",
            'next': 'step-2W'
        },
        {
            'text': "Increase the Delay duration further until the issue rarely reproduces.",
            'type': 'wrong',
            'feedback': "<p>You keep increasing the Delay until the bug seems to disappear, but now your game feels sluggish and you've introduced unnecessary latency. The underlying problem is still there, only harder to spot.</p>",
            'next': 'step-2W'
        },
        {
            'text': "Bind the listener in an earlier, guaranteed initialization phase instead of relying on a Delay.",
            'type': 'partial',
            'feedback': "<p>You move the binding to an earlier point in the lifecycle so it's ready before the broadcast. This behaves much more consistently and removes the need for arbitrary delays, pushing you toward a proper initialization order fix.</p>",
            'next': 'step-3'
        }
    ],
    'step-3': [
        {
            'text': "Choose an authoritative class, such as GameMode or a central manager, to own the dispatcher binding.",
            'type': 'correct',
            'feedback': "<p>You move the binding into a class that's guaranteed to exist early and consistently, like GameMode. The dispatcher now has a reliable place to set up, which greatly reduces the chance of missing events due to order-of-creation quirks.</p>",
            'next': 'step-4'
        }
    ],
    'step-3W': [
        {
            'text': "Wrap the dispatcher broadcast in an IsValid check on the listener and do nothing if it isn't valid.",
            'type': 'misguided',
            'feedback': "<p>You add an IsValid guard to avoid errors, but when the listener isn't ready the event is just dropped silently. The bug becomes harder to notice, and players simply don't get the expected behavior.</p>",
            'next': 'step-3W'
        },
        {
            'text': "Add an IsValid check around the listener and reattempt the broadcast every Tick until it succeeds.",
            'type': 'wrong',
            'feedback': "<p>You build a Tick-based retry loop gated by IsValid, which quickly becomes noisy and inefficient. It may eventually work, but you've created a messy workaround instead of fixing the setup timing.</p>",
            'next': 'step-3W'
        },
        {
            'text': "Log a warning whenever the listener is invalid, but otherwise leave the logic unchanged.",
            'type': 'partial',
            'feedback': "<p>You at least get visibility when the listener isn't ready, but you still lose those early events. The logs confirm the problem without actually resolving it, nudging you back toward addressing initialization order.</p>",
            'next': 'step-4'
        }
    ],
    'step-3M': [
        {
            'text': "Use Tick to constantly check if the listener exists, binding to the dispatcher the moment it becomes valid.",
            'type': 'misguided',
            'feedback': "<p>You wire up Tick to poll for a valid listener and bind when it appears. It works, but you've added per-frame overhead and made the binding logic harder to follow. It's a workaround, not a clean solution.</p>",
            'next': 'step-3M'
        },
        {
            'text': "Keep the Tick loop but add a Delay inside it to reduce how often it checks for the listener.",
            'type': 'wrong',
            'feedback': "<p>You try to throttle the Tick-based polling with a Delay, making the flow even more convoluted. Now timing depends on both the frame loop and arbitrary delays, increasing the risk of missed or late bindings.</p>",
            'next': 'step-3M'
        },
        {
            'text': "Refactor the binding into GameMode's BeginPlay so it happens once in a predictable place.",
            'type': 'partial',
            'feedback': "<p>You move away from Tick and into GameMode's BeginPlay, which fires once and early. The dispatcher binding now has a deterministic location, greatly simplifying the logic and bringing you closer to the intended fix.</p>",
            'next': 'step-4'
        }
    ],
    'step-4': [
        {
            'text': "Compile the Blueprint changes, then run the game to ensure the dispatcher now always has a bound listener before broadcast.",
            'type': 'correct',
            'feedback': "<p>You compile, launch the game, and repeatedly trigger the event. The dispatcher now fires reliably with a listener always in place. This confirms your initialization order changes are working as intended.</p>",
            'next': 'step-5'
        }
    ],
    'step-4W': [
        {
            'text': "Rely on local variables or temporary references to hold the widget instead of a UPROPERTY field.",
            'type': 'misguided',
            'feedback': "<p>You stash the widget in a local variable, which works briefly, but it's not tracked for garbage collection. After a few frames, the widget can still be destroyed, leading to intermittent null references.</p>",
            'next': 'step-4W'
        },
        {
            'text': "Disable garbage collection for the widget Blueprint class in the hope it will never be destroyed.",
            'type': 'wrong',
            'feedback': "<p>You try to fight the engine's memory management instead of working with it. This approach is brittle and can lead to leaks or undefined behavior. The underlying issue is still that no owning UPROPERTY is holding a reference.</p>",
            'next': 'step-4W'
        },
        {
            'text': "Store the widget in a member variable on the owning HUD or PlayerController Blueprint.",
            'type': 'partial',
            'feedback': "<p>You add a member variable and assign the widget to it, effectively giving GC a strong reference to track. The widget now persists correctly, and you understand why an owning reference is necessary for UI elements.</p>",
            'next': 'step-5'
        }
    ],
    'step-5': [
        {
            'text': "Play through the scenario multiple times and confirm the dispatcher-driven UI updates consistently.",
            'type': 'correct',
            'feedback': "<p>You run several test passes, triggering the dispatcher under different conditions. The UI responds correctly every time, indicating that the binding, lifetime, and logic are all behaving as expected.</p>",
            'next': 'step-6'
        },
        {
            'text': "Run a single quick test and assume everything is fine after the first successful attempt.",
            'type': 'partial',
            'feedback': "<p>The first run looks good, but you haven't proven the fix across different flows or edge cases. It could still fail under load or in unusual sequences. You know you should add more thorough verification.</p>",
            'next': 'step-5W'
        }
    ],
    'step-5W': [
        {
            'text': "Rely solely on visual feedback from the UI without adding any logging or instrumentation.",
            'type': 'misguided',
            'feedback': "<p>You watch the UI during play but have no logs to tell you what the dispatcher is doing behind the scenes. When something feels off, you have little data to go on, making it hard to reproduce or diagnose subtle timing issues.</p>",
            'next': 'step-5W'
        },
        {
            'text': "Assume QA will catch any remaining ordering issues and move on to a different task.",
            'type': 'wrong',
            'feedback': "<p>You hand the build off and hope for the best. When QA reports intermittent missing UI updates, you're back at square one and have to re-open the Blueprint to add the diagnostics you skipped earlier.</p>",
            'next': 'step-5W'
        },
        {
            'text': "Add Print Strings that show when the listener binds and when the dispatcher broadcasts, including timestamps.",
            'type': 'partial',
            'feedback': "<p>You finally add detailed logging that shows the exact sequence of binds and broadcasts. This gives you clear evidence that the execution order is correct now, or pinpoints any remaining gaps, letting you move forward with confidence.</p>",
            'next': 'step-6'
        }
    ],
    'step-6': [
        {
            'text': "Stress-test edge cases like rapid item pickups, level transitions, and player respawns.",
            'type': 'correct',
            'feedback': "<p>You hammer on the system with edge cases and confirm the dispatcher remains reliable. Even under rapid interactions and transitions, the events fire and the UI updates as expected. The fix holds up under pressure.</p>",
            'next': 'step-7'
        },
        {
            'text': "Assume that if it works in the main happy path, edge cases will be fine too.",
            'type': 'partial',
            'feedback': "<p>You only check the straightforward flow, which looks good, but you haven't proven robustness. Any unusual player behavior or timing could still reveal issues, so you're leaving risk on the table.</p>",
            'next': 'step-6W'
        }
    ],
    'step-6W': [
        {
            'text': "Log a QA bug that the dispatcher is 'sometimes unreliable' without attaching reproduction steps.",
            'type': 'wrong',
            'feedback': "<p>You file a vague bug and move on, pushing the problem onto QA. Without solid repro steps or technical notes, the issue bounces back to you later, wasting more time.</p>",
            'next': 'step-6W'
        },
        {
            'text': "Ask QA for detailed repro cases, then actively test and instrument those scenarios yourself.",
            'type': 'partial',
            'feedback': "<p>You collaborate with QA, gathering specific sequences where events might be missed. Running those with your instrumentation either confirms the fix or exposes remaining gaps, making your testing much more targeted.</p>",
            'next': 'step-7'
        },
        {
            'text': "Ignore the QA report because you can't reproduce the issue locally.",
            'type': 'misguided',
            'feedback': "<p>You dismiss the bug since it doesn't show up on your machine. This leaves a lurking issue in the build and undermines trust between engineering and QA until it inevitably resurfaces.</p>",
            'next': 'step-6W'
        }
    ],
    'step-7': [
        {
            'text': "Write a brief internal doc explaining the dispatcher race condition, the fix, and recommended patterns.",
            'type': 'correct',
            'feedback': "<p>You capture the root cause, the reasoning behind your fix, and best practices for initialization order. Future team members can avoid repeating the same mistake, and your own notes will help you months from now.</p>",
            'next': 'conclusion'
        },
        {
            'text': "Add a short comment above the binding node describing why it must run early in the lifecycle.",
            'type': 'partial',
            'feedback': "<p>You at least leave an inline comment warning others not to move the binding without understanding the timing. It's lightweight but helpful. A more complete write-up would be ideal, but this still reduces the chance of regressions.</p>",
            'next': 'conclusion'
        }
    ]
}

# ============================================================================
# MERGE PROCESS
# ============================================================================

print("="*80)
print("MERGING ALL LLM-GENERATED CHOICES")
print("="*80)
print()

# Process lumen_gi.js
print("Processing lumen_gi.js...")
with open('scenarios/lumen_gi.js', 'r', encoding='utf-8') as f:
    lumen_content = f.read()

for step_id, choices in lumen_gi_choices.items():
    lumen_content = add_choices_to_step(lumen_content, step_id, choices)

with open('scenarios/lumen_gi.js', 'w', encoding='utf-8') as f:
    f.write(lumen_content)

print()

# Process blueprintslogic_advanced.js
print("Processing blueprintslogic_advanced.js...")
with open('scenarios/blueprintslogic_advanced.js', 'r', encoding='utf-8') as f:
    blueprints_content = f.read()

for step_id, choices in blueprints_choices.items():
    blueprints_content = add_choices_to_step(blueprints_content, step_id, choices)

with open('scenarios/blueprintslogic_advanced.js', 'w', encoding='utf-8') as f:
    f.write(blueprints_content)

print()
print("="*80)
print("✅ MERGE COMPLETE!")
print("="*80)
print(f"\nTotal choices added:")
print(f"  - lumen_gi.js: {sum(len(c) for c in lumen_gi_choices.values())} choices across {len(lumen_gi_choices)} steps")
print(f"  - blueprintslogic_advanced.js: {sum(len(c) for c in blueprints_choices.values())} choices across {len(blueprints_choices)} steps")
print(f"\nNext steps:")
print("1. Run check_templates_format.py to verify all steps now have 4+ choices")
print("2. Test scenarios in the browser with debug mode enabled")
print("3. Commit the changes")
