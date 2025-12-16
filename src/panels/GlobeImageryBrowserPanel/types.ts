export type OpenSpaceCapabilities = Record<string, Capability>;

export interface Capability {
  Name: string;
  URL: string;
}

export interface OpenSpaceGlobeBrowsingNodes {
  firstIndexWithoutUrl: number;
  identifiers: Record<string, string>;
}

export interface GlobeBrowsingNodes {
  firstIndexWithoutUrl: number;
  identifiers: string[];
}

/**
 * @TODO (anden88 2025-12-15): `UrlInfo` is kind of a bad name imo, but this is what it is
 * called on the engine side. Name refers to the WMS server name and the url the WMS url.
 */
export interface UrlInfo {
  name: string;
  url: string;
}
