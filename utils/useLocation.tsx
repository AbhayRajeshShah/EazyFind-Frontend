import { useState, useEffect } from "react";

interface Coordinates {
  lat: number | null;
  lon: number | null;
}

export const useUserLocation = ({
  setLoading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}): Coordinates => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if geolocation is available in the browser
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    // Ask for permission and get position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        setLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Permission denied");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Position unavailable");
            break;
          case err.TIMEOUT:
            setError("Request timed out");
            break;
          default:
            setError("An unknown error occurred");
        }
        setLoading(false);
      },
    );
  }, []);

  return { lat, lon };
};
