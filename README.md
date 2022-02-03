# わーどる（Waadoru）

何度でも遊べる日本語版[Wordle](https://www.powerlanguage.co.uk/wordle/)です！

[**ここ**](https://skytomo221.github.io/waadoru/)からプレイできます。

## せつめい

Wordleは、テレビ番組[Lingo](https://en.wikipedia.org/wiki/Lingo_(British_game_show))に似たワードゲームです。

5文字の単語を6回以内に当てます。答えた後に毎回、文字が手がかりとしてさまざまな色で点灯します。緑は、この場所で文字が正しいことを意味します。黄色は、文字がお題の単語の _他の場所_ にあることを意味します。灰色は、文字がお題の単語にまったく含まれていないことを意味します。

日本語版Wordle「わーどる」は、日本語にローカライズするためにこれらにいくつかのルールを追加しました。詳しくは、ゲーム内の _遊び方_ をクリックします。

## れきし

2021年、Josh "powerlanguage" Wardleは、1日1回プレイできるLingoワードゲームのバージョンである _Wordle_ を作成しました。目標の単語は毎日誰もが同じで、結果をTwitterで共有したり、友達と比較したりできます。これにより、Wordleは2022年1月頃に[とても話題になりました](https://www.nytimes.com/2022/01/03/technology/wordle-word-game-creator.html)。

フォーク元のLynnさんはこのゲームが大好きでしたが、1日に2回以上プレイしたかったので、単語がランダムでありながら好きなだけプレイできる独自のバージョンを作成しました。Lynnさんはそれを _hello wordl_ と呼びました。これは一種の[悪いプログラミングジョーク](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program)です。

私はこれをフォークして日本語版を作りました。本家を忠実に再現したWordleはすでに存在しましたが、6回以内にひらがなで答えるゲームが作りたかったので、ルールを追加して、日本語でもいい塩梅でプレイできるように改良しました。「わーどる」はそのまま _Wordl_ を日本語にしました。なぜなら、どちらも適切にスワップ（`.replace(/(.*)(.)(.)$/, '$1$3$2')`）すれば「わーるど（ _World_ ）」になるからです。

## しかし、1日1回プレイすることがポイントです！

誤解しないでください。私も、これがWordleの最も優れた側面だと思います。また、「本物の」ゲームを廃止したり、改善したりすることは目指していません。

## 本家に忠実なルールで遊びたいです！

ひらがなで本家に忠実なルールで遊びたい場合は
[WORDLE ja](https://aseruneko.github.io/WORDLEja/)、
ローマ字で本家に忠実なルールで遊びたい場合は
[Wordle-jp](https://wordle-jp.netlify.app/)をプレイしてください。

## 私の言葉には同じ文字が2つ含まれていました！

これは本家Wordleでも発生する可能性があり、本家Wordleとまったく同じ方法で手がかりを与えます。二つの同じ文字をなくすとゲームが楽になりすぎると思うので、やめます。

## 単語はどこから来ていますか？

お題の単語は[JMdict-EDICT Dictionary Project](http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)から取得しています。
これらの単語は[skytomo221/japanese-common-words](https://github.com/skytomo221/japanese-common-words)から簡単に取得できます。

推測を確認するために、[MeCab](https://github.com/taku910/mecab)に同封されている[IPAdic](https://github.com/taku910/mecab/tree/master/mecab-ipadic)と[mecab-ipadic-NEologd](https://github.com/neologd/mecab-ipadic-neologd)を使用しています。

お題の単語は、名詞、形容詞及び動詞が含まれています。
外来語も含まれています。
固有名詞や代名詞、副詞は基本的に含まれていませんが、たまに含まれていることがあるのでご了承ください。
活用語は、すべて終止形です。

## For developers

You're very welcome to create your own Wordle offshoot/remix based on _hello wordl_. To get started, you can [fork the code](https://docs.github.com/en/get-started/quickstart/fork-a-repo) on GitHub.

To run the code locally, first install [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm). Then, in this directory, open a terminal and run `npm install` followed by `npm run start`. _hello wordl_ will be running at http://localhost:3000/. Any changes you make to the source code will be reflected there. Have fun!

Finally, `npm run deploy` will deploy your code to the `gh-pages` branch of your fork, so that everyone can play your version at https://yourname.github.io/hello-wordl (or the name of your fork if you renamed it). 
