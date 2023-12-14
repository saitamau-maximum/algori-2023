import { TColor, TDrawReason, TSpecial } from "./types";

export const TIME_DELAY = 10; // 処理停止時間

// Socket通信の全イベント名
export const SocketConst = {
  EMIT: {
    JOIN_ROOM: "join-room", // 試合参加
    RECEIVER_CARD: "receiver-card", // カードの配布
    FIRST_PLAYER: "first-player", // 対戦開始
    COLOR_OF_WILD: "color-of-wild", // 場札の色を変更する
    UPDATE_COLOR: "update-color", // 場札の色が変更された
    SHUFFLE_WILD: "shuffle-wild", // シャッフルしたカードの配布
    NEXT_PLAYER: "next-player", // 自分の手番
    PLAY_CARD: "play-card", // カードを出す
    DRAW_CARD: "draw-card", // カードを山札から引く
    PLAY_DRAW_CARD: "play-draw-card", // 山札から引いたカードを出す
    CHALLENGE: "challenge", // チャレンジ
    PUBLIC_CARD: "public-card", // 手札の公開
    POINTED_NOT_SAY_UNO: "pointed-not-say-uno", // UNO宣言漏れの指摘
    SPECIAL_LOGIC: "special-logic", // スペシャルロジック
    FINISH_TURN: "finish-turn", // 対戦終了
    FINISH_GAME: "finish-game", // 試合終了
    PENALTY: "penalty", // ペナルティ
  },
};

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
export const TEST_TOOL_EVENT_DATA_Wrap = (
  player: string,
  roomName: string
) => ({
  [SocketConst.EMIT.JOIN_ROOM]: {
    player,
    room_name: roomName,
  },
  [SocketConst.EMIT.COLOR_OF_WILD]: {
    color_of_wild: "red",
  },
  [SocketConst.EMIT.PLAY_CARD]: {
    card_play: { color: "black", special: "wild" },
    yell_uno: false,
    color_of_wild: "blue",
  },
  [SocketConst.EMIT.DRAW_CARD]: {},
  [SocketConst.EMIT.PLAY_DRAW_CARD]: {
    is_play_card: true,
    yell_uno: true,
    color_of_wild: "blue",
  },
  [SocketConst.EMIT.CHALLENGE]: {
    is_challenge: true,
  },
  [SocketConst.EMIT.POINTED_NOT_SAY_UNO]: {
    target: "Player 1",
  },
  [SocketConst.EMIT.SPECIAL_LOGIC]: {
    title: SPECIAL_LOGIC_TITLE,
  },
});
