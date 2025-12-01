/// file: src/routes/icons/data.remote.ts
import * as v from "valibot";
import { query, command } from "$app/server";
import {
  fetchAvailableIcons,
  downloadIcon,
  getLocalIcons,
} from "$lib/server/icons";

export const getAvailableIcons = query(async () => {
  return await fetchAvailableIcons();
});

export const getLocalIconsList = query(async () => {
  return await getLocalIcons();
});

export const downloadIconToAssets = command(
  v.object({
    name: v.string(),
    format: v.picklist(["svg", "png", "webp"]),
  }),
  async ({ name, format }) => {
    const savedPath = await downloadIcon(name, format);
    await getLocalIconsList().refresh();
    return savedPath;
  }
);