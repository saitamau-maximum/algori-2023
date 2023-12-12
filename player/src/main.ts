import {
  SocketConst,
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

/**
 * コマンドラインから受け取った変数等
 */
const host = process.argv[2] || ""; // 接続先（ディーラープログラム or 開発ガイドラインツール）
const roomName = process.argv[3] || ""; // ディーラー名
const player = process.argv[4] || ""; // プレイヤー名
const eventName = process.argv[5]; // Socket通信イベント名
const isTestTool = host.includes(TEST_TOOL_HOST_PORT); // 接続先が開発ガイドラインツールであるかを判定

let id = ""; // 自分のID
let unoDeclared = {}; // 他のプレイヤーのUNO宣言状況

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
addClientEventListener(SocketConst.EMIT.JOIN_ROOM, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.JOIN_ROOM, dataRes);
});

// カードが手札に追加された
addClientEventListener(SocketConst.EMIT.RECEIVER_CARD, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.RECEIVER_CARD, dataRes);
});

// 対戦の開始
addClientEventListener(SocketConst.EMIT.FIRST_PLAYER, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.FIRST_PLAYER, dataRes);
});

// 場札の色指定を要求
addClientEventListener(SocketConst.EMIT.COLOR_OF_WILD, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.COLOR_OF_WILD, dataRes, () => {
    const color = selectChangeColor();
    const data = {
      color_of_wild: color,
    };

    sendEvent(SocketConst.EMIT.COLOR_OF_WILD, data);
  });
});

// 場札の色が変わった
addClientEventListener(SocketConst.EMIT.UPDATE_COLOR, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.UPDATE_COLOR, dataRes);
});

// シャッフルワイルドにより手札状況が変更
addClientEventListener(SocketConst.EMIT.SHUFFLE_WILD, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.SHUFFLE_WILD, dataRes),
    () => {
      Object.keys(dataRes.number_card_of_player).forEach((player) => {
        if (dataRes.number_card_of_player[player] === 1) {
          // シャッフル後に1枚になったプレイヤーはUNO宣言を行ったこととする
          (unoDeclared as any)[player] = true;
        } else {
          // シャッフル後に2枚以上のカードが配られたプレイヤーはUNO宣言の状態をリセットする
          delete (unoDeclared as any)[player];
        }
      });
    };
});

// 自分の番
addClientEventListener(SocketConst.EMIT.NEXT_PLAYER, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.NEXT_PLAYER, dataRes, async () => {
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
        sendEvent(SocketConst.EMIT.CHALLENGE, { is_challenge: true });
        return;
      }
    }

    if (dataRes.must_call_draw_card) {
      // 引かなければいけない場合
      sendEvent(SocketConst.EMIT.DRAW_CARD, {});
      return;
    }

    // スペシャルロジックを発動させる
    const specialLogicNumRundom = randomByNumber(10); // 1/10で発動するように調整
    if (specialLogicNumRundom === 0) {
      sendEvent(SocketConst.EMIT.SPECIAL_LOGIC, {
        title: SPECIAL_LOGIC_TITLE,
      });
    }

    const playCard = selectPlayCard(cards, dataRes.card_before);
    if (playCard) {
      // 選出したカードがある時
      console.log(`selected card: ${JSON.stringify(playCard)}`);
      const data = {
        card_play: playCard,
        yell_uno: cards.length === 2, // 残り手札数を考慮してUNOコールを宣言する
      };

      // 出すカードがワイルドとワイルドドロー4の時は変更する色を指定する
      if (
        playCard.type === "special" &&
        (playCard.special === Special.WILD ||
          playCard.special === Special.WILD_DRAW_4)
      ) {
        const color = selectChangeColor(); // 指定する色
        (data as any).color_of_wild = color;
      }

      // カードを出すイベントを実行
      sendEvent(SocketConst.EMIT.PLAY_CARD, data);
    } else {
      // 選出したカードが無かった時

      // カードを引くイベントを実行
      sendEvent(SocketConst.EMIT.DRAW_CARD, {}, (res: any) => {
        if (!res.can_play_draw_card) {
          // 引いたカードが場に出せないので処理を終了
          return;
        }

        // 以後、引いたカードが場に出せるときの処理
        const data = {
          is_play_card: true,
          yell_uno: cards.concat(res.draw_card).length === 2, // 残り手札数を考慮してUNOコールを宣言する
        };

        const playCard = res.draw_card[0]; // 引いたカード。draw-cardイベントのcallbackデータは引いたカードのリスト形式であるため、配列の先頭を指定する。
        // 引いたカードがワイルドとワイルドドロー4の時は変更する色を指定する
        if (
          playCard.special === Special.WILD ||
          playCard.special === Special.WILD_DRAW_4
        ) {
          const color = selectChangeColor();
          (data as any).color_of_wild = color;
        }

        // 引いたカードを出すイベントを実行
        sendEvent(SocketConst.EMIT.PLAY_DRAW_CARD, data);
      });
    }
  });
});

// カードが場に出た
addClientEventListener(SocketConst.EMIT.PLAY_CARD, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.PLAY_CARD, dataRes, () => {
    // UNO宣言を行った場合は記録する
    if (dataRes.yell_uno) {
      (unoDeclared as any)[dataRes.player] = true;
    }
  });
});

// 山札からカードを引いた
addClientEventListener(SocketConst.EMIT.DRAW_CARD, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.DRAW_CARD, dataRes, () => {
    // カードが増えているのでUNO宣言の状態をリセットする
    delete (unoDeclared as any)[dataRes.player];
  });
});

// 山札から引いたカードが場に出た
addClientEventListener(SocketConst.EMIT.PLAY_DRAW_CARD, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.PLAY_DRAW_CARD, dataRes, () => {
    // UNO宣言を行った場合は記録する
    if (dataRes.yell_uno) {
      (unoDeclared as any)[dataRes.player] = true;
    }
  });
});

// チャレンジの結果
addClientEventListener(SocketConst.EMIT.CHALLENGE, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.CHALLENGE, dataRes);
});

// チャレンジによる手札の公開
addClientEventListener(SocketConst.EMIT.PUBLIC_CARD, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.PUBLIC_CARD, dataRes);
});

// UNOコールを忘れていることを指摘
addClientEventListener(SocketConst.EMIT.POINTED_NOT_SAY_UNO, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.POINTED_NOT_SAY_UNO, dataRes);
});

// 対戦が終了
addClientEventListener(SocketConst.EMIT.FINISH_TURN, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.FINISH_TURN, dataRes, () => {
    // 新しい対戦が始まるのでUNO宣言の状態をリセットする
    unoDeclared = {};
  });
});

// 試合が終了
addClientEventListener(SocketConst.EMIT.FINISH_GAME, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.FINISH_GAME, dataRes);
});

// ペナルティ発生
addClientEventListener(SocketConst.EMIT.PENALTY, (dataRes: any) => {
  receiveEvent(SocketConst.EMIT.PENALTY, dataRes, () => {
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
  sendEvent(SocketConst.EMIT.JOIN_ROOM, data, (res: any) => {
    console.log(`join-room res: ${JSON.stringify(res)}`);
    id = res.your_id;
    console.log(`My id is ${id}`);
  });
}
