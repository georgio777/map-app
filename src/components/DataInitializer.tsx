import useDataLoader from "../hooks/useDataLoader";
import useStore from "../store/store";

function DataInitializer() {
  const { loading } = useStore()
  useDataLoader();
  return !loading ? null : <p>Загрузка...</p>
}

export default DataInitializer