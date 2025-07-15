import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/InfoPanel.css';
import useStore from '../store/store';

function InfoPanel() {
  const { currentCharacter } = useStore();
  const [isOpen, setOpen] = useState(false);
  const isDraggableRef = useRef(false);
  const xRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef(0);
  const xStartRef = useRef(0);

  let screenWidth = window.innerWidth;
  let panelWidth = screenWidth * 0.3;
  const panelLedge = 0;

  const handleResize = useCallback(() => {
    screenWidth = window.innerWidth;
    panelWidth = screenWidth * 0.3;
    panelRef.current!.style.width = `${panelWidth}px`;
    panelRef.current!.style.transition = 'none';
    
    diffRef.current = isOpen ? -panelWidth + panelLedge : 0;
    panelRef.current!.style.transform = `translateX(${diffRef.current}px)`;
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const openPanel = () => {
    diffRef.current = -panelWidth + panelLedge;
    setOpen(true);
  };

  const closePanel = () => {
    diffRef.current = 0;
    setOpen(false);
  };

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    panelRef.current!.style.transition = 'none';
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggableRef.current = true;
    xStartRef.current = e.clientX;
    xRef.current = e.clientX;
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggableRef.current) {
      xRef.current = e.clientX;
      diffRef.current = isOpen 
        ? xRef.current - screenWidth + panelLedge
        : xRef.current - xStartRef.current;
      if (diffRef.current <= 0 && diffRef.current >= -panelWidth + panelLedge) {
        panelRef.current!.style.transform = `translateX(${diffRef.current}px)`;
      }
    }
  };

  const handleUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDraggableRef.current = false;
    panelRef.current!.style.transition = '.2s ease';
    
    if (xStartRef.current > xRef.current) {
      openPanel();
    } else {
      closePanel();
    }
    
    if (xRef.current - xStartRef.current === 0 && !isOpen) {
      openPanel();
    } else if (xRef.current - xStartRef.current === 0 && isOpen) {
      closePanel();
    }
    
    panelRef.current!.style.transform = `translateX(${diffRef.current}px)`;
  };

  useEffect(() => {
    if (!currentCharacter) return;
    openPanel();
    panelRef.current!.style.transform = `translateX(${diffRef.current}px)`;
  }, [currentCharacter]);

  return (
    <div ref={panelRef} className="info-panel">
      <div 
        onPointerDown={handleDown} 
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        className="grip"
      ></div>
      <div className="panel-inner">
      </div>
    </div>
  );
}

export default InfoPanel;