/// file: src/lib/server/icons.ts
import * as fs from "node:fs/promises";
import * as path from "node:path";

const ICONS_REPO = "selfhst/icons";
const GITHUB_API = "https://api.github.com";
const RAW_GITHUB = "https://raw.githubusercontent.com";

export interface IconInfo {
  name: string;
  formats: ("svg" | "png" | "webp")[];
}

interface GitHubTreeItem {
  path: string;
  type: string;
}

interface GitHubTreeResponse {
  tree: GitHubTreeItem[];
}

// Cache icons list for 1 hour
let iconsCache: IconInfo[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000;

export async function fetchAvailableIcons(): Promise<IconInfo[]> {
  if (iconsCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return iconsCache;
  }

  try {
    // Fetch the repository tree to get all icons
    const response = await fetch(
      `${GITHUB_API}/repos/${ICONS_REPO}/git/trees/main?recursive=1`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Homer-Config-Manager",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubTreeResponse = await response.json();

    // Group icons by name and collect available formats
    const iconMap = new Map<string, Set<string>>();

    for (const item of data.tree) {
      if (item.type !== "blob") continue;

      const match = item.path.match(/^(svg|png|webp)\/(.+)\.(svg|png|webp)$/);
      if (match) {
        const [, , name, format] = match;
        if (!iconMap.has(name)) {
          iconMap.set(name, new Set());
        }
        iconMap.get(name)!.add(format);
      }
    }

    iconsCache = Array.from(iconMap.entries())
      .map(([name, formats]) => ({
        name,
        formats: Array.from(formats) as ("svg" | "png" | "webp")[],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    cacheTimestamp = Date.now();
    return iconsCache;
  } catch (error) {
    console.error("Failed to fetch icons:", error);
    // Return cached data if available, even if stale
    if (iconsCache) return iconsCache;
    throw error;
  }
}

export async function downloadIcon(
  iconName: string,
  format: "svg" | "png" | "webp" = "png"
): Promise<string> {
  const url = `${RAW_GITHUB}/${ICONS_REPO}/main/${format}/${iconName}.${format}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download icon: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();

  // Ensure the icons directory exists
  const iconsDir = "./assets/tools";
  await fs.mkdir(iconsDir, { recursive: true });

  // Save the icon
  const filename = `${iconName}.${format}`;
  const filepath = path.join(iconsDir, filename);
  await fs.writeFile(filepath, Buffer.from(buffer));

  return `assets/tools/${filename}`;
}

export async function getLocalIcons(): Promise<string[]> {
  const iconsDir = "./assets/tools";

  try {
    const files = await fs.readdir(iconsDir);
    return files.filter((f) =>
      [".png", ".svg", ".webp", ".ico", ".jpg", ".jpeg"].some((ext) =>
        f.toLowerCase().endsWith(ext)
      )
    );
  } catch {
    return [];
  }
}