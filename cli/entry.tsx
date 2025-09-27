import React from "react";

// By referencing React here, we prevent it from being removed.
const _ = React.version;

import { Box, render } from "ink";
import FrontendServer from "./components/FrontendServer";
import MediaServer from "./components/MediaServer";

// The main App component with the new output box
const App = () => {
  return (
    <Box flexDirection="column">
      <MediaServer />
      <FrontendServer />
    </Box>
  );
};

render(<App />);
