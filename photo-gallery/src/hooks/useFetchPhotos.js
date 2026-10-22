
import { useEffect, useState } from "react";

function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPhotos() {
      try {
        const response = await fetch(
          "https://picsum.photos/v2/list?limit=30"
        );

        if (!response.ok) {
          throw new Error("Could not load photos");
        }

        const data = await response.json();
        setPhotos(data);
      } catch {
        setError("Unable to load photos. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    getPhotos();
  }, []);

  return { photos, loading, error };
}

export default useFetchPhotos;
