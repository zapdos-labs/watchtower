import { WatchtowerConfig } from "./config";
export type WsHeader =
  | {
      type: "frame";
      stream_id: string;
    }
  | {
      type: "codecpar";
      stream_id: string;
      data: {
        width: number;
        height: number;
      };
    }
  | {
      type: "config";
      data: WatchtowerConfig;
    };
