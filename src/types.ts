export type Bans = {
  element: Element;
  fontSize: number;
}[];

export interface Options {
  enabled: boolean;
  maxWidth?: number;
  targetSelector?: string;
}
