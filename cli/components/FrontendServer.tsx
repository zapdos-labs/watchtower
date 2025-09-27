import { Box, Text } from "ink";
import useDevServer from "./useDevServer";
import useProdServer from "./useProdServer";
import React from "react";

export default function FrontendServer() {
  const frontend = (
    process.env.NODE_ENV == "dev" ? useDevServer : useProdServer
  )();

  return (
    <Box
      borderStyle="single"
      borderColor="gray"
      flexDirection="column"
      paddingX={1}
    >
      <Text color="cyan">
        <Text bold>Frontend:</Text> {frontend.status}
      </Text>
      <Text color="gray">{frontend.output}</Text>
    </Box>
  );
}
