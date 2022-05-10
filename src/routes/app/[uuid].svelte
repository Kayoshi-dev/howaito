<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { io } from "socket.io-client";

  export const prerender = true;

  let canvasCtx;
  let isDrawing = false;
  let isConnected = false;
  let shouldShowToast = false;

  onMount(() => {
    let socket = io("http://localhost:8000", {
      query: `uuid=${$page.params.uuid}`,
    });

    socket.on("connect", (arg) => {
      isConnected = true;
      shouldShowToast = true;

      setTimeout(() => {
        shouldShowToast = false;
      }, 5000);
    });

    socket.on("disconnect", () => {
      isConnected = false;
      shouldShowToast = true;

      setTimeout(() => {
        shouldShowToast = false;
      }, 5000);
    });

    canvasCtx = document
      .getElementById("myCollaborativeCanvas")
      ?.getContext("2d");

    const canvas = document.getElementById("myCollaborativeCanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  });

  function startDrawing(e) {
    canvasCtx.beginPath();
    canvasCtx.moveTo(e.x, e.y);

    isDrawing ? (isDrawing = false) : (isDrawing = true);
  }

  function draw(e) {
    if (isDrawing) {
      const canvas = document
        .getElementById("myCollaborativeCanvas")
        ?.getBoundingClientRect();

      canvasCtx.lineTo(e.x - canvas?.left, e.y - canvas?.top);
      canvasCtx.stroke();
    }
  }

  function increaseStrokeWidth() {
    canvasCtx.lineWidth++;
  }

  function decreaseStrokeWidth() {
    canvasCtx.lineWidth--;
  }
</script>

<div class="relative">
  {#if isConnected && shouldShowToast}
    <div
      id="toast-success"
      class="absolute top-2 right-2 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
      >
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          /></svg
        >
      </div>
      <div class="ml-3 text-sm font-normal">Successfully connected.</div>
      <button
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-success"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          /></svg
        >
      </button>
    </div>
  {/if}

  {#if !isConnected && shouldShowToast}
    <div
      id="toast-danger"
      class="absolute top-2 right-2 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200"
      >
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          /></svg
        >
      </div>
      <div class="ml-3 text-sm font-normal">
        Couldn't connect to the server.
      </div>
      <button
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-danger"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          /></svg
        >
      </button>
    </div>
  {/if}

  <div>
    <h1 class="text-2xl font-bold">New Whiteboard</h1>

    <canvas
      height="500px"
      width="500px"
      id="myCollaborativeCanvas"
      class="border-2"
      on:mousedown={startDrawing}
      on:mousemove={draw}
    />

    <button
      on:click={increaseStrokeWidth}
      class="bg-blue-700 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-50 text-white font-semibold py-2 px-4 rounded-lg sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
      >+</button
    >
    <button
      on:click={decreaseStrokeWidth}
      class="bg-blue-700 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-50 text-white font-semibold py-2 px-5 rounded-lg sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
      >-</button
    >
  </div>
</div>
