import { Box, Newline, render, Text } from "ink";
import React, { useEffect, useState } from "react";
import { forwardStream } from "../utils/startForward";
import { WebSocketServer } from 'ws';
import { DEFS } from "../../definitions";

export default function MediaSource() {
    const [output, setOutput] = useState('');

    function log(str: string) {
        setOutput(prev => prev + str + '\n');
    }

    async function initStream() {
        const messages = forwardStream('http://200.46.196.243/axis-cgi/media.cgi?camera=1&videoframeskipmode=empty&videozprofile=classic&resolution=1280x720&audiodeviceid=0&audioinputid=0&audiocodec=aac&audiosamplerate=16000&audiobitrate=32000&timestamp=0&videocodec=h264&container=mp4')

        for await (const msg of messages) {
            if (msg.type === 'frame') {
                // Process the frame buffer (e.g., display it, save it, etc.)
                // console.log('Received frame of size:', msg.buffer.byteLength);
            }
        }
    }


    async function startMediaServer() {
        // Placeholder for WebSocket server logic
        // This function would set up a WebSocket server to stream media frames to connected clients
        log("Starting Media WebSocket Server...");

        // Create a new WebSocket server on configurable port
        const wss = new WebSocketServer({ port: DEFS.media_server.port });

        // This event listener is fired when a new client connects to the server
        wss.on('connection', (ws, req) => {
            log('New client connected.');

            // You can get the client's IP address from the request object
            const ip = req.socket.remoteAddress;
            log(`Client IP: ${ip}`);

            // Send a welcome message to the newly connected client
            ws.send('Welcome to the WebSocket server!');

            // This event listener is fired when the server receives a message from a client
            ws.on('message', (message) => {
                log(`Received message => ${message}`);

                // Echo the received message back to the client
                ws.send(`Server received: ${message}`);
            });

            // This event listener is fired when a client disconnects
            ws.on('close', () => {
                log('Client has disconnected.');
            });

            // Handle potential errors
            ws.on('error', (error) => {
                log(`WebSocket error: ${error}`);
            });
        });

        log('WebSocket server is running on ws://localhost:8080');
    }

    useEffect(() => {
        // initStream();
        startMediaServer();
    }, []);

    return (
        <Box
            borderStyle="single"
            borderColor="gray"
            flexDirection="column"
            paddingX={1}
        >
            <Text color="green"><Text bold>Media Source:</Text> Streaming...</Text>
            <Text>{output}</Text>
        </Box>
    );
}
