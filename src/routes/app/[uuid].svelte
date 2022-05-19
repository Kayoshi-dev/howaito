<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { io } from "socket.io-client";
  import showToast from "../../stores/ToastStore/showToast";

  export const prerender = true;

  let canvasCtx;
  let isDrawing = false;
  let socket;
  const from = {};

  onMount(() => {
    socket = io("http://localhost:8000", {
      query: `uuid=${$page.params.uuid}`,
    });

    const canvas = document.getElementById("myCollaborativeCanvas");

    socket.on("connect", () => {
      showToast("Connected to the server.", "success", { icon: "check" });
    });

    socket.on("disconnect", () => {
      showToast("Lost connection, reconnecting...", "error", { icon: "cross" });
    });

    socket.on("newUserConnection", () => {
      showToast("A user has connected", "info", { icon: "users" });
    });

    socket.on("setMoveTo", (arg) => {
      from.x = arg.x;
      from.y = arg.y;
    });

    socket.on("userIsDrawing", (arg) => {
      canvasCtx.strokeStyle = canvasCtx.beginPath();
      canvasCtx.moveTo(from.x, from.y);
      canvasCtx.lineTo(arg.x, arg.y);
      canvasCtx.stroke();

      from.x = arg.x;
      from.y = arg.y;
    });

    canvasCtx = document
      .getElementById("myCollaborativeCanvas")
      ?.getContext("2d");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  });

  function startDrawing(e) {
    const canvas = document
      .getElementById("myCollaborativeCanvas")
      ?.getBoundingClientRect();

    const normalizedCoords = { x: e.x - canvas?.left, y: e.y - canvas?.top };

    canvasCtx.beginPath();
    canvasCtx.moveTo(normalizedCoords.x, normalizedCoords.y);
    socket.emit("moveTo", { x: normalizedCoords.x, y: normalizedCoords.y });

    from.x = e.x;
    from.y = e.y;

    isDrawing ? (isDrawing = false) : (isDrawing = true);
  }

  function draw(e) {
    if (isDrawing) {
      const canvas = document
        .getElementById("myCollaborativeCanvas")
        ?.getBoundingClientRect();

      canvasCtx.lineTo(e.x - canvas?.left, e.y - canvas?.top);
      canvasCtx.stroke();

      socket.emit("isDrawing", { x: e.x - canvas?.left, y: e.y - canvas?.top });
    }
  }

  function increaseStrokeWidth() {
    canvasCtx.lineWidth++;
  }

  function decreaseStrokeWidth() {
    canvasCtx.lineWidth--;
  }
</script>

<div>
  <div>
    <h1 class="text-2xl font-bold dark:text-white">New Whiteboard</h1>

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
