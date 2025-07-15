// App.tsx — Шаг 1: подключаем useSearchParams и читаем параметр id
import { useSearchParams } from "react-router-dom";
import InteractiveMap from "./components/InteractiveMap";
import InfoPanel from "./components/InfoPanel";
import InfoPanelVertical from "./components/infoPanelVertical";
import useDataLoader from "./hooks/useDataLoader";
import useStore from "./store/store";
import './App.css';
import { useEffect, useState, useCallback } from "react";

function App() {
  // 1. читаем и записываем параметры из URL
  const [ searchParams ] = useSearchParams();
  const idFromUrl = searchParams.get("id"); // например "42"

  // остальная логика
  const [isDesktop, setDesktop] = useState(() => window.innerWidth > 1024);
  const { loading, data, currentCharacter, setCurrentCharacter, setCurrentId } = useStore();

  // ваш ресайз-хук
  const handleResize = useCallback(() => {
    setDesktop(window.innerWidth > 1024);
  }, []);
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // хук для подгрузки данных
  useDataLoader();

  // 2. При загрузке данных — если в URL есть ?id=..., находим персонажа и устанавливаем
  useEffect(() => {
    if (!loading && data && idFromUrl && !currentCharacter) {
      setCurrentId(Number(idFromUrl))
      const match = data.find((c) => String(c.id) === idFromUrl);
      if (match) {
        setCurrentCharacter(match);
      }
    }
  }, [loading, data, idFromUrl, currentCharacter, setCurrentCharacter]);

  return (
    <>
      <InteractiveMap />
      {loading && (
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      )}
      {isDesktop ? <InfoPanel /> : <InfoPanelVertical />}
    </>
  );
}

export default App;
