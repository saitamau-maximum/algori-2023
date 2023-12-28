import {
  Color,
  Special,
  DrawReason,
  TEST_TOOL_HOST_PORT,
  ARR_COLOR,
  SPECIAL_LOGIC_TITLE,
  TEST_TOOL_EVENT_DATA_Wrap,
} from "./constant";
import { selectPlayCard } from "./select";
import { isChallenge, randomByNumber, selectChangeColor } from "./utils";
import {
  addClientEventListener,
  initializeClient,
  receiveEvent,
  sendEvent,
} from "./socket";
import { determineIfExecutePointedNotSayUno } from "./check_uno";
import {
  Challenge,
  ColorOfWild,
  DrawCard,
  FinishGame,
  FinishTurn,
  FirstPlayer,
  JoinRoom,
  NextPlayer,
  Penalty,
  PlayCard,
  PlayDrawCard,
  PointedNotSayUno,
  PublicCard,
  ReceiverCard,
  ShuffleWild,
  SpecialLogic,
  TEventName,
  UpdateColor,
} from "./gamelog_types";
import { isSpecialCard } from "./types";

/**
 * コマンドラインから受け取った変数等
 */
const host = process.argv[2] || ""; // 接続先（ディーラープログラム or 開発ガイドラインツール）
const roomName = process.argv[3] || ""; // ディーラー名
const player = process.argv[4] || ""; // プレイヤー名
const eventName = process.argv[5] as TEventName; // Socket通信イベント名
const isTestTool = host.includes(TEST_TOOL_HOST_PORT); // 接続先が開発ガイドラインツールであるかを判定

let id = ""; // 自分のID
let unoDeclared: Record<string, boolean> = {}; // 他のプレイヤーのUNO宣言状況

/**
 * コマンドライン引数のチェック
 */
if (!host) {
  // 接続先のhostが指定されていない場合はプロセスを終了する
  console.log("Host missed");
  process.exit();
} else {
  console.log(`Host: ${host}`);
}

// ディーラー名とプレイヤー名の指定があることをチェックする
if (!roomName || !player) {
  console.log("Arguments invalid");
  if (!isTestTool) {
    // 接続先がディーラープログラムの場合はプロセスを終了する
    process.exit();
  }
} else {
  console.log(`Dealer: ${roomName}, Player: ${player}`);
}

initializeClient(host);

// 開発ガイドラインツールSTEP1で送信するサンプルデータ
const TEST_TOOL_EVENT_DATA = TEST_TOOL_EVENT_DATA_Wrap(player, roomName);

/**
 * Socket通信受信
 */
// プレイヤーがゲームに参加
addClientEventListener(JoinRoom.name, (dataRes: JoinRoom.On) => {
  receiveEvent(JoinRoom.name, dataRes);
});

// カードが手札に追加された
addClientEventListener(ReceiverCard.name, (dataRes: ReceiverCard.On) => {
  receiveEvent(ReceiverCard.name, dataRes);
});

// 対戦の開始
addClientEventListener(FirstPlayer.name, (dataRes: FirstPlayer.On) => {
  receiveEvent(FirstPlayer.name, dataRes);
});

// 場札の色指定を要求
addClientEventListener(ColorOfWild.name, (dataRes: ColorOfWild.On) => {
  receiveEvent(ColorOfWild.name, dataRes, () => {
    const color = selectChangeColor();
    const data: ColorOfWild.Emit = {
      color_of_wild: color,
    };

    sendEvent(ColorOfWild.name, data);
  });
});

// 場札の色が変わった
addClientEventListener(UpdateColor.name, (dataRes: UpdateColor.On) => {
  receiveEvent(UpdateColor.name, dataRes);
});

// シャッフルワイルドにより手札状況が変更
addClientEventListener(ShuffleWild.name, (dataRes: ShuffleWild.On) => {
  receiveEvent(ShuffleWild.name, dataRes),
    () => {
      Object.keys(dataRes.number_card_of_player).forEach((player) => {
        if (dataRes.number_card_of_player[player] === 1) {
          // シャッフル後に1枚になったプレイヤーはUNO宣言を行ったこととする
          unoDeclared[player] = true;
        } else {
          // シャッフル後に2枚以上のカードが配られたプレイヤーはUNO宣言の状態をリセットする
          delete unoDeclared[player];
        }
      });
    };
});

// 自分の番
addClientEventListener(NextPlayer.name, (dataRes: NextPlayer.On) => {
  receiveEvent(NextPlayer.name, dataRes, async () => {
    // UNO宣言が漏れているプレイヤーがいないかチェックする。
    // 該当するプレイヤーがいる場合は指摘する。
    await determineIfExecutePointedNotSayUno(
      dataRes.number_card_of_player,
      id,
      unoDeclared
    );

    const cards = dataRes.card_of_player;

    if (dataRes.draw_reason === DrawReason.WILD_DRAW_4) {
      // カードを引く理由がワイルドドロー4の時、チャレンジを行うことができる。
      if (isChallenge()) {
        sendEvent(Challenge.name, { is_challenge: true });
        return;
      }
    }

    if (dataRes.must_call_draw_card) {
      // 引かなければいけない場合
      sendEvent(DrawCard.name, {});
      return;
    }

    // スペシャルロジックを発動させる
    const specialLogicNumRundom = randomByNumber(10); // 1/10で発動するように調整
    if (specialLogicNumRundom === 0) {
      sendEvent(SpecialLogic.name, {
        title: SPECIAL_LOGIC_TITLE,
      });
    }

    const playCard = selectPlayCard(cards, dataRes.card_before);
    if (playCard) {
      // 選出したカードがある時
      console.log(`selected card: ${JSON.stringify(playCard)}`);
      const data: PlayCard.Emit = {
        card_play: playCard,
        yell_uno: cards.length === 2, // 残り手札数を考慮してUNOコールを宣言する
        color_of_wild: undefined,
      };

      // 出すカードがワイルドとワイルドドロー4の時は変更する色を指定する
      if (
        isSpecialCard(playCard) &&
        (playCard.special === Special.WILD ||
          playCard.special === Special.WILD_DRAW_4)
      ) {
        const color = selectChangeColor(); // 指定する色
        data.color_of_wild = color;
      }

      // カードを出すイベントを実行
      sendEvent(PlayCard.name, data);
    } else {
      // 選出したカードが無かった時

      // カードを引くイベントを実行
      sendEvent(DrawCard.name, {}, (res: DrawCard.Callback) => {
        if (!res.can_play_draw_card) {
          // 引いたカードが場に出せないので処理を終了
          return;
        }

        // 以後、引いたカードが場に出せるときの処理
        const data: PlayDrawCard.Emit = {
          is_play_card: true,
          yell_uno: cards.concat(res.draw_card).length === 2, // 残り手札数を考慮してUNOコールを宣言する
          color_of_wild: undefined,
        };

        const playCard = res.draw_card[0]; // 引いたカード。draw-cardイベントのcallbackデータは引いたカードのリスト形式であるため、配列の先頭を指定する。
        // 引いたカードがワイルドとワイルドドロー4の時は変更する色を指定する
        if (
          isSpecialCard(playCard) &&
          [Special.WILD, Special.WILD_DRAW_4].includes(playCard.special)
        ) {
          const color = selectChangeColor();
          data.color_of_wild = color;
        }

        // 引いたカードを出すイベントを実行
        sendEvent(PlayDrawCard.name, data);
      });
    }
  });
});

// カードが場に出た
addClientEventListener(PlayCard.name, (dataRes: PlayCard.On) => {
  receiveEvent(PlayCard.name, dataRes, () => {
    // UNO宣言を行った場合は記録する
    if (dataRes.yell_uno) {
      (unoDeclared as any)[dataRes.player] = true;
    }
  });
});

// 山札からカードを引いた
addClientEventListener(DrawCard.name, (dataRes: DrawCard.On) => {
  receiveEvent(DrawCard.name, dataRes, () => {
    // カードが増えているのでUNO宣言の状態をリセットする
    delete (unoDeclared as any)[dataRes.player];
  });
});

// 山札から引いたカードが場に出た
addClientEventListener(PlayDrawCard.name, (dataRes: PlayDrawCard.On) => {
  receiveEvent(PlayDrawCard.name, dataRes, () => {
    // UNO宣言を行った場合は記録する
    if (dataRes.yell_uno) {
      (unoDeclared as any)[dataRes.player] = true;
    }
  });
});

// チャレンジの結果
addClientEventListener(Challenge.name, (dataRes: Challenge.On) => {
  receiveEvent(Challenge.name, dataRes);
});

// チャレンジによる手札の公開
addClientEventListener(PublicCard.name, (dataRes: PublicCard.On) => {
  receiveEvent(PublicCard.name, dataRes);
});

// UNOコールを忘れていることを指摘
addClientEventListener(
  PointedNotSayUno.name,
  (dataRes: PointedNotSayUno.On) => {
    receiveEvent(PointedNotSayUno.name, dataRes);
  }
);

// 対戦が終了
addClientEventListener(FinishTurn.name, (dataRes: FinishTurn.On) => {
  receiveEvent(FinishTurn.name, dataRes, () => {
    // 新しい対戦が始まるのでUNO宣言の状態をリセットする
    unoDeclared = {};
  });
});

// 試合が終了
addClientEventListener(FinishGame.name, (dataRes: FinishGame.On) => {
  receiveEvent(FinishGame.name, dataRes);
});

// ペナルティ発生
addClientEventListener(Penalty.name, (dataRes: Penalty.On) => {
  receiveEvent(Penalty.name, dataRes, () => {
    // カードが増えているのでUNO宣言の状態をリセットする
    delete (unoDeclared as any)[dataRes.player];
  });
});

// プロセス起動時の処理。接続先によって振る舞いが異なる。
if (isTestTool) {
  // テストツールに接続
  if (!eventName) {
    // イベント名の指定がない（開発ガイドラインSTEP2の受信のテストを行う時）
    console.log("Not found event name.");
  } else if (!TEST_TOOL_EVENT_DATA[eventName]) {
    // イベント名の指定があり、テストデータが定義されていない場合はエラー
    console.log(`Undefined test data. eventName: ${eventName}`);
  } else {
    // イベント名の指定があり、テストデータが定義されている場合は送信する(開発ガイドラインSTEP1の送信のテストを行う時)
    sendEvent(eventName, TEST_TOOL_EVENT_DATA[eventName]);
  }
} else {
  // ディーラープログラムに接続
  const data = {
    room_name: roomName,
    player,
  };

  // 試合に参加するイベントを実行
  sendEvent(JoinRoom.name, data, (res: JoinRoom.Callback) => {
    console.log(`join-room res: ${JSON.stringify(res)}`);
    id = res.your_id;
    console.log(`My id is ${id}`);
  });
}
