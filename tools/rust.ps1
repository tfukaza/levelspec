param([ValidateSet('test','build','wasm','wasm-threads','wasm-tests','check','fmt')][string]$Task = 'test')
$ErrorActionPreference = 'Stop'
$wrapper = Join-Path $PSScriptRoot 'superspec.mjs'
$engine = & node $wrapper root
if ($LASTEXITCODE -ne 0) { throw 'SuperSpec pin verification failed.' }
& (Join-Path $engine 'tools/rust.ps1') $Task
if ($LASTEXITCODE -ne 0) { throw "SuperSpec Rust $Task failed." }
if ($Task -eq 'test') {
    & node $wrapper test-harness
    if ($LASTEXITCODE -ne 0) { throw 'LevelSpec sample-map acceptance failed.' }
}
