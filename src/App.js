
import logo from "./pokemon.jpg";
import "./App.css";
import pokemonData from "./pokemonapi.json";
import React, { useState, useEffect } from "react";

function App() {
  const [pokemonList, setPokemonList] = useState(pokemonData.results);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.includes(searchTerm)
  );

  const showPokemon = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Error fetching Pokemon: ${response.statusText}`);
        return;
      }

      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    }
  };

  const getColorCode = (type) => {
    switch (type) {
      case "grass":
        return "#78c850";
      case "fire":
        return "#f08030";
      case "water":
        return "#6890f0";
      case "normal":
        return "#A8A77A";
      case "electric":
        return "#F7D02C";
      case "ice":
        return "#96D9D6";
      case "fighting":
        return "#C22E28";
      case "poison":
        return "#A33EA1";
      case "ground":
        return "#E2BF65";
      case "flying":
        return "#A98FF3";
      case "psychic":
        return "#F95587";
      case "bug":
        return "#A6B91A";
      case "rock":
        return "#B6A136";
      case "ghost":
        return "#735797";
      case "dragon":
        return "#6F35FC";
      case "dark":
        return "#705746";
      case "steel":
        return "#B7B7CE";
      case "fairy":
        return "#B685AD";
      default:
        return "#ffffff"; // Default color
    }
  };

  const getGradientStyle = () => {
    if (selectedPokemon) {
      const primaryType = selectedPokemon.types[0].type.name;
      const secondaryType = selectedPokemon.types[1]
        ? selectedPokemon.types[1].type.name
        : null;

      const gradientStart = getColorCode(primaryType);
      const gradientEnd = secondaryType
        ? getColorCode(secondaryType)
        : getColorCode(primaryType);

      return {
        background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
      };
    }
    return {};
  };

  const searchPokemon = (query) => {
    setSearchTerm(query);
    if (!query) {
      setSelectedPokemon(null);
      return;
    }

    // Check if the query is a number (ID search) or a string (name search)
    if (!isNaN(query)) {
      // If the query is a number, search by ID
      const pokemon = pokemonList.find((pokemon) =>
        pokemon.url.includes(`/${query}/`)
      );
      if (pokemon) {
        showPokemon(pokemon.url);
      } else {
        console.error(`Pokemon with ID ${query} not found.`);
        setSelectedPokemon(null); // Clear selectedPokemon state if not found
      }
    } else {
      // If the query is a string, search by name
      const pokemon = pokemonList.find(
        (pokemon) => pokemon.name.toLowerCase() === query.toLowerCase()
      );
      if (pokemon) {
        showPokemon(pokemon.url);
      } else {
        console.error(`Pokemon with name '${query}' not found.`);
        setSelectedPokemon(null);
      }
    }
  };

  return (
    <div className="App" style={getGradientStyle()}>
      <header>
        <img alt="react logo" className="logo" src={logo} />
      </header>

      <main>
        <div className="search-container">
          <input
            className="search-box"
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(event) => searchPokemon(event.target.value)}
          />
        </div>

        {selectedPokemon && (
          <div className="pokemon-details">
            <h2>{selectedPokemon.name}</h2>
            <img
              src={selectedPokemon.sprites.front_default}
              alt={selectedPokemon.name}
            />
            <p>
              Type:{" "}
              {selectedPokemon.types.map((type) => type.type.name).join(", ")}
            </p>
            <p>Height: {selectedPokemon.height}</p>
            <p>Weight: {selectedPokemon.weight}</p>

            {selectedPokemon.stats.map((stat, index) => (
              <div key={index}>
                <p>
                  {stat.stat.name}: {stat.base_stat}
                </p>
              </div>
            ))}
          </div>
        )}

        <ul>
          {filteredPokemonList.map((pokemon) => (
            <li key={pokemon.name} className="pokemon-item">
              <a href="#" onClick={() => showPokemon(pokemon.url)}>
                {pokemon.name}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
