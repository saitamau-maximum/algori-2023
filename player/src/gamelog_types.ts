import { TCard, TDrawReason } from "./types";

export interface IJoinGame {
  dealer_code: string;
  event: "join-room";
  dealer: string;
  player: string;
  contents: {
    player_id: string;
    player_name: string;
  };
  dateCreated: number;
}

export interface IFirstPlayer {
  dealer_code: string;
  event: "first-player";
  dealer: string;
  player: string;
  turn: number;
  contents: {
    white_wild: string;
    first_player: string;
    first_card: TCard;
    play_order: string[];
    cards_receive: Record<string, TCard[]>;
  };
  dataCreated: number;
}

export interface INextPlayer {
  dealer_code: string;
  event: "next-player";
  dealer: string;
  player: string;
  turn: number;
  contents: {
    next_player: string;
    before_player: string;
    card_before: TCard;
    card_of_player: TCard[];
    turn_right: boolean;
    must_call_draw_card: boolean;
    draw_reason: TDrawReason;
    number_card_play: number;
    number_turn_play: number;
    number_card_of_player: Record<string, number>;
  };
  dateCreated: number;
}

export interface IColorChangeRequest {
  dealer_code: string;
  event: "color-of-wild";
  dealer: string;
  player: string;
  contents: {
    player: string;
    number_turn_play: number;
  };
  dateCreated: number;
}

export interface IColorOfWild {
  dealer_code: string;
  event: "color-of-wild";
  dealer: string;
  player: string;
  contents: {
    color_of_wild: string;
    number_turn_play: number;
  };
  dateCreated: number;
}

export interface IShuffleWild {
  dealer_code: string;
  event: "shuffle-wild";
  dealer: string;
  player: "";
  turn: number;
  contents: {
    player: string;
    cards_receive: Record<string, TCard[]>;
    number_turn_play: number;
  };
  dateCreated: number;
}

export interface IPlayCard {
  dealer_code: string;
  event: "play-card";
  dealer: string;
  player: string;
  turn: number;
  contents: {
    card_play: TCard;
    next_player: string;
    skip_player: string;
    yell_uno: boolean;
    color_of_wild: string;
    number_turn_play: number;
  };
  dateCreated: number;
}

export interface IDrawCard {
  dealer_code: string;
  event: "draw-card";
  dealer: string;
  player: string;
  turn: number;
  contents: {
    can_play_draw_card: boolean;
    card_draw: TCard[];
    is_draw: boolean;
    draw_desk: {
      before: number;
      after: number;
    };
    before_card: TCard;
    draw_reason: TDrawReason;
    number_turn_play: number;
  };
  dateCreated: number;
}

export interface IPlayDrawCard {
  dealer_code: string;
  event: "play-draw-card";
  dealer: string;
  player: string;
  turn: number;
  contents: {
    is_play_card: boolean;
    card_play: TCard;
    next_player: string;
    skip_player: string;
    yell_uno: boolean;
    color_of_wild: string;
    number_turn_play: number;
  };
  dateCreated: number;
}

export interface IPointedNotSayUno {
  dealer_code: string;
  event: "pointed-not-say-uno";
  dealer: string;
  player: string;
  turn: number;
  contents: {
    target: string;
    number_turn_play: number;
    have_say_uno: boolean;
  };
  dateCreated: number;
}

export interface IChallenge {
  dealer_code: string;
  event: "challenge";
  dealer: string;
  player: string;
  turn: number;
  contents:
    | {
        target: string;
        is_challenge: true;
        result: {
          is_challenge_success: boolean;
          player: string;
          cards_receive: TCard[];
        };
        number_turn_play: number;
      }
    | {
        target: string;
        is_challenge: false;
        result: undefined;
        number_turn_play: number;
      };
  dateCreated: number;
}

export interface IPublicCard {
  dealer_code: string;
  event: "public-card";
  dealer: string;
  player: "";
  turn: number;
  contents: {
    player: string;
    cards: TCard[];
    number_turn_play: number;
  };
  dateCreated: number;
}

export interface ISpecialLogic {
  dealer_code: string;
  event: "special-logic";
  dealer: string;
  player: string;
  turn: number;
  contents: {
    title: string;
    number_turn_play: number;
  };
  dateCreated: number;
}

export interface IFinishTurn {
  dealer_code: string;
  event: "finish-turn";
  dealer: string;
  player: "";
  turn: number;
  contents: {
    player: string;
    winner: string;
    score: Record<string, number>;
    total_score: Record<string, number>;
    card_of_player: Record<string, TCard[]>;
    number_turn_play: number;
  };
}

export interface IFinishGame {
  dealer_code: string;
  event: "finish-game";
  dealer: string;
  player: "";
  turn: number;
  contents: {
    winner: string;
    turn_win: number;
    order: Record<string, number>;
    total_score: Record<string, number>;
  };
  dateCreated: number;
}

export interface IPenalty {
  dealer_code: string;
  event: "penalty";
  dealer: string;
  player: "";
  turn: number;
  contents: {
    player: string;
    cards_receive: TCard[];
    number_turn_play: number;
    error: string;
  };
  dateCreated: number;
}

export interface IDisconnect {
  dealer_code: string;
  event: "disconnect";
  dealer: string;
  player: string;
  content: {
    socketId: string;
  };
  dateCreated: number;
}

export type TGameEvent = IJoinGame;
