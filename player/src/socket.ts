// Socket 関係

import { connect } from "socket.io-client";

export let client: SocketIOClient.Socket;

export function initializeClient(host: string) {
  client = connect(host, {
    transports: ["websocket"],
  });
}

/**
 * 送信イベント共通処理
 * @param event Socket通信イベント名
 * @param data 送信するデータ
 * @param callback 個別処理
 */
export function sendEvent(event: any, data: any, callback?: CallableFunction) {
  console.log(`Send ${event} event.`);
  console.log(`req_data: ${JSON.stringify(data)}`);

  client.emit(event, data, (err: any, res: any) => {
    if (err) {
      // エラーをキャッチした場合ログを記録
      console.log(`Client ${event} failed!`);
      console.error(err);
      return;
    }

    console.log(`Client ${event} successfully!`);
    console.log(`res_data: ${JSON.stringify(res)}`);

    if (callback) {
      callback(res);
    }
  });
}

/**
 * 受信イベント共通処理
 * @param event Socket通信イベント名
 * @param data 受信するデータ
 * @param callback 個別処理
 */
export function receiveEvent(
  event: any,
  data: any,
  callback?: CallableFunction
) {
  console.log(`Receive ${event} event.`);
  console.log(`res_data: ${JSON.stringify(data)}`);

  // 個別処理の指定がある場合は実行する
  if (callback) {
    callback();
  }
}
