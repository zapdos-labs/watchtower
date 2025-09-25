import { BsSearch } from "solid-icons/bs";
import { FaSolidCloud } from "solid-icons/fa";
import { VsSearch } from "solid-icons/vs";
import { createSignal, onCleanup, onMount, Show, untrack } from "solid-js";

function NoResultIcon() {
    return <div class=" flex items-center -space-x-4">
        <FaSolidCloud class="w-14 h-14 text-zinc-700" />
        <BsSearch class="w-7 h-7 text-white translate-y-1" />
    </div>
}

export default function SearchBar() {
    const [isOpen, setIsOpen] = createSignal();
    const [barRef, setBarRef] = createSignal<HTMLDivElement>();
    const [state, setState] = createSignal<{
        type: 'idle' | 'searching' | 'result';
        query?: string;
        result?: {
            items: any[];
        };
    }>({ type: 'result' });

    onMount(() => {
        const listener = (e: MouseEvent) => {
            const bar = untrack(barRef);
            if (!bar) return;
            const isInside = bar === e.target || bar.contains(e.target as any);
            setIsOpen(isInside);
        }
        onCleanup(() => {
            document.removeEventListener('click', listener);
        })

        document.addEventListener('click', listener)
    })


    const isEmptyResult = () => state().type === 'result' && (state().result?.items.length ?? 0) == 0;

    return <div>
        <Show when={isOpen()}>
            <div
                class="fixed h-[100vh] w-[100vw] top-0 left-0 bg-black/80 z-[100]" />
        </Show>
        <div
            ref={setBarRef}
            data-open={isOpen()}
            class="z-[200] absolute top-2 left-1/2 -translate-x-1/2 w-[24rem] data-[open=true]:top-10 transition-all data-[open=true]:w-[50vw] data-[open=true]:drop-shadow-lg  border border-zinc-800  data-[open=false]:rounded  data-[open=true]:rounded-lg overflow-hidden bg-zinc-900">

            <div
                data-open={isOpen()}
                class="relative  h-8 data-[open=true]:text-xl data-[open=true]:h-12   group ">
                <div
                    data-open={isOpen()}
                    class="absolute top-1/2 -translate-y-1/2 left-0 h-full flex items-center pl-2 data-[open=true]:pl-4 " >

                    <BsSearch
                        data-open={isOpen()}
                        class="w-4 h-4 data-[open=true]:w-6 data-[open=true]:h-6 text-zinc-500 group-hover:text-white  transition-all duration-100 "
                    />
                </div>

                <div data-open={isOpen()}
                    class="h-full flex items-center justify-center data-[open=true]:justify-end">
                    <input
                        data-open={isOpen()}
                        class="w-[calc(100%-3rem)] h-full  placeholder:text-zinc-500 px-2 focus:outline-none text-center data-[open=true]:text-left min-w-0 text-white " placeholder="Search" />
                </div>
            </div>

            <Show when={isOpen()}>
                <div
                    data-empty={isEmptyResult()}
                    class="h-[50vh] data-empty:h-80 w-full border-t border-zinc-800">
                    <Show when={isEmptyResult()}>
                        <div class="flex items-center h-full justify-center">
                            <div class="flex flex-col items-center ">
                                <NoResultIcon />
                                <div class="font-medium mt-2">No results found</div>
                                <div class="text-center text-zinc-500 mt-1">We couldn't find any results.<br />Try adjusting your search or use different keywords.</div>
                                <button class="mt-6 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all duration-100 px-4 py-2 drop-shadow-2xl bg-zinc-900">Clear search</button>
                            </div>

                        </div>
                    </Show>
                </div>
            </Show>

        </div>
    </div>
}