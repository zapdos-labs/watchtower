import { BsCloudFill } from "solid-icons/bs";
import { Accessor, createSignal, For, Show } from "solid-js";
import { getDynamicIcon, notEmpty } from "../utils";
import { BiSolidCctv } from "solid-icons/bi";

type Range = {
    from_ms: number;
    to_ms: number;
}

type CameraEvent = {
    from_ms: number;
    to_ms?: number;
    type: 'motion' | 'detection' | 'threat' | 'dangerous' | 'threat_mitigated';
    label: string;
    icon: string;
}

type Mark = {
    is_minor?: boolean;
    at_ms: number;
}

const buildMarks = (range: Range) => {
    const numMarks = 10;
    const interval = (range.to_ms - range.from_ms) / numMarks;
    const result: Mark[] = [];
    for (let i = 0; i <= numMarks; i++) {
        const at_ms = range.from_ms + i * interval;
        result.push({
            at_ms
        });
    }

    const minorMarks: Mark[] = [];
    const numMinorMarks = 5;
    for (let i = 0; i < result.length; i++) {
        const mark = result[i];
        const nextMark = result[i + 1];
        if (!nextMark) break;


        const minorInterval = (nextMark.at_ms - mark.at_ms) / numMinorMarks;
        for (let j = 1; j < numMinorMarks; j++) {
            const at_ms = mark.at_ms + j * minorInterval;
            minorMarks.push({ at_ms, is_minor: true });
        }
    }

    return [...result, ...minorMarks];
}


export function EventBar() {
    const [range, setRange] = createSignal<Range>({
        from_ms: 1758792956127,
        to_ms: 1758796573099
    });

    const marks = () => buildMarks(range());


    return <div>
        <div class="ml-20 mr-12 select-none ">
            <div class="h-10 relative border-b border-zinc-800">
                <For each={marks()}>{(mark) => {
                    const position = ((mark.at_ms - range().from_ms) / (range().to_ms - range().from_ms)) * 100;
                    return (
                        <div class="absolute -translate-x-1/2 text-xs h-full flex flex-col items-center" style={{
                            left: `${position}%`,
                        }}>
                            <Show when={mark.is_minor} fallback={
                                <>
                                    {/* This wrapper will grow to fill available space */}
                                    <div class="flex-grow flex items-center">
                                        {/* The time label is now vertically centered within the wrapper */}
                                        <div>{new Date(mark.at_ms).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</div>
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
                }}</For>
            </div>
        </div>
        <div class="h-50 overflow-y-auto overflow-x-hidden ">
            <EventRow range={range} events={[{
                from_ms: 1758792956127 + 10 * 60 * 1000,
                to_ms: 1758792956127 + 14 * 60 * 1000,
                type: 'threat',
                label: 'Suspicious loitering',
                icon: 'BsExclamationTriangleFill'
            }, {
                from_ms: 1758792956127 + 30 * 60 * 1000,
                to_ms: 1758792956127 + 35 * 60 * 1000,
                type: 'dangerous',
                label: 'Purse snatched',
                icon: 'BsHandbagFill'
            }, {
                from_ms: 1758792956127 + 35 * 60 * 1000,
                to_ms: 1758792956127 + 42 * 60 * 1000,
                type: 'threat_mitigated',
                label: 'Suspect captured',
                icon: 'FaSolidHandcuffs'
            }]} />
            <EventRow range={range} events={[
                {
                    from_ms: 1758792956127 + 5 * 60 * 1000,
                    to_ms: 1758792956127 + 9 * 60 * 1000,
                    type: 'motion',
                    label: 'Motion detected',
                    icon: 'FaSolidPersonRunning'
                }
            ]} />
            <EventRow range={range} events={[{
                from_ms: 1758792956127 + 16 * 60 * 1000,
                to_ms: 1758792956127 + 27 * 60 * 1000,
                type: 'detection',
                label: 'Face matched watchlist',
                icon: 'FaSolidMask'
            }]} />
            <EventRow range={range} />
            <EventRow range={range} />
            <EventRow range={range} />
        </div>
    </div>
}

const COLORS: Record<CameraEvent['type'], { border: string; bg: string; text: string; }> = {
    motion: {
        border: 'border-zinc-600',
        bg: 'bg-zinc-500/30',
        text: 'text-zinc-500',
    },
    threat: {
        border: 'border-yellow-600',
        bg: 'bg-yellow-500/30',
        text: 'text-yellow-500',
    },
    threat_mitigated: {
        border: 'border-green-600',
        bg: 'bg-green-500/30',
        text: 'text-green-500',
    },
    dangerous: {
        border: 'border-red-600',
        bg: 'bg-red-500/30',
        text: 'text-red-500',
    },
    detection: {
        border: 'border-blue-600',
        bg: 'bg-blue-500/30',
        text: 'text-blue-500',
    }
}

export function EventRow(props: {
    range: Accessor<Range>;
    events?: CameraEvent[];
}) {

    const events = () => {
        const _events = props.events ?? []
        const filtered = _events.map(e => {
            const left_side_inside = e.from_ms >= props.range().from_ms && e.from_ms <= props.range().to_ms;
            const right_side_inside = e.to_ms && e.to_ms <= props.range().to_ms && e.to_ms >= props.range().from_ms;
            if (!left_side_inside && !right_side_inside) return;
            if (left_side_inside && right_side_inside) return {
                ...e,
                align: 'start'
            }
            if (left_side_inside && !right_side_inside) return {
                ...e,
                align: 'start'
            }
            if (!left_side_inside && right_side_inside) return {
                ...e,
                align: 'end'
            }
        }).filter(notEmpty);
        return filtered;
    }


    const marks = () => buildMarks(props.range());

    return <div class="flex items-center hover:bg-indigo-500/20">
        <button class="flex-none bg-zinc-950 w-16 h-12 flex items-center justify-center z-[20] ">
            <BiSolidCctv class="w-6 h-6 text-zinc-400" />
        </button>

        <div class="flex-1 relative h-12 flex items-center">

            {/* Backdrop */}
            <div class="absolute h-full w-[calc(100%-16px-32px)] left-[16px] right-[32px] ">

                <For each={marks()}>{(mark) => {
                    const position = ((mark.at_ms - props.range().from_ms) / (props.range().to_ms - props.range().from_ms)) * 100;
                    return (
                        <div class="absolute -translate-x-1/2 text-xs h-full flex flex-col items-center" style={{
                            left: `${position}%`,
                        }}>
                            <Show when={!mark.is_minor}>
                                <div class="h-full w-[1px] bg-zinc-800" />
                            </Show>
                        </div>
                    );
                }}</For>
            </div>


            {/* Events */}
            <div class="absolute h-full w-[calc(100%-16px-32px)] left-[16px] right-[32px] ">
                <For each={events()}>{(event) => {
                    const DynamicIcon = getDynamicIcon(event.icon);
                    const from_position = ((event.from_ms - props.range().from_ms) / (props.range().to_ms - props.range().from_ms)) * 100;
                    const to_position = (((event.to_ms ?? event.from_ms + 60000) - props.range().from_ms) / (props.range().to_ms - props.range().from_ms)) * 100;
                    return <div style={{
                        left: `${from_position}%`,
                        width: `${to_position - from_position}%`
                    }}
                        data-type={event.type}
                        data-align={event.align}
                        class={"absolute h-8 top-1/2 -translate-y-1/2  px-2 text-sm flex items-center font-medium  justify-start data-[align=end]:justify-end border-l-2 overflow-hidden"
                            + " " + COLORS[event.type].border
                            + " " + COLORS[event.type].bg
                        }>
                        <div class="flex items-center space-x-2">
                            <DynamicIcon class={"w-4 h-4" + COLORS[event.type].text} />
                            <div class="line-clamp-1">{event.label}</div>
                        </div>
                    </div>
                }}</For>
            </div>
        </div>


    </div>
}