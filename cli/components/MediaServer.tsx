import { Box, Newline, render, Text } from "ink";
import React, { useEffect, useState } from "react";
import { forwardStream } from "../utils/startForward";
import { WebSocketServer, WebSocket } from 'ws';
import { DEFS, VideoWsMessage } from "../../definitions";
import { logger } from "../utils/logger";
import { jsonBigIntReplacer } from "../utils/json";

type WsClient = {
    id: string;
    ip: string | undefined;
    ws: WebSocket & {
        send: (data: VideoWsMessage) => boolean;
    }
}

export default function MediaServer() {
    const [output, setOutput] = useState<string[]>([]);
    let clients: {
        [key: string]: WsClient
    } = {};

    const log = logger(setOutput);


    function broadcast(opts: {
        header: Record<string, any>;
        buffer?: ArrayBufferLike;
        clients: WsClient[]
    }) {
        let finalMessage: Buffer | string;
        if (opts.buffer) {
            const { header, buffer } = opts;
            const headerString = JSON.stringify(header, jsonBigIntReplacer);
            const headerBuffer = Buffer.from(headerString, 'utf-8');
            const headerLength = headerBuffer.length;
            const lengthBuffer = Buffer.alloc(4);
            lengthBuffer.writeUInt32BE(headerLength, 0);
            const imageBuffer = Buffer.from(buffer as ArrayBuffer);
            finalMessage = Buffer.concat([lengthBuffer, headerBuffer, imageBuffer]);
        } else {
            finalMessage = JSON.stringify(opts.header, jsonBigIntReplacer);
        }

        opts.clients.forEach((client) => {
            try {
                client.ws.send(finalMessage);
            } catch (e) {
                log('Error broadcasting to client: ' + e);
                clients = Object.fromEntries(Object.entries(clients).filter(([, c]) => c.id !== client.id)); // Remove client on error
            }
        });
    }


    const streams: {
        [key: string]: {
            codecpar?: { width: number; height: number; }
        }
    } = {}

    async function loopStream(id: string, url: string) {
        const messages = forwardStream(url)

        try {
            for await (const msg of messages) {
                if (msg.type === 'frame') {
                    broadcast({
                        header: { type: 'frame', id },
                        buffer: msg.buffer,
                        clients: Object.values(clients),
                    })
                }

                if (msg.type === 'codecpar') {
                    const header = {
                        type: 'codecpar',
                        id,
                        data: msg.data
                    };

                    if (!streams[id]) streams[id] = {};
                    streams[id].codecpar = msg.data;

                    broadcast({
                        header,
                        clients: Object.values(clients),
                    })
                }
            }
        } catch (e) {
            log('Error in stream loop: ' + e);
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

            const id = crypto.randomUUID();

            clients[id] = {
                id,
                ip, ws: ws as any
            };

            Object.entries(streams).forEach(([streamId, state]) => {
                if (!state.codecpar) return;
                try {
                    broadcast({
                        header: {
                            type: 'codecpar',
                            id: streamId,
                            data: state.codecpar
                        },
                        clients: [clients[id]],
                    });
                }
                catch (e) {
                    log('Error sending codecpar to new client: ' + e);
                }
            });

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
        loopStream('camera-1', 'http://200.46.196.243/axis-cgi/media.cgi?camera=1&videoframeskipmode=empty&videozprofile=classic&resolution=1280x720&audiodeviceid=0&audioinputid=0&audiocodec=aac&audiosamplerate=16000&audiobitrate=32000&timestamp=0&videocodec=h264&container=mp4');
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
            <Text color="gray">{output.join('\n')}</Text>
        </Box>
    );
}
