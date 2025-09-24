import React, { useState, useEffect } from 'react';
import { render, Text, Box, Newline } from 'ink';
import { spawn } from 'child_process';

export default function useDevServer() {
    const [status, setStatus] = useState('Starting...');
    const [output, setOutput] = useState('');

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
            setOutput(prevOutput => prevOutput + data.toString());
        });

        viteProcess.stderr.on('data', (data) => {
            setOutput(prevOutput => prevOutput + data.toString());
            setStatus('Error!');
        });

        viteProcess.on('close', (code) => {
            setStatus(`Exited with code ${code}`);
        });

        return () => { viteProcess.kill() }
    }, [])

    return {
        status,
        output
    }
}