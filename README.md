# WordPress boilerplate
VCCW を使って WordPress ローカル開発環境を構築しています。   
http://vccw.cc/

※ コマンドは特に注釈がない限り、プロジェクトのルートディレクトリで実行しているものとします。

## 環境構築

### site.ymlの編集

1. hostnameに開発で使いたいドメインを設定する.（ `サービス名.test` などがベター. ）
2. admin_userとadmin_passにそれぞれユーザー名、パスワードを設定する。サーバーと同期する際、すべて同じ設定になるのでパスワードはなるべく強力な方が良い.

### プロジェクトのセットアップ

```
$ make setup
```


## フロントエンド開発

### Webサーバーの立ち上げ.
以下のコマンドを実行すると、 `localhost:8080` でWebサーバーが立ち上がります。   

```bash
$yarn start
```

or

```bash
$make run
```

終了したい際は `Ctrl + C` と入力してください。

### ビルド

```bash
$yarn start
```

or

```bash
$make run
```

稀に自動で終了しない時があるので、その際はビルドの完了を確認した後に `Ctrl + C` と入力してください。

## CSS
作業ディレクトリ: `web/src/styles`   
   
エントリーポイントを `index.scss` とし、そこに様々なscssファイルがインポートされることを想定しています。   
デフォルトで、 [sanitize.css](http://jonathantneal.github.io/sanitize.css/) がimportされていますが、用途に合わせてreset.cssに変えるなりしても良いと思います。（どのreset.cssを使うかというルール決めをするのも良いかもしれません）
CSSライブラリですが、 `yarn` で追加したものをimportするのがcleanで良いかと思われます.


### ディレクトリ構成
基本的な構成は以下のようになります。   
以下のディレクトリで十分まかなえるはずなので、不用意にディレクトリを新しく切ることはあまりおすすめしません。

#### base
プロジェクトのベースとなるscssをここに配置します。

* `_variable.scss` : 変数の宣言を行うファイルです。
* `_font.scss` : フォントファミリーの定義を行うファイルです。加えて、フォントファミリー関係の変数はここにまとめておくと、わかり良いかも知れません。
* `_mixin.scss` : mixinの定義を行うファイルです。
* `_function.scss` : functionの定義を行うファイルです。
* `_base.scss` : html, body, aなどプリミティブなタグにおいての基本的なstyle定義を行うファイルです。

#### components
component単位に分割されたscssファイルを配置する.

#### pages
page固有のstyleが定義されたscssファイルを配置する.

#### vendor
npmにないようなライブラリ、パッケージはここに入れて下さい。そして、index.scssでここからrequireして下さい。


### Prettier
整形ツールとして [CSScomb](http://csscomb.com) を採用しています。基本的なruleのみ記述しています。  
sort-orderは社内ルールが決まり次第書いていきましょう.

#### 参考記事
[【Grunt】csscombでソートだけでなくインデントなどのフォーマットも整形する \| バシャログ。](http://bashalog.c-brains.jp/14/12/01-202258.php)
[CSSCombのAtomプラグイン \- EagleLand](https://1000ch.net/posts/2015/atom-csscomb.html)


## JavaScript
作業ディレクトリ: `web/src/scripts`   
    
`index.js` をエントリーポイントとします。
パッケージは基本的に `yarn` で入れられるパッケージはyarnでaddした上で、require or importすることを推奨します。   
このboilerplateでは実際に、 `jQuery` をその方法でrequireしていますので、`index.js` を参考にしてみて下さい.   

また、webpackのbuild軽量化のために、外部ライブラリはdllとしてコンパイルされるようになっています。
ライブラリの追加時は、 `webpack.dll.config` の `vendor` にpluginを追加した上で、 `make rebuild-scripts-dll` を実行してください.

### ディレクトリ構成

#### components
機能毎のパーツをclassで切り出して作成し、ここに配置します.

#### helpers
各ページにまたがって使うようなhelperクラス、関数をここに配置します.

#### vendor
npmにないようなライブラリ、パッケージはここに入れて下さい。そして、必要なページでここからrequireして下さい。


## WordPress環境の起動
WPサーバーを起動するには以下のコマンドを実行して下さい。
```
$ make run
```

実行後、WPサーバーへのアクセスURL [http://192.168.33.10/](http://192.168.33.10/) が自動的に開かれます。

## WordPress環境のシャットダウン
WPサーバーを安全にシャットダウンするには以下のコマンドを実行して下さい。
```
$ make down
```

## DB の export/import
ローカル環境で投稿したりプラグインを追加したり、などDBへの変更を行った場合は必ず以下の手順でDBをexportしてsqlファイルを共有しましょう。

```
# DBのexport
$ make db_export
# DBのimport
$ make db_import
```

## デプロイ
デプロイ用のコマンドは以下です.

```bash
# stgにthemeをpushする.
$ make push_stg_theme

# stgにdbをpushする.
$ make push_stg_db

# stgに全てpushする.
$ make push_stg_all

# proにthemeをpushする.
$ make push_pro_theme

# proにdbをpushする.
$ make push_pro_db

# proに全てpushする.
$ make push_pro_all
```

## ドキュメント情報
更新日: 2018/8/17   
記述者: 岩本 大樹 iwamoto@cshool.jp
