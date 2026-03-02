import { spawn } from 'child_process';
import { join } from 'path';
import * as fs from 'fs';

const PYTHON_BRIDGE = join(process.cwd(), 'python', 'mlx_bridge.py');
const VENV_PYTHON = join(process.cwd(), 'venv', 'bin', 'python3');

async function debugMLX() {
  console.log("Debugging MLX...\n");
  
  // Check paths
  console.log("Paths:");
  console.log(`  VENV_PYTHON: ${VENV_PYTHON}`);
  console.log(`  Exists: ${fs.existsSync(VENV_PYTHON)}`);
  console.log(`  PYTHON_BRIDGE: ${PYTHON_BRIDGE}`);
  console.log(`  Exists: ${fs.existsSync(PYTHON_BRIDGE)}`);
  
  // Try running with venv python
  console.log("\nTrying venv python...");
  const proc = spawn(VENV_PYTHON, [PYTHON_BRIDGE, '--check']);
  let output = '';
  let errOutput = '';
  
  proc.stdout.on('data', (data) => output += data.toString());
  proc.stderr.on('data', (data) => errOutput += data.toString());
  
  proc.on('close', (code) => {
    console.log(`Exit code: ${code}`);
    console.log(`Stdout: ${output}`);
    console.log(`Stderr: ${errOutput}`);
  });
}

debugMLX();
