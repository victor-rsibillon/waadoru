import { Clue, clueClass, CluedLetter } from "./clue";
import { toConsonant, toSeion, toVowel } from "./util";

interface KeyboardProps {
  letterInfo: Map<string, Clue>;
  guesses: CluedLetter[];
  onKey: (key: string) => void;
}

export function Keyboard(props: KeyboardProps) {
  const keyboard = [
    "わ ら や ま は な た さ か あ".split(" "),
    "ゐ り 　 み ひ に ち し き い".split(" "),
    "　 る ゆ む ふ ぬ つ す く う".split(" "),
    "ゑ れ 　 め へ ね て せ け え".split(" "),
    "を ろ よ も ほ の と そ こ お".split(" "),
    "ん ゛ ゜ 大/小 長音 Backspace 確定".split(" "),
  ];

  return (
    <div className="Game-keyboard" aria-hidden="true">
      {keyboard.map((row, i) => (
        <div key={i} className="Game-keyboard-row">
          {row.map((label, j) => {
            let className = "Game-keyboard-button";
            const clue = props.letterInfo.get(label);
            if (clue !== undefined) {
              className += " " + clueClass(clue);
            } else if (
              label !== "゛" &&
              label !== "゜" &&
              label !== "大/小" &&
              label !== "Backspace" &&
              label !== "確定" &&
              props.guesses.some(
                (c) =>
                  c !== undefined &&
                  (((c.clue === Clue.Absent || c.clue === Clue.Elsewhere) &&
                    (toConsonant(c.letter) === toConsonant(label) ||
                      toVowel(c.letter) === toVowel(label))) ||
                    ((c.clue === Clue.CorrectConsonant ||
                      c.clue === Clue.CorrectConsonantAndElsewhere) &&
                      toConsonant(c.letter) !== toConsonant(label)) ||
                    ((c.clue === Clue.CorrectVowel ||
                      c.clue === Clue.CorrectVowelAndElsewhere) &&
                      toVowel(c.letter) !== toVowel(label)) ||
                    (c.clue === Clue.Almost &&
                      toSeion(c.letter) !== toSeion(label)) ||
                    (c.clue === Clue.Correct && c.letter !== label))
              )
            ) {
              className += " " + clueClass(Clue.Absent);
            } else if (label === "　") {
              className += " " + clueClass(Clue.Absent);
            }
            if (label.length > 1) {
              className += " Game-keyboard-button-wide";
            }
            return (
              <div
                tabIndex={-1}
                key={j}
                role="button"
                className={className}
                onClick={() => {
                  props.onKey(label);
                }}
              >
                {label.replace("Backspace", "⌫")}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
