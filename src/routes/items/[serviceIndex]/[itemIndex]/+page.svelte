<!-- file: src/routes/items/[serviceIndex]/[itemIndex]/+page.svelte -->
<script>
  import { page } from "$app/state";
  import { getServiceItem, updateServiceItem } from "./data.remote";

  const serviceIndex = $derived(Number(page.params.serviceIndex));
  const itemIndex = $derived(Number(page.params.itemIndex));
  const item = $derived(await getServiceItem({ serviceIndex, itemIndex }));
</script>

<svelte:head>
  <title>Edit {item?.name ?? "Item"}</title>
</svelte:head>

<main>
  <a href="/services/{serviceIndex}">← Back to Category</a>

  {#if item}
    <h1>Edit: {item.name}</h1>

    <section class="card">
      <form {...updateServiceItem}>
        <input
          type="hidden"
          name={updateServiceItem.fields.serviceIndex.as("number").name}
          value={serviceIndex}
        />
        <input
          type="hidden"
          name={updateServiceItem.fields.itemIndex.as("number").name}
          value={itemIndex}
        />

        {#each updateServiceItem.fields.allIssues() as issue}
          <p class="error">{issue.message}</p>
        {/each}

        <label>
          Name *
          <input
            {...updateServiceItem.fields.name.as("text")}
            value={item.name}
          />
        </label>

        <label>
          Subtitle
          <input
            {...updateServiceItem.fields.subtitle.as("text")}
            value={item.subtitle}
          />
        </label>

        <label>
          URL *
          <input
            {...updateServiceItem.fields.url.as("text")}
            value={item.url}
          />
        </label>

        <label>
          Logo Path
          <input
            {...updateServiceItem.fields.logo.as("text")}
            value={item.logo}
          />
        </label>

        <label>
          Tag
          <input
            {...updateServiceItem.fields.tag.as("text")}
            value={item.tag}
          />
        </label>

        <label>
          Tag Style
          <select {...updateServiceItem.fields.tagstyle.as("select")}>
            {#each ["is-info", "is-success", "is-warning", "is-danger"] as style}
              <option value={style} selected={item.tagstyle === style}>
                {style}
              </option>
            {/each}
          </select>
        </label>

        <label>
          Target
          <select {...updateServiceItem.fields.target.as("select")}>
            <option value="_blank" selected={item.target === "_blank"}>
              New Tab (_blank)
            </option>
            <option value="_self" selected={item.target === "_self"}>
              Same Tab (_self)
            </option>
          </select>
        </label>

        <div class="actions">
          <button type="submit">Save Changes</button>
          <a href="/services/{serviceIndex}" class="btn secondary">Cancel</a>
        </div>
      </form>
    </section>
  {:else}
    <p>Item not found.</p>
  {/if}
</main>

<style>
  main {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  .card {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 1rem;
  }

  input,
  select {
    display: block;
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  button,
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: #3273dc;
    color: white;
    cursor: pointer;
    text-decoration: none;
  }

  .btn.secondary {
    background: #6c757d;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .error {
    color: #dc3545;
    background: #f8d7da;
    padding: 0.5rem;
    border-radius: 4px;
  }
</style>