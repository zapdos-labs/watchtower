import { useState, useEffect } from 'react';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mime from 'mime-types';

export default function useProdServer() {
    const [status, setStatus] = useState('Initializing...');
    const [output, setOutput] = useState('');

    useEffect(() => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const distPath = path.resolve(__dirname, '..', '..', 'dist');

        if (!fs.existsSync(distPath)) {
            setStatus('Error');
            setOutput(`Build directory not found. Please run 'bun run build' first.\nExpected path: ${distPath}`);
            return;
        }

        const PORT = process.env.PORT || 3000;

        const server = http.createServer((req, res) => {
            const filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url!);

            fs.readFile(filePath, (err, content) => {
                if (err) {
                    if (err.code === 'ENOENT') {
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
                    // --- REPLACEMENT LOGIC ---
                    // 2. Look up the content type using the file path
                    const contentType = mime.lookup(filePath) || 'application/octet-stream';

                    // 3. Set the header and send the response
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        });

        server.listen(PORT, () => {
            const url = `http://localhost:${PORT}`;
            setStatus('Running in Production');
            setOutput(`Static server is live at ${url}\nServing files from: ${distPath}`);
        });

        return () => {
            server.close();
        };
    }, []);

    return {
        status,
        output,
    };
}