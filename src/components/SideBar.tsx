import { IconTypes } from "solid-icons";
import { FaSolidChevronDown, FaSolidExpand, FaSolidPlus } from "solid-icons/fa";
import { FiFilm, FiGrid, FiLayout, FiMessageCircle } from "solid-icons/fi";
import { createSignal, For, onMount, Show } from "solid-js";
import { config, setTabId, TabId } from "../utils";
import { ConfigViewItem } from "../../config";

function SideBarViewItem(props: { view: ConfigViewItem }) {
  // TODO: persist open state
  const [isOpen, setIsOpen] = createSignal(true);

  return (
    <div class="mx-2 ">
      <div
        onClick={() => setIsOpen((o) => !o)}
        class="cursor-pointer flex items-center px-1  rounded-lg  py-2 hover:text-white hover:bg-neutral-800  text-neutral-500 group"
      >
        <div class="ml-2 mr-2">
          <FaSolidChevronDown
            data-open={isOpen()}
            class="w-4 h-4 data-[open=true]:rotate-180 transition-transform"
          />
        </div>

        <div class="font-semibold ml-1">{props.view.label}</div>
        <div class="flex-1" />

        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          class="p-1 rounded hover:text-white hover:bg-neutral-700  text-neutral-600 group-hover:opacity-100 opacity-0 transition-all"
        >
          <FaSolidExpand class="w-4 h-4" />
        </button>
      </div>
      <div
        data-open={isOpen()}
        class="border-l-2 border-zinc-700 mt-1 pl-0.5 ml-5 data-[open=false]:max-h-0 overflow-hidden transition-all duration-200 max-h-[1000px]"
      >
        <For each={props.view.streams}>
          {(stream_id) => {
            const label = config()?.streams?.[stream_id].label || stream_id;
            return (
              <div class="cursor-pointer px-3 py-2 mx-2 space-x-3  rounded-lg hover:bg-neutral-800 flex items-center text-neutral-300 hover:text-white">
                <div class="text-sm">{label}</div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}

export default function SideBar() {
  const views = () => {
    const cf = config();
    return cf?.views || [];
  };

  const items: Record<TabId, { label: string; icon: IconTypes }> = {
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
                <div
                  onClick={() => setTabId(key as TabId)}
                  class="cursor-pointer px-3 py-2 mx-2 space-x-3  rounded-lg hover:bg-neutral-800 flex items-center text-neutral-300 hover:text-white"
                >
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
          <div class="text-xs font-semibold text-neutral-400">VIEWS</div>

          <button class="p-1 rounded hover:text-white hover:bg-neutral-800 mr-2 text-neutral-500">
            <FaSolidPlus class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-1">
          <For each={views()}>{(view) => <SideBarViewItem view={view} />}</For>
        </div>
      </div>
    </div>
  );
}
