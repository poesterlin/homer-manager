/// file: src/lib/server/config.ts
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as yaml from "js-yaml";
import { error } from "@sveltejs/kit";

// Use absolute path to ensure we are looking where we think we are
const CONFIG_PATH = path.resolve("./assets/config.yml");
// const CONFIG_PATH = "./assets/config.yml";


export interface ServiceItem {
  name: string;
  logo: string;
  tag?: string;
  tagstyle?: string;
  url: string;
  target: string;
}

export interface ServiceCategory {
  name: string;
  icon: string;
  items: ServiceItem[];
}

export interface HomerConfig {
  title: string;
  subtitle: string;
  logo: string;
  header: boolean;
  footer: boolean;
  stylesheet: string[];
  columns: string;
  theme: string;
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  services: ServiceCategory[];
}

export async function readConfig(): Promise<HomerConfig> {
  try {
    // Check if file exists first
    try {
      await fs.access(CONFIG_PATH);
    } catch {
      console.error(`[Config] File not found at: ${CONFIG_PATH}`);
      throw error(500, {
        message: `Config file not found at ${CONFIG_PATH}. Did you mount the volume correctly?`
      });
    }

    const content = await fs.readFile(CONFIG_PATH, "utf-8");
    
    if (!content.trim()) {
      console.error(`[Config] File is empty: ${CONFIG_PATH}`);
      throw error(500, "Config file is empty.");
    }

    const parsed = yaml.load(content) as HomerConfig;

    if (!parsed || typeof parsed !== 'object') {
       console.error(`[Config] Invalid YAML structure`);
       throw error(500, "Config file contains invalid YAML.");
    }

    return parsed;
  } catch (e: any) {
    // If it's already a SvelteKit error, rethrow it
    if (e?.status && e?.body) throw e;

    console.error(`[Config] Read Error:`, e);
    throw error(500, {
        message: `Failed to read config: ${e.message}`
    });
  }
}

export async function writeConfig(config: HomerConfig): Promise<void> {
  try {
    const content = yaml.dump(config, {
      indent: 2,
      lineWidth: -1,
      quotingType: '"',
    });
    await fs.writeFile(CONFIG_PATH, content, "utf-8");
    console.log(`[Config] Saved successfully to ${CONFIG_PATH}`);
  } catch (e: any) {
    console.error(`[Config] Write Error:`, e);
    throw error(500, {
        message: `Failed to write config: ${e.message}. Check file permissions.`
    });
  }
}