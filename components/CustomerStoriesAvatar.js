const COLORS = [
  "bg-[#1240cc]",
  "bg-emerald-600",
  "bg-teal-600",
  "bg-slate-700",
  "bg-cyan-700",
  "bg-stone-700",
];

function colorForName(name) {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
}

function initialsForName(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function CustomerStoriesAvatar({ name, size = "h-11 w-11" }) {
  return (
    <div
      className={`${size} ${colorForName(name)} rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0`}
      aria-hidden="true"
    >
      {initialsForName(name)}
    </div>
  );
}
