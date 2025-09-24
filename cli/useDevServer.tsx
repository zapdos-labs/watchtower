import React, { useState, useEffect } from 'react';
import { render, Text, Box, Newline } from 'ink';
import { spawn } from 'child_process';

export default function useDevServer() {
    const [status, setStatus] = useState('Starting...');
    const [output, setOutput] = useState('');

    useEffect(() => {
        // Correctly call spawn without the shell option
        const viteProcess = spawn('npx', ['vite'], {
            stdio: ['inherit', 'pipe', 'pipe'], // Correctly specify all three stdio streams
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