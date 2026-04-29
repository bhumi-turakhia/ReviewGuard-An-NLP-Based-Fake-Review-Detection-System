/**
 * utils/pythonRunner.js
 * ──────────────────────
 * Utility to spawn Python scripts from Node.js and capture JSON output.
 */

const { spawn } = require('child_process');
const path = require('path');

const PYTHON_PATH = path.resolve(__dirname, '../../ml-model/venv/bin/python');
const ML_DIR = path.resolve(__dirname, '../../ml-model');

/**
 * Run a Python script with JSON input, return parsed JSON output.
 * @param {string} scriptName - Python script filename
 * @param {object} inputData  - Data to pass as JSON via stdin
 * @returns {Promise<object>}
 */
function runPython(scriptName, inputData = {}) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(ML_DIR, scriptName);
    const inputJson = JSON.stringify(inputData);
    
    const py = spawn(PYTHON_PATH, [scriptPath, inputJson]);
    
    let stdout = '';
    let stderr = '';
    
    py.stdout.on('data', (data) => { stdout += data.toString(); });
    py.stderr.on('data', (data) => { stderr += data.toString(); });
    
    py.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python error (${scriptName}):`, stderr);
        return reject(new Error(`Python script failed: ${stderr || 'Unknown error'}`));
      }
      
      try {
        const result = JSON.parse(stdout.trim());
        if (result.error) {
          return reject(new Error(result.error));
        }
        resolve(result);
      } catch (e) {
        console.error('Failed to parse Python output:', stdout);
        reject(new Error('Invalid JSON from Python script'));
      }
    });
    
    py.on('error', (err) => {
      reject(new Error(`Failed to start Python: ${err.message}. Make sure Python is installed and PYTHON_PATH is correct in .env`));
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      py.kill();
      reject(new Error('Python script timed out after 30 seconds'));
    }, 30000);
  });
}

module.exports = { runPython };
