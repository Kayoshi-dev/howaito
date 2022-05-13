<script>
  // @ts-nocheck

  import { toasts } from "../../stores/ToastStore/stores";
  import Toast from "./Toast.svelte";

  let toastList;

  toasts.subscribe((toasts) => {
    toastList = toasts;
  });
</script>

{#each toastList as toastData}
  <Toast {toastData} />
{/each}
