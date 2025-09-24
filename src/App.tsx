import { createSignal, onMount, onCleanup, createEffect, type Component, Show } from 'solid-js';

const App: Component = () => {
  // Signal to hold the raw blob data from the WebSocket
  const [imageBlob, setImageBlob] = createSignal<Blob>();
  // Signal to hold the temporary URL for the <img> tag
  const [imageUrl, setImageUrl] = createSignal<string>();

  onMount(() => {
    // Connect to websocket server
    const socket = new WebSocket('/ws');

    onCleanup(() => {
      console.log('Closing WebSocket connection.');
      socket.close();
    });

    socket.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', (event) => {
      const blob = new Blob([event.data]);
      setImageBlob(blob);
    });

    socket.addEventListener('close', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error: ', error);
    });

  });

  // IMPORTANT: Use an effect to manage the lifecycle of the object URL
  createEffect(() => {
    const blob = imageBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      setImageUrl(url);

      // This cleanup function runs when the effect re-runs or the component is unmounted
      onCleanup(() => {
        URL.revokeObjectURL(url);
      });
    }
  });

  return (
    <div>
      {/* Display a message while waiting for the image */}
      <Show when={imageUrl()}>
        <img src={imageUrl()} alt="WebSocket Image" />
      </Show>
    </div>
  );
};

export default App;