import React, { useState, useEffect } from "react";

function App() {
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [participants, setParticipants] = useState<number>(1); // Stato per il numero di partecipanti
  const [draws, setDraws] = useState<number>(1); // Stato per il numero di estrazioni

  // Funzione per gestire la generazione dei numeri casuali
  async function handleGenerateRandomNumbers() {
    setLoading(true); // Imposta lo spinner di caricamento

    try {
      const response = await fetch(
        `${import.meta.env.VITE_CANISTER_ORIGIN}/randomness`,
        {
          method: "POST",
          body: JSON.stringify({ participants, draws }), // Includi il numero di partecipanti e il numero di estrazioni nella richiesta
        }
      );
      const data = await response.json();
      if (data) {
        setRandomNumbers(data); // Mostra solo il numero di estrazioni desiderato
      } else {
        console.error("La risposta non contiene un array di numeri casuali.");
      }
    } catch (error) {
      console.error(
        "Si è verificato un errore durante la generazione dei numeri casuali:",
        error
      );
    } finally {
      setLoading(false); // Rimuovi lo spinner di caricamento
    }
  }

  useEffect(() => {
    // Chiamata alla funzione per generare i numeri casuali quando cambia qualche dipendenza (in questo caso, vuoto per generarlo solo all'avvio)
    handleGenerateRandomNumbers();
  }, []);

  return (
    <div className="bg-gray-400">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div>
        <label htmlFor="participants">
          Numero di partecipanti (da 1 a 255):{" "}
        </label>
        <input
          id="participants"
          type="number"
          value={participants.toString()}
          min={1}
          max={255}
          onChange={(e) => setParticipants(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="draws">
          Numero di estrazioni (da 1 a {participants}):{" "}
        </label>
        <input
          id="draws"
          type="number"
          value={draws.toString()}
          min={1}
          max={participants}
          onChange={(e) => setDraws(parseInt(e.target.value))}
        />
      </div>
      <button onClick={handleGenerateRandomNumbers}>
        Genera Numeri Casuali
      </button>
      {loading && <div>Caricamento...</div>}
      {!loading && randomNumbers && randomNumbers.length > 0 && (
        <div>
          <div>Numeri Casuali Generati:</div>
          <ul>
            {randomNumbers.map((number, index) => (
              <li key={index}>{number}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
