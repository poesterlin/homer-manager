<!-- file: src/lib/components/IconPicker.svelte -->
<script lang="ts">
  import {
    getAvailableIcons,
    getLocalIconsList,
    downloadIconToAssets,
  } from "../../routes/icons/data.remote";

  interface Props {
    value: string;
    onSelect: (path: string) => void;
  }

  let { value, onSelect }: Props = $props();

  let open = $state(false);
  let search = $state("");
  let tab = $state<"local" | "remote">("local");
  let downloading = $state<string | null>(null);

  const remoteIcons = $derived(await getAvailableIcons());
  const localIcons = $derived(await getLocalIconsList());

  const filteredRemote = $derived(
    remoteIcons
      .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 50)
  );

  const filteredLocal = $derived(
    localIcons.filter((i) => i.toLowerCase().includes(search.toLowerCase()))
  );

  function getRemotePreview(name: string) {
    return `https://raw.githubusercontent.com/selfhst/icons/main/png/${name}.png`;
  }

  async function downloadAndSelect(name: string) {
    downloading = name;
    try {
      const path = await downloadIconToAssets({ name, format: "png" });
      onSelect(path);
      open = false;
    } catch (e) {
      alert(`Download failed: ${e}`);
    } finally {
      downloading = null;
    }
  }

  function selectLocal(filename: string) {
    onSelect(`assets/tools/${filename}`);
    open = false;
  }
</script>

<div class="icon-picker">
  <div class="current" onclick={() => (open = !open)}>
    {#if value}
      <img src="/{value}" alt="" />
      <span>{value.split("/").pop()}</span>
    {:else}
      <span class="placeholder">Select icon...</span>
    {/if}
    <span class="arrow">▼</span>
  </div>

  {#if open}
    <div class="dropdown">
      <div class="tabs">
        <button
          class:active={tab === "local"}
          onclick={() => (tab = "local")}
          type="button"
        >
          Local ({localIcons.length})
        </button>
        <button
          class:active={tab === "remote"}
          onclick={() => (tab = "remote")}
          type="button"
        >
          selfh.st/icons
        </button>
      </div>

      <input
        type="search"
        bind:value={search}
        placeholder="Search icons..."
        onclick={(e) => e.stopPropagation()}
      />

      <div class="icons-list">
        {#if tab === "local"}
          {#each filteredLocal as icon}
            <button
              type="button"
              class="icon-option"
              onclick={() => selectLocal(icon)}
            >
              <img src="/assets/tools/{icon}" alt="" />
              <span>{icon}</span>
            </button>
          {:else}
            <p class="empty">No local icons</p>
          {/each}
        {:else}
          {#each filteredRemote as icon}
            <button
              type="button"
              class="icon-option"
              disabled={downloading === icon.name}
              onclick={() => downloadAndSelect(icon.name)}
            >
              <img src={getRemotePreview(icon.name)} alt="" loading="lazy" />
              <span>{icon.name}</span>
              {#if downloading === icon.name}
                <span class="dl">↓</span>
              {/if}
            </button>
          {:else}
            <p class="empty">No icons found</p>
          {/each}
        {/if}
      </div>

      <button type="button" class="close-btn" onclick={() => (open = false)}>
        Close
      </button>
    </div>
  {/if}
</div>

<style>
  .icon-picker {
    position: relative;
  }

  .current {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }

  .current img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .current .arrow {
    margin-left: auto;
    font-size: 0.7rem;
    color: #666;
  }

  .placeholder {
    color: #999;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    min-width: 300px;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid #eee;
  }

  .tabs button {
    flex: 1;
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .tabs button.active {
    background: #f0f0f0;
    font-weight: bold;
  }

  .dropdown input {
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
  }

  .icons-list {
    max-height: 200px;
    overflow-y: auto;
  }

  .icon-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
  }

  .icon-option:hover {
    background: #f5f5f5;
  }

  .icon-option:disabled {
    opacity: 0.5;
  }

  .icon-option img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .icon-option span {
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon-option .dl {
    margin-left: auto;
    animation: pulse 0.5s infinite;
  }

  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }

  .empty {
    padding: 1rem;
    text-align: center;
    color: #999;
    margin: 0;
  }

  .close-btn {
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-top: 1px solid #eee;
    background: #f5f5f5;
    cursor: pointer;
  }
</style>