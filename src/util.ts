import { toHiragana } from "wanakana";
import dictionary from "./dictionary.json";

export enum Difficulty {
  Normal,
  Hard,
  UltraHard,
}

export const maxGuesses = 6;

export const dictionarySet: Set<string> = new Set(
  dictionary.map((word) => toHiragana(word))
);

function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function urlParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

export const seed = Number(urlParam("seed"));
const makeRandom = () => (seed ? mulberry32(seed) : () => Math.random());
let random = makeRandom();

export function resetRng(): void {
  random = makeRandom();
}

export function pick<T>(array: Array<T>): T {
  return array[Math.floor(array.length * random())];
}

// https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk/
export function speak(
  text: string,
  priority: "polite" | "assertive" = "assertive"
) {
  var el = document.createElement("div");
  var id = "speak-" + Date.now();
  el.setAttribute("id", id);
  el.setAttribute("aria-live", priority || "polite");
  el.classList.add("sr-only");
  document.body.appendChild(el);

  window.setTimeout(function () {
    document.getElementById(id)!.innerHTML = text;
  }, 100);

  window.setTimeout(function () {
    document.body.removeChild(document.getElementById(id)!);
  }, 1000);
}

export function toSeion(letter: string): string {
  if ("ぁ".includes(letter)) {
    return "あ";
  } else if ("ぃ".includes(letter)) {
    return "い";
  } else if ("ぅ".includes(letter)) {
    return "う";
  } else if ("ぇ".includes(letter)) {
    return "え";
  } else if ("ぉ".includes(letter)) {
    return "お";
  } else if ("がゕ".includes(letter)) {
    return "か";
  } else if ("ぎ".includes(letter)) {
    return "き";
  } else if ("ぐ".includes(letter)) {
    return "く";
  } else if ("げゖ".includes(letter)) {
    return "け";
  } else if ("ご".includes(letter)) {
    return "こ";
  } else if ("ざ".includes(letter)) {
    return "さ";
  } else if ("じ".includes(letter)) {
    return "し";
  } else if ("ず".includes(letter)) {
    return "す";
  } else if ("ぜ".includes(letter)) {
    return "せ";
  } else if ("ぞ".includes(letter)) {
    return "そ";
  } else if ("だ".includes(letter)) {
    return "た";
  } else if ("ぢ".includes(letter)) {
    return "ち";
  } else if ("づっ".includes(letter)) {
    return "つ";
  } else if ("で".includes(letter)) {
    return "て";
  } else if ("ど".includes(letter)) {
    return "と";
  } else if ("ばぱ".includes(letter)) {
    return "は";
  } else if ("びぴ".includes(letter)) {
    return "ひ";
  } else if ("ぶぷ".includes(letter)) {
    return "ふ";
  } else if ("べぺ".includes(letter)) {
    return "へ";
  } else if ("ぼぽ".includes(letter)) {
    return "ほ";
  } else if ("ゃ".includes(letter)) {
    return "や";
  } else if ("ゅ".includes(letter)) {
    return "ゆ";
  } else if ("ょ".includes(letter)) {
    return "よ";
  } else if ("ゎ".includes(letter)) {
    return "わ";
  } else {
    return letter;
  }
}

export function toConsonant(letter: string): string {
  if ("あいうえおぁぃぅぇぉ".includes(letter)) {
    return "あ";
  } else if ("かきくけこゕゖ".includes(letter)) {
    return "か";
  } else if ("さしすせそ".includes(letter)) {
    return "さ";
  } else if ("たちつてと".includes(letter)) {
    return "た";
  } else if ("なにぬねの".includes(letter)) {
    return "な";
  } else if ("はひふへほ".includes(letter)) {
    return "は";
  } else if ("まみむめも".includes(letter)) {
    return "ま";
  } else if ("やゆよゃゅょ".includes(letter)) {
    return "や";
  } else if ("らりるれろ".includes(letter)) {
    return "ら";
  } else if ("わゐゑを".includes(letter)) {
    return "わ";
  } else if ("がぎぐげご".includes(letter)) {
    return "が";
  } else if ("ざじずぜぞ".includes(letter)) {
    return "ざ";
  } else if ("だぢづでど".includes(letter)) {
    return "だ";
  } else if ("ばびぶべぼ".includes(letter)) {
    return "ば";
  } else if ("ぱぴぷぺぽ".includes(letter)) {
    return "ぱ";
  } else if ("ぱぴぷぺぽ".includes(letter)) {
    return "ぱ";
  } else {
    return letter;
  }
}

export function toVowel(letter: string): string {
  const seionLetter = toSeion(letter);
  if ("あかさたなはまやらわ".includes(seionLetter)) {
    return "あ";
  } else if ("いきしちにひみりゐ".includes(seionLetter)) {
    return "い";
  } else if ("うくすつぬふむゆる".includes(seionLetter)) {
    return "う";
  } else if ("えけせてねへめれゑ".includes(seionLetter)) {
    return "え";
  } else if ("おこそとのほもよろ".includes(seionLetter)) {
    return "お";
  } else {
    return letter;
  }
}

export function isVoiced(letter: string): boolean {
  return "がぎぐげござじずぜぞだぢづでどばびぶべぼ".includes(letter);
}

export function toVoiced(letter: string): string {
  switch (letter) {
    case "か":
      return "が";
    case "き":
      return "ぎ";
    case "く":
      return "ぐ";
    case "け":
      return "げ";
    case "こ":
      return "ご";
    case "さ":
      return "ざ";
    case "し":
      return "じ";
    case "す":
      return "ず";
    case "せ":
      return "ぜ";
    case "そ":
      return "ぞ";
    case "た":
      return "だ";
    case "ち":
      return "ぢ";
    case "つ":
      return "づ";
    case "て":
      return "で";
    case "と":
      return "ど";
    case "は":
      return "ば";
    case "ひ":
      return "び";
    case "ふ":
      return "ぶ";
    case "へ":
      return "べ";
    case "ほ":
      return "ぼ";
    default:
      return letter;
  }
}

export function isSemivoiced(letter: string): boolean {
  return "ぱぴぷぺぽ".includes(letter);
}

export function toSemivoiced(letter: string): string {
  switch (letter) {
    case "は":
      return "ぱ";
    case "ひ":
      return "ぴ";
    case "ふ":
      return "ぷ";
    case "へ":
      return "ぺ";
    case "ほ":
      return "ぽ";
    default:
      return letter;
  }
}

export function isKogaki(letter: string): boolean {
  return "ぁぃぅぇぉっゃゅょゎゕゖ".includes(letter);
}

export function toKogaki(letter: string): string {
  switch (letter) {
    case "あ":
      return "ぁ";
    case "い":
      return "ぃ";
    case "う":
      return "ぅ";
    case "え":
      return "ぇ";
    case "お":
      return "ぉ";
    case "つ":
      return "っ";
    case "や":
      return "ゃ";
    case "ゆ":
      return "ゅ";
    case "よ":
      return "ょ";
    case "わ":
      return "ゎ";
    case "か":
      return "ゕ";
    case "け":
      return "ゖ";
    default:
      return letter;
  }
}
