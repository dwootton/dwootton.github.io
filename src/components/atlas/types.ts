export type AtlasItemType = "route" | "waypoint" | "field_note" | "project" | "map";

export interface AtlasItem {
  slug: string;
  title: string;
  type: AtlasItemType;
  date: string;
  updated?: string;
  desc: string;
  tags: string[];
  topics: string[];
  status: "uncharted" | "in_progress" | "charted";
  elevation: number;
  thumbnail?: string;
  alt?: string;
  repo_url?: string;
  live_url?: string;
  related?: string[];
  x: number;
  y: number;
  cluster?: number;
}

export interface AtlasData {
  items: AtlasItem[];
  meta: {
    builtAt: string;
    version: number;
  };
}

