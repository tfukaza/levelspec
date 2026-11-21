# LevelSpec tools for FPS authoring and review

Use this adapter when building or verifying LevelSpec geometry. The
[FPS workflow](../../fps-map-workflow/SKILL.md) owns the process;
[level-authoring](../SKILL.md) owns construction and circulation.
Repository contracts, coordinates, project paths and CLI commands live in
[AGENTS.md](../../../../AGENTS.md). Use stable authored IDs to track retained,
changed and retired features between drawings, AML and evidence.

## Compiled geometry and captures

Use the current CLI/help for validate, build and preview. Inspect diagnostics as
well as the actual volume. The [structural guide](structural-review.md) covers
physical transitions and [repeatable captures](structural-review.md#repeatable-captures).
Capture loaded source/companions and camera state for the inspected revision;
generated outputs belong under ignored `generated/`, with retained review evidence
separate from disposable runs.

Choose meaningful opposing and supporting views from known or explicitly provisional
body/eye/FOV settings. An arbitrary camera pose does not verify body placement or
simulate the target game's posture. Keep render visibility, physical collision,
navigation and material/gameplay behavior distinct.

## Optional visibility scanner

For a requested sampled audit:

```sh
levelspec visibility projects/my-level/level.aml \
  projects/my-level/audits/visibility.json --out generated/my-level/visibility-01 --json
```

Use a new output directory and an explicit
[query configuration](../../../../docs/FPS_VISIBILITY.md#configuration). Retain source/config
identity, supported levels, sample spacing, eye offsets, omitted opacity/state and
incomplete work budgets. Include protected spawn areas and offsets rather than only
center pairs. Optical occlusion uses rendered opaque geometry independently of
collision/navigation admission. Configured low eye offsets are optical studies,
not simulated crouch states. Interpret warnings using the
[visibility/cover guide](../../fps-map-review/references/visibility-and-cover.md).

## Inspection movement

The TypeScript viewer checks standing-body placement against compiler-produced
collision geometry. Click Walk, then a supported floor. WASD/arrows move, Space
jumps, Ctrl/C crouches, captured mouse input changes view direction, and Escape
exits. The movement helper repeats jumping or holds crouch. Focus loss, hidden
pages and a new compiled scene end inspection movement.

The canvas data-walk attribute records accepted Z-up feet, eye, height, stance
and grounded state. Horizontal movement requires continuing physical support,
including while a jump helper lifts the body. These are inspection controls.
Destination-engine gameplay still needs independent verification.
An intentional crouch-only duct or passage can still be authored, but its traversal
needs crouch-compatible movement verification in the intended engine when this
standing-eroded navigation excludes it. Check that standing is blocked and crouching
passes through the entrances, interior and exits; do not shrink the standing body
or weaken clearance checks to manufacture a pass.

For an intended drop or other directed transition, inspect takeoff, landing support,
clearance, exposure and the return route, then exercise the actual supported movement.
Nearby navigation polygons or a jump control do not prove reachability, fall damage
or one-way behavior. Do not add seeds/off-mesh links to disguise a broken route.

Retain unavailable target-engine checks as explicit limitations. Sampled navigation,
optical rays and successful exports do not establish continuous gameplay reachability
or configured destination-engine collision/gameplay.
