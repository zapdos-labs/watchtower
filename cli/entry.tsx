import { Box, Newline, render, Text } from 'ink';
import React, { useEffect, useState } from 'react';
import useDevServer from './useDevServer';
import useProdServer from './useProdServer';
import MediaSource from './components/MediaSource';

// The main App component with the new output box
const App = () => {
    const frontend = (process.env.NODE_ENV == 'dev' ? useDevServer : useProdServer)();

    return (
        <Box flexDirection="column" >
            <MediaSource />
            <Box borderStyle="single" borderColor="gray" flexDirection="column" paddingX={1}>
                <Text color="cyan"><Text bold>Frontend:</Text> {frontend.status}</Text>
                <Text>{frontend.output}</Text>
            </Box>
        </Box>
    );
};

render(<App />);