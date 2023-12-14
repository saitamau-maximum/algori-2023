import { TCard, TDrawReason } from "./types";

// 試合参加
export namespace JoinRoom {
  export const name = "join-room";

  export interface Emit {
    room_name: string;
    player: string;
  }

  export interface Callback {
    room_name: string;
    player: string;
    game_id: string;
    your_id: string;
    total_turn: number;
    white_wild: string;
  }

  export interface On {
    room_name: string;
    player: string;
  }
}

// カードを出す
export namespace PlayCard {
  export const name = "play-card";

  export interface Emit {
    card_play: TCard;
    yell_uno: boolean;
    color_of_wild: string;
  }

  export interface On {
    player: string;
    card_play: TCard;
    yell_uno: boolean;
    color_of_wild: string;
  }
}

// カードを引く
export namespace DrawCard {
  export const name = "draw-card";

  export interface Emit {}

  export interface Callback {
    player: string;
    is_draw: boolean;
    can_play_draw_card: boolean;
    draw_card: TCard[];
  }

  export interface On {
    player: string;
    is_draw: boolean;
  }
}

// 山札から引いたカードを場札に出すか決める
export namespace PlayDrawCard {
  export const name = "play-draw-card";

  export interface Emit {
    is_play_card: boolean;
    yell_uno: boolean;
    color_of_wild: string;
  }

  export interface On {
    player: string;
    is_play_card: boolean;
    card_play: TCard;
    yell_uno: boolean;
    color_of_wild: string;
  }
}

// チャレンジ
export namespace Challenge {
  export const name = "challenge";

  export interface Emit {
    is_challenge: boolean;
  }

  export interface On {
    challenger: string;
    target: string;
    is_challenge: boolean;
    is_challenge_success: boolean;
  }
}

// UNO コール指摘
export namespace PointedNotSayUno {
  export const name = "pointed-not-say-uno";

  export interface Emit {
    target: string;
  }

  export interface On {
    pointer: string;
    target_string: string;
    have_say_uno: boolean;
  }
}

// スペシャルロジック発動
export namespace SpecialLogic {
  export const name = "special-logic";

  export interface Emit {
    title: string;
  }
}

// カードを手札に追加
export namespace ReceiverCard {
  export const name = "receiver-card";

  export interface On {
    cards_receive: TCard[];
    is_penalty: boolean;
  }
}

// 対戦開始
export namespace FirstPlayer {
  export const name = "first-player";

  export interface On {
    first_player: string;
    first_card: TCard;
    play_order: string[];
  }
}

// 場札の色指定を要求
export namespace ColorOfWild {
  export const name = "color-of-wild";

  export interface On {}

  export interface Emit {
    color_of_wild: string;
  }
}

// 場札の色を更新
export namespace UpdateColor {
  export const name = "update-color";

  export interface On {
    color: string;
  }

  export interface Emit {}
}

// シャッフル
export namespace ShuffleWild {
  export const name = "shuffle-wild";

  export interface On {
    cards_receive: TCard[];
    number_card_of_player: Record<string, number>;
  }
}

// 次の番ですよ通知
export namespace NextPlayer {
  export const name = "next-player";

  export interface On {
    next_player: string;
    before_player: string;
    card_before: TCard;
    card_of_player: TCard[];
    must_call_draw_card: boolean;
    draw_reason: TDrawReason;
    turn_right: boolean;
    number_card_play: number;
    number_turn_play: number;
    number_card_of_player: Record<string, number>;
  }
}

// 手札の公開
export namespace PublicCard {
  export const name = "public-card";

  export interface On {
    card_of_player: string;
    cards: TCard[];
  }
}

// 対戦終了
export namespace FinishTurn {
  export const name = "finish-turn";

  export interface On {
    turn_no: number;
    winner: string;
    score: Record<string, number>;
  }
}

// ゲーム終了
export namespace FinishGame {
  export const name = "finish-game";

  export interface On {
    winner: string;
    turn_win: number;
    order: Record<string, number>;
    total_score: Record<string, number>;
  }
}

// ペナ
export namespace Penalty {
  export const name = "penalty";

  export interface On {
    player: string;
    number_card_of_player: number;
    error: string;
  }
}
