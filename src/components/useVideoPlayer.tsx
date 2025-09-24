import { createSignal, createEffect, onCleanup } from 'solid-js';



export default function useVideoPlayer() {
    const [imageBuffer, setImageBuffer] = createSignal<ArrayBuffer>();
    const [codecpar, setCodecpar] = createSignal<{
        width: number;
        height: number;
    }>({
        width: 640,
        height: 480
    });
    let canvasRef: HTMLCanvasElement | undefined;

    createEffect(() => {
        const c = codecpar();
        if (canvasRef) {
            canvasRef.width = c.width;
            canvasRef.height = c.height;
        }
    })

    createEffect(async () => {
        const buffer = imageBuffer();
        if (buffer && canvasRef) {
            const ctx = canvasRef.getContext('2d');
            if (!ctx) return;

            // 1. Create a Blob from the ArrayBuffer, specifying it's a JPEG
            const blob = new Blob([buffer], { type: 'image/jpeg' });

            // 2. Use the modern createImageBitmap API (it's async and efficient)
            const bitmap = await createImageBitmap(blob)
            // 3. Draw the decoded bitmap onto the canvas
            ctx.drawImage(bitmap, 0, 0, codecpar().width, codecpar().height);
            // 4. Free the memory used by the bitmap
            bitmap.close();
        }
    });

    return {
        setCodecpar,
        setImageBuffer,
        component: () => {
            return (
                <div class="flex flex-1">
                    <div class="overflow-hidden border border-zinc-600 bg-black drop-shadow-lg">
                        <canvas ref={canvasRef} width={codecpar().width} height={codecpar().height} />
                    </div>
                </div>
            )
        }
    }
};