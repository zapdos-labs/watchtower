import { For } from "solid-js";
import { getDynamicIcon } from "../utils";
import { BsChevronDown, BsChevronExpand } from "solid-icons/bs";
import {
  FiBarChart2,
  FiFilm,
  FiGrid,
  FiLayers,
  FiLayout,
  FiMessageCircle,
} from "solid-icons/fi";
import { FaSolidChevronDown, FaSolidPlus } from "solid-icons/fa";

export default function SideBar() {
  const items = {
    home: {
      label: "Home",
      icon: FiGrid,
    },
    chat: {
      label: "Chat",
      icon: FiMessageCircle,
    },
    moments: {
      label: "Moments",
      icon: FiFilm,
    },
  };

  const views = {
    "v-0000": {
      label: "Outbound",
      cameras: [
        {
          label: "South West Gate",
        },
        {
          label: "East Gate",
        },
        {
          label: "Parking Lot",
        },
      ],
    },
    "v-0001": {
      label: "Inbound",
      cameras: [
        {
          label: "Lobby",
        },
        { label: "Warehouse" },
        {
          label: "Reception",
        },
        {
          label: "Cafeteria",
        },
      ],
    },
  };

  return (
    <div class="w-60 flex-none h-full bg-neutral-900 space-y-4">
      <div class="mx-4 mt-4">
        <div class="flex-1 font-ibm font-bold text-white text-2xl">
          Zapdos Labs
        </div>
      </div>

      <div class="space-y-2 mt-6">
        <div class="mx-4 text-xs font-semibold text-neutral-400">DASHBOARD</div>
        <div>
          <For each={Object.entries(items)}>
            {([key, item]) => {
              const Icon = item.icon;
              return (
                <div class="cursor-pointer px-3 py-2 mx-2 space-x-3  rounded-lg hover:bg-neutral-800 flex items-center text-neutral-300 hover:text-white">
                  <Icon class="w-4 h-4" />
                  <div>{item.label}</div>
                </div>
              );
            }}
          </For>
        </div>
      </div>

      <div class="space-y-2 mt-6">
        <div class="flex items-center mx-4 space-x-1">
          <div class="text-xs font-semibold text-neutral-400">CAMERAS</div>

          <button class="p-1 rounded hover:text-white hover:bg-neutral-800 mr-2 text-neutral-500">
            <FaSolidPlus class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-1">
          <For each={Object.values(views)}>
            {(view) => (
              <div class="ml-3.5">
                <div class="flex items-center space-x-1">
                  <button class="p-1 rounded hover:text-white hover:bg-neutral-800 mr-2 text-neutral-500">
                    <FiLayout class="w-4 h-4" />
                  </button>

                  <div class="font-semibold">{view.label}</div>
                  <div class="flex-1" />
                  <button class="p-1 rounded hover:text-white hover:bg-neutral-800 mr-2 text-neutral-600">
                    <FaSolidChevronDown class="w-4 h-4 " />
                  </button>
                </div>
                <div class="border-l-2 border-zinc-700 mt-1 pl-0.5 ml-2.5">
                  <For each={view.cameras}>
                    {(camera) => {
                      return (
                        <div class="cursor-pointer px-3 py-2 mx-2 space-x-3  rounded-lg hover:bg-neutral-800 flex items-center text-neutral-300 hover:text-white">
                          <div class="text-sm">{camera.label}</div>
                        </div>
                      );
                    }}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
