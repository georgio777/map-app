import InteractiveMap from "./components/InteractiveMap";
import InfoPanel from "./components/InfoPanel";
import InfoPanelVertical from "./components/infoPanelVertical";
import useDataLoader from "./hooks/useDataLoader";
import useStore from "./store/store";
import './App.css';
import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1024);
  const { loading } = useStore();

  const handleResize = useCallback(() => {
    setDesktop(window.innerWidth > 1024);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useDataLoader();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <InteractiveMap />

              {loading && (
                <div className="loader-wrapper">
                  <div className="loader"></div>
                </div>
              )}

              {isDesktop ? <InfoPanel /> : <InfoPanelVertical />}
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;