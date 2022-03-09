import {
  Difficulty,
  toConsonant,
  toKogaki,
  toSeion,
  toSemivoiced,
  toVoiced,
  toVowel,
} from "./util";

export enum Clue {
  Absent,
  Elsewhere,
  CorrectVowel,
  CorrectConsonant,
  CorrectVowelAndElsewhere,
  CorrectConsonantAndElsewhere,
  Almost,
  Correct,
}

export interface CluedLetter {
  clue?: Clue;
  letter: string;
}

export function clue(word: string, target: string): CluedLetter[] {
  let elusive: string[] = [];
  target.split("").forEach((letter, i) => {
    if (word[i] !== letter) {
      elusive.push(letter);
    }
  });
  return word.split("").map((letter, i) => {
    let j: number;
    if (target[i] === letter) {
      return { clue: Clue.Correct, letter };
    } else if (toSeion(target[i]) === toSeion(letter)) {
      return { clue: Clue.Almost, letter };
    } else if (
      toConsonant(target[i]) === toConsonant(letter) &&
      (j = elusive.indexOf(letter)) > -1
    ) {
      // "use it up" so we don't clue at it twice
      elusive[j] = "";
      return { clue: Clue.CorrectConsonantAndElsewhere, letter };
    } else if (
      toVowel(target[i]) === toVowel(letter) &&
      (j = elusive.indexOf(letter)) > -1
    ) {
      // "use it up" so we don't clue at it twice
      elusive[j] = "";
      return { clue: Clue.CorrectVowelAndElsewhere, letter };
    } else if (toConsonant(target[i]) === toConsonant(letter)) {
      return { clue: Clue.CorrectConsonant, letter };
    } else if (toVowel(target[i]) === toVowel(letter)) {
      return { clue: Clue.CorrectVowel, letter };
    } else if ((j = elusive.indexOf(letter)) > -1) {
      // "use it up" so we don't clue at it twice
      elusive[j] = "";
      return { clue: Clue.Elsewhere, letter };
    } else {
      return { clue: Clue.Absent, letter };
    }
  });
}

export function clueClass(clue: Clue): string {
  if (clue === Clue.Absent) {
    return "letter-absent";
  } else if (clue === Clue.Elsewhere) {
    return "letter-elsewhere";
  } else if (clue === Clue.CorrectVowel) {
    return "letter-correct-vowel";
  } else if (clue === Clue.CorrectConsonant) {
    return "letter-correct-consonant";
  } else if (clue === Clue.CorrectVowelAndElsewhere) {
    return "letter-correct-vowel-and-elsewhere";
  } else if (clue === Clue.CorrectConsonantAndElsewhere) {
    return "letter-correct-consonant-and-elsewhere";
  } else if (clue === Clue.Almost) {
    return "letter-almost";
  } else {
    return "letter-correct";
  }
}

export function clueWord(clue: Clue): string {
  if (clue === Clue.Absent) {
    return "Absent";
  } else if (clue === Clue.Elsewhere) {
    return "Elsewhere";
  } else if (clue === Clue.CorrectVowel) {
    return "Correct vowel";
  } else if (clue === Clue.CorrectConsonant) {
    return "Correct consonant";
  } else if (clue === Clue.CorrectVowelAndElsewhere) {
    return "Correct vowel and elsewhere";
  } else if (clue === Clue.CorrectConsonantAndElsewhere) {
    return "Correct consonant and elsewhere";
  } else if (clue === Clue.Almost) {
    return "Other diacritic mark or different size";
  } else {
    return "Correct";
  }
}

export function describeClue(clue: CluedLetter[]): string {
  return clue
    .map(({ letter, clue }) => letter.toUpperCase() + " " + clueWord(clue!))
    .join(", ");
}

export function violation(
  difficulty: Difficulty,
  clues: CluedLetter[],
  guess: string
): string | undefined {
  if (difficulty === Difficulty.Normal) {
    return undefined;
  }
  const ultra = difficulty === Difficulty.UltraHard;
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
    const glyph = letter.toUpperCase();
    const nth = i + 1;

    // Hard: enforce greens stay in place.
    if (clue === Clue.Correct && guess[i] !== letter) {
      return "Kana #" + nth + " must be「" + glyph + "」!";
    }

    // Hard: enforce yellows are used.
    if (guessCount < clueCount) {
      const atLeastN = clueCount > 1 ? `at least ${clueCount} ` : "";
      return `You must use ${atLeastN}「${glyph}」!`;
    }

    // Ultra Hard: disallow would-be greens.
    if (ultra && clue !== Clue.Correct && guess[i] === letter) {
      return `Kana #${nth} can't be「${glyph}」!`;
    }

    // Ultra Hard: if the exact amount is known because of an Absent clue, enforce it.
    if (
      ultra &&
      (clue === Clue.Absent ||
        clue === Clue.CorrectConsonant ||
        clue === Clue.CorrectVowel) &&
      guessCount !== clueCount
    ) {
      return clueCount === 0
        ? `${glyph} can't be there!`
        : `Must include ${clueCount}「${glyph}」!`;
    }

    if (
      ultra &&
      clue === Clue.Almost &&
      toSeion(guess[i]) !== toSeion(letter)
    ) {
      const glyphs = Array.from(
        new Set([
          glyph,
          toSeion(glyph),
          toVoiced(glyph),
          toSemivoiced(glyph),
          toKogaki(glyph),
        ])
      ).map((g) => `「${g}」`);
      const which = glyphs.length === 2 ? "one of those two" : "one of these";
      return `Kana #${nth} must include ${which}: ${glyphs.join(
        ""
      )}`;
    }

    if (
      ultra &&
      (clue === Clue.CorrectConsonant ||
        clue === Clue.CorrectConsonantAndElsewhere) &&
      toConsonant(guess[i]) !== toConsonant(letter)
    ) {
      return `Kana #${nth} is in the ${toConsonant(glyph)} column`;
    }

    if (
      ultra &&
      (clue === Clue.CorrectVowel || clue === Clue.CorrectVowelAndElsewhere) &&
      toVowel(guess[i]) !== toVowel(letter)
    ) {
      return `Kana #${nth} is in the ${toVowel(glyph)} row`;
    }

    if (
      ultra &&
      clue === Clue.Absent &&
      toConsonant(guess[i]) === toConsonant(letter)
    ) {
      return `Kana #${nth} is NOT in the ${toConsonant(glyph)} column`;
    }

    if (
      ultra &&
      clue === Clue.Absent &&
      toVowel(guess[i]) === toVowel(letter)
    ) {
      return `Kana #${nth} is NOT in the ${toVowel(glyph)} row`;
    }

    ++i;
  }
  return undefined;
}
