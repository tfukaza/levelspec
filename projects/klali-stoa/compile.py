"""Compatibility launcher for the SuperSpec exporter."""
import argparse
from pathlib import Path
import subprocess
import sys

parser = argparse.ArgumentParser()
parser.add_argument("cli")
parser.add_argument("output")
parser.add_argument("--jobs", type=int)
args = parser.parse_args()
project = Path(__file__).resolve().parent
repos = project.parents[2]
command = [sys.executable, repos / "superspec/tools/kowloon-export/compile.py",
           project / "scene.aml", args.cli, args.output]
if args.jobs is not None:
    command.extend(["--jobs", str(args.jobs)])
subprocess.run(command, check=True)
