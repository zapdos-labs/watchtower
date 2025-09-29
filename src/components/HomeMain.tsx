import { FaSolidClockRotateLeft } from "solid-icons/fa";
import { For } from "solid-js";
import SearchBar from "./SearchBar";

export default function HomeMain() {
  return (
    // Added `isolate` to create a new stacking context. This is important!
    <div class="flex items-center flex-col h-full justify-center bg-neutral-950 space-y-16 relative isolate">
      <div class="font-anton font-bold text-white text-6xl text-center relative z-10">
        Semantic search
        <br />
        across all cameras
      </div>

      <div class="relative z-40">
        <SearchBar variant="lg" />
      </div>

      <div class="text-left w-[40vw] mt-12 space-y-2 relative z-30">
        <div class="flex items-center space-x-2 text-neutral-300">
          <FaSolidClockRotateLeft class="w-4 h-4" />
          <div class="font-bold">Recent Searches</div>
        </div>

        <div>
          <For each={["loading dock", "back door access", "parking spot 42"]}>
            {(item) => {
              return (
                <div class="text-neutral-300 hover:text-white cursor-pointer px-6 py-4 border-b border-neutral-800">
                  {item}
                </div>
              );
            }}
          </For>
        </div>
      </div>

      {/* Gradient blob - z-index: 20 */}
      {/* This will now sit between the title (10) and the search sections (30) */}
      <div class="absolute bottom-20 right-20 translate-x-1/2 translate-y-1/2 z-20">
        <div class="gradient-circle"></div>
      </div>
    </div>
  );
}
