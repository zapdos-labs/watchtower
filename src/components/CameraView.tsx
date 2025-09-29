import {
  BsBellFill,
  BsChevronDown,
  BsGearFill,
  BsInfoCircleFill,
} from "solid-icons/bs";
import { Accessor, createEffect, untrack } from "solid-js";
import { WsHeader } from "../../definitions";
import { latestWsMessage } from "../utils";
import { EventBar } from "./EventBar";
import SearchBar from "./SearchBar";
import useVideoPlayer from "./useVideoPlayer";

export default function CameraView(props: {
  sidebar: any;
  id: Accessor<string | undefined>;
}) {
  const videoPlayer = useVideoPlayer();

  function onMessage({
    header,
    imageBuffer,
  }: {
    header: WsHeader;
    imageBuffer?: ArrayBuffer;
  }) {
    console.log("CameraView received message", { header });
    const sid = untrack(props.id);

    if (header.type === "frame") {
      if (header.stream_id !== sid) {
        console.log(
          "Frame received but stream_id doesn't match:",
          header.stream_id,
          "vs",
          sid
        );
        return;
      }
      console.log("Processing frame for stream", sid);

      videoPlayer.setImageBuffer(imageBuffer);
    }

    if (header.type === "codecpar") {
      if (header.stream_id !== sid) {
        console.log(
          "Codecpar received but stream_id doesn't match:",
          header.stream_id,
          "vs",
          sid
        );
        return;
      }
      console.log("Processing codecpar for stream", sid);
      videoPlayer.setCodecpar(header.data);
    }

    if (header.type === "config") {
      console.log("Received config message in CameraView");
    }
  }

  createEffect(() => {
    const msg = latestWsMessage();
    if (!msg) return;
    onMessage(msg);
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
