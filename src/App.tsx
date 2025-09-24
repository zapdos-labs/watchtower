import { onMount, type Component } from 'solid-js';

const App: Component = () => {

  onMount(() => {
    // Connect to websocket server
    const socket = new WebSocket('/ws');

    socket.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', (event) => {
      console.log('Message from server ', event.data);
    });

    socket.addEventListener('close', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error: ', error);
    });
  })

  return (
    <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
  );
};

export default App;
