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
