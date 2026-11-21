//! Acceptance of maintained LevelSpec maps against the SuperSpec engine.
use superspec_engine::{Scene, compile};

#[test]
fn edited_draft_compiles_to_xml_the_scene_builder_can_read() {
    use superspec_types::architecture::Value;

    let mut draft = levelspec_aml::read(
        r#"<architecture version="1" id="handoff"><box id="wall" width="1" depth="2" height="3"/></architecture>"#,
    )
    .unwrap();
    draft.elements[0]
        .attributes
        .insert("width".into(), Value::Number(4.));
    let aml = levelspec_aml::compile(&draft).unwrap();
    let scene = superspec_engine::compile(&aml, 1).unwrap();
    assert_eq!(scene.manifest.id, "handoff");
    assert_eq!(
        scene
            .positions
            .iter()
            .step_by(3)
            .copied()
            .fold(f32::NEG_INFINITY, f32::max),
        4.
    );

    draft.elements[0]
        .attributes
        .insert("width".into(), Value::Text("wide".into()));
    assert!(levelspec_aml::compile(&draft).is_err());
}

fn near(actual: f64, expected: f64) {
    assert!((actual - expected).abs() < 1e-5, "{actual} != {expected}");
}
fn ray(scene: &Scene, origin: [f64; 3], direction: [f64; 3]) -> f64 {
    use superspec_geometry::math::*;
    let mut distance = f64::INFINITY;
    for mesh in &scene.manifest.meshes {
        if !scene.manifest.colliders.contains(&mesh.id) {
            continue;
        }
        for t in scene.indices[mesh.index_start..mesh.index_start + mesh.index_count]
            .as_chunks::<3>()
            .0
        {
            let p = t.map(|i| {
                let offset = (mesh.vertex_start + i as usize) * 3;
                [
                    scene.positions[offset] as f64,
                    scene.positions[offset + 1] as f64,
                    scene.positions[offset + 2] as f64,
                ]
            });
            let e1 = sub(p[1], p[0]);
            let e2 = sub(p[2], p[0]);
            let h = cross(direction, e2);
            let den = dot(e1, h);
            if den.abs() < 1e-10 {
                continue;
            }
            let s = sub(origin, p[0]);
            let u = dot(s, h) / den;
            let q = cross(s, e1);
            let v = dot(direction, q) / den;
            let d = dot(e2, q) / den;
            if u >= -1e-7 && v >= -1e-7 && u + v <= 1. + 1e-7 && d > 1e-7 {
                distance = distance.min(d);
            }
        }
    }
    distance
}

#[test]
fn daiban_architecture() {
    let output = compile(include_str!("../../../examples/daiban.aml"), 1).unwrap();
    assert!(
        output
            .manifest
            .meshes
            .iter()
            .any(|m| m.id == "lower-flight")
    );
    for (origin, direction, distance) in [
        ([2.8, 7., 6.6], [0., 1., 0.], 1.965),
        ([2.6, 7., 5.4], [0., 1., 0.], 0.78),
        ([5.8, 4.6, 7.8], [1., 0., 0.], 0.8),
        ([0.7, 5.7, 2.41], [0., 0., 1.], 2.19),
        ([1.45, 3.4, 3.], [0., 0., 1.], 1.8),
    ] {
        near(ray(&output, origin, direction), distance);
    }
    assert!(ray(&output, [5.8, 4.6, 7.5], [1., 0., 0.]).is_infinite());
}

#[test]
fn dust2_architecture() {
    let output = compile(include_str!("../../../demos/dust2/scene.aml"), 1).unwrap();
    assert!(output.manifest.meshes.len() > 100);
    let xy = |x: f64, y: f64, z: f64| [(x - 50.) * 0.1, (1005. - y) * 0.1, z];
    near(ray(&output, xy(650., 230., 0.1), [0., 0., 1.]), 3.7);
    near(ray(&output, xy(650., 230., 1.), [0., 0., -1.]), 1.);
    near(ray(&output, xy(650., 230., 4.5), [0., 0., -1.]), 0.5);
    near(ray(&output, xy(820., 120., 5.), [0., 0., -1.]), 0.64);
    let metadata = &output.manifest.architecture.as_ref().unwrap().metadata;
    let player = metadata.iter().find(|n| n.kind == "player").unwrap();
    assert_eq!(
        [
            player.number("height", 0.),
            player.number("radius", 0.),
            player.number("step", 0.)
        ],
        [2., 0.25, 0.4]
    );
    let routes = metadata
        .iter()
        .filter(|n| n.kind == "route")
        .collect::<Vec<_>>();
    let expected = [
        (
            "b_doors_route",
            "b_doors_route.from",
            "b_doors_route.to",
            10.,
        ),
        (
            "b_tunnel_threshold_route",
            "b_tunnel_threshold_route.from",
            "b_tunnel_threshold_route.to",
            10.,
        ),
        (
            "short_stair_route",
            "short_stair_route.from",
            "short_stair_route.to",
            12.,
        ),
        (
            "mid_stair_route",
            "mid_stair_route.from",
            "mid_stair_route.to",
            12.,
        ),
        (
            "pit_platform_route",
            "pit_platform_route.from",
            "pit_platform_route.to",
            10.,
        ),
        ("t_to_site_a", "t_spawn_mark", "site_a", 250.),
        ("t_to_site_b", "t_spawn_mark", "site_b", 250.),
        ("t_to_a_back_mark", "t_spawn_mark", "a_back_mark", 250.),
        ("t_to_pit_mark", "t_spawn_mark", "pit_mark", 250.),
        ("t_to_short_mark", "t_spawn_mark", "short_mark", 250.),
        (
            "tunnel_bend_route",
            "tunnel_upper_mark",
            "tunnel_lower_mark",
            15.,
        ),
        ("ct_to_cross", "ct_spawn_mark", "ct_cross_mark", 28.),
        ("short_to_site", "short_mark", "site_a", 32.),
        ("long_to_site", "long_mark", "site_a", 55.),
        ("long_to_goose", "long_mark", "goose_mark", 48.),
        ("goose_to_site", "goose_mark", "site_a", 12.),
    ];
    assert_eq!(routes.len(), expected.len());
    for (id, from, to, limit) in expected {
        let route = routes.iter().find(|n| n.id == id).unwrap();
        assert_eq!(route.text("from"), Some(from));
        assert_eq!(route.text("to"), Some(to));
        assert_eq!(route.number("max-distance", 0.), limit);
        assert_eq!(route.number("min-routes", 0.), 1.);
    }
}

#[test]
fn daiban_connections_reject_missing_support() {
    let source = include_str!("../../../examples/daiban.aml").replace(
        r#"id="lower-landing""#,
        r#"id="lower-landing" collidable="false""#,
    );
    let failure = compile(&source, 1).unwrap_err();
    assert_eq!(failure.code, "AML_CONNECTION_SUPPORT");
    assert!(failure.objects.contains(&"lower-landing".into()));
}
