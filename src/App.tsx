import { Match, onCleanup, onMount, Switch } from "solid-js";
import StreamView from "./components/StreamView";
import SideBar from "./components/SideBar";
import {
  parseWsMessage,
  setConfig,
  setLatestWsMessage,
  setTabId,
  tabId,
} from "./utils";
import TabLayout from "./components/TabLayout";
import HomeMain from "./components/HomeMain";

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
        // const firstStreamId = Object.keys(message.header.data.streams).at(0);
        // if (firstStreamId) {
        //   setTabId({
        //     type: "stream",
        //     stream_id: firstStreamId,
        //   });
        // }
      }
    });

    socket.addEventListener("close", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket error: ", error);
    });
  });

  const sidebar = <SideBar />;

  return (
    <Switch fallback={<div>Loading...</div>}>
      <Match when={tabId().type === "stream"}>
        <StreamView sidebar={sidebar} id={() => (tabId() as any).stream_id} />
      </Match>

      <Match when={tabId().type === "home"}>
        <TabLayout sidebar={sidebar} main={<HomeMain />} />
      </Match>

      <Match when={tabId().type === "statistics"}>
        <TabLayout sidebar={sidebar} main={<div>Stats</div>} />
      </Match>

      <Match when={tabId().type === "moments"}>
        <TabLayout sidebar={sidebar} main={<div>Moments</div>} />
      </Match>
    </Switch>
  );
}
