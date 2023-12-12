import { ARR_COLOR } from "./constant";

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
  return !!randomByNumber(2);
}
