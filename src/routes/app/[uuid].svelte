<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { io } from "socket.io-client";
  import showToast from "../../stores/ToastStore/showToast";

  export const prerender = true;

  let isDrawing = false;
  let socket;
  const from = {};
  let canvas, canvasCtx, canvasCoords;

  onMount(() => {
    canvas = document.getElementById("myCollaborativeCanvas");
    canvasCtx = canvas.getContext("2d");
    canvasCoords = canvas.getBoundingClientRect();

    socket = io("http://localhost:8000", {
      query: `uuid=${$page.params.uuid}`,
    });

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
      canvasCtx.beginPath();
      canvasCtx.moveTo(from.x, from.y);
      canvasCtx.lineTo(arg.x, arg.y);
      canvasCtx.stroke();

      from.x = arg.x;
      from.y = arg.y;
    });

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight - 80;
  });

  function startDrawing(e) {
    const normalizedCoords = { x: e.x - canvasCoords?.left, y: e.y - canvasCoords?.top };

    canvasCtx.beginPath();
    canvasCtx.moveTo(normalizedCoords.x, normalizedCoords.y);
    socket.emit("moveTo", { x: normalizedCoords.x, y: normalizedCoords.y });

    from.x = e.x;
    from.y = e.y;

    isDrawing ? (isDrawing = false) : (isDrawing = true);
  }

  function draw(e) {
    if (isDrawing) {
      canvasCtx.lineTo(e.x - canvasCoords?.left, e.y - canvasCoords?.top);
      canvasCtx.stroke();

      socket.emit("isDrawing", { x: e.x - canvasCoords?.left, y: e.y - canvasCoords?.top });
    }
  }

  function increaseStrokeWidth() {
    canvasCtx.lineWidth++;
  }

  function decreaseStrokeWidth() {
    canvasCtx.lineWidth--;
  }

  let oldTitle;

  function editTitle(e) {
    oldTitle = e.target.value;
    e.target.value = "";
    e.target.placeholder = "Enter a title...";
  }

  function saveTitle(e) {
    if(e.target.value) {
      socket.emit("saveTitle", e.target.value);
    } else {
      e.target.value = oldTitle;
    }
  }

</script>

<div>
  <form on:submit|preventDefault>
    <input class="text-2xl font-bold dark:bg-gray-800 dark:text-white" id="titleInput" value="New Whiteboard" on:click={editTitle} on:blur={saveTitle} />
  </form>

  <canvas
    height="500px"
    width="500px"
    id="myCollaborativeCanvas"
    on:mousedown={startDrawing}
    on:mouseup={() => (isDrawing = false)}
    on:mousemove={draw}></canvas>
</div>
