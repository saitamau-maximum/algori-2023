import { Special } from "./constant";
import { TCard, isSpecialCard, isNumberCard, ISpecialCard } from "./types";

/**
 * 出すカードを選出する
 * @param cards 自分の手札
 * @param beforeCard 場札のカード
 */
export function selectPlayCard(
  cards: TCard[],
  beforeCard: TCard,
  id: string,
  numberCardOfPlayer: Record<string, number>
) {
  const cardsWild: ISpecialCard[] = []; // ワイルド・シャッフルワイルド・白いワイルドを格納
  const cardsWild4: ISpecialCard[] = []; // ワイルドドロー4を格納
  const cardsValid: TCard[] = []; // 同じ色 または 同じ数字・記号 のカードを格納
  let myCardLength = 0; // 自分の手札の数
  const enemyCardCounts: number[] = []; // 敵の手札の数

  for (const [k, v] of Object.entries(numberCardOfPlayer)) {
    if (k === id) {
      myCardLength = v;
      continue;
    } else {
      enemyCardCounts.push(v);
      continue;
    }
  }

  const enemyCardCountsAvg =
    enemyCardCounts.reduce((a, b) => a + b) / enemyCardCounts.length;
  const enemyCardCountsMin = Math.min(...enemyCardCounts);

  // 場札と照らし合わせ出せるカードを抽出する
  for (const card of cards) {
    // 敵の平均カード数の80%未満の手札を持っている場合にWHITE_WILDを持ってしまっている場合は即座に出す
    // 敵の最少カード数の50%以上の手札を持っている場合にWHITE_WILDを持っている場合は即座に出す
    if (
      isSpecialCard(card) &&
      String(card.special) === Special.WHITE_WILD &&
      myCardLength < enemyCardCountsAvg * 0.8 &&
      myCardLength > enemyCardCountsMin * 0.5
    ) {
      return card;
    }

    // ワイルドドロー4は場札に関係なく出せる
    if (isSpecialCard(card) && card.special === Special.WILD_DRAW_4) {
      cardsWild4.push(card);
    } else if (
      isSpecialCard(card) &&
      [Special.WILD, Special.WILD_SHUFFLE, Special.WHITE_WILD].includes(
        card.special
      )
    ) {
      // ワイルド・シャッフルワイルド・白いワイルドも場札に関係なく出せる
      cardsWild.push(card);
    } else if (isNumberCard(card) && card.color === beforeCard.color) {
      // 場札と同じ色のカード
      cardsValid.push(card);
    } else if (
      isSpecialCard(card) &&
      isSpecialCard(beforeCard) &&
      card.special === beforeCard.special
    ) {
      // 場札と記号が同じカード
      cardsValid.push(card);
    } else if (
      isNumberCard(card) &&
      isNumberCard(beforeCard) &&
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
