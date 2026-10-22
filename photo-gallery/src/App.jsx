import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import useFetchPhotos from "./hooks/useFetchPhotos";

function favoritesReducer(favorites, action) {
  switch (action.type) {
    case "toggle":
      if (favorites.includes(action.id)) {
        return favorites.filter((id) => id !== action.id);
      }

      return [...favorites, action.id];

    default:
      return favorites;
  }
}

function App() {
  const { photos, loading, error } = useFetchPhotos();

  const [favorites, dispatch] = useReducer(favoritesReducer, [], () => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesName = photo.author
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesFavorite = !showFavorites || favorites.includes(photo.id);

      return matchesName && matchesFavorite;
    });
  }, [photos, search, showFavorites, favorites]);

  function toggleFavorite(id) {
    dispatch({ type: "toggle", id });
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-purple-700">
          Photo Gallery
        </h1>

        <p className="mb-6 text-gray-600">
          Browse photos and save your favourites.
        </p>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by author..."
            value={search}
            onChange={handleSearch}
            className="flex-1 rounded border bg-white p-3"
          />

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="rounded bg-purple-700 px-4 py-3 text-white"
          >
            {showFavorites ? "Show All" : "Favourites"}
          </button>
        </div>

        {loading && (
          <div className="py-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-700" />
            <p className="mt-3">Loading photos...</p>
          </div>
        )}

        {!loading && error && (
          <p className="py-10 text-center text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded bg-white shadow"
              >
                <img
                  src={`https://picsum.photos/id/${photo.id}/500/350`}
                  alt={`Photo by ${photo.author}`}
                  className="h-52 w-full object-cover"
                />

                <div className="flex items-center justify-between p-4">
                  <p className="truncate">{photo.author}</p>

                  <button
                    onClick={() => toggleFavorite(photo.id)}
                    aria-label="Toggle favourite"
                    className="ml-3 text-2xl"
                  >
                    {favorites.includes(photo.id) ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            ))}

            {filteredPhotos.length === 0 && (
              <p className="col-span-full py-10 text-center text-gray-500">
                No photos found.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
