import "./App.css";
import {maxGuesses, seed, urlParam, vocabLevelNames} from "./util";
import Game from "./Game";
import {useEffect, useState} from "react";
import {About} from "./About";

function useSetting<T>(
    key: string,
    initial: T
): [T, (value: T | ((t: T) => T)) => void] {
    const [current, setCurrent] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initial;
        } catch (e) {
            return initial;
        }
    });
    const setSetting = (value: T | ((t: T) => T)) => {
        try {
            const v = value instanceof Function ? value(current) : value;
            setCurrent(v);
            window.localStorage.setItem(key, JSON.stringify(v));
        } catch (e) {
        }
    };
    return [current, setSetting];
}

const todaySeed = new Date().toISOString().replace(/-/g, "").slice(0, 8);

function App() {
    type Page = "game" | "about" | "settings";
    const [page, setPage] = useState<Page>("game");
    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [dark, setDark] = useSetting<boolean>("dark", prefersDark);
    const [colorBlind, setColorBlind] = useSetting<boolean>("colorblind", false);
    const [difficulty, setDifficulty] = useSetting<number>("difficulty", 0);

    const [keyboard, setKeyboard] = useSetting<string>(
        "keyboard",
        "わらやまはなたさかあ-　り　みひにちしきい-　るゆむふぬつすくう-　れ　めへねてせけえ-をろよもほのとそこお-Bん゛゜LーE"
    );
    const [enterLeft, setEnterLeft] = useSetting<boolean>("enter-left", false);

    useEffect(() => {
        document.body.className = dark ? "dark" : "";
        if (urlParam("today") !== null || urlParam("todas") !== null) {
            document.location = "?seed=" + todaySeed;
        }
        setTimeout(() => {
            // Avoid transition on page load
            document.body.style.transition = "0.3s background-color ease-out";
        }, 1);
    }, [dark]);

    const link = (emoji: string, label: string, page: Page) => (
        <button
            className="emoji-link"
            onClick={() => setPage(page)}
            title={label}
            aria-label={label}
        >
            {emoji}
        </button>
    );

    return (
        <div className={"App-container" + (colorBlind ? " color-blind" : "")}>
            <h1>
                {difficulty === 0 ? (
                    "わーどる"
                ) : difficulty === 1 ? (
                    <>
            <span
                style={{
                    color: "#e66",
                }}
            >
              はーど
            </span>
                        る
                    </>
                ) : (
                    <>
            <span
                style={{
                    color: "#e66",
                    fontStyle: "italic",
                }}
            >
              超はーど
            </span>
                        る
                    </>
                )}
            </h1>
            <div className="top-right">
                {page !== "game" ? (
                    link("❌", "Close", "game")
                ) : (
                    <>
                        {link("❓", "How to play", "about")}
                        {link("⚙️", "Settings", "settings")}
                    </>
                )}
            </div>
            <div
                style={{
                    position: "absolute",
                    left: 5,
                    top: 5,
                    visibility: page === "game" ? "visible" : "hidden",
                }}
            >
                <a href={seed ? "?random" : "?seed=" + todaySeed}>
                    {seed ? "Random" : "Today's word"}
                </a>
            </div>
            {page === "about" && <About/>}
            {page === "settings" && (
                <div className="Settings">
                    <div className="Settings-setting">
                        <input
                            id="dark-setting"
                            type="checkbox"
                            checked={dark}
                            onChange={() => setDark((x: boolean) => !x)}
                        />
                        <label htmlFor="dark-setting">Dark mode</label>
                    </div>
                    <div className="Settings-setting">
                        <input
                            id="colorblind-setting"
                            type="checkbox"
                            checked={colorBlind}
                            onChange={() => setColorBlind((x: boolean) => !x)}
                        />
                        <label htmlFor="colorblind-setting">Colorblind</label>
                    </div>
                    <div className="Settings-setting">
                        <input
                            id="difficulty-setting"
                            type="range"
                            min="0"
                            max="2"
                            value={difficulty}
                            onChange={(e) => setDifficulty(+e.target.value)}
                        />
                        <div>
                            <label htmlFor="difficulty-setting">Difficulty：</label>
                            <strong>{["Normal", "Hard", "Very Hard"][difficulty]}</strong>
                            <div
                                style={{
                                    fontSize: 14,
                                    height: 70,
                                    marginLeft: 8,
                                    marginTop: 8,
                                }}
                            >
                                {
                                    [
                                        `Just find the word, no pressure :)`,
                                        `When you get green or yellow markers, you must use them in your next guesses!`,
                                        `Even harder! Yellow marked kana must change position in your next guess, and you must strictly follow the rules for any half-green marked kana you found.`,
                                    ][difficulty]
                                }
                            </div>
                        </div>
                    </div>

                    <div className="Settings-setting">
                        <label htmlFor="keyboard-setting">Keyboard</label>
                        <select
                            name="keyboard-setting"
                            id="keyboard-setting"
                            value={keyboard}
                            onChange={(e) => setKeyboard(e.target.value)}
                        >
                            <option
                                value="わらやまはなたさかあ-ゐり　みひにちしきい-　るゆむふぬつすくう-ゑれ　めへねてせけえ-をろよもほのとそこお-Bん゛゜L長E">
                                50音配列
                            </option>
                            <option
                                value="ぬふあうえおやゆよわほへ-たていすかんなにらせ゛゜-ちとしはきくまのりれけむ-つさそひこみもねるめろ-BL長E">
                                JISかな
                            </option>
                            <option
                                value="。かたこさらちくつ，ー-うしてけせはときいん-゜．ひすふへめそねほ・゜-SB゛E|ぁえりゃれよにるまぇー-をあなゅもみおのょっ-゜ぅーろやぃぬゆむわぉ゜-SB゛E">
                                親指シフト
                            </option>
                            <option
                                value="そけせてょつんのをりち-はかしとたくうい゛きな-すこにさあっる、。れ-SBLES|ぁ゜ほふめひえみやぬ「-ぃへらゅよまおもわゆ」-ぅぇぉねゃむろ・ー　-SBLES">
                                新JIS配列
                            </option>
                            <option
                                value="そこしてょつんいのりち-はか☆とたくう☆゛きれ-すけになさっる、。゜-BE|ぁひほふめぬえみやぇ「-ぃをらあよまおもわゆ」-ぅへせゅゃむろねーぉ-BE">
                                月配列
                            </option>
                            <option value="qwertyuiop-asdfghjkl-BzxcvbnmE">QWERTY</option>
                            <option value="azertyuiop-qsdfghjklm-BwxcvbnE">AZERTY</option>
                            <option value="qwertzuiop-asdfghjkl-ByxcvbnmE">QWERTZ</option>
                            <option value="BpyfgcrlE-aoeuidhtns-qjkxbmwvz">Dvorak</option>
                            <option value="qwfpgjluy-arstdhneio-BzxcvbkmE">Colemak</option>
                        </select>
                        <input
                            style={{marginLeft: 20}}
                            id="enter-left-setting"
                            type="checkbox"
                            checked={enterLeft}
                            onChange={() => setEnterLeft((x: boolean) => !x)}
                        />
                        <label htmlFor="enter-left-setting">「確定」を左配置にする</label>
                    </div>
                </div>
            )}
            <Game
                maxGuesses={maxGuesses}
                hidden={page !== "game"}
                difficulty={difficulty}
                colorBlind={colorBlind}
                keyboardLayout={keyboard.replaceAll(
                    /[BE]/g,
                    (x) => (enterLeft ? "EB" : "BE")["BE".indexOf(x)]
                )}
            />
        </div>
    );
}

export default App;
