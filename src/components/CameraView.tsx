import {
  BsBellFill,
  BsChevronDown,
  BsGearFill,
  BsInfoCircleFill,
} from "solid-icons/bs";
import { Accessor, createEffect, onMount, untrack } from "solid-js";
import { WsHeader } from "../../definitions";
import { globalState, latestWsMessage, setGlobalState } from "../utils";
import { EventBar } from "./EventBar";
import SearchBar from "./SearchBar";
import useVideoPlayer from "./useVideoPlayer";

export default function CameraView(props: {
  sidebar: any;
  id: Accessor<string>;
}) {
  const videoPlayer = useVideoPlayer();

  function onMessage({
    header,
    imageBuffer,
  }: {
    header: WsHeader;
    imageBuffer?: ArrayBuffer;
  }) {
    const sid = untrack(props.id);

    if (header.type === "frame") {
      if (header.stream_id !== sid) return;

      videoPlayer.setImageBuffer(imageBuffer);
    }

    if (header.type === "codecpar") {
      if (header.stream_id !== sid) return;
      videoPlayer.setCodecpar(header.data);
      setGlobalState("streams", sid, "codecpar", header.data);
    }
  }

  createEffect(() => {
    const msg = latestWsMessage();
    if (!msg) return;
    onMessage(msg);
  });

  onMount(() => {
    const codecpar = untrack(() => {
      const sid = props.id();
      return globalState.streams[sid]?.codecpar;
    });
    if (!codecpar) return;
    videoPlayer.setCodecpar(codecpar);
  });

  return (
    <div class="h-screen flex flex-col">
      <div class="flex items-start flex-1 gap-2">
        {props.sidebar}

        <div class="flex-1 flex flex-col h-full">
          <div class="flex-none h-12 relative flex items-center px-2 gap-2">
            <button class="flex items-center space-x-2 text-neutral-400 hover:text-white">
              <div class="text-xs  font-semibold">SSA MARINE MIT SW Cam</div>
              <BsChevronDown class="w-4 h-4" />
            </button>
            <div class="flex-1" />
            <SearchBar />

            <button class="rounded-full p-2  hover:bg-neutral-800 hover:text-white text-neutral-400">
              <BsBellFill class="w-4 h-4 " />
            </button>

            <button class="rounded-full p-2  hover:bg-neutral-800 hover:text-white text-neutral-400">
              <BsGearFill class="w-4 h-4 " />
            </button>

            <button class="rounded-full p-2  hover:bg-neutral-800 hover:text-white text-neutral-400">
              <BsInfoCircleFill class="w-4 h-4 " />
            </button>
          </div>
          <videoPlayer.component />
        </div>
      </div>
      <EventBar />
    </div>
  );
}
