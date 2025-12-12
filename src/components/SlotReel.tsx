import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SlotReelProps {
  spinning: boolean;
  finalValue: number | null;
  delay: number;
  onSpinComplete?: () => void;
}

const SlotReel = ({ spinning, finalValue, delay, onSpinComplete }: SlotReelProps) => {
  const [displayValue, setDisplayValue] = useState<number | null>(null);
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
    } else if (finalValue === null) {
      // Reset to default when not spinning and no final value
      setDisplayValue(null);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [spinning, finalValue, delay, onSpinComplete]);

  return (
    <div className="slot-reel-container">
      <div className={cn("slot-reel-window", isSpinning && "active")}>
        <div className={cn(
          "slot-reel-number",
          isSpinning && "spinning"
        )}>
          {displayValue !== null ? displayValue : "?"}
        </div>
      </div>
      <div className={cn("slot-reel-glow", isSpinning && "active")} />
    </div>
  );
};

export default SlotReel;
