export type TColor = "red" | "yellow" | "green" | "blue" | "black" | "white";

export interface INumberCard {
  type: "number";
  number: number;
  color: TColor;
}

export type TSpecial =
  | "skip"
  | "reverse"
  | "draw_2"
  | "wild"
  | "wild_draw_4"
  | "wild_shuffle"
  | "white_wild";

export interface ISpecialCard {
  type: "special";
  color: TColor;
  special: TSpecial;
}

export type TCard = INumberCard | ISpecialCard;
