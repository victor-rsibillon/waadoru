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
        からフォークして作りました。 日本語へローカライズするために、
        オリジナルのゲームにいくつかのルールを加えています。
      </p>
      <p>
        お題の単語は{maxGuesses}回以内に当てます。
        <br />
        単語を推測すると、それに対してヒントが与えられます。
      </p>
      <hr />
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Almost, letter: "し" },
          { clue: Clue.CorrectConsonant, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
          { clue: Clue.CorrectVowelAndElsewhere, letter: "ち" },
          { clue: Clue.Absent, letter: "く" },
          { clue: Clue.CorrectVowel, letter: "ば" },
          { clue: Clue.Elsewhere, letter: "い" },
        ]}
      />
      <p>
        <b>く</b>はお題の単語に含まれていません。
      </p>
      <p>
        <b className="green-bg">う</b>は合っています！3番目の文字は
        <b className="green-bg">う</b>です。
        <br />
        <strong>
          （しかし、単語の中に「う」が2回以上現れることもあります。）
        </strong>
      </p>
      <p>
        <b className="purple-bg">し</b>はとても惜しいです。
        <br />
        1番目の文字は清音ではなく、
        <br />
        濁音か半濁音または小書き文字であることを示しています。
      </p>
      <p>
        <b className="yellow-bg">ー</b>はお題の単語の他の場所にあります。
        <br />
        <strong>（2回以上現れることもあります。🤔）</strong>
      </p>
      <p>
        <b className="gray-green-bg">ば</b>は、
        <b className="gray-bg">ば</b>と
        <b className="black-green-bg">ば</b>の組み合わせです。
        <br />
        <b className="black-green-bg">　</b>は母音が一致していることを表します。
        <br />
        つまり「ば」はお題の単語に含まれていませんが、
        <br />
        6番目の文字はば行ではないあ段の文字です。
      </p>
      <p>
        <b className="green-gray-bg">ょ</b>は、
        <b className="gray-bg">ょ</b>と
        <b className="green-black-bg">ょ</b>の組み合わせです。
        <br />
        <b className="green-black-bg">　</b>は子音が一致していることを表します。
        <br />
        つまり「ょ」はお題の単語に含まれていませんが、
        <br />
        2番目の文字はお段ではないや行の文字です。
      </p>
      <p>
        <b className="green-yellow-bg">ち</b>は、
        <b className="yellow-bg">ち</b>と
        <b className="green-black-bg">ち</b>の組み合わせです。
        <br />
        つまり「ち」はお題の単語の他の場所にありますが、
        <br />
        4番目の文字はい段ではないた行の文字です。
      </p>
      <hr />
      <p>難しい場合は次のように適当な単語を入れるのも一つのコツです：</p>
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Almost, letter: "し" },
          { clue: Clue.CorrectConsonant, letter: "ょ" },
          { clue: Clue.Correct, letter: "う" },
          { clue: Clue.CorrectVowelAndElsewhere, letter: "ち" },
          { clue: Clue.Absent, letter: "く" },
          { clue: Clue.CorrectVowel, letter: "ば" },
          { clue: Clue.Elsewhere, letter: "い" },
        ]}
        annotation={"難しい……"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Correct, letter: "じ" },
          { clue: Clue.Correct, letter: "ゅ" },
          { clue: Clue.Correct, letter: "う" },
          { clue: Clue.CorrectVowel, letter: "き" },
          { clue: Clue.Absent, letter: "ん" },
          { clue: Clue.Absent, letter: "ぞ" },
          { clue: Clue.CorrectVowel, letter: "く" },
        ]}
        annotation={"適当な推測"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={7}
        cluedLetters={[
          { clue: Clue.Correct, letter: "じ" },
          { clue: Clue.Correct, letter: "ゅ" },
          { clue: Clue.Correct, letter: "う" },
          { clue: Clue.Correct, letter: "い" },
          { clue: Clue.Correct, letter: "ち" },
          { clue: Clue.Correct, letter: "が" },
          { clue: Clue.Correct, letter: "つ" },
        ]}
        annotation={"わかった！"}
      />
      <p>他の例も見てみましょう：</p>
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
