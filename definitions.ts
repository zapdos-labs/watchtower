export const DEFS = {
    port: parseInt(process.env.WT_PORT || '3000'),
    media_server: {
        port: parseInt(process.env.WT_MEDIA_SERVER_PORT || '8080')
    },
}

export type VideoWsMessage = {
    type: 'frame';
    buffer: ArrayBuffer;
} | {
    type: 'codecpar';
    data: {
        width: number;
        height: number;
    }
}