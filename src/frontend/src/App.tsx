import { useState } from "react";
import bgsx from "../public/gradient_1_sx.jpg";
import { response } from "express";

function App() {
  const [query, setQuery] = useState({
    draws: 32,
    range: 256,
  });
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setDraws = (value: number) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      draws: value,
    }));
  };

  const setrange = (value: number) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      range: value,
    }));
  };
  async function handleGenerateRandomNumbers() {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_CANISTER_ORIGIN}/randomness`,
        {
          method: "POST",
          headers: [["Content-Type", "application/json"]],
          body: JSON.stringify(query),
        }
      );
      if (!response.ok) {
        // Se la risposta HTTP non è OK, ottieni il messaggio di errore dal corpo della risposta
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      const data = await response.json();
      if (data.main) {
        setRandomNumbers(data.main);
        setCounter(data.count);
        setError(null); // Resetta l'errore quando la richiesta ha successo
      }
    } catch (e) {
      // Gestisci l'errore generico o HTTP
      if (e instanceof Error) {
        setError(e); // Imposta l'errore generico
        setRandomNumbers([]); // Svuota la lista dei risultati quando si verifica un errore
      } else {
        setError(new Error("Failed to fetch")); // Imposta un errore generico se non è un'istanza di Error
        setRandomNumbers([]); // Svuota la lista dei risultati anche per altri tipi di errore
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="text-[var(--color-custom)] ">
      <header className="ml-10 mt-10">
        <nav className="flex w-full items-center justify-between ">
          <a className="flex items-end gap-2 cursor-pointer">
            <div className="flex  h-auto text-xl">
              <h1>🎲</h1>
              <h1 className="text-white">RANDOMIZER</h1>
            </div>
          </a>
        </nav>
      </header>
      <img
        className="absolute left-[-250px] top-[-300px] z-[-1] md:left-[-350px] md:top-[-400] lg:left-[-400px] lg:top-[-600px]"
        src={bgsx}
      />
      <div className="mt-16 mx-auto flex flex-col w-1/3 justify-center content-center">
        <div className="flex justify-center content-center gap-2 ">
          <div className="w-16 flex ">
            <label className="text-white" htmlFor="range">
              range:{" "}
            </label>
          </div>
          <input
            className="bg-transparent text-[var(--color-custom)] w-16"
            id="range"
            name="range"
            type="number"
            value={query.range.toString()}
            onChange={(e) => setrange(parseInt(e.target.value))}
          />
        </div>
        <div className="flex justify-center content-center gap-2 mt-4">
          <div className="w-16 flex ">
            <label className="text-white" htmlFor="draws">
              draws:{" "}
            </label>
          </div>
          <input
            className="bg-transparent text-[var(--color-custom)] w-16"
            id="draws"
            name="draws"
            type="number"
            value={query.draws.toString()}
            onChange={(e) => setDraws(parseInt(e.target.value))}
          />
        </div>

        <button
          className="mt-6 mb-4 mx-auto
          w-auto
          p-2
          border-solid
          border-2
          border-[var(--color-custom)]"
          onClick={handleGenerateRandomNumbers}
        >
          Generate
        </button>
        {error && (
          <div className="mx-auto mt-2 text-red-500">{error.message}</div>
        )}
        {loading ? (
          <p className="mt-2 mx-auto">Generation in progress...</p>
        ) : null}
        {!loading && randomNumbers.length > 0 ? (
          <>
            <ul className="mx-auto mt-2">
              {randomNumbers.map((number, index) => (
                <li key={index}>
                  <span className="text-white">{index + 1} :</span>
                  <span className="text-[var(--color-custom)]">{number}</span>
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-6 text-white">
              <p>
                <span className="mr-1">This app has been used:</span>
                <span className="mr-1 text-[var(--color-custom)]">
                  {counter}
                </span>
                <span>times</span>
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
