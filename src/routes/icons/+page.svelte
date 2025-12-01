<!-- file: src/routes/icons/+page.svelte -->
<script lang="ts">
  import {
    getAvailableIcons,
    getLocalIconsList,
    downloadIconToAssets,
  } from "./data.remote";

  let search = $state("");
  let selectedFormat = $state<"svg" | "png" | "webp">("png");
  let downloading = $state<string | null>(null);
  let downloadedIcon = $state<string | null>(null);

  const icons = $derived(await getAvailableIcons());
  const localIcons = $derived(await getLocalIconsList());

  const filteredIcons = $derived(
    icons.filter((icon) =>
      icon.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  function getPreviewUrl(name: string, format: string) {
    return `https://raw.githubusercontent.com/selfhst/icons/main/${format}/${name}.${format}`;
  }

  async function handleDownload(iconName: string) {
    downloading = iconName;
    downloadedIcon = null;

    try {
      const path = await downloadIconToAssets({
        name: iconName,
        format: selectedFormat,
      });
      downloadedIcon = path;
    } catch (e) {
      alert(`Failed to download: ${e}`);
    } finally {
      downloading = null;
    }
  }
</script>

<svelte:head>
  <title>Icon Browser - selfh.st/icons</title>
</svelte:head>

<main>
  <a href="/">← Back to Dashboard</a>

  <h1>Icon Browser</h1>
  <p class="subtitle">
    Browse and download icons from
    <a href="https://github.com/selfhst/icons" target="_blank">selfh.st/icons</a
    >
  </p>

  {#if downloadedIcon}
    <div class="success">
      ✓ Downloaded to <code>{downloadedIcon}</code>
      <button onclick={() => navigator.clipboard.writeText(downloadedIcon!)}>
        Copy Path
      </button>
    </div>
  {/if}

  <section class="card">
    <h2>Local Icons ({localIcons.length})</h2>
    <div class="local-icons">
      {#each localIcons as icon}
        <div class="local-icon" title={icon}>
          <img src="/assets/tools/{icon}" alt={icon} />
          <span>{icon}</span>
        </div>
      {:else}
        <p class="muted">No local icons found in assets/tools/</p>
      {/each}
    </div>
  </section>

  <section class="card">
    <h2>Browse Icons ({icons.length} available)</h2>

    <div class="controls">
      <input
        type="search"
        bind:value={search}
        placeholder="Search icons... (e.g., plex, sonarr, docker)"
      />

      <div class="format-selector">
        <label>
          <input type="radio" bind:group={selectedFormat} value="png" /> PNG
        </label>
        <label>
          <input type="radio" bind:group={selectedFormat} value="svg" /> SVG
        </label>
        <label>
          <input type="radio" bind:group={selectedFormat} value="webp" /> WebP
        </label>
      </div>
    </div>

    <div class="icons-grid">
      {#each filteredIcons.slice(0, 100) as icon}
        {@const hasFormat = icon.formats.includes(selectedFormat)}
        <button
          class="icon-card"
          class:disabled={!hasFormat}
          disabled={!hasFormat || downloading === icon.name}
          onclick={() => handleDownload(icon.name)}
          title={hasFormat
            ? `Download ${icon.name}.${selectedFormat}`
            : `${selectedFormat.toUpperCase()} not available`}
        >
          {#if hasFormat}
            <img
              src={getPreviewUrl(icon.name, selectedFormat)}
              alt={icon.name}
              loading="lazy"
            />
          {:else}
            <div class="no-preview">N/A</div>
          {/if}
          <span class="icon-name">{icon.name}</span>
          {#if downloading === icon.name}
            <span class="downloading">...</span>
          {/if}
        </button>
      {/each}
    </div>

    {#if filteredIcons.length > 100}
      <p class="muted">Showing 100 of {filteredIcons.length} results</p>
    {/if}

    {#if filteredIcons.length === 0}
      <p class="muted">No icons found matching "{search}"</p>
    {/if}
  </section>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  .subtitle {
    color: #666;
    margin-top: -0.5rem;
  }

  .card {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    margin-top: 0;
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  input[type="search"] {
    flex: 1;
    min-width: 250px;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .format-selector {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .format-selector label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
  }

  .icons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }

  .icon-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
  }

  .icon-card:hover:not(:disabled) {
    border-color: #3273dc;
    background: #f0f7ff;
  }

  .icon-card:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .icon-card.disabled {
    background: #fafafa;
  }

  .icon-card img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .icon-name {
    font-size: 0.75rem;
    text-align: center;
    word-break: break-word;
    color: #333;
  }

  .no-preview {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    border-radius: 4px;
    color: #999;
    font-size: 0.75rem;
  }

  .downloading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }

  .local-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .local-icon {
    background: white;
    border-radius: 6px;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
  }

  .local-icon img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .success {
    background: #d4edda;
    color: #155724;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .success code {
    background: rgba(0, 0, 0, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .success button {
    background: #155724;
    color: white;
    border: none;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .muted {
    color: #666;
    text-align: center;
    padding: 1rem;
  }
</style>