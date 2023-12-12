# algori-2023

ALGORI 2023 Source

> [!IMPORTANT]
> Discord で Asa に参加する旨を伝えてください！
> 記入必須な書類があるので、それを送ります

## 実行手順メモ

詳しいことはシステム仕様書を参照

1. Clone
2. Docker 入れる
3. ディーラーを起動

    ```bash
    cd dealer
    docker compose build
    docker compose up
    ```

4. 管理者ツールにアクセスして設定
   - <http://localhost:8080/api/v1/admin/web>
5. プレイヤーを起動
   - `Dealer 1`: 管理ツールで設定したディーラー名
   - `Player 1`: プレイヤー名を適宜入れる

    ```bash
    cd src
    docker build -t algori2023-player ./

    # Windows/Mac環境での実⾏
    docker run algori2023-player "http://host.docker.internal:8080" "Dealer 1" "Player 1"
    # Linux環境での実⾏
    docker run --add-host=host.docker.internal:host-gateway algori2023-player "http://host.docker.internal:8080" "Dealer 1" "Player 1"
    ```

6. 必要に応じてプレイヤーを追加する
   - しなくてもデモプレイヤーが追加されるらしい
   - するときはディーラー名を同じにして、プレイヤー名は違うものに変える
