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
    } else if (card.color === beforeCard.color) {
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

  const cardsAll = cardsValid.sort((a, b) => {
    return calcCardPoint(b) - calcCardPoint(a);
  });
  if (cardsAll.length !== 0) return cardsAll[0];

  return [...cardsWild, ...cardsWild4].sort((a, b) => {
    return calcCardPoint(b) - calcCardPoint(a);
  })[0];
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
