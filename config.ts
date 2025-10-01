import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";

export type ConfigViewItem = {
  label: string;
  streams: string[];
};

export type AppConfig = {
  port: number;
  media_server: {
    port: number;
  };
  streams: {
    [id: string]: {
      label?: string;
      uri: string;
    };
  };
  views?: ConfigViewItem[];

  __path?: string;
};

type GetConfigOpts = {
  from_flags?: boolean;
  from_env?: boolean;
};

function getConfigPath(opts?: GetConfigOpts) {
  const from_env = opts?.from_env ?? true;
  const from_flags = opts?.from_flags ?? true;

  // Parse command line flags using yargs
  const argv = yargs(hideBin(process.argv))
    .option("config", {
      alias: "c",
      type: "string",
      description: "Path to config file",
    })
    .parseSync();

  let configPath: string | undefined = undefined;
  if (from_flags) {
    configPath = argv.config;
  }

  if (from_env) {
    configPath = configPath || process.env.BV_CONFIG_PATH;
  }

  if (configPath) {
    try {
      configPath = path.resolve(configPath);
      // Check if the file exists and is readable
      fs.accessSync(configPath, fs.constants.R_OK);
    } catch (err) {
      console.error(`Config file at ${configPath} is not readable:`, err);
      process.exit(1);
    }
  }

  return configPath;
}

function readConfigFile(configPath: string) {
  try {
    const configFile = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configFile);
  } catch (error) {
    console.error(`Error reading config file at ${configPath}:`, error);
    process.exit(1);
  }
}

export function getConfig(opts?: GetConfigOpts) {
  const configPath = getConfigPath(opts);
  const config: AppConfig = configPath ? readConfigFile(configPath) : {};

  if (!config.port) config.port = parseInt(process.env.BV_PORT || "3000");
  // @ts-ignore
  if (!config.media_server) config.media_server = {};
  if (!config.media_server.port)
    config.media_server.port = parseInt(
      process.env.BV_MEDIA_SERVER_PORT || "8080"
    );
  if (!config.streams) config.streams = {};
  config.__path = configPath;

  return config;
}

// Only get config from env var BV_CONFIG_PATH
// This would be passed when spawning vite process
export const viteProcessConfig = getConfig({
  from_flags: false,
  from_env: true,
});

export const mediaConfig = getConfig();
