import { useEffect, useRef, useState } from "react";
import { Row, RowState } from "./Row";
import { Clue, clue, describeClue, violation } from "./clue";
import { Keyboard } from "./Keyboard";
import targetListN5 from "./targets_N5.json";
import targetListN4 from "./targets_N4.json";
import targetListN3 from "./targets_N3.json";
import targetListN2 from "./targets_N2.json";
import targetListN1 from "./targets_N1.json";
import targetListNetflix from "./targets_netflix_95.json";
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
  vocabLevelNames,
} from "./util";
import { decode, encode } from "./base64";
import { toRomaji } from "wanakana";
import { cheer } from "./cheer";

enum GameState {
  Playing,
  Won,
  Lost,
}

interface GameProps {
  maxGuesses: number;
  hidden: boolean;
  difficulty: Difficulty;
  colorBlind: boolean;
  keyboardLayout: string;
}

const targets = [targetListN5, targetListN4, targetListN3, targetListN2, targetListN1, targetListNetflix];
// const targets = targetList;
const minLength = 3;
const maxLength = 8;
const minVocabLevel = 1;
const maxVocabLevel = 5;

function randomTarget(wordLength: number, vocabLevel: number): string {
  const eligible = targets[vocabLevel].filter((word) => word.length === wordLength && !/[ア-ン]/i.test(word));
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
  initChallenge = toHiraganaKeepLongVowelMark(
    decode(urlParam("challenge") ?? "")
  );
} catch (e) {
  console.warn(e);
  challengeError = true;
}
if (initChallenge && !dictionarySet.has(initChallenge)) {
  initChallenge = "";
  challengeError = true;
}

function parseUrlLength(): number {
  const lengthParam = urlParam("length");
  if (!lengthParam) return 4;
  const length = Number(lengthParam);
  return length >= minLength && length <= maxLength ? length : 4;
}

function parseUrlVocabLevel(): number {
  const vocabLevelParam = urlParam("vocablvl");
  if (!vocabLevelParam) return minVocabLevel;
  const vocabLevel = Number(vocabLevelParam);
  return vocabLevel >= minVocabLevel && vocabLevel <= maxVocabLevel ? vocabLevel : minVocabLevel;
}

function parseUrlGameNumber(): number {
  const gameParam = urlParam("game");
  if (!gameParam) return 1;
  const gameNumber = Number(gameParam);
  return gameNumber >= 1 && gameNumber <= 1000 ? gameNumber : 1;
}

function Game(props: GameProps) {
  const [romajiMode, setRomajiMode] = useState(false);

  const [gameState, setGameState] = useState(GameState.Playing);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [hint, setHint] = useState<string>(
    challengeError
      ? `Invalid invite link. Playing with a random word.`
      : `Enter your guess!`
  );
  const [challenge, setChallenge] = useState<string>(initChallenge);
  const [wordLength, setWordLength] = useState(
    challenge ? challenge.length : parseUrlLength()
  );
  const [vocabLevel, setVocabLevel] = useState(parseUrlVocabLevel());
  const [gameNumber, setGameNumber] = useState(parseUrlGameNumber());
  const [target, setTarget] = useState(() => {
    resetRng();
    // Skip RNG ahead to the parsed initial game number:
    for (let i = 1; i < gameNumber; i++) randomTarget(wordLength, vocabLevel);
    return challenge || randomTarget(wordLength, vocabLevel);
  });
  const [candidates, setCandidates] = useState(Array.from(dictionarySet));
  const [shift, setShift] = useState<boolean>(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const startNextGame = () => {
    if (challenge) {
      // Clear the URL parameters:
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setChallenge("");
    const newWordLength =
      wordLength >= minLength && wordLength <= maxLength ? wordLength : 5;
    setWordLength(newWordLength);
    setTarget(randomTarget(newWordLength, vocabLevel));
    setHint("");
    setGuesses([]);
    setCurrentGuess("");
    setGameState(GameState.Playing);
    setGameNumber((x) => x + 1);
    setCandidates(
      Array.from(dictionarySet).filter((word) => word.length === newWordLength)
    );
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
        let newGuess = guess + key.toLowerCase();
        newGuess = (
          !/n$/i.test(guess) && key.toLowerCase() === "n"
            ? newGuess
            : toHiraganaKeepLongVowelMark(newGuess.replace("nn", "n"))
        )
        // Limit the lenght of the guess, unless there are romaji at the end
        // (i.e. the user is not done typing a kana).
        if (! /[a-zA]$/i.test(guess)) {
          newGuess = newGuess.slice(0, wordLength);
        }
        return newGuess
      });
      tableRef.current?.focus();
      setHint("");
      if (shift) setShift(false);
    } else if (key === "゛") {
      const letter = currentGuess.slice(-1);
      const mark = "\u{3099}";
      const key = isVoiced(letter)
        ? toSeion(letter)
        : (toSeion(letter) + mark).normalize().replace(mark, "");
      setCurrentGuess((guess) =>
        (guess.slice(0, -1) + key).slice(0, wordLength)
      );
      if (shift) setShift(false);
    } else if (key === "゜") {
      const letter = currentGuess.slice(-1);
      const mark = "\u{309A}";
      const key = isVoiced(letter)
        ? toSeion(letter)
        : (toSeion(letter) + mark).normalize().replace(mark, "");
      setCurrentGuess((guess) =>
        (guess.slice(0, -1) + key).slice(0, wordLength)
      );
      if (shift) setShift(false);
    } else if (key === "大/小") {
      const letter = currentGuess.slice(-1);
      const key = isKogaki(letter) ? toSeion(letter) : toKogaki(letter);
      setCurrentGuess((guess) =>
        (guess.slice(0, -1) + key).slice(0, wordLength)
      );
      setHint("");
    } else if (key === "長音" || key === "-" || key === "ー") {
      setCurrentGuess((guess) => (guess + "ー").slice(0, wordLength));
      setHint("");
      if (shift) setShift(false);
    } else if (key === "Backspace") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      setHint("");
    } else if (key === "Shift" || key === "☆") {
      setShift(!shift);
    } else if (key === "確定" || key === "Enter") {
      if (currentGuess.length !== wordLength) {
        setHint("Too short");
        return;
      }
      if (!dictionarySet.has(currentGuess)) {
        if (/^(.)\1+$/g.test(currentGuess)) {
          if (guesses.length === 0)
            setHint(
              "Feeling tired? Please stop and take a break."
            );
          else {
            setHint(cheer(candidates, guesses, target, setCandidates));
          }
        } else {
          setHint("Invalid word!");
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
        `You ${verbed}! Correct answer was「${target.toUpperCase()}」.\n (Press Enter to ${
          challenge ? "play with a new word" : "play again"
        })`;

      if (currentGuess === target) {
        setHint(gameOver("won!"));
        setGameState(GameState.Won);
      } else if (guesses.length + 1 === props.maxGuesses) {
        setHint(gameOver("lost!"));
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
            if (!(letter in ["っ", "ー"])) {
              const romaji = toRomaji(letter);
              const consonants = romaji.slice(0, -1);
              const vowel = romaji.slice(-1);
              const oldCheckAndSet = (letter: string, clue: Clue) => {
                const old = letterInfo.get(letter);
                if (old === undefined || clue > old)
                  letterInfo.set(letter, clue);
              };
              if (clue === Clue.Correct) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, clue);
                oldCheckAndSet(vowel, clue);
              } else if (clue === Clue.Almost) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Absent);
                oldCheckAndSet(vowel, Clue.Correct);
              } else if (clue === Clue.CorrectConsonantAndElsewhere) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Correct);
                oldCheckAndSet(vowel, Clue.Elsewhere);
              } else if (clue === Clue.CorrectVowelAndElsewhere) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Elsewhere);
                oldCheckAndSet(vowel, Clue.Correct);
              } else if (clue === Clue.CorrectConsonant) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Correct);
                oldCheckAndSet(vowel, Clue.Absent);
              } else if (clue === Clue.CorrectVowel) {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, Clue.Absent);
                oldCheckAndSet(vowel, Clue.Correct);
              } else {
                for (const consonant of consonants)
                  oldCheckAndSet(consonant, clue);
                oldCheckAndSet(vowel, clue);
              }
            }
          }
        }
      }
      return (
        <Row
          key={i}
          romajiMode={romajiMode}
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

        <label htmlFor="vocabLevel">Vocab level: </label>
        <select
          name="vocab-level"
          id="vocab-level"
          value={vocabLevel}
          disabled={
            gameState === GameState.Playing &&
            (guesses.length > 0 || currentGuess !== "" || challenge !== "")
          }
          onChange={(e) => {
            const newVocabLevel = parseInt(e.target.value)
            setVocabLevel(newVocabLevel)
            resetRng();
            setGameNumber(1);
            setGameState(GameState.Playing);
            setGuesses([]);
            setCurrentGuess("");
            setTarget(randomTarget(wordLength, newVocabLevel));
            setWordLength(wordLength);
            setCandidates(
              Array.from(dictionarySet).filter((word) => word.length === wordLength)
            );
            setHint(`${wordLength} kana word (vocab level: ${vocabLevelNames[newVocabLevel]})`);
          }}
        >
          <option value="0">JLPT N5 words</option>
          <option value="1">JLPT N4 words</option>
          <option value="2">JLPT N3 words</option>
          <option value="3">JLPT N2 words</option>
          <option value="4">JLPT N1 words</option>
          <option value="5">95% most frequent words on Netflix</option>
        </select>

        <label htmlFor="wordLength">Word length: </label>
        <input
          type="range"
          min={minLength}
          max={maxLength}
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
            setTarget(randomTarget(length, vocabLevel));
            setWordLength(length);
            setCandidates(
              Array.from(dictionarySet).filter((word) => word.length === length)
            );
            setHint(`${length} kana word (vocab level: ${vocabLevelNames[vocabLevel]})`);
          }}
        ></input>
        <button
          style={{ flex: "0 0 auto" }}
          disabled={gameState !== GameState.Playing || guesses.length === 0}
          onClick={() => {
            setHint(
              `The answer was「${target.toUpperCase()}」... \n(Press Enter again for a new word)`
            );
            setGameState(GameState.Lost);
            (document.activeElement as HTMLElement)?.blur();
          }}
        >
          Give up
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
        layout={props.keyboardLayout}
        romajiMode={romajiMode}
        updateRomajiMode={(newState: boolean) => {setRomajiMode(newState)}}
        letterInfo={letterInfo}
        guesses={guesses
          .map((g) => clue(g, target))
          .map((c) => {
            const length = currentGuess.replace(/\w/g, "").length;
            return c[length <= maxLength ? length : length - 1];
          })}
        onKey={onKey}
        shift={props.keyboardLayout.split("|").length === 2 && shift}
      />
      {gameState !== GameState.Playing && (
        <p>
          <button
            onClick={() => {
              const emoji = props.colorBlind
                ? ["⬛", "🟦", "🟧"]
                : ["⬛", "🟨", "🟩"];
              share(
                getChallengeUrl(target),
                "Sharing link copied to clipboard!"
              );
            }}
          >
            Challenge your friends to guess this word
          </button>{" "}
          <button
            onClick={() => {
              share(
                getChallengeUrl(target),
                "Results copied to the clipboard!",
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
            Share the results
          </button>
        </p>
      )}
      {challenge ? (
        <div className="Game-seed-info">playing a challenge game</div>
      ) : seed ? (
        <div className="Game-seed-info">
          Seed：{seed}，word length：{wordLength}，game number：{gameNumber}
        </div>
      ) : undefined}
    </div>
  );
}

export default Game;
