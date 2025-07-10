import { useEffect } from "react";
import useStore from "../store/store";

export default function useDataLoader() {
  const { setData, setError, setLoading } = useStore();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/data/characters.json', {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log(jsonData);
        

        setData(jsonData);
        setError(null)
      } catch(err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [setData, setError, setLoading]);

  return null
}