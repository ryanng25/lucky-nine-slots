import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import SlotReel from "./SlotReel";
import { cn } from "@/lib/utils";

const SlotMachine = () => {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState<(number | null)[]>([null, null, null]);
  const [activeReels, setActiveReels] = useState<boolean[]>([false, false, false]);
  const [completedReels, setCompletedReels] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  const handleSpin = useCallback((reelCount: 1 | 2 | 3) => {
    if (spinning) return;
    
    setSpinning(true);
    setCompletedReels(0);
    setSpinCount(reelCount);
    
    // Reset all results to null first, then set new values for spinning reels
    const newResults: (number | null)[] = [null, null, null];
    const newActiveReels = [false, false, false];
    
    for (let i = 0; i < reelCount; i++) {
      newResults[i] = Math.floor(Math.random() * 10);
      newActiveReels[i] = true;
    }
    
    setResults(newResults);
    setActiveReels(newActiveReels);
  }, [spinning]);

  const handleReelComplete = useCallback(() => {
    setCompletedReels(prev => {
      const next = prev + 1;
      if (next >= spinCount) {
        setSpinning(false);
        setActiveReels([false, false, false]);
      }
      return next;
    });
  }, [spinCount]);

  const getDelays = () => {
    const baseDelay = 1000;
    return [baseDelay, baseDelay + 500, baseDelay + 1000];
  };

  const delays = getDelays();

  const getDisplayResults = () => {
    return results.filter(r => r !== null).join(" - ");
  };

  return (
    <div className="slot-machine">
      {/* Header */}
      <div className="slot-header">
        <h1 className="slot-title">Lucky 9</h1>
        <p className="slot-subtitle">Test Your Fortune</p>
      </div>

      {/* Slot Display */}
      <div className="slot-display">
        <div className="slot-frame">
          <div className="slot-reels">
            {[0, 1, 2].map((index) => (
              <SlotReel
                key={index}
                spinning={activeReels[index]}
                finalValue={results[index]}
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

      {/* Spin Buttons */}
      <div className="spin-buttons">
        <Button
          onClick={() => handleSpin(1)}
          disabled={spinning}
          variant="spin"
          size="spinSmall"
          className="spin-btn-lucky"
        >
          {spinning && spinCount === 1 ? "SPINNING..." : "LUCKY 9"}
        </Button>
        <Button
          onClick={() => handleSpin(2)}
          disabled={spinning}
          variant="spin"
          size="spinSmall"
          className="spin-btn-double"
        >
          {spinning && spinCount === 2 ? "SPINNING..." : "DOUBLE LUCKY 9"}
        </Button>
        <Button
          onClick={() => handleSpin(3)}
          disabled={spinning}
          variant="spin"
          size="spinSmall"
          className="spin-btn-triple"
        >
          {spinning && spinCount === 3 ? "SPINNING..." : "TRIPLE LUCKY 9"}
        </Button>
      </div>

      {/* Result Display */}
      {!spinning && results.some(r => r !== null) && (
        <div className="result-display">
          <span className="result-label">Result:</span>
          <span className="result-value">{getDisplayResults()}</span>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
