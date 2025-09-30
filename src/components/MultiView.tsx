import { FaSolidArrowLeft, FaSolidExpand } from "solid-icons/fa";
import { Accessor, For } from "solid-js";
import { config, tabId } from "../utils";
import useVideoPlayer from "./useVideoPlayer";
import useWsVideo from "./useWsVideo";

function StreamItem(props: { id: Accessor<string> }) {
  const videoPlayer = useVideoPlayer();
  useWsVideo({ id: props.id, videoPlayer });

  const label = () => {
    return config()?.streams?.[props.id()]?.label || props.id();
  };
  return (
    <div class="h-full overflow-hidden relative">
      <videoPlayer.component />

      <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-99% to-transparent">
        {label()}
      </div>
    </div>
  );
}

export default function MultiView() {
  const streamIds = () => (tabId() as any).stream_ids ?? [];

  const numCols = () => {
    const n = streamIds().length;
    return Math.min(4, Math.ceil(Math.sqrt(n)));
  };

  return (
    <div class="h-full flex flex-col">
      <div class="flex-none px-2 py-2 flex items-center space-x-2">
        <button
          onClick={() => {}}
          class="flex items-center space-x-2 text-neutral-400 hover:text-white transition-all duration-100 bg-neutral-900 hover:bg-neutral-950 border border-neutral-800/0 hover:border-neutral-800 px-4 py-2 rounded-lg"
        >
          <FaSolidArrowLeft class="w-4 h-4" />
          <div class="font-bold text-sm">Back</div>
        </button>

        <button
          onClick={() => {}}
          class="flex items-center space-x-2 text-neutral-400 hover:text-white transition-all duration-100 bg-neutral-900 hover:bg-neutral-950 border border-neutral-800/0 hover:border-neutral-800 px-4 py-2 rounded-lg"
        >
          <FaSolidExpand class="w-4 h-4" />
          <div class="font-bold text-sm">Fullscreen</div>
        </button>
      </div>

      <div
        class="grid flex-1 border-t border-neutral-800 divide-x divide-y divide-neutral-800"
        style={{
          "grid-template-columns": `repeat(${numCols()}, minmax(0, 1fr))`,
        }}
      >
        <For each={streamIds()}>{(id) => <StreamItem id={() => id} />}</For>
      </div>
    </div>
  );
}
