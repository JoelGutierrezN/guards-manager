import { type JSX, useState } from 'react'

const DAYS = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
const ASSIGNED = [12, 18, 9, 22, 14, 27, 18, 15, 24, 29, 17, 26, 21, 33]
const RETURNED = [10, 14, 7, 18, 12, 20, 15, 11, 19, 22, 14, 19, 16, 24]

const W = 760
const H = 200
const PAD = { t: 12, r: 10, b: 22, l: 28 }
const MAX_V = Math.max(...ASSIGNED, ...RETURNED) + 4

const x = (i: number): number => PAD.l + (i * (W - PAD.l - PAD.r)) / (DAYS.length - 1)
const y = (v: number): number => H - PAD.b - (v * (H - PAD.t - PAD.b)) / MAX_V
const line = (arr: number[]): string =>
  arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ')
const area = (arr: number[]): string =>
  `${line(arr)} L ${x(arr.length - 1)} ${H - PAD.b} L ${x(0)} ${H - PAD.b} Z`

export function ActivityChart(): JSX.Element {
  const [hover, setHover] = useState(7)
  const yTicks = [0, Math.round(MAX_V / 2), MAX_V]

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const step = (W - PAD.l - PAD.r) / (DAYS.length - 1)
    const i = Math.max(0, Math.min(DAYS.length - 1, Math.round((px - PAD.l) / step)))
    setHover(i)
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="block h-auto"
        onMouseLeave={() => setHover(7)}
        onMouseMove={handleMove}
      >
        <defs>
          <linearGradient id="g-assigned" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#272871" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#272871" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(t)}
              y2={y(t)}
              stroke="rgba(26,19,38,0.06)"
              strokeDasharray="2 3"
            />
            <text x={6} y={y(t) + 4} fontSize="9" fill="#7b7388" fontFamily="JetBrains Mono">
              {t}
            </text>
          </g>
        ))}

        {DAYS.map((d, i) => (
          <text
            key={d}
            x={x(i)}
            y={H - 8}
            fontSize="9"
            fill="#7b7388"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            {d}
          </text>
        ))}

        <path d={area(ASSIGNED)} fill="url(#g-assigned)" />
        <path
          d={line(RETURNED)}
          stroke="#aea7bb"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3 3"
        />
        <path d={line(ASSIGNED)} stroke="#272871" strokeWidth="2.2" fill="none" />

        {ASSIGNED.map((v, i) => (
          <circle
            key={`a${i}`}
            cx={x(i)}
            cy={y(v)}
            r={hover === i ? 4 : 2.5}
            fill="#272871"
            stroke="#fff"
            strokeWidth="1.5"
          />
        ))}

        <line
          x1={x(hover)}
          x2={x(hover)}
          y1={PAD.t}
          y2={H - PAD.b}
          stroke="#272871"
          strokeOpacity="0.25"
          strokeDasharray="3 3"
        />
      </svg>

      <div
        className="pointer-events-none absolute top-1 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 font-mono text-[11px] tracking-[0.02em] whitespace-nowrap text-white shadow-[0_6px_14px_-4px_rgba(26,19,38,0.4)]"
        style={{ left: `${(x(hover) / W) * 100}%` }}
      >
        <b className="mb-0.5 block font-sans text-[12px]">{DAYS[hover]} may</b>
        <span className="text-[#C1C1F1]">● {ASSIGNED[hover]}</span> asign ·{' '}
        <span className="text-white/60">○ {RETURNED[hover]}</span> dev
      </div>
    </div>
  )
}
