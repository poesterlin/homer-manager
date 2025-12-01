/// file: src/lib/server/config.ts
import * as fs from "node:fs/promises";
import * as yaml from "js-yaml";

const CONFIG_PATH = "./assets/config.yaml";

export interface ServiceItem {
  name: string;
  logo: string;
  tag: string;
  tagstyle: string;
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
  const content = await fs.readFile(CONFIG_PATH, "utf-8");
  return yaml.load(content) as HomerConfig;
}

export async function writeConfig(config: HomerConfig): Promise<void> {
  const content = yaml.dump(config, {
    indent: 2,
    lineWidth: -1,
    quotingType: '"',
  });
  await fs.writeFile(CONFIG_PATH, content, "utf-8");
}