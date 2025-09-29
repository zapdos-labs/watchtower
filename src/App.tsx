import { onCleanup, onMount } from "solid-js";
import CameraView from "./components/CameraView";
import SideBar from "./components/SideBar";
import {
  parseWsMessage,
  selectedStreamId,
  setConfig,
  setLatestWsMessage,
  setSelectedStreamId,
} from "./utils";

export default function App() {
  onMount(() => {
    // Connect to websocket server
    const socket = new WebSocket("/ws");

    // IMPORTANT: Set the binaryType to 'arraybuffer'
    // This tells the WebSocket to provide the data as an ArrayBuffer, not a Blob.
    socket.binaryType = "arraybuffer";

    onCleanup(() => {
      console.log("Closing WebSocket connection.");
      socket.close();
    });

    socket.addEventListener("open", () => {
      console.log("Connected to WebSocket server");
    });

    socket.addEventListener("message", (event) => {
      const message = parseWsMessage(event.data);
      setLatestWsMessage(message);

      if (message.header.type === "config") {
        setConfig(message.header.data);
        // TODO: Delete this later
        const firstStreamId = Object.keys(message.header.data.streams).at(0);
        setSelectedStreamId(firstStreamId);
      }
    });

    socket.addEventListener("close", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket error: ", error);
    });
  });

  return <CameraView sidebar={<SideBar />} id={selectedStreamId} />;
}
