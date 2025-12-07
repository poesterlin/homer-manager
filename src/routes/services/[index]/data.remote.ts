/// file: src/routes/services/[index]/data.remote.ts
import * as v from "valibot";
import { query, form, command } from "$app/server";
import { readConfig, writeConfig } from "$lib/server/config";
import { redirect } from "@sveltejs/kit";

export const getServiceCategory = query(v.number(), async (index) => {
  const config = await readConfig();
  return config.services[index] ?? null;
});

export const updateServiceCategory = form(
  v.object({
    index: v.number(),
    name: v.pipe(v.string(), v.nonEmpty()),
    icon: v.pipe(v.string(), v.nonEmpty()),
  }),
  async (data) => {
    const config = await readConfig();
    if (config.services[data.index]) {
      config.services[data.index].name = data.name;
      config.services[data.index].icon = data.icon;
      await writeConfig(config);
      await getServiceCategory(data.index).refresh();
    }
    redirect(303, "/");
  }
);

export const addServiceItem = form(
  v.object({
    categoryIndex: v.number(),
    name: v.pipe(v.string(), v.nonEmpty()),
    subtitle: v.optional(v.string()),
    logo: v.string(),
    tag: v.string(),
    tagstyle: v.string(),
    url: v.pipe(v.string(), v.nonEmpty()),
    target: v.string(),
  }),
  async (data) => {
    const config = await readConfig();
    if (config.services[data.categoryIndex]) {
      config.services[data.categoryIndex].items.push({
        name: data.name,
        subtitle: data.subtitle,
        logo: data.logo || "assets/tools/default.png",
        tag: data.tag || "App",
        tagstyle: data.tagstyle || "is-info",
        url: data.url,
        target: data.target || "_blank",
      });
      await writeConfig(config);
      await getServiceCategory(data.categoryIndex).refresh();
    }
    return { success: true };
  }
);

export const deleteServiceItem = command(
  v.object({ categoryIndex: v.number(), itemIndex: v.number() }),
  async ({ categoryIndex, itemIndex }) => {
    const config = await readConfig();
    if (config.services[categoryIndex]) {
      config.services[categoryIndex].items.splice(itemIndex, 1);
      await writeConfig(config);
      await getServiceCategory(categoryIndex).refresh();
    }
  }
);

export const moveServiceItem = command(
  v.object({
    categoryIndex: v.number(),
    itemIndex: v.number(),
    direction: v.picklist(["up", "down"]),
  }),
  async ({ categoryIndex, itemIndex, direction }) => {
    const config = await readConfig();
    const items = config.services[categoryIndex]?.items;
    if (!items) return;

    const newIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const [item] = items.splice(itemIndex, 1);
    items.splice(newIndex, 0, item);
    await writeConfig(config);
    await getServiceCategory(categoryIndex).refresh();
  }
);