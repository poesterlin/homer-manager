<!-- file: src/routes/+page.svelte -->
<script>
  import {
    getConfig,
    updateGlobalSettings,
    addServiceCategory,
    deleteServiceCategory,
    moveServiceCategory,
  } from "./data.remote";

  const config = $derived(await getConfig());
</script>

<svelte:head>
  <title>Homer Config Manager</title>
</svelte:head>

<main>
  <header class="page-header">
    <h1>Homer Dashboard Config</h1>
    <a href="/icons" class="btn secondary">🎨 Icon Browser</a>
  </header>

  <section class="card">
    <h2>Global Settings</h2>

    {#if updateGlobalSettings.result?.success}
      <p class="success">Settings saved!</p>
    {/if}

    <form {...updateGlobalSettings}>
      <label>
        Title
        <input
          {...updateGlobalSettings.fields.title.as("text")}
          value={config.title}
        />
      </label>

      <label>
        Subtitle
        <input
          {...updateGlobalSettings.fields.subtitle.as("text")}
          value={config.subtitle}
        />
      </label>

      <label>
        Columns
        <select {...updateGlobalSettings.fields.columns.as("select")}>
          {#each ["1", "2", "3", "4", "6", "12"] as col}
            <option value={col} selected={config?.columns === col}>{col}</option>
          {/each}
        </select>
      </label>

      <label>
        Theme
        <input
          {...updateGlobalSettings.fields.theme.as("text")}
          value={config.theme}
        />
      </label>

      <button type="submit">Save Settings</button>
    </form>
  </section>

  <section class="card">
    <h2>Service Categories</h2>

    <div class="categories">
      {#each config.services as category, index}
        <div class="category-card">
          <div class="category-header">
            <i class={category.icon}></i>
            <strong>{category.name}</strong>
            <span class="badge">{category.items.length} items</span>
          </div>

          <div class="category-actions">
            <button
              onclick={() => moveServiceCategory({ index, direction: "up" })}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              onclick={() => moveServiceCategory({ index, direction: "down" })}
              disabled={index === config.services.length - 1}
            >
              ↓
            </button>
            <a href="/services/{index}" class="btn">Edit</a>
            <button
              class="danger"
              onclick={() => {
                if (confirm(`Delete "${category.name}"?`)) {
                  deleteServiceCategory(index);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      {/each}
    </div>

    <h3>Add New Category</h3>

    {#if addServiceCategory.result?.success}
      <p class="success">Category added!</p>
    {/if}

    <form {...addServiceCategory}>
      {#each addServiceCategory.fields.name.issues() as issue}
        <p class="error">{issue.message}</p>
      {/each}

      <div class="form-row">
        <label>
          Name
          <input {...addServiceCategory.fields.name.as("text")} />
        </label>

        <label>
          Icon (FontAwesome class)
          <input
            {...addServiceCategory.fields.icon.as("text")}
            placeholder="fas fa-code"
          />
        </label>

        <button type="submit">Add Category</button>
      </div>
    </form>
  </section>
</main>

<style>
  main {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .page-header h1 {
    margin: 0;
  }

  .card {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    margin-top: 0;
    border-bottom: 2px solid #ddd;
    padding-bottom: 0.5rem;
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
    cursor: not-allowed;
  }

  button.danger {
    background: #dc3545;
  }

  button.danger:hover {
    background: #b02a37;
  }

  .btn.secondary {
    background: #6c757d;
  }

  .btn.secondary:hover {
    background: #545b62;
  }

  .category-card {
    background: white;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .category-actions {
    display: flex;
    gap: 0.5rem;
  }

  .badge {
    background: #e0e0e0;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }

  .form-row {
    display: flex;
    gap: 1rem;
    align-items: end;
  }

  .form-row label {
    flex: 1;
    margin-bottom: 0;
  }

  .success {
    color: #28a745;
    background: #d4edda;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .error {
    color: #dc3545;
    background: #f8d7da;
    padding: 0.5rem;
    border-radius: 4px;
  }
</style>