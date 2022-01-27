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
      return nth + "文字目は「" + glyph + "」でなければなりません";
    }

    // Hard: enforce yellows are used.
    if (guessCount < clueCount) {
      const atLeastN = clueCount > 1 ? `少なくとも${clueCount}つの` : "";
      return `推測には${atLeastN}「${glyph}」が含まれている必要があります`;
    }

    // Ultra Hard: disallow would-be greens.
    if (ultra && clue !== Clue.Correct && guess[i] === letter) {
      return `${nth}文字目は「${glyph}」ではありません`;
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
        ? `${glyph}を含めることはできません`
        : `推測には正確に${clueCount}つの「${glyph}」が含まれている必要があります`;
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
      const which = glyphs.length === 2 ? "どちら" : "どれ";
      return `${nth}文字目は${glyphs.join(
        ""
      )}の${which}かが含まれている必要があります`;
    }

    if (
      ultra &&
      (clue === Clue.CorrectConsonant ||
        clue === Clue.CorrectConsonantAndElsewhere) &&
      toConsonant(guess[i]) !== toConsonant(letter)
    ) {
      return `${nth}文字目は${toConsonant(glyph)}行です`;
    }

    if (
      ultra &&
      (clue === Clue.CorrectVowel || clue === Clue.CorrectVowelAndElsewhere) &&
      toVowel(guess[i]) !== toVowel(letter)
    ) {
      return `${nth}文字目は${toVowel(glyph)}段です`;
    }

    ++i;
  }
  return undefined;
}
