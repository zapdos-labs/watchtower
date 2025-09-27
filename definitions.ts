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