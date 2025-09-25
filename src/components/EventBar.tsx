import { BsCloudFill } from "solid-icons/bs";
import { Accessor, createSignal, Show } from "solid-js";

type Range = {
    from_unixts: number;
    to_unixts: number;
}

type CameraEvent = {
    from_unixts: number;
    to_unixts?: number;
    type: 'motion' | 'detection' | 'warning' | 'dangerous';
    color: string;
}

type Mark = {
    is_minor?: boolean;
    at_sec: number;
}

export function EventBar() {
    const [range, setRange] = createSignal<Range>({
        from_unixts: Date.now() - 3600 * 1000,
        to_unixts: Date.now()
    });

    const marks = () => {
        const numMarks = 10;
        const interval = (range().to_unixts - range().from_unixts) / numMarks;
        const result: Mark[] = [];
        for (let i = 0; i <= numMarks; i++) {
            const at_sec = range().from_unixts + i * interval;
            result.push({
                at_sec
            });
        }

        const minorMarks: Mark[] = [];
        const numMinorMarks = 5;
        for (let i = 0; i < result.length; i++) {
            const mark = result[i];
            const nextMark = result[i + 1];
            if (!nextMark) break;


            const minorInterval = (nextMark.at_sec - mark.at_sec) / numMinorMarks;
            for (let j = 1; j < numMinorMarks; j++) {
                const at_sec = mark.at_sec + j * minorInterval;
                minorMarks.push({ at_sec, is_minor: true });
            }
        }

        return [...result, ...minorMarks];
    }

    return <div>
        <div class="ml-20 mr-12 select-none">
            <div class="h-10 relative border-b border-zinc-800">
                {marks().map((mark, index) => {
                    const position = ((mark.at_sec - range().from_unixts) / (range().to_unixts - range().from_unixts)) * 100;
                    return (
                        <div class="absolute -translate-x-1/2 text-xs h-full flex flex-col items-center" style={{
                            left: `${position}%`,
                        }}>
                            <Show when={mark.is_minor} fallback={
                                <>
                                    {/* This wrapper will grow to fill available space */}
                                    <div class="flex-grow flex items-center">
                                        {/* The time label is now vertically centered within the wrapper */}
                                        <div>{new Date(mark.at_sec).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>

                                    {/* The tick mark remains at the bottom */}
                                    <div class="h-2.5 bg-white w-[1px]" />
                                </>
                            }>
                                {/* Minor marks remain the same: a spacer pushes the tick to the bottom */}
                                <div class="flex-grow" />
                                <div class="h-1 bg-white w-[1px]" />
                            </Show>
                        </div>
                    );
                })}
            </div>
        </div>
        <div class="h-50 border-t border-zinc-800 overflow-y-auto overflow-x-hidden ">
            <EventRow range={range} />
            <EventRow range={range} />
            <EventRow range={range} />
            <EventRow range={range} />
            <EventRow range={range} />
            <EventRow range={range} />
        </div>
    </div>
}

export function EventRow(props: {
    range: Accessor<Range>;
}) {
    const [events, setEvents] = createSignal<CameraEvent[]>([])

    return <div class="flex items-center bg-red-500">
        <button class="flex-none bg-zinc-800 w-10 h-12 flex items-center justify-center">
            <BsCloudFill class="w-6 h-6 text-zinc-400" />
        </button>

        <div class="flex-1">

        </div>


    </div>
}
