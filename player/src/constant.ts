import {
  Challenge,
  ColorOfWild,
  DrawCard,
  JoinRoom,
  PlayCard,
  PlayDrawCard,
  PointedNotSayUno,
  SpecialLogic,
  TEventEmit,
  TEventName,
} from "./gamelog_types";
import { TColor, TDrawReason, TSpecial } from "./types";

export const TIME_DELAY = 10; // 処理停止時間

// UNOのカードの色
export const Color: Record<string, TColor> = {
  RED: "red", // 赤
  YELLOW: "yellow", // 黄
  GREEN: "green", // 緑
  BLUE: "blue", // 青
  BLACK: "black", // 黒
  WHITE: "white", // 白
};

// UNOの記号カード種類
export const Special: Record<string, TSpecial> = {
  SKIP: "skip", // スキップ
  REVERSE: "reverse", // リバース
  DRAW_2: "draw_2", // ドロー2
  WILD: "wild", // ワイルド
  WILD_DRAW_4: "wild_draw_4", // ワイルドドロー4
  WILD_SHUFFLE: "wild_shuffle", // シャッフルワイルド
  WHITE_WILD: "white_wild", // 白いワイルド
};

// カードを引く理由
export const DrawReason: Record<string, TDrawReason> = {
  DRAW_2: "draw_2", // 直前のプレイヤーがドロー2を出した場合
  WILD_DRAW_4: "wild_draw_4", // 直前のプレイヤーがワイルドドロー4を出した場合
  BIND_2: "bind_2", // 直前のプレイヤーが白いワイルド（バインド2）を出した場合
  SKIP_BIND_2: "skip_bind_2", // 直前のプレイヤーが白いワイルド（スキップバインド2）を出した場合
  NOTHING: "nothing", // 理由なし
};

export const TEST_TOOL_HOST_PORT = "3000"; // 開発ガイドラインツールのポート番号
export const ARR_COLOR = [Color.RED, Color.YELLOW, Color.BLUE, Color.GREEN]; // 色変更の選択肢

export const SPECIAL_LOGIC_TITLE = "◯◯◯◯◯◯◯◯◯◯◯◯◯◯◯◯◯◯◯◯◯"; // スペシャルロジック名

// 開発ガイドラインツールSTEP1で送信するサンプルデータ
export const TEST_TOOL_EVENT_DATA_Wrap = (player: string, roomName: string) =>
  ({
    [JoinRoom.name]: {
      player,
      room_name: roomName,
    } as JoinRoom.Emit,
    [ColorOfWild.name]: {
      color_of_wild: "red",
    } as ColorOfWild.Emit,
    [PlayCard.name]: {
      card_play: { color: "black", special: "wild" },
      yell_uno: false,
      color_of_wild: "blue",
    } as PlayCard.Emit,
    [DrawCard.name]: {} as DrawCard.Emit,
    [PlayDrawCard.name]: {
      is_play_card: true,
      yell_uno: true,
      color_of_wild: "blue",
    } as PlayDrawCard.Emit,
    [Challenge.name]: {
      is_challenge: true,
    } as Challenge.Emit,
    [PointedNotSayUno.name]: {
      target: "Player 1",
    } as PointedNotSayUno.Emit,
    [SpecialLogic.name]: {
      title: SPECIAL_LOGIC_TITLE,
    } as SpecialLogic.Emit,
  } as Record<TEventName, TEventEmit>);
