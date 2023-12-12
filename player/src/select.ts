import { Special } from "./constant";
import { TCard, INumberCard, ISpecialCard } from "./types";

/**
 * 出すカードを選出する
 * @param cards 自分の手札
 * @param beforeCard 場札のカード
 */
export function selectPlayCard(cards: TCard[], beforeCard: TCard) {
  let cardsWild = []; // ワイルド・シャッフルワイルド・白いワイルドを格納
  let cardsWild4 = []; // ワイルドドロー4を格納
  let cardsValid = []; // 同じ色 または 同じ数字・記号 のカードを格納

  // 場札と照らし合わせ出せるカードを抽出する
  for (const card of cards) {
    // ワイルドドロー4は場札に関係なく出せる
    if (card.type === "special" && card.special === Special.WILD_DRAW_4) {
      cardsWild4.push(card);
    } else if (
      card.type === "special" &&
      (card.special === Special.WILD ||
        card.special === Special.WILD_SHUFFLE ||
        card.special === Special.WHITE_WILD)
    ) {
      // ワイルド・シャッフルワイルド・白いワイルドも場札に関係なく出せる
      cardsWild.push(card);
    } else if (card.type === "number" && card.color === beforeCard.color) {
      // 場札と同じ色のカード
      cardsValid.push(card);
    } else if (
      card.type === "special" &&
      beforeCard.type === "special" &&
      card.special === beforeCard.special
    ) {
      // 場札と記号が同じカード
      cardsValid.push(card);
    } else if (
      card.type === "number" &&
      beforeCard.type === "number" &&
      card.number === beforeCard.number
    ) {
      // 場札と数字が同じカード
      cardsValid.push(card);
    }
  }

  /**
   * 出せるカードのリストを結合し、先頭のカードを返却する。
   * このプログラムでは優先順位を、「同じ色 または 同じ数字・記号」 > 「ワイルド・シャッフルワイルド・白いワイルド」 > ワイルドドロー4の順番とする。
   * ワイルドドロー4は本来、手札に出せるカードが無い時に出していいカードであるため、一番優先順位を低くする。
   * ワイルド・シャッフルワイルド・白いワイルドはいつでも出せるので、条件が揃わないと出せない「同じ色 または 同じ数字・記号」のカードより優先度を低くする。
   */
  return cardsValid.concat(cardsWild).concat(cardsWild4)[0];
}
