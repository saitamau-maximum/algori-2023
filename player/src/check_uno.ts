import Bluebird from "bluebird";

import { SocketConst, TIME_DELAY } from "./constant";
import { sendEvent } from "./socket";

/**
 * 他のプレイヤーのUNO宣言漏れをチェックする
 * @param numberCardOfPlayer
 */
export async function determineIfExecutePointedNotSayUno(
  numberCardOfPlayer: Record<any, any>,
  id: string,
  unoDeclared: Record<any, any>
) {
  let target;
  // 手札の枚数が1枚だけのプレイヤーを抽出する
  // 2枚以上所持しているプレイヤーはUNO宣言の状態をリセットする
  for (const [k, v] of Object.entries(numberCardOfPlayer)) {
    if (k === id) {
      // 自分のIDは処理しない
      break;
    } else if (v === 1) {
      // 1枚だけ所持しているプレイヤー
      target = k;
      break;
    } else if (Object.keys(unoDeclared).indexOf(k) > -1) {
      // 2枚以上所持しているプレイヤーはUNO宣言の状態をリセットする
      delete (unoDeclared as any)[k];
    }
  }

  if (!target) {
    // 1枚だけ所持しているプレイヤーがいない場合、処理を中断する
    return;
  }

  // 抽出したプレイヤーがUNO宣言を行っていない場合宣言漏れを指摘する
  if (Object.keys(unoDeclared).indexOf(target) === -1) {
    sendEvent(SocketConst.EMIT.POINTED_NOT_SAY_UNO, { target });
    await Bluebird.delay(TIME_DELAY);
  }
}
