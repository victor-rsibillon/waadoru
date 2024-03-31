import { Clue } from "./clue";
import { Row, RowState } from "./Row";
import { maxGuesses } from "./util";

export function About() {
  return (
    <div className="App-about">
      <p>
        <i>Waadoru</i> is a Japanese adaptation of a word-guessing game called <a href="https://www.powerlanguage.co.uk/wordle/">
          <i>Wordle</i>
        </a>.
      </p>
      <p>
        You must guess a target word in {maxGuesses} tries or less.
        <br />
        With each try, you will get some hints about that target word.
      </p>
      <hr />
      <p>
        <h2>The Japanese Kana Table</h2>
        <table className="kana-table">
          <th colSpan={17}>
            <b className="green-black-bg">　</b> ⬇️Columns⬇️
          </th>
          <th></th>
          <tr>
            <th rowSpan={6} className="border-none"></th>
            <th rowSpan={5} className="border-none"></th>
            <th>ぱ</th>
            <th>ば</th>
            <th>だ</th>
            <th>ざ</th>
            <th>が</th>
            <th>わ</th>
            <th>ら</th>
            <th>やゃ</th>
            <th>ま</th>
            <th>は</th>
            <th>な</th>
            <th>た</th>
            <th>さ</th>
            <th>か</th>
            <th>あぁ</th>
            <th rowSpan={7}>
              ⬅️
              Rows
              ⬅️
              <br />
              <b className="black-green-bg">　</b>
            </th>
          </tr>
          <tr>
            <td>ぴ</td>
            <td>び</td>
            <td>ぢ</td>
            <td>じ</td>
            <td>ぎ</td>
            <td>ゐ</td>
            <td>り</td>
            <td></td>
            <td>み</td>
            <td>ひ</td>
            <td>に</td>
            <td>ち</td>
            <td>し</td>
            <td>き</td>
            <th>いぃ</th>
          </tr>
          <tr>
            <td>ぷ</td>
            <td>ぶ</td>
            <td>づ</td>
            <td>ず</td>
            <td>ぐ</td>
            <td></td>
            <td>る</td>
            <td>ゆゅ</td>
            <td>む</td>
            <td>ふ</td>
            <td>ぬ</td>
            <td>つっ</td>
            <td>す</td>
            <td>く</td>
            <th>うぅ</th>
          </tr>
          <tr>
            <td>ぺ</td>
            <td>べ</td>
            <td>で</td>
            <td>ぜ</td>
            <td>げ</td>
            <td>ゑ</td>
            <td>れ</td>
            <td></td>
            <td>め</td>
            <td>へ</td>
            <td>ね</td>
            <td>て</td>
            <td>せ</td>
            <td>け</td>
            <th>えぇ</th>
          </tr>
          <tr>
            <td>ぽ</td>
            <td>ぼ</td>
            <td>ど</td>
            <td>ぞ</td>
            <td>ご</td>
            <td>を</td>
            <td>ろ</td>
            <td>よょ</td>
            <td>も</td>
            <td>ほ</td>
            <td>の</td>
            <td>と</td>
            <td>そ</td>
            <td>こ</td>
            <th>おぉ</th>
          </tr>
          <tr>
            <th>ん</th>
            <td colSpan={15} className="border-none"></td>
          </tr>
          <tr>
            <th>ー</th>
            <td colSpan={16} className="border-none"></td>
          </tr>
        </table>
      </p>
      <p>
        Each column corresponds to a particular consonant.
        For example the "K" column with「か」「き」「く」「け」「こ」.
        Note that the diacritics and (e.g., ば or ぱ) are in the same column as the kana they are based on (e.g., は),
        but they are considered separate characters for the game.
      </p>
      <p>
        Each row corresponds to a particular vowel.
        For example the "I" row with「い」「き」「し」「ち」「に」「ひ」「み」「り」「ゐ」「ぎ」「じ」「ぢ」「び」「ぴ」.
      </p>
      <p>
        「ん」and「ー」are considered separate from all the rows and columns.
      </p>
      <hr />
      <h2>Rules</h2>
      <p>
        <b className="green-bg">　</b>（🟩 emoji） means a kana matched with the target word.
      </p>
      <p>
        <b className="purple-bg">　</b>
        （🟪 emoji） means that the diacritic (e.g. は/ば/ぱ) or the size (e.g. う/ぅ) is incorrect.
      </p>
      <p>
        <b className="gray-bg">　</b>
        （⬛ emoji） means that the kana is not found at all in the target word.
      </p>
      <p>
        <b className="green-gray-bg">　</b>
        （🟦 emoji） means that the column is correct.
      </p>
      <p>
        <b className="gray-green-bg">　</b>
        （🟥 emoji） means that the row is correct.
      </p>
      <p>
        <b className="yellow-bg">　</b>
        （🟡 emoji） means that the kana is present somewhere else in the target word.
      </p>
      <p>
        <b className="green-yellow-bg">　</b>
        （🔵 emoji）means the combination of both <b className="yellow-bg">　</b> and 
        <b className="green-black-bg">　</b>.
      </p>
      <p>
        <b className="yellow-green-bg">　</b>
        （🔴 emoji） means the combination of both <b className="yellow-bg">　</b> and
        <b className="black-green-bg">　</b>.
      </p>
      <hr />
      <Row
          romajiMode={false}
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
        <b>く</b> is not in the target word at all.
      </p>
      <p>
        <b className="green-bg">う</b> is correct! The 3rd kana is <b className="green-bg">う</b>.
        <br />
        <strong>
          (but beware,「う」may also be somewhere else!)
        </strong>
      </p>
      <p>
        <b className="purple-bg">し</b> is almost correct.
        <br />
        The diacritic or size is not good, so the correct kana has to be 「じ」.
      </p>
      <p>
        <b className="yellow-bg">ー</b> is somewhere else in the target word.
        <br />
        <strong>(at least once, but could be more of them 🤔）</strong>
      </p>
      <p>
        <b className="gray-green-bg">ば</b> means both <b className="gray-bg">ば</b> and <b className="black-green-bg">ば</b>.
        <br />
        <b className="black-green-bg">　</b> means that the correct kana is in the same line.
        <br />
        In other words, there is no「ば」here or anywhere else in the target word,
        <br />
        and that next-to-last kana contains the vowel "A".
      </p>
      <p>
        <b className="green-gray-bg">ょ</b> means both <b className="gray-bg">ょ</b> and <b className="green-black-bg">ょ</b>.
        <br />
        <b className="green-black-bg">　</b> means that the correct kana is in the same column.
        <br />
        In other words, there is no「ょ」here or anywhere else in the target word,
        <br />
        and that second kana contains the consonant "Y" (「や」, 「ゆ」)
      </p>
      <p>
        <b className="green-yellow-bg">ち</b> means both <b className="yellow-bg">ち</b> and <b className="green-black-bg">ち</b>.
        <br />
        In others words, there is at least one「ち」somewhere else in the target word,
        <br />
        and that 4th kana contains the consonant "T" (「た」, 「つ」...)
      </p>
      <hr />
      <p>
        If you have a question about the rules or my translation, please open a ticket <a href="https://github.com/itsupera/waadoru/issues">here</a>.
        For a technical issue ask skytomo221 (the original author) <a href="https://github.com/skytomo221/waadoru/issues">here</a>
      </p>
      <p>
        If you like the game, please <a href="https://ko-fi.com/skytomo">donate to skytomo</a> (not me!).
        <br/>
        He is the author of the Japanese adaptation and deserve the credits :)
        <br/>
        <br/>
        I (<a href="https://github.com/itsupera">itsupera</a>) only made so minor tweaks and translated to English.
      </p>
    </div>
  );
}
