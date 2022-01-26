import { Clue } from "./clue";
import { Row, RowState } from "./Row";
import { maxGuesses } from "./util";

export function About() {
  return (
    <div className="App-about">
      <p>
        <i>Waadoru</i>
        は、単語当てゲーム
        <a href="https://www.powerlanguage.co.uk/wordle/">
          <i>Wordle</i>
        </a>
        の日本語版です。
        <a href="https://www.powerlanguage.co.uk/wordle/">
          <i>Wordle</i>
        </a>
        は、
        <a href="https://twitter.com/powerlanguish">powerlanguage</a>
        さんが作成したゲームで、これはそのリメイク版です。また、このゲームは、
        <a href="https://twitter.com/chordbug">Lynn</a>さんの作成した
        <a href="https://hellowordl.net">
          <i>Hello Wordl</i>
        </a>
        からフォークして作りました。
        日本語へローカライズするために、
        オリジナルのゲームにいくつかのルールを加えています。
        それが<i>Waadoru</i>と<i>日本語版Wordle</i>の違いです。
      </p>
      <p>
        お題の単語は{maxGuesses}回までに当てます。
        <br />
        単語を推測すると、それに対してヒントが与えられます。
      </p>
      <hr />
      <Row
        rowState={RowState.LockedIn}
        wordLength={8}
        cluedLetters={[
          { clue: Clue.Absent, letter: "に" },
          { clue: Clue.Absent, letter: "ほ" },
          { clue: Clue.Correct, letter: "ん" },
          { clue: Clue.Almost, letter: "ご" },
          { clue: Clue.CorrectVowel, letter: "わ" },
          { clue: Clue.Elsewhere, letter: "ー" },
          { clue: Clue.CorrectConsonant, letter: "ど" },
          { clue: Clue.CorrectConsonantAndElsewhere, letter: "る" },
        ]}
      />
      <p>
        <b>に</b> と <b>ほ</b> はお題の単語に含まれていません。
      </p>
      <p>
        <b className="green-bg">ん</b> は合っています！3番目の文字は{" "}
        <b className="green-bg">ん</b>
        です。
        <br />
        <strong>
          （しかし、単語の中に「ん」が2回以上現れることもあります。）
        </strong>
      </p>
      <p>
        <b className="purple-bg">ご</b>はとても惜しいです。
        4番目の文字は濁音ではなく、清音か半濁音または小書き文字であることを示しています。
      </p>
      <p>
        <b className="gray-green-bg">わ</b>はお題の単語に含まれていません。
        <br />
        しかし、5番目の文字はあ段でありわ行ではありません。
        <br />
        <strong>（右下の緑は母音が一致していることを表します。）</strong>
      </p>
      <p>
        <b className="yellow-bg">ー</b>はお題の単語の他の場所にあります。
        <br />
        <strong>（2回以上現れることもあります。🤔）</strong>
      </p>
      <p>
        <b className="green-gray-bg">ど</b>はお題の単語に含まれていません。
        <br />
        しかし、7番目の文字はた行でありお段ではありません。
        <br />
        <strong>（左上の緑は子音が一致していることを表します。）</strong>
      </p>
      <p>
        <b className="green-yellow-bg">る</b>はお題の単語の他の場所にあります。
        <br />
        そして、8番目の文字はら行でありう段ではありません。
        <br />
      </p>
      <hr />
      <p>具体的にはこんな感じです：</p>
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.CorrectVowel, letter: "さ" },
          { clue: Clue.Absent, letter: "よ" },
          { clue: Clue.Elsewhere, letter: "う" },
          { clue: Clue.Absent, letter: "な" },
          { clue: Clue.Absent, letter: "ら" },
        ]}
        annotation={"ふむふむ"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.CorrectVowel, letter: "な" },
          { clue: Clue.Absent, letter: "ん" },
          { clue: Clue.CorrectVowel, letter: "ち" },
          { clue: Clue.CorrectConsonant, letter: "ゅ" },
          { clue: Clue.Correct, letter: "う" },
        ]}
        annotation={"おっ"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.Correct, letter: "か" },
          { clue: Clue.Correct, letter: "い" },
          { clue: Clue.CorrectVowel, letter: "ぎ" },
          { clue: Clue.Correct, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
        ]}
        annotation={"近い！"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.Correct, letter: "か" },
          { clue: Clue.Correct, letter: "い" },
          { clue: Clue.Almost, letter: "し" },
          { clue: Clue.Correct, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
        ]}
        annotation={"惜しい！"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.Correct, letter: "か" },
          { clue: Clue.Correct, letter: "い" },
          { clue: Clue.Correct, letter: "じ" },
          { clue: Clue.Correct, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
        ]}
        annotation={"やったね！"}
      />
      <p>
        問題やバグが発生した場合は
        <a href="https://github.com/skytomo221/waadoru/issues">ここ</a>
        から報告するか、Twitterで
        <a href="https://twitter.com/skytomo221">@skytomo221</a>
        にご連絡ください。
      </p>
      <p>
        このゲームはこれからも無料で広告表示もありませんが、
        <br />
        望めば
        <a href="https://ko-fi.com/skytomo">私にコーヒーを一杯おごる</a>
        こともできます。
      </p>
    </div>
  );
}
