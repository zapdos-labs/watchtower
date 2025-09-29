export default function TabLayout(props: { sidebar: any; main: any }) {
  return (
    <div class="h-screen flex items-start flex-1 gap-2">
      {props.sidebar}

      <div class="flex-1 flex flex-col h-full">{props.main}</div>
    </div>
  );
}
