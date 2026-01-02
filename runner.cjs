const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream('runner.log', { flags: 'a' });

function log(msg) {
    process.stdout.write(msg);
    logStream.write(msg);
}

function runCommand(command, args, isLongRunning = false) {
    return new Promise((resolve, reject) => {
        log(`\n>>> Starting: ${command} ${args.join(' ')}\n`);

        // Ensure npm can find node
        const env = { ...process.env, PATH: process.env.PATH + ";C:\\Program Files\\nodejs" };

        // On Windows, npm is a batch file, so we need shell: true usually, 
        // or point to npm.cmd directly. Let's rely on shell:true and PATH.
        const proc = spawn(command, args, {
            shell: true,
            env: env,
            cwd: __dirname
        });

        proc.stdout.on('data', (data) => log(data.toString()));
        proc.stderr.on('data', (data) => log(data.toString()));

        proc.on('error', (err) => {
            log(`Error: ${err.message}\n`);
            reject(err);
        });

        proc.on('close', (code) => {
            log(`\n<<< Exited with code ${code}\n`);
            if (code === 0 || isLongRunning) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
}

async function main() {
    try {
        // 1. Install
        await runCommand('npm', ['install']);

        // 2. Run Dev
        // This won't resolve until server stops, so we just start it.
        await runCommand('npm', ['run', 'dev'], true);
    } catch (err) {
        log(`CRITICAL FAILURE: ${err.message}\n`);
    }
}

main();
