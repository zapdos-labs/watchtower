import React, { useState, useEffect } from 'react';
import { render, Text, Box, Newline } from 'ink';
import { spawn } from 'child_process';
import { logger } from './utils/logger';

export default function useDevServer() {
    const [status, setStatus] = useState('Starting...');
    const [output, setOutput] = useState<string[]>([]);

    const log = logger(setOutput);

    useEffect(() => {
        // Spawn vite with environment variables that preserve colors
        const viteProcess = spawn('npx', ['vite'], {
            stdio: ['inherit', 'pipe', 'pipe'],
            env: {
                ...process.env,
                // Force colors to be enabled in the child process
                FORCE_COLOR: '1'
            }
        });

        setStatus('Running...');

        viteProcess.stdout.on('data', (data) => {
            log(data.toString());
        });

        viteProcess.stderr.on('data', (data) => {
            log(data.toString());
            setStatus('Error!');
        });

        viteProcess.on('close', (code) => {
            setStatus(`Exited with code ${code}`);
        });

        return () => { viteProcess.kill() }
    }, [])

    return {
        status,
        output: output.join('\n')
    }
}