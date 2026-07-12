export default function NumberBalls({ numbers, highlight, colors = {}, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {numbers.map((num, i) => {
        const isMatch = highlight && highlight.includes(num);
        let ballClass = 'ball-default';
        if (isMatch) ballClass = 'ball-match-bg';
        else if ('bonus' in colors) ballClass = 'ball-bonus';
        else if ('supp' in colors) ballClass = 'ball-supp';
        else if ('main' in colors) ballClass = 'ball-main';

        return (
          <span
            key={i}
            className={`ball ${sizeClass} ${ballClass} ${isMatch ? 'ball-match ring-2 ring-emerald-400/50' : ''} text-white shadow-lg`}
          >
            {num}
          </span>
        );
      })}
    </div>
  );
}