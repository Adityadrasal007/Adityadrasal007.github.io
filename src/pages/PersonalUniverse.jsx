import React, { useEffect } from 'react';
import useGameController from '../components/personal/useGameController';
import ParallaxWorld from '../components/personal/ParallaxWorld';
import Character from '../components/personal/Character';
import GameHUD from '../components/personal/GameHUD';

export function PersonalUniverse() {
  const {
    character,
    cameraX,
    hasMoved,
    teleportTo,
    setTouchMove,
    triggerJump,
  } = useGameController();

  // Scroll to top/origin when entering Personal Universe
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = 'Personal Universe — Aditya Rasal';
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* 4-Tier Interactive Parallax World */}
      <ParallaxWorld cameraX={cameraX} characterX={character.x}>
        {/* Animated Character Sprite */}
        <Character state={character} />
      </ParallaxWorld>

      {/* Game HUD (Mini-Map, Fast Travel, Audio, Mobile Controls) */}
      <GameHUD
        characterX={character.x}
        hasMoved={hasMoved}
        onTeleport={teleportTo}
        onTouchMove={setTouchMove}
        onJump={triggerJump}
      />
    </div>
  );
}

export default PersonalUniverse;
