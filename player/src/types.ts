export type TDrawReason =
  | "draw_2"
  | "wild_draw_4"
  | "bind_2"
  | "skip_bind_2"
  | "nothing";

export type TColor = "red" | "yellow" | "green" | "blue" | "black" | "white";

export interface INumberCard {
  number: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  color: TColor;
}

export const isNumberCard = (card: TCard): card is INumberCard =>
  "number" in card;

export type TSpecial =
  | "skip"
  | "reverse"
  | "draw_2"
  | "wild"
  | "wild_draw_4"
  | "wild_shuffle"
  | "white_wild";

export interface ISpecialCard {
  color: TColor;
  special: TSpecial;
}

export const isSpecialCard = (card: TCard): card is ISpecialCard =>
  "special" in card;

export type TCard = INumberCard | ISpecialCard;
