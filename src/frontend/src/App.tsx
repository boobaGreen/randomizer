import { useState } from "react";

function App() {
  const [query, setQuery] = useState({
    draws: 0,
    participants: 0,
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
    <div>
      <input
        id="participants"
        type="number"
        value={query.participants.toString()}
        min={1}
        max={255}
        onChange={(e) => setParticipants(parseInt(e.target.value))}
      />

      <input
        id="draws"
        type="number"
        value={query.draws.toString()}
        min={1}
        max={query.participants}
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
  );
}

export default App;
