import { useState } from "react";

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
      if (query.draws < 1 || query.draws > 30) {
        throw new Error(
          "Il numero di estrazioni deve essere compreso tra 1 e 30."
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
    <div className="text-[var(--color-custom)]">
      <header className="mx-auto cl:max-w-[1550px] xl:px-[100px]">
        <nav className="flex w-full items-center justify-between px-6 py-5 md:px-4 xl:px-0 xl:oy-8">
          <a className="flex items-end gap-2 cursor-pointer">
            <div className="flex w-[175px] md:w-[180px] xl:w-[205px] h-auto text-xl">
              <h2>🎲</h2>
              <h2 className="text-white">RANDOMIZER</h2>
            </div>
          </a>
        </nav>
      </header>
      <div>
        <input
          className="bg-transparent"
          id="participants"
          type="number"
          value={query.participants.toString()}
          min={1}
          max={255}
          onChange={(e) => setParticipants(parseInt(e.target.value))}
        />

        <input
          className="bg-transparent"
          id="draws"
          type="number"
          value={query.draws.toString()}
          min={1}
          max={30}
          onChange={(e) => setDraws(parseInt(e.target.value))}
        />

        <button onClick={handleGenerateRandomNumbers}>
          Genera numeri casuali
        </button>

        {loading ? (
          <p>Generazione in corso...</p>
        ) : (
          <ul>
            {randomNumbers.map((number, index) => (
              <li key={index}>{number}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
