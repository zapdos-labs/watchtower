import { For } from "solid-js"
import { getDynamicIcon } from "../utils"
import { BsChevronExpand } from "solid-icons/bs"
import { FiBarChart2, FiGrid, FiLayers } from "solid-icons/fi"

export default function SideBar() {
    const items = {
        'dashboard': {
            label: 'Dashboard',
            icon: FiGrid

        },
        'stats': {
            label: 'Statistics',
            icon: FiBarChart2

        },
        'moments': {
            label: 'Moments',
            icon: FiLayers

        }
    }


    return <div class="w-60 flex-none h-full bg-zinc-900 space-y-4">

        <div class="mx-2 mt-4">
            <div class="bg-zinc-800 p-2 rounded-xl flex items-center space-x-2">
                <div class="w-10 h-10 bg-linear-to-t/hsl from-indigo-500 to-blue-400 rounded-lg relative">
                    <div class="absolute top-1/2 left-1/2  -translate-x-1/2  -translate-y-1/2">
                        <div class="text-lg font-bold">P</div>
                    </div>

                </div>
                <div class="flex-1 font-medium text-white">PanamaCanal</div>
                <div class="flex-none p-1">
                    <BsChevronExpand />

                </div>
            </div>
        </div>

        <div class="space-y-2">
            <For each={Object.entries(items)}>{([key, item]) => {
                const Icon = item.icon
                return <div class="cursor-pointer px-3 py-2 mx-2 space-x-4  rounded-lg hover:bg-zinc-800 flex items-center text-zinc-400 hover:text-white">
                    <Icon class="w-4 h-4" />
                    <div>{item.label}</div>
                </div>
            }

            }</For>
        </div>
    </div>
}