import { Box, Newline, render, Text } from 'ink';
import React, { useEffect, useState } from 'react';
import useDevServer from './useDevServer';
import useProdServer from './useProdServer';

// Counter component remains the same
const Counter = () => {
    const [counter, setCounter] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setCounter(p => p + 1), 100);
        return () => clearInterval(timer);
    }, []);
    return <Text color="green">{counter} tests passed</Text>;
};

// The main App component with the new output box
const App = () => {
    const devServer = (process.env.NODE_ENV == 'dev' ? useDevServer : useProdServer)();

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="magenta">
            <Text bold color="white">WatchTower App is running</Text>
            <Box>
                <Text>Server Status: </Text>
                <Text color="cyan">{devServer.status}</Text>
            </Box>

            <Box borderStyle="single" borderColor="gray" flexDirection="column" paddingX={1}>
                <Text bold>Server:</Text>
                <Text>{devServer.output}</Text>
            </Box>
        </Box>
    );
};

render(<App />);