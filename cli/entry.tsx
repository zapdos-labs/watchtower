import React from 'react';
import { Box, render, Text } from 'ink';
import useDevServer from './useDevServer';
import useProdServer from './useProdServer';
import MediaServer from './components/MediaServer';

// The main App component with the new output box
const App = () => {
    const frontend = (process.env.NODE_ENV == 'dev' ? useDevServer : useProdServer)();

    return (
        <Box flexDirection="column" >
            <MediaServer />
            <Box borderStyle="single" borderColor="gray" flexDirection="column" paddingX={1}>
                <Text color="cyan"><Text bold>Frontend:</Text> {frontend.status}</Text>
                <Text>{frontend.output}</Text>
            </Box>
        </Box>
    );
};

render(<App />);