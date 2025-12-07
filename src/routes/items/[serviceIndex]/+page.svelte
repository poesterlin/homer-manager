<!-- file: src/routes/services/[index]/+page.svelte -->
<script>
  import { page } from "$app/state";
  import IconPicker from "$lib/components/IconPicker.svelte";
    import { addServiceItem, deleteServiceItem, getServiceCategory, moveServiceItem, updateServiceCategory } from "../../services/[index]/data.remote";

  const categoryIndex = $derived(Number(page.params.index));
  const category = $derived(await getServiceCategory(categoryIndex));

  // Track logo value for the new item form
  let newItemLogo = $state("");
</script>

<svelte:head>
  <title>Edit {category?.name ?? "Category"}</title>
</svelte:head>

<main>
  <nav>
    <a href="/">← Back to Dashboard</a>
    <a href="/icons">🎨 Icon Browser</a>
  </nav>

  {#if category}
    <h1>Edit: {category.name}</h1>

    <section class="card">
      <h2>Category Settings</h2>

      <form {...updateServiceCategory}>
        <input
          type="hidden"
          name={updateServiceCategory.fields.index.as("number").name}
          value={categoryIndex}
        />

        <label>
          Name
          <input
            {...updateServiceCategory.fields.name.as("text")}
            value={category.name}
          />
        </label>

        <label>
          Icon
          <input
            {...updateServiceCategory.fields.icon.as("text")}
            value={category.icon}
          />
        </label>

        <button type="submit">Save Category</button>
      </form>
    </section>

    <section class="card">
      <h2>Items ({category.items.length})</h2>

      <div class="items-list">
        {#each category.items as item, itemIndex}
          <div class="item-card">
            <div class="item-info">
              <img src="/{item.logo}" alt="" width="32" height="32" />
              <div>
                <strong>{item.name}</strong>
                {#if item.subtitle}
                  <small>{item.subtitle}</small>
                {/if}
                <small>{item.url}</small>
              </div>
              <span class="tag">{item.tag}</span>
            </div>

            <div class="item-actions">
              <button
                onclick={() =>
                  moveServiceItem({
                    categoryIndex,
                    itemIndex,
                    direction: "up",
                  })}
                disabled={itemIndex === 0}
              >
                ↑
              </button>
              <button
                onclick={() =>
                  moveServiceItem({
                    categoryIndex,
                    itemIndex,
                    direction: "down",
                  })}
                disabled={itemIndex === category.items.length - 1}
              >
                ↓
              </button>
              <a href="/items/{categoryIndex}/{itemIndex}" class="btn">Edit</a>
              <button
                class="danger"
                onclick={() => {
                  if (confirm(`Delete "${item.name}"?`)) {
                    deleteServiceItem({ categoryIndex, itemIndex });
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>

      <h3>Add New Item</h3>

      {#if addServiceItem.result?.success}
        <p class="success">Item added!</p>
      {/if}

      <form {...addServiceItem}>
        <input
          type="hidden"
          name={addServiceItem.fields.categoryIndex.as("number").name}
          value={categoryIndex}
        />

        <!-- Hidden input synced with IconPicker -->
        <input
          type="hidden"
          name={addServiceItem.fields.logo.as("text").name}
          value={newItemLogo}
        />

        {#each addServiceItem.fields.name.issues() as issue}
          <p class="error">{issue.message}</p>
        {/each}

        <div class="form-grid">
          <label>
            Name *
            <input {...addServiceItem.fields.name.as("text")} />
          </label>

          <label>
            Subtitle
            <input
              {...addServiceItem.fields.subtitle.as("text")}
              placeholder="Another application"
            />
          </label>

          <label>
            URL *
            <input
              {...addServiceItem.fields.url.as("text")}
              placeholder="https://..."
            />
          </label>

          <label>
            Logo
            <IconPicker
              value={newItemLogo}
              onSelect={(path) => (newItemLogo = path)}
            />
          </label>

          <label>
            Tag
            <input
              {...addServiceItem.fields.tag.as("text")}
              placeholder="App"
            />
          </label>

          <label>
            Tag Style
            <select {...addServiceItem.fields.tagstyle.as("select")}>
              <option value="is-info">is-info (blue)</option>
              <option value="is-success">is-success (green)</option>
              <option value="is-warning">is-warning (yellow)</option>
              <option value="is-danger">is-danger (red)</option>
            </select>
          </label>

          <label>
            Target
            <select {...addServiceItem.fields.target.as("select")}>
              <option value="_blank">New Tab (_blank)</option>
              <option value="_self">Same Tab (_self)</option>
            </select>
          </label>
        </div>

        <button type="submit">Add Item</button>
      </form>
    </section>
  {:else}
    <p>Category not found.</p>
  {/if}
</main>

<style>
  main {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  nav {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
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
    display: inline-block;
  }

  button:hover,
  .btn:hover {
    background: #2557a7;
  }

  button:disabled {
    opacity: 0.5;
  }

  button.danger {
    background: #dc3545;
  }

  .item-card {
    background: white;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .item-info img {
    border-radius: 4px;
  }

  .item-info small {
    display: block;
    color: #666;
    font-size: 0.8rem;
  }

  .item-actions {
    display: flex;
    gap: 0.5rem;
  }

  .tag {
    background: #3273dc;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .success {
    color: #28a745;
    background: #d4edda;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .error {
    color: #dc3545;
  }
</style>