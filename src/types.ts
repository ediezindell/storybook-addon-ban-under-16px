export type BanElement = {
  tagName: string;
  id: string;
  className: string;
  outerHTML: string;
  selector: string;
};

export type Bans = {
  element: BanElement;
  fontSize: number;
}[];

export interface Options {
  enabled: boolean;
  maxWidth?: number;
  targetSelector?: string;
}
