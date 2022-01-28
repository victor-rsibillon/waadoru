import { useEffect, useRef, useState } from "react";
import { Row, RowState } from "./Row";
import { Clue, clue, describeClue, violation } from "./clue";
import { Keyboard } from "./Keyboard";
import targetList from "./targets.json";
import {
  dictionarySet,
  Difficulty,
  isKogaki,
  isVoiced,
  pick,
  resetRng,
  seed,
  speak,
  toHiraganaKeepLongVowelMark,
  toKogaki,
  toSeion,
  urlParam,
} from "./util";
import { decode, encode } from "./base64";
import { toRomaji } from "wanakana";

enum GameState {
  Playing,
  Won,
  Lost,
}

interface GameProps {
  maxGuesses: number;
  hidden: boolean;
  difficulty: Difficulty;
}

const targets = targetList.map((word) => toHiraganaKeepLongVowelMark(word));
//.filter((word) => dictionary.includes(word)); // .slice(0, targetList.indexOf("murky") + 1); // Words no rarer than this one
const minWordLength = 3;
const maxWordLength = 10;

function randomTarget(wordLength: number): string {
  const eligible = targets.filter((word) => word.length === wordLength);
  let candidate: string;
  do {
    candidate = pick(eligible);
  } while (/\*/.test(candidate));
  return candidate;
}

function getChallengeUrl(target: string): string {
  return (
    window.location.origin +
    window.location.pathname +
    "?challenge=" +
    encode(toRomaji(target))
  );
}

let initChallenge = "";
let challengeError = false;
try {
  initChallenge = toHiraganaKeepLongVowelMark(decode(urlParam("challenge") ?? ""));
} catch (e) {
  console.warn(e);
  challengeError = true;
}
if (initChallenge && !dictionarySet.has(initChallenge)) {
  initChallenge = "";
  challengeError = true;
}

function Game(props: GameProps) {
  const [gameState, setGameState] = useState(GameState.Playing);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [hint, setHint] = useState<string>(
    challengeError
      ? `招待リンクが無効です。ランダムモードをプレイします。`
      : `あなたの推測を入力してください！`
  );
  const [challenge, setChallenge] = useState<string>(initChallenge);
  const [wordLength, setWordLength] = useState(
    challenge ? challenge.length : 5
  );
  const [target, setTarget] = useState(() => {
    resetRng();
    return challenge || randomTarget(wordLength);
  });
  const [gameNumber, setGameNumber] = useState(1);
  const tableRef = useRef<HTMLTableElement>(null);
  const startNextGame = () => {
    if (challenge) {
      // Clear the URL parameters:
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setChallenge("");
    const newWordLength =
      wordLength < minWordLength || wordLength > maxWordLength ? 5 : wordLength;
    setWordLength(newWordLength);
    setTarget(randomTarget(newWordLength));
    setGuesses([]);
    setCurrentGuess("");
    setHint("");
    setGameState(GameState.Playing);
    setGameNumber((x) => x + 1);
  };

  async function share(
    url: string,
    copiedHint: string,
    firstText?: string,
    secondText?: string
  ) {
    const body =
      (firstText ? firstText + "\n" : "") +
      url +
      (secondText ? "\n\n" + secondText : "");
    if (
      /android|iphone|ipad|ipod|webos/i.test(navigator.userAgent) &&
      !/firefox/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({ text: body });
        return;
      } catch (e) {
        console.warn("navigator.share failed:", e);
      }
    }
    try {
      await navigator.clipboard.writeText(body);
      setHint(copiedHint);
      return;
    } catch (e) {
      console.warn("navigator.clipboard.writeText failed:", e);
    }
    setHint(url);
  }

  const onKey = (key: string) => {
    if (gameState !== GameState.Playing) {
      if (key === "確定" || key === "Enter") {
        startNextGame();
      }
      return;
    }
    if (guesses.length === props.maxGuesses) return;
    if (key === "大/小") {
      key = toKogaki(key);
    }
    if (/^[a-zあ-ん]$/i.test(key)) {
      setCurrentGuess((guess) => {
        const newGuess = guess + key.toLowerCase();
        return (
          !/n$/i.test(guess) && key.toLowerCase() === "n"
            ? newGuess
            : toHiraganaKeepLongVowelMark(newGuess.replace("nn", "n"))
        ).slice(0, wordLength);
      });
      tableRef.current?.focus();
      setHint("");
    } else if (key === "゛") {
      const letter = currentGuess.slice(-1);
      const mark = "\u{3099}";
      const key = isVoiced(letter)
        ? toSeion(letter)
        : (toSeion(letter) + mark).normalize().replace(mark, "");
      setCurrentGuess((guess) =>
        (guess.slice(0, -1) + key).slice(0, wordLength)
      );
    } else if (key === "゜") {
      const letter = currentGuess.slice(-1);
      const mark = "\u{309A}";
      const key = isVoiced(letter)
        ? toSeion(letter)
        : (toSeion(letter) + mark).normalize().replace(mark, "");
      setCurrentGuess((guess) =>
        (guess.slice(0, -1) + key).slice(0, wordLength)
      );
    } else if (key === "大/小") {
      const letter = currentGuess.slice(-1);
      const key = isKogaki(letter) ? toSeion(letter) : toKogaki(letter);
      setCurrentGuess((guess) =>
        (guess.slice(0, -1) + key).slice(0, wordLength)
      );
      setHint("");
    } else if (key === "長音" || key === "-") {
      setCurrentGuess((guess) => (guess + "ー").slice(0, wordLength));
      setHint("");
    } else if (key === "Backspace") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      setHint("");
    } else if (key === "確定" || key === "Enter") {
      if (currentGuess.length !== wordLength) {
        setHint("短すぎます");
        return;
      }
      if (!dictionarySet.has(currentGuess)) {
        if (/^(.)\1+$/g.test(currentGuess)) {
          if (guesses.length === 0)
            setHint(
              "お疲れですか？こんなゲームなんかやめて、散歩でもしましょう"
            );
          else {
            setHint(`${currentGuess}！難しいですが、頑張ってください！`);
          }
        } else {
          setHint("有効な単語ではありません");
        }
        return;
      }
      for (const g of guesses) {
        const c = clue(g, target);
        const feedback = violation(props.difficulty, c, currentGuess);
        if (feedback) {
          setHint(feedback);
          return;
        }
      }
      setGuesses((guesses) => guesses.concat([currentGuess]));
      setCurrentGuess((guess) => "");

      const gameOver = (verbed: string) =>
        `あなたの${verbed}！正解は「${target.toUpperCase()}」です。（確定で${
          challenge ? "ランダムモードで遊ぶ" : "再び遊ぶ"
        })`;

      if (currentGuess === target) {
        setHint(gameOver("勝ち"));
        setGameState(GameState.Won);
      } else if (guesses.length + 1 === props.maxGuesses) {
        setHint(gameOver("負け"));
        setGameState(GameState.Lost);
      } else {
        setHint("");
        speak(describeClue(clue(currentGuess, target)));
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        onKey(e.key);
      }
      if (e.key === "Backspace") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentGuess, gameState]);

  let letterInfo = new Map<string, Clue>();
  const tableRows = Array(props.maxGuesses)
    .fill(undefined)
    .map((_, i) => {
      const guess = [...guesses, currentGuess][i] ?? "";
      const cluedLetters = clue(guess, target);
      const lockedIn = i < guesses.length;
      if (lockedIn) {
        for (const { clue, letter } of cluedLetters) {
          if (clue === undefined) break;
          const old = letterInfo.get(letter);
          if (old === undefined || clue > old) {
            letterInfo.set(letter, clue);
          }
        }
      }
      return (
        <Row
          key={i}
          wordLength={wordLength}
          rowState={
            lockedIn
              ? RowState.LockedIn
              : i === guesses.length
              ? RowState.Editing
              : RowState.Pending
          }
          cluedLetters={cluedLetters}
        />
      );
    });

  return (
    <div className="Game" style={{ display: props.hidden ? "none" : "block" }}>
      <div className="Game-options">
        <label htmlFor="wordLength">単語の文字数：</label>
        <input
          type="range"
          min={minWordLength}
          max={maxWordLength}
          id="wordLength"
          disabled={
            gameState === GameState.Playing &&
            (guesses.length > 0 || currentGuess !== "" || challenge !== "")
          }
          value={wordLength}
          onChange={(e) => {
            const length = Number(e.target.value);
            resetRng();
            setGameNumber(1);
            setGameState(GameState.Playing);
            setGuesses([]);
            setCurrentGuess("");
            setTarget(randomTarget(length));
            setWordLength(length);
            setHint(`${length} 文字`);
          }}
        ></input>
        <button
          style={{ flex: "0 0 auto" }}
          disabled={gameState !== GameState.Playing || guesses.length === 0}
          onClick={() => {
            setHint(
              `答えは「${target.toUpperCase()}」でした。（確定で再挑戦）`
            );
            setGameState(GameState.Lost);
            (document.activeElement as HTMLElement)?.blur();
          }}
        >
          諦める
        </button>
      </div>
      <table
        className="Game-rows"
        tabIndex={0}
        aria-label="Table of guesses"
        ref={tableRef}
      >
        <tbody>{tableRows}</tbody>
      </table>
      <p
        role="alert"
        style={{
          userSelect: /https?:/.test(hint) ? "text" : "none",
          whiteSpace: "pre-wrap",
        }}
      >
        {hint || `\u00a0`}
      </p>
      <Keyboard
        letterInfo={letterInfo}
        guesses={guesses
          .map((g) => clue(g, target))
          .map((c) => {
            const length = currentGuess.replace(/\w/g, "").length;
            return c[length <= maxWordLength ? length : length - 1];
          })}
        onKey={onKey}
      />
      {gameState !== GameState.Playing && (
        <p>
          <button
            onClick={() => {
              share(
                getChallengeUrl(target),
                "共有リンクをクリップボードにコピーしました！"
              );
            }}
          >
            この単語を友達にチャレンジさせる
          </button>{" "}
          <button
            onClick={() => {
              share(
                getChallengeUrl(target),
                "結果をクリップボードにコピーしました！",
                "Wordle 🇯🇵 わーどる（Waadoru）",
                guesses
                  .map((guess) =>
                    clue(guess, target)
                      .map(
                        (c) =>
                          ["⬛", "🟡", "🟥", "🟦", "🔴", "🔵", "🟪", "🟩"][
                            c.clue ?? 0
                          ]
                      )
                      .join("")
                  )
                  .join("\n")
              );
            }}
          >
            絵文字で結果をシェアする
          </button>
        </p>
      )}
      {challenge ? (
        <div className="Game-seed-info">playing a challenge game</div>
      ) : seed ? (
        <div className="Game-seed-info">
          シード値：{seed}，単語の長さ：{wordLength}，ゲーム番号：{gameNumber}
        </div>
      ) : undefined}
    </div>
  );
}

export default Game;
