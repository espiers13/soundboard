function Header() {
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "pink",
    "purple",
    "cyan",
    "emerald",
    "indigo",
    "fuchsia",
    "rose",
    "sky",
    "teal",
  ];
  const rows = 4;
  const cols = 50;

  const grid = Array.from({ length: rows }, () =>
    Array.from(
      { length: cols },
      () => colors[Math.floor(Math.random() * colors.length)]
    )
  );

  return (
    <header className="w-full h-20 relative overflow-hidden">
      <div
        className="grid absolute inset-0 gap-0"
        style={{ gridTemplateColumns: `repeat(${cols}, 1rem)` }}
      >
        {grid.flatMap((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-4 h-4 ${`bg-${color}-500`} bg-opacity-50`}
            />
          ))
        )}
      </div>
      <h1 className="relative text-white text-2xl font-bold flex items-center justify-center h-full">
        Pixel Artist
      </h1>
    </header>
  );
}

export default Header;
