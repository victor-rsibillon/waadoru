import { Difficulty, englishNumbers, ordinal, toConsonant, toSeion, toVowel } from "./util";

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
    } else if (toConsonant(target[i]) === toConsonant(letter) && (j = elusive.indexOf(letter)) > -1) {
      // "use it up" so we don't clue at it twice
      elusive[j] = "";
      return { clue: Clue.CorrectConsonantAndElsewhere, letter };
    } else if (toVowel(target[i]) === toVowel(letter) && (j = elusive.indexOf(letter)) > -1) {
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
    return "不在";
  } else if (clue === Clue.Elsewhere) {
    return "場所違い";
  } else if (clue === Clue.CorrectVowel) {
    return "母音一致";
  } else if (clue === Clue.CorrectConsonant) {
    return "子音一致";
  } else if (clue === Clue.CorrectVowelAndElsewhere) {
    return "場所違い＆母音一致";
  } else if (clue === Clue.CorrectConsonantAndElsewhere) {
    return "場所違い＆子音一致";
  } else if (clue === Clue.Almost) {
    return "濁点・半濁点・小書き";
  } else {
    return "正解";
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
      (c) => c.letter === letter && c.clue !== Clue.Absent
    ).length;
    const guessCount = guess.split(letter).length - 1;
    const glyph = letter.toUpperCase();
    const glyphs = glyph + (clueCount !== 1 ? "s" : "");
    const nth = ordinal(i + 1);

    // Hard: enforce greens stay in place.
    if (clue === Clue.Correct && guess[i] !== letter) {
      return nth + " letter must be " + glyph;
    }

    // Hard: enforce yellows are used.
    if (guessCount < clueCount) {
      const atLeastN =
        clueCount > 1 ? `at least ${englishNumbers[clueCount]} ` : "";
      return `Guess must contain ${atLeastN}${glyphs}`;
    }

    // Ultra Hard: disallow would-be greens.
    if (ultra && clue !== Clue.Correct && guess[i] === letter) {
      return nth + " letter can't be " + glyph;
    }

    // Ultra Hard: if the exact amount is known because of an Absent clue, enforce it.
    if (ultra && clue === Clue.Absent && guessCount !== clueCount) {
      return clueCount === 0
        ? `Guess can't contain ${glyph}`
        : `Guess must contain exactly ${englishNumbers[clueCount]} ${glyphs}`;
    }

    ++i;
  }
  return undefined;
}
