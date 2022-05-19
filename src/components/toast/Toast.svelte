<script>
  // @ts-nocheck
  import { createEventDispatcher, onDestroy } from "svelte";
  import { CrossIcon, CheckIcon, UsersIcon } from "../icons/index";
  import { fly, fade } from "svelte/transition";
  import { toasts } from "../../stores/ToastStore/stores";

  export let toastData;

  // Bad memory, never forget to give a key when you {# each #}
  setTimeout(() => {
    toasts.update((toasts) => toasts.filter(toast => toast.id !== toastData.id));
  }, 3000);

  const onCloseToast = (id) => {
    toasts.update((toasts) => toasts.filter(toast => toast.id !== id));
  }
  
  const notificationStyle = {
    success: [
      "text-green-500",
      "bg-green-100",
      "dark:bg-green-800",
      "dark:text-green-200",
    ],
    info: [
      "text-blue-500",
      "bg-blue-100",
      "dark:bg-blue-800",
      "dark:text-blue-200",
    ],
    error: [
      "text-red-500",
      "bg-red-100",
      "dark:bg-red-800",
      "dark:text-red-200",
    ],
  };

  const iconList = {
    check: CheckIcon,
    users: UsersIcon,
    cross: CrossIcon,
  };
</script>

<div
  transition:fly={{ x: 200, duration: 500 }}
  id={toastData.id}
  class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
  role="alert"
>
  <div
    class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg {notificationStyle[
      toastData.type
    ].join(' ')}"
  >
    {#if toastData.options.icon}
      {@html iconList[toastData.options.icon]()}
    {/if}
  </div>
  <div class="ml-3 text-sm font-normal">{toastData.message}</div>
  <button
    type="button"
    class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
    data-dismiss-target={`#${toastData.id}`}
    aria-label="Close"
    on:click={onCloseToast(toastData.id)}
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
