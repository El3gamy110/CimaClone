import { Star } from 'lucide-react';

interface RatingBadgeProps {
  score?: number;
  className?: string;
  showText?: boolean;
}

export function RatingBadge({ score, className = '', showText = true }: RatingBadgeProps) {
  if (score === undefined || score === null) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent-amber fill-accent-amber" />
      <div className="flex items-baseline gap-0.5 font-sans">
        <span className="text-white font-bold text-xs md:text-sm">{score.toFixed(1)}</span>
        {showText && <span className="text-[10px] md:text-xs text-gray-500 font-medium">/10</span>}
      </div>
    </div>
  );
}
