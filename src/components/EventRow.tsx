import { BiSolidCctv } from "solid-icons/bi";
import { Accessor, For, Show } from "solid-js";
import {
  buildMarks,
  CameraEvent,
  COLORS,
  getDynamicIcon,
  notEmpty,
  TimeRange,
} from "../utils";

export function EventRow(props: {
  range: Accessor<TimeRange>;
  events?: CameraEvent[];
}) {
  const events = () => {
    const _events = props.events ?? [];
    const filtered = _events
      .map((e) => {
        const left_side_inside =
          e.from_ms >= props.range().from_ms &&
          e.from_ms <= props.range().to_ms;
        const right_side_inside =
          e.to_ms &&
          e.to_ms <= props.range().to_ms &&
          e.to_ms >= props.range().from_ms;
        if (!left_side_inside && !right_side_inside) return;
        if (left_side_inside && right_side_inside)
          return {
            ...e,
            align: "start",
          };
        if (left_side_inside && !right_side_inside)
          return {
            ...e,
            align: "start",
          };
        if (!left_side_inside && right_side_inside)
          return {
            ...e,
            align: "end",
          };
      })
      .filter(notEmpty);
    return filtered;
  };

  const marks = () => buildMarks(props.range());

  return (
    <div class="flex items-center hover:bg-indigo-500/20">
      <button class="flex-none bg-neutral-950 w-16 h-12 flex items-center justify-center z-[20] ">
        <BiSolidCctv class="w-6 h-6 text-neutral-400" />
      </button>

      <div class="flex-1 relative h-12 flex items-center">
        {/* Backdrop */}
        <div class="absolute h-full w-[calc(100%-16px-32px)] left-[16px] right-[32px] ">
          <For each={marks()}>
            {(mark) => {
              const position =
                ((mark.at_ms - props.range().from_ms) /
                  (props.range().to_ms - props.range().from_ms)) *
                100;
              return (
                <div
                  class="absolute -translate-x-1/2 text-xs h-full flex flex-col items-center"
                  style={{
                    left: `${position}%`,
                  }}
                >
                  <Show when={!mark.is_minor}>
                    <div class="h-full w-[1px] bg-neutral-800" />
                  </Show>
                </div>
              );
            }}
          </For>
        </div>

        {/* Events */}
        <div class="absolute h-full w-[calc(100%-16px-32px)] left-[16px] right-[32px] ">
          <For each={events()}>
            {(event) => {
              const DynamicIcon = getDynamicIcon(event.icon);
              const from_position =
                ((event.from_ms - props.range().from_ms) /
                  (props.range().to_ms - props.range().from_ms)) *
                100;
              const to_position =
                (((event.to_ms ?? event.from_ms + 60000) -
                  props.range().from_ms) /
                  (props.range().to_ms - props.range().from_ms)) *
                100;
              return (
                <div
                  style={{
                    left: `${from_position}%`,
                    width: `${to_position - from_position}%`,
                  }}
                  data-type={event.type}
                  data-align={event.align}
                  class={
                    "absolute h-8 top-1/2 -translate-y-1/2  px-2 text-sm flex items-center font-medium  justify-start data-[align=end]:justify-end border-l-2 overflow-hidden" +
                    " " +
                    COLORS[event.type].border +
                    " " +
                    COLORS[event.type].bg
                  }
                >
                  <div class="flex items-center space-x-2">
                    <DynamicIcon class={"w-4 h-4" + COLORS[event.type].text} />
                    <div class="line-clamp-1">{event.label}</div>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}
