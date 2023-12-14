// Socket 関係

import { connect } from "socket.io-client";

let client: SocketIOClient.Socket;
let isClientInitialized = false;
const clientEventQueued = new Map<string, CallableFunction[]>();

export function initializeClient(host: string) {
  client = connect(host, {
    transports: ["websocket"],
  });
  client.connect();

  client.on("connect", () => {
    console.log("Client connect successfully!");
  });

  client.on("disconnect", (dataRes: string) => {
    console.log("Client disconnect.");
    console.log(dataRes);
    process.exit();
  });

  for (const [event, callbacks] of clientEventQueued) {
    for (const callback of callbacks) {
      client.on(event, callback);
    }
  }

  isClientInitialized = true;
}

export function addClientEventListener(
  event: string,
  callback: CallableFunction
) {
  if (isClientInitialized) {
    client.on(event, callback);
  }

  if (!clientEventQueued.has(event)) {
    clientEventQueued.set(event, []);
  }
  clientEventQueued.get(event)?.push(callback);
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
