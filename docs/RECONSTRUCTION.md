# Native reconstruction

The Rust reconstruction workflow compares compiled geometry with independent
image annotations, then optionally requests complete AML revisions from a model.
Photographic correspondence and sampled gameplay validation are reported separately.

```sh
superspec reconstruct --source projects/study/level.aml --evidence projects/study/annotations.json --out generated/study --json
```

The source declares reference cameras and image identities. The evidence file
contains a `views` array keyed by `referenceId`, with independently recorded
`imageDimensions`, `landmarks`, `masks`, `strokes` and an optional `silhouettePath`.
A silhouette is a PNG/JPEG mask whose opaque bright pixels identify the subject.
Candidate-authored landmarks and masks do not establish acceptance.

The report includes landmark RMS error, silhouette intersection-over-union,
structural-stroke error, camera calibration, verified view count and native
navigation status. Missing independent observations leave a view unverified.
Reference captures are written with the evaluation report. `--max-dimension`
controls raster resolution, from 32 through 4096, with 512 as the default.

Optional `thresholds` in the evidence file set `landmarkRmsPixels`,
`silhouetteIoU`, `strokeErrorPixels`, `minimumVerifiedViews` and
`minimumCameraLandmarks`. The default camera check requires four independent
landmarks spanning a plane. Preserve separate source/reference evidence and use
the architectural authoring and reference-review skills for interpreting results.

## Model-assisted revisions

```sh
superspec reconstruct --source projects/study/level.aml --evidence projects/study/annotations.json --model <vision-model> --max-revisions 4 --out generated/study-model --json
```

Set `OPENAI_API_KEY` in the environment. Select an image-capable model explicitly.
This mode sends the source's reference photographs, current AML, rendered candidate
views and measured feedback to the Responses API. The client uses structured AML
output, handles refusals and incomplete responses, and bounds retries and response
sizes. `--api-url` supports a compatible endpoint for integration testing.

The source must contain the initial reference declarations and local photographs.
Local companion inputs are frozen for the run. Generated candidates can use those
companions and shipped material images. Each revision is compiled and evaluated
before selection. The workflow retains the lowest-scoring valid candidate and
reports whether acceptance was reached, exhausted or interrupted. The selected
AML, attempts and reference renders are published to the requested output folder.

`--max-source-characters` defaults to two million UTF-16 units. The Rust library
also exposes a model-independent revision callback through
`superspec_engine::reconstruction::run`.

The local HTTP transport smoke uses a fixture server. A paid provider run has not
been performed as part of the migration. The API contract follows the official
[Structured Outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs).

Historical SVGX studies require explicit `superspec migrate` before reconstruction.
Use `node tools/capture-level.mjs SOURCE.aml NEW_OUTPUT VIEWS.json` for named
Three.js captures through the native preview service. JavaScript in that helper
owns browser automation and capture file I/O.
