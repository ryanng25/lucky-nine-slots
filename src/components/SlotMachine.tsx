import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import SlotReel from "./SlotReel";
import { cn } from "@/lib/utils";

type GameMode = "single" | "double" | "triple";

const SlotMachine = () => {
  const [gameMode, setGameMode] = useState<GameMode>("single");
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [completedReels, setCompletedReels] = useState(0);

  const reelCount = gameMode === "single" ? 1 : gameMode === "double" ? 2 : 3;

  const handleSpin = useCallback(() => {
    if (spinning) return;
    
    setSpinning(true);
    setCompletedReels(0);
    
    // Generate random results
    const newResults = Array.from({ length: reelCount }, () => 
      Math.floor(Math.random() * 10)
    );
    setResults(newResults);
  }, [spinning, reelCount]);

  const handleReelComplete = useCallback(() => {
    setCompletedReels(prev => {
      const next = prev + 1;
      if (next >= reelCount) {
        setSpinning(false);
      }
      return next;
    });
  }, [reelCount]);

  const getDelays = () => {
    const baseDelay = 1000;
    return Array.from({ length: reelCount }, (_, i) => baseDelay + (i * 500));
  };

  const delays = getDelays();

  return (
    <div className="slot-machine">
      {/* Header */}
      <div className="slot-header">
        <h1 className="slot-title">Lucky 9</h1>
        <p className="slot-subtitle">Test Your Fortune</p>
      </div>

      {/* Game Mode Selector */}
      <div className="mode-selector">
        <button
          onClick={() => !spinning && setGameMode("single")}
          className={cn("mode-btn", gameMode === "single" && "active")}
          disabled={spinning}
        >
          Lucky 9
        </button>
        <button
          onClick={() => !spinning && setGameMode("double")}
          className={cn("mode-btn", gameMode === "double" && "active")}
          disabled={spinning}
        >
          Double Lucky 9
        </button>
        <button
          onClick={() => !spinning && setGameMode("triple")}
          className={cn("mode-btn", gameMode === "triple" && "active")}
          disabled={spinning}
        >
          Triple Lucky 9
        </button>
      </div>

      {/* Slot Display */}
      <div className="slot-display">
        <div className="slot-frame">
          <div className="slot-reels">
            {Array.from({ length: reelCount }).map((_, index) => (
              <SlotReel
                key={`${gameMode}-${index}`}
                spinning={spinning}
                finalValue={results[index] ?? 0}
                delay={delays[index]}
                onSpinComplete={handleReelComplete}
              />
            ))}
          </div>
        </div>
        
        {/* Decorative lights */}
        <div className="light-strip top">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={cn("light", spinning && "animate")} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <div className="light-strip bottom">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={cn("light", spinning && "animate")} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>

      {/* Spin Button */}
      <Button
        onClick={handleSpin}
        disabled={spinning}
        variant="spin"
        size="spin"
        className={cn(spinning && "spinning")}
      >
        {spinning ? "SPINNING..." : "SPIN"}
      </Button>

      {/* Result Display */}
      {!spinning && results.length > 0 && (
        <div className="result-display">
          <span className="result-label">Result:</span>
          <span className="result-value">{results.join(" - ")}</span>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
