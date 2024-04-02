import { useState } from "react";
import bgsx from "../public/gradient_1_sx.jpg";

function App() {
  const [query, setQuery] = useState({
    draws: 30,
    participants: 256,
  });
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [loading, setLoading] = useState(false);

  const setDraws = (value: number) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      draws: value,
    }));
  };

  const setParticipants = (value: number) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      participants: value,
    }));
  };
  async function handleGenerateRandomNumbers() {
    setLoading(true);
    try {
      // Validazione dei valori dei parametri
      if (query.participants < 1 || query.participants > 256) {
        throw new Error(
          "Il numero di partecipanti deve essere compreso tra 1 e 256."
        );
      }
      if (query.draws < 1 || query.draws > 32) {
        throw new Error(
          "Il numero di estrazioni deve essere compreso tra 1 e 32."
        );
      }

      const response = await fetch(
        `${import.meta.env.VITE_CANISTER_ORIGIN}/randomness`,
        {
          method: "POST",
          headers: [["Content-Type", "application/json"]],
          body: JSON.stringify(query),
        }
      );
      const data = await response.json();
      if (data) {
        setRandomNumbers(data);
      } else {
        console.error("La risposta non contiene un array di numeri casuali.");
      }
    } catch (error) {
      console.error(
        "Si è verificato un errore durante la generazione dei numeri casuali:",
        error
      );
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
        className="absolute left-[-250px] top-[-400px] z-[-1] md:left-[-450px] md:top-[-1000px] lg:left-[-400px] lg:top-[100px]"
        src={bgsx}
      />
      <div className="mt-16 mx-auto flex flex-col w-1/3 justify-center content-center">
        <div className="flex justify-center content-center gap-2 ">
          <div className="w-1/3 flex justify-end">
            <label className="text-white" htmlFor="participants">
              particpants:{" "}
            </label>
          </div>
          <input
            className="bg-transparent w-auto text-[var(--color-custom)]"
            id="participants"
            name="participants"
            type="number"
            value={query.participants.toString()}
            min={1}
            max={256}
            onChange={(e) => setParticipants(parseInt(e.target.value))}
          />
        </div>
        <div className="flex justify-center content-center gap-2 mt-4">
          <div className="w-1/3 flex justify-end">
            <label className="text-white" htmlFor="draws">
              draws:{" "}
            </label>
          </div>
          <input
            className="bg-transparent w-auto text-[var(--color-custom)]"
            id="draws"
            name="draws"
            type="number"
            value={query.draws.toString()}
            min={1}
            max={30}
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

        {loading ? (
          <p className="mt-2 mx-auto">Generation in progress...</p>
        ) : (
          <ul className="mx-auto mt-2">
            {randomNumbers.map((number, index) => (
              <li key={index}>
                <span className="text-white">{index + 1} :</span>
                <span className="text-[var(--color-custom)]">{number}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
