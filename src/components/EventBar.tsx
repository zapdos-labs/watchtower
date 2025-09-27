import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { buildMarks, TimeRange } from "../utils";
import { EventRow } from "./EventRow";

export function EventBar() {
  const [range, setRange] = createSignal<TimeRange>({
    from_ms: 1758792956127,
    to_ms: 1758796573099,
  });
  const [marksBarRef, setMarksBarRef] = createSignal<HTMLDivElement>();

  const marks = () => buildMarks(range());

  createEffect(() => {
    const marksBar = marksBarRef();
    if (!marksBar) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const zoomIntensity = 0.1;
      const rect = marksBar.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const percentage = mouseX / rect.width;

      const oldRange = range();
      const timeSpan = oldRange.to_ms - oldRange.from_ms;
      const timeAtCursor = oldRange.from_ms + timeSpan * percentage;

      const direction = e.deltaY < 0 ? 1 : -1;
      const newTimeSpan = timeSpan * (1 - direction * zoomIntensity);

      const newFromMs = timeAtCursor - newTimeSpan * percentage;
      const newToMs = newFromMs + newTimeSpan;

      setRange({
        from_ms: newFromMs,
        to_ms: newToMs,
      });
    };

    marksBar.addEventListener("wheel", handleWheel);

    onCleanup(() => {
      marksBar.removeEventListener("wheel", handleWheel);
    });
  });

  return (
    <div class="border-t border-neutral-800">
      <div class="ml-20 mr-12 select-none ">
        <div
          class="h-10 relative border-b border-neutral-800"
          ref={setMarksBarRef}
        >
          <For each={marks()}>
            {(mark) => {
              const position =
                ((mark.at_ms - range().from_ms) /
                  (range().to_ms - range().from_ms)) *
                100;
              return (
                <div
                  class="absolute -translate-x-1/2 text-xs h-full flex flex-col items-center"
                  style={{
                    left: `${position}%`,
                  }}
                >
                  <Show
                    when={mark.is_minor}
                    fallback={
                      <>
                        {/* This wrapper will grow to fill available space */}
                        <div class="flex-grow flex items-center">
                          {/* The time label is now vertically centered within the wrapper */}
                          <div>
                            {new Date(mark.at_ms).toLocaleTimeString("en-US", {
                              hour12: false,
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {/* The tick mark remains at the bottom */}
                        <div class="h-2.5 bg-white w-[1px]" />
                      </>
                    }
                  >
                    {/* Minor marks remain the same: a spacer pushes the tick to the bottom */}
                    <div class="flex-grow" />
                    <div class="h-1 bg-white w-[1px]" />
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </div>
      <div class="h-50 overflow-y-auto overflow-x-hidden ">
        <EventRow
          range={range}
          events={[
            {
              from_ms: 1758792956127 + 10 * 60 * 1000,
              to_ms: 1758792956127 + 14 * 60 * 1000,
              type: "threat",
              label: "Suspicious loitering",
              icon: "BsExclamationTriangleFill",
            },
            {
              from_ms: 1758792956127 + 30 * 60 * 1000,
              to_ms: 1758792956127 + 35 * 60 * 1000,
              type: "dangerous",
              label: "Purse snatched",
              icon: "BsHandbagFill",
            },
            {
              from_ms: 1758792956127 + 35 * 60 * 1000,
              to_ms: 1758792956127 + 42 * 60 * 1000,
              type: "threat_mitigated",
              label: "Suspect captured",
              icon: "FaSolidHandcuffs",
            },
          ]}
        />
        <EventRow
          range={range}
          events={[
            {
              from_ms: 1758792956127 + 5 * 60 * 1000,
              to_ms: 1758792956127 + 9 * 60 * 1000,
              type: "motion",
              label: "Motion detected",
              icon: "FaSolidPersonRunning",
            },
          ]}
        />
        <EventRow
          range={range}
          events={[
            {
              from_ms: 1758792956127 + 16 * 60 * 1000,
              to_ms: 1758792956127 + 27 * 60 * 1000,
              type: "detection",
              label: "Face matched watchlist",
              icon: "FaSolidMask",
            },
          ]}
        />
        <EventRow range={range} />
        <EventRow range={range} />
        <EventRow range={range} />
      </div>
    </div>
  );
}
