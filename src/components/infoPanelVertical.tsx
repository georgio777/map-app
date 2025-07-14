// src/components/InfoPanelVertical.tsx
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import '../styles/InfoPanelVertical.css';
import useStore from '../store/store';


const HANDLE_HEIGHT = 40;      // px
const HANDLE_MARGIN = 0;      // px
const CLOSED_OFFSET = HANDLE_HEIGHT + HANDLE_MARGIN * 2;

type SnapPoints = {
  closed: number;
  half: number;
  open: number;
};

const InfoPanelVertical: React.FC = () => {
  const { currentCharacter } = useStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(() => window.innerHeight);
  const [currentY, setCurrentY] = useState<number>(CLOSED_OFFSET);
  const offsetRef = useRef<number>(CLOSED_OFFSET);

  // Обновляем высоту экрана при ресайзе
  useEffect(() => {
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Определяем snap‑точки в пикселях
  const SNAP: SnapPoints = useMemo(
    () => ({
      closed: CLOSED_OFFSET,
      half: windowHeight / 2,
      open: windowHeight,
    }),
    [windowHeight]
  );

  // При монтировании выставляем закрытую позицию
  useEffect(() => {
    setCurrentY(SNAP.closed);
    offsetRef.current = SNAP.closed;
  }, [SNAP.closed]);

  useEffect(() => {
  if (currentCharacter == null) return;

  // включаем CSS‑переход для плавности
  if (panelRef.current) {
    panelRef.current.style.transition = 'transform 0.3s ease';
  }

  // смещаемся в snap-полупозицию
  setCurrentY(SNAP.half);
  offsetRef.current = SNAP.half;
}, [currentCharacter, SNAP.half]);

  // Вычисляем ближайшую точку притяжения
  const getClosestPoint = useCallback(
    (offset: number) => {
      return [SNAP.closed, SNAP.half, SNAP.open].reduce(
        (best, pt) =>
          Math.abs(offset - pt) < Math.abs(offset - best) ? pt : best,
        SNAP.closed
      );
    },
    [SNAP]
  );

  // Начало перетаскивания
  const startDrag = useCallback(
    (startMouseY: number, startOffset: number, pointerId: number) => {
      // отключаем CSS-переход для ручного движения
      if (panelRef.current) panelRef.current.style.transition = 'none';

      const onMove = (e: PointerEvent) => {
        const delta = startMouseY - e.clientY;
        const raw = startOffset + delta;
        const clamped = Math.min(
          Math.max(raw, SNAP.closed),
          SNAP.open
        );
        offsetRef.current = clamped;
        setCurrentY(clamped);
      };

      const onUp = (e: PointerEvent) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        // отпустить захват указателя
        panelRef.current?.releasePointerCapture(pointerId);

        // «притягиваем» к ближайшей точке
        const snapTo = getClosestPoint(offsetRef.current);
        if (panelRef.current)
          panelRef.current.style.transition = 'transform 0.3s ease';
        setCurrentY(snapTo);
        offsetRef.current = snapTo;

        // по окончании transition убираем inline-стиль
        const cleanup = () => {
          if (panelRef.current) {
            panelRef.current.style.transition = '';
            panelRef.current.removeEventListener(
              'transitionend',
              cleanup
            );
          }
        };
        panelRef.current?.addEventListener('transitionend', cleanup);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [SNAP, getClosestPoint]
  );

  // Обработчик нажатия на ручку
  const onHandlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // перехватываем указатель, чтобы получать его события
      e.currentTarget.setPointerCapture(e.pointerId);
      startDrag(e.clientY, offsetRef.current, e.pointerId);
    },
    [startDrag]
  );

  // Вычисляем translateY
  const translateY = windowHeight - currentY;

  return (
    <div
      ref={panelRef}
      className="info-panel-vertical"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      <div
        className="info-panel__handle"
        onPointerDown={onHandlePointerDown}
      />
      <div className="info-panel__content">
        <h2>Информационная панель</h2>
        <p>Перетащите меня вверх или вниз!</p>
      </div>
    </div>
  );
};

export default InfoPanelVertical;
