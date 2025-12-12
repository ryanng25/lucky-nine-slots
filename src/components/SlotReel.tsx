import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SlotReelProps {
  spinning: boolean;
  finalValue: number | null;
  delay: number;
  onSpinComplete?: () => void;
}

const SlotReel = ({ spinning, finalValue, delay, onSpinComplete }: SlotReelProps) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (spinning) {
      setIsSpinning(true);
      
      // Rapid number cycling during spin
      intervalRef.current = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 10));
      }, 50);

      // Stop after delay
      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (finalValue !== null) {
          setDisplayValue(finalValue);
        }
        setIsSpinning(false);
        onSpinComplete?.();
      }, delay);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [spinning, finalValue, delay, onSpinComplete]);

  return (
    <div className="slot-reel-container">
      <div className="slot-reel-window">
        <div className={cn(
          "slot-reel-number",
          isSpinning && "spinning"
        )}>
          {displayValue}
        </div>
      </div>
      <div className="slot-reel-glow" />
    </div>
  );
};

export default SlotReel;
