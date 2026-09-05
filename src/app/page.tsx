"use client";

import { useEffect, useMemo, useState } from "react";

type View = "learn" | "words" | "practice";
type Word = { english: string; polish: string; example: string };

const dictionary: Record<string, Omit<Word, "english">> = {
  consistency: { polish: "konsekwencja, regularność", example: "Consistency matters more than intensity." },
  remarkable: { polish: "niezwykły, godny uwagi", example: "Small habits create remarkable results." },
  progress: { polish: "postęp", example: "Your progress becomes visible over time." },
  habits: { polish: "nawyki", example: "Good habits make learning easier." },
  improve: { polish: "poprawiać, doskonalić", example: "Practice will improve your speaking." },
  compound: { polish: "narastać, kumulować się", example: "Tiny gains compound every day." },
};

const transcript = [
  { time: "0:00", text: "The most powerful outcomes are usually delayed." },
  { time: "0:05", text: "Your habits may feel small today, but consistency creates remarkable progress." },
  { time: "0:13", text: "If you improve by just one percent each day, those gains compound over time." },
  { time: "0:21", text: "Focus on the system, enjoy the process, and let the results follow." },
];

function getVideoId(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2];
    return url.searchParams.get("v") || "PZ7lDrwYdZc";
  } catch { return "PZ7lDrwYdZc"; }
}

export default function Home() {
  const [view, setView] = useState<View>("learn");
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=PZ7lDrwYdZc");
  const [videoId, setVideoId] = useState("PZ7lDrwYdZc");
  const [selected, setSelected] = useState<Word | null>(null);
  const [saved, setSaved] = useState<Word[]>([]);

  useEffect(() => { const stored = localStorage.getItem("fluentframe-words"); if (stored) setSaved(JSON.parse(stored)); }, []);
  const savedKeys = useMemo(() => new Set(saved.map((word) => word.english)), [saved]);
  const saveWord = (word: Word) => {
    const next = savedKeys.has(word.english) ? saved.filter((item) => item.english !== word.english) : [...saved, word];
    setSaved(next); localStorage.setItem("fluentframe-words", JSON.stringify(next));
  };
  const selectWord = (raw: string) => {
    const english = raw.toLowerCase().replace(/[^a-z']/g, "");
    const meaning = dictionary[english] || { polish: "Tłumaczenie pojawi się w pełnej wersji", example: `Learn “${english}” in context.` };
    setSelected({ english, ...meaning });
  };

  return <main className="shell">
    <header><button className="brand" onClick={() => setView("learn")}><span>F</span> FluentFrame</button><nav aria-label="Główna nawigacja">
      <button className={view === "learn" ? "active" : ""} onClick={() => setView("learn")}>Ucz się</button>
      <button className={view === "words" ? "active" : ""} onClick={() => setView("words")}>Moje słowa <b>{saved.length}</b></button>
      <button className={view === "practice" ? "active" : ""} onClick={() => setView("practice")}>Ćwicz z AI</button>
    </nav></header>

    {view === "learn" && <><section className="hero"><p className="eyebrow">ANGIELSKI Z PRAWDZIWEGO ŚWIATA</p><h1>Oglądaj. Klikaj. <em>Zapamiętuj.</em></h1><p>Ucz się angielskiego z filmów, które naprawdę Cię interesują.</p><form onSubmit={(e) => { e.preventDefault(); setVideoId(getVideoId(url)); }}><input aria-label="Link do filmu YouTube" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Wklej link do filmu YouTube…"/><button type="submit">Załaduj film <span>→</span></button></form></section>
    <section className="workspace"><div className="video-card"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title="Film do nauki" allowFullScreen/></div><div className="board-label"><span>PRZESTRZEŃ DO PRACY Z FILMEM</span><i>↓</i></div><div className="transcript-card"><div className="section-title"><div><p>INTERAKTYWNA TABLICA</p><h2>Tekst filmu — dotknij dowolnego słowa</h2></div><span>EN</span></div><div className="transcript">{transcript.map((line) => <div className="line" key={line.time}><time>{line.time}</time><p>{line.text.split(" ").map((word, i) => <button onClick={() => selectWord(word)} key={`${word}-${i}`}>{word} </button>)}</p></div>)}</div></div></section></>}

    {view === "words" && <section className="collection"><p className="eyebrow">TWOJA KOLEKCJA</p><h1>Moje słowa</h1><p>Zapisane słowa zostają w tej przeglądarce.</p>{saved.length === 0 ? <div className="empty">Kliknij słowo w transkrypcji, a potem dodaj je do nauki.</div> : <div className="word-grid">{saved.map((word) => <article key={word.english}><button aria-label={`Usuń ${word.english}`} onClick={() => saveWord(word)}>×</button><h3>{word.english}</h3><strong>{word.polish}</strong><p>{word.example}</p></article>)}</div>}</section>}
    {view === "practice" && <section className="practice"><div className="orb">✦</div><p className="eyebrow">TWÓJ TRENER JĘZYKOWY</p><h1>Ćwicz z AI</h1><p>Wkrótce AI ułoży krótkie dialogi i ćwiczenia na podstawie zapisanych przez Ciebie słów.</p><button disabled>Sesje AI już wkrótce</button></section>}
    {selected && <div className="overlay" onClick={() => setSelected(null)}><aside className="word-panel" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setSelected(null)}>×</button><p className="eyebrow">NOWE SŁOWO</p><h2>{selected.english}</h2><p className="translation">{selected.polish}</p><div className="example"><span>PRZYKŁAD</span>{selected.example}</div><button className="save" onClick={() => saveWord(selected)}>{savedKeys.has(selected.english) ? "✓ Zapisano — usuń" : "+ Dodaj do nauki"}</button></aside></div>}
  </main>;
}
