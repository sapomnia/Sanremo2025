import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';

const WordCloud = () => {
  const [data, setData] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [wordCounts, setWordCounts] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('lyrics.csv');
        const text = await response.text();
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true
        });
        
        // Correggiamo il nome dell'artista
        const correctedData = result.data.map(row => ({
          ...row,
          Artista: row.Artista === 'Come_Cose' ? 'Coma_Cose' : row.Artista
        }));

        const uniqueArtists = _.uniq(correctedData.map(row => row.Artista));
        setArtists(['Tutte le canzoni', ...uniqueArtists]); // Aggiungiamo l'opzione per tutte le canzoni
        setSelectedArtist('Tutte le canzoni');
        setData(correctedData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const filteredWords = data
        .filter(row => selectedArtist === 'Tutte le canzoni' || row.Artista === selectedArtist)
        .map(row => row.Parola.toLowerCase())
        .filter(word => word.length > 2); // Filtriamo le parole troppo corte

      const counts = _.countBy(filteredWords);
      const sortedCounts = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 50); // Prendiamo le 50 parole più frequenti
      
      setWordCounts(Object.fromEntries(sortedCounts));
    }
  }, [selectedArtist, data]);

  const maxCount = Math.max(...Object.values(wordCounts));
  const minFontSize = 12;
  const maxFontSize = 48;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-right font-bold text-xl mb-6" style={{ fontFamily: 'Futura, sans-serif' }}>
        Sanremo 2025: la word cloud delle canzoni in gara
      </h1>
      
      <div className="mb-4">
        <select 
          className="w-full p-2 border rounded"
          value={selectedArtist}
          onChange={(e) => setSelectedArtist(e.target.value)}
        >
          {artists.map(artist => (
            <option key={artist} value={artist}>{artist}</option>
          ))}
        </select>
      </div>

      <div className="relative w-full h-[600px] border rounded bg-white p-4">
        <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-4 p-8">
          {Object.entries(wordCounts).map(([word, count]) => {
            const fontSize = minFontSize + (count / maxCount) * (maxFontSize - minFontSize);
            return (
              <span
                key={word}
                className="inline-block"
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily: 'Futura, sans-serif',
                  opacity: 0.7 + (count / maxCount) * 0.3,
                  transform: `rotate(${Math.random() * 30 - 15}deg)`,
                  color: `hsl(${Math.random() * 360}, 70%, 50%)`
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WordCloud;