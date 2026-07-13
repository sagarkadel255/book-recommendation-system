interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
  maxRating?: number;
}

export default function StarRating({ rating, count, size = 14, maxRating = 10 }: StarRatingProps) {
  const starRating = (rating / maxRating) * 5;
  const fullStars = Math.floor(starRating);
  const hasHalfStar = starRating - fullStars >= 0.25;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} width={size} height={size} viewBox="0 0 20 20" fill="#D4A853">
            <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.28l-4.77 2.44.91-5.33-3.87-3.77 5.34-.78L10 1z"/>
          </svg>
        ))}
        {hasHalfStar && (
          <svg width={size} height={size} viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfGrad">
                <stop offset="50%" stopColor="#D4A853" />
                <stop offset="50%" stopColor="#E8E2D8" />
              </linearGradient>
            </defs>
            <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.28l-4.77 2.44.91-5.33-3.87-3.77 5.34-.78L10 1z" fill="url(#halfGrad)"/>
          </svg>
        )}
        {Array.from({ length: Math.max(0, emptyStars) }).map((_, i) => (
          <svg key={`empty-${i}`} width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#E8E2D8" strokeWidth="1">
            <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.28l-4.77 2.44.91-5.33-3.87-3.77 5.34-.78L10 1z"/>
          </svg>
        ))}
      </div>
      {count !== undefined && count > 0 && (
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px', color: '#8A7E75' }}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
