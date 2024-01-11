import { ARR_COLOR } from "./constant";
import { INumberCard, TColor } from "./types";

/**
 * 乱数取得
 * @param num 最大値
 * @returns
 */
export function randomByNumber(num: number) {
  return Math.floor(Math.random() * num);
}

function typedObjectKeys<T extends Record<string, unknown>>(
  obj: T
): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * 変更する色を選出する
 */
export function selectChangeColor(numberCards: INumberCard[]): TColor {
  // このプログラムでは、手札の色の数を数え、最も多い色を選出する。
  // ただし、同じ数の色が複数ある場合は、ランダムで選出する。
  const colorCount: Record<TColor, number> = {
    black: -1,
    blue: 0,
    green: 0,
    red: 0,
    yellow: 0,
    white: -1,
  };
  for (const card of numberCards) {
    // ワイルドカードは変更する色には含めない
    if (card.color === "black" || card.color === "white") {
      continue;
    }
    if (colorCount[card.color]) {
      colorCount[card.color]++;
    } else {
      colorCount[card.color] = 1;
    }
  }

  const maxColor = typedObjectKeys(colorCount).reduce((a, b) =>
    colorCount[a] > colorCount[b] ? a : b
  );

  return maxColor;
}

/**
 * チャンレンジするかを決定する
 */
export function isChallenge() {
  // このプログラムでは1/2の確率でチャレンジを行う。
  return !!randomByNumber(2);
}
