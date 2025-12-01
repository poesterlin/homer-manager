/// file: src/routes/data.remote.ts
import * as v from "valibot";
import { query, form, command } from "$app/server";
import { readConfig, writeConfig } from "$lib/server/config";

export const getConfig = query(async () => {
  return await readConfig();
});

export const updateGlobalSettings = form(
  v.object({
    title: v.pipe(v.string(), v.nonEmpty()),
    subtitle: v.string(),
    columns: v.picklist(["1", "2", "3", "4", "6", "12"]),
    theme: v.string(),
  }),
  async (data) => {
    const config = await readConfig();
    config.title = data.title;
    config.subtitle = data.subtitle;
    config.columns = data.columns;
    config.theme = data.theme;
    await writeConfig(config);
    await getConfig().refresh();
    return { success: true };
  }
);

export const addServiceCategory = form(
  v.object({
    name: v.pipe(v.string(), v.nonEmpty()),
    icon: v.pipe(v.string(), v.nonEmpty()),
  }),
  async (data) => {
    const config = await readConfig();
    config.services.push({
      name: data.name,
      icon: data.icon,
      items: [],
    });
    await writeConfig(config);
    await getConfig().refresh();
    return { success: true };
  }
);

export const deleteServiceCategory = command(v.number(), async (index) => {
  const config = await readConfig();
  config.services.splice(index, 1);
  await writeConfig(config);
  await getConfig().refresh();
});

export const moveServiceCategory = command(
  v.object({ index: v.number(), direction: v.picklist(["up", "down"]) }),
  async ({ index, direction }) => {
    const config = await readConfig();
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.services.length) return;

    const [category] = config.services.splice(index, 1);
    config.services.splice(newIndex, 0, category);
    await writeConfig(config);
    await getConfig().refresh();
  }
);