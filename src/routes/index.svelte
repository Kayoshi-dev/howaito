<script>
  import { v4 as uuidv4 } from "uuid";

  import JoinWhiteboardModal from "../components/modals/JoinWhiteboardModal.svelte";

  export const prerender = true;

  let showModal = false;

  const onJoinWhiteboardClick = () => {
    showModal = true;
  };
</script>

{#if showModal}
  <JoinWhiteboardModal bind:showModal />
{/if}

<div class="py-32 text-center">
  <h1 class="font-bold text-4xl dark:text-white">
    Your free collaborative Whiteboard
  </h1>
  <h2 class="text-gray-400 text-xl">
    Start creating now and invite your friends !
  </h2>
</div>

<div class="py-24 flex justify-center">
  <a
    href={`/app/${uuidv4()}`}
    class="mx-2 hover:cursor-pointer bg-blue-700 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-blue-700 dark:highlight-white/20 dark:hover:bg-blue-500"
    >Start a new Whiteboard</a
  >
  <button
    on:click={onJoinWhiteboardClick}
    class="mx-2 bg-slate-700 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-blue-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
    >Join a Whiteboard</button
  >
</div>
