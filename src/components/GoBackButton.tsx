import { FaSolidArrowLeft } from "solid-icons/fa";
import { goBackTabId } from "../utils";

export default function GoBackButton() {
  return (
    <button
      onClick={() => {
        goBackTabId();
      }}
      class="btn-primary"
    >
      <FaSolidArrowLeft class="w-4 h-4" />
      <div class="font-bold text-sm">Back</div>
    </button>
  );
}
