import { BsBellFill, BsChevronDown, BsGearFill, BsInfoCircleFill } from "solid-icons/bs";
import { onCleanup, onMount } from "solid-js";
import { VideoWsMessage } from "../definitions";
import { EventBar } from "./components/EventBar";
import SearchBar from "./components/SearchBar";
import useVideoPlayer from "./components/useVideoPlayer";
import SideBar from "./components/SideBar";

export default function App() {
  const videoPlayer = useVideoPlayer();

  function parseBinaryMessage(buffer: ArrayBuffer) {
    // Use a DataView to safely read numbers from the buffer
    const view = new DataView(buffer);

    // 1. Read the header length from the first 4 bytes (at offset 0)
    // The 'false' argument specifies Big-Endian, matching our server.
    const headerLength = view.getUint32(0, false);

    // 2. Define the byte offsets for the different parts
    const headerStart = 4; // Header starts after the 4-byte length prefix
    const imageStart = headerStart + headerLength;

    // 3. Decode the header string (from bytes to a string)
    // Use TextDecoder for proper UTF-8 handling.
    const headerSlice = buffer.slice(headerStart, imageStart);
    const headerString = new TextDecoder().decode(headerSlice);
    const header = JSON.parse(headerString);

    // 4. Extract the image data
    // The image is the rest of the buffer after the header.
    const imageBuffer = buffer.slice(imageStart);

    // --- You now have both the header and the buffer, correctly parsed ---
    // console.log('Received Header:', header);
    // console.log(`Received Image for stream ${header.id} with size ${imageBuffer.byteLength}`);

    return { header, imageBuffer };
  }


  onMount(() => {
    // Connect to websocket server
    const socket = new WebSocket('/ws');

    // IMPORTANT: Set the binaryType to 'arraybuffer'
    // This tells the WebSocket to provide the data as an ArrayBuffer, not a Blob.
    socket.binaryType = 'arraybuffer';

    onCleanup(() => {
      console.log('Closing WebSocket connection.');
      socket.close();
    });

    socket.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', (event) => {
      // We only expect ArrayBuffer messages now
      if (event.data instanceof ArrayBuffer) {
        const { header, imageBuffer } = parseBinaryMessage(event.data);
        videoPlayer.setImageBuffer(imageBuffer);
      } else {
        try {
          const json: VideoWsMessage = JSON.parse(event.data);
          console.log('Received JSON message:', json);
          if (json.type === 'codecpar') {
            videoPlayer.setCodecpar(json.data);
          }
        } catch (e) {
          console.error('Received non-binary message that is not valid JSON:', event.data);
          return;
        }
      }


    });

    socket.addEventListener('close', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error: ', error);
    });
  });

  return <div class="h-screen flex flex-col">


    <div class="flex items-start flex-1 gap-2">

      <SideBar />

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
}