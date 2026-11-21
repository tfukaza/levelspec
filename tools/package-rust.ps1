param(
    [string]$Output = 'generated/native-release',
    [switch]$SkipBuild
)
$ErrorActionPreference = 'Stop'
$repository = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$engine = & node (Join-Path $PSScriptRoot 'superspec.mjs') root
if ($LASTEXITCODE -ne 0) { throw 'SuperSpec pin verification failed.' }
$destination = if ([IO.Path]::IsPathRooted($Output)) { [IO.Path]::GetFullPath($Output) } else { [IO.Path]::GetFullPath((Join-Path $repository $Output)) }
& (Join-Path $engine 'tools/package-rust.ps1') -Output $destination -SkipBuild:$SkipBuild
if ($LASTEXITCODE -ne 0) { throw 'SuperSpec packaging failed.' }
