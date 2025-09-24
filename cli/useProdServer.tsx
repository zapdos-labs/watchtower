import { useState, useEffect } from 'react';
import http from 'http';
import fs from 'fs';
import path from 'path';

export default function useProdServer() {
    const [status, setStatus] = useState('Initializing...');
    const [output, setOutput] = useState('');

    useEffect(() => {
        // Path to the 'dist' folder where Vite places the built frontend assets
        const distPath = path.resolve(process.cwd(), 'dist');

        // Check if the dist directory exists before starting the server
        if (!fs.existsSync(distPath)) {
            setStatus('Error');
            setOutput(`Build directory not found. Please run 'bun run build' first.\nExpected path: ${distPath}`);
            return;
        }

        const PORT = process.env.PORT || 3000;

        // Create a simple HTTP server to serve static files
        const server = http.createServer((req, res) => {
            // Determine the file path, defaulting to index.html
            const filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url!);

            fs.readFile(filePath, (err, content) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        // If file is not found, serve index.html for SPA routing
                        fs.readFile(path.join(distPath, 'index.html'), (errIndex, contentIndex) => {
                            if (errIndex) {
                                res.writeHead(500);
                                res.end('Server Error');
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.end(contentIndex, 'utf-8');
                            }
                        });
                    } else {
                        res.writeHead(500);
                        res.end(`Server Error: ${err.code}`);
                    }
                } else {
                    // Determine content type based on file extension
                    const ext = path.extname(filePath);
                    let contentType = 'text/html';
                    if (ext === '.js') contentType = 'text/javascript';
                    if (ext === '.css') contentType = 'text/css';
                    if (ext === '.png') contentType = 'image/png';
                    if (ext === '.jpg') contentType = 'image/jpeg';
                    if (ext === '.svg') contentType = 'image/svg+xml';

                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        });

        // Start listening for requests
        server.listen(PORT, () => {
            const url = `http://localhost:${PORT}`;
            setStatus('Running in Production');
            setOutput(`Static server is live at ${url}\nServing files from: ${distPath}`);
        });

        // Return a cleanup function to close the server when the app exits
        return () => {
            server.close();
        };
    }, []); // The empty dependency array ensures this runs only once

    return {
        status,
        output,
    };
}