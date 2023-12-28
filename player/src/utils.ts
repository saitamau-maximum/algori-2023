import { ARR_COLOR } from "./constant";
import { TCard, isNumberCard, isSpecialCard } from "./types";

/**
 * 乱数取得
 * @param num 最大値
 * @returns
 */
export function randomByNumber(num: number) {
  return Math.floor(Math.random() * num);
}

/**
 * 変更する色を選出する
 */
export function selectChangeColor() {
  // このプログラムでは変更する色をランダムで選択する。
  return ARR_COLOR[randomByNumber(ARR_COLOR.length)];
}

/**
 * チャンレンジするかを決定する
 */
export function isChallenge() {
  // このプログラムでは1/2の確率でチャレンジを行う。
  return false;
}

/**
 * カードから得点を算出する
 */
export function calcCardPoint(cards: TCard) {
  if (isNumberCard(cards)) {
    return cards.number;
  }
  if (isSpecialCard(cards)) {
    switch (cards.special) {
      case "skip":
      case "reverse":
      case "draw_2":
        return 20;
      case "wild":
      case "wild_draw_4":
        return 50;
      case "wild_shuffle":
      case "white_wild":
        return 40;
    }
  }
  return 0;
}
