import { clue, Clue, CluedLetter } from "./clue";
import { toConsonant, toSeion, toVowel } from "./util";

function violation(clues: CluedLetter[], guess: string): boolean {
  let i = 0;
  for (const { letter, clue } of clues) {
    const clueCount = clues.filter(
      (c) =>
        c.letter === letter &&
        (c.clue === Clue.Correct ||
          c.clue === Clue.Elsewhere ||
          c.clue === Clue.CorrectConsonantAndElsewhere ||
          c.clue === Clue.CorrectVowelAndElsewhere)
    ).length;
    const guessCount = guess.split(letter).length - 1;
    const violation =
      (clue === Clue.Absent &&
        (toConsonant(guess[i]) === toConsonant(letter) ||
          toVowel(guess[i]) === toVowel(letter))) ||
      ((clue === Clue.CorrectVowel || clue === Clue.CorrectVowelAndElsewhere) &&
        toVowel(guess[i]) !== toVowel(letter)) ||
      ((clue === Clue.CorrectConsonant ||
        clue === Clue.CorrectConsonantAndElsewhere) &&
        toConsonant(guess[i]) !== toConsonant(letter)) ||
      (clue === Clue.Correct && guess[i] !== letter) ||
      guessCount < clueCount ||
      (clue !== Clue.Correct && guess[i] === letter) ||
      ((clue === Clue.Absent ||
        clue === Clue.CorrectConsonant ||
        clue === Clue.CorrectVowel) &&
        guessCount !== clueCount) ||
      (clue === Clue.Almost && toSeion(guess[i]) !== toSeion(letter));
    if (violation) return true;
    ++i;
  }
  return false;
}

export function cheer(
  dictionary: string[],
  guesses: string[],
  target: string,
  setDictionary: React.Dispatch<React.SetStateAction<string[]>>
): string {
  const allClues = guesses.map((guess) => clue(guess, target));
  const candidates = dictionary.filter((word) => {
    for (const clues of allClues) {
      if (violation(clues, word)) return false;
    }
    return true;
  });
  setDictionary(candidates);
  return candidates.length === 1
    ? `Almost there! There is only one possible word left!`
    : `Only ${candidates.length} possibilities left in the dictionary`;
}
