/// file: src/routes/items/[serviceIndex]/[itemIndex]/data.remote.ts
import * as v from "valibot";
import { query, form } from "$app/server";
import { readConfig, writeConfig } from "$lib/server/config";
import { redirect } from "@sveltejs/kit";

export const getServiceItem = query(
  v.object({ serviceIndex: v.number(), itemIndex: v.number() }),
  async ({ serviceIndex, itemIndex }) => {
    const config = await readConfig();
    return config.services[serviceIndex]?.items[itemIndex] ?? null;
  }
);

export const updateServiceItem = form(
  v.object({
    serviceIndex: v.number(),
    itemIndex: v.number(),
    name: v.pipe(v.string(), v.nonEmpty()),
    subtitle: v.optional(v.string()),
    logo: v.string(),
    tag: v.optional(v.string()),
    tagstyle: v.optional(v.string()),
    url: v.pipe(v.string(), v.nonEmpty()),
    target: v.string(),
  }),
  async (data) => {
    const config = await readConfig();
    const item = config.services[data.serviceIndex]?.items[data.itemIndex];
    if (item) {
      item.name = data.name;
      item.subtitle = data.subtitle;
      item.logo = data.logo;
      item.tag = data.tag;
      item.tagstyle = data.tagstyle;
      item.url = data.url;
      item.target = data.target;
      await writeConfig(config);
    }
    redirect(303, `/services/${data.serviceIndex}`);
  }
);