import { useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CREATOR_CARDS } from '../constants/cards'
import { TOOLTIP_CURSOR_LINE } from '../constants/theme'
import { formatK } from '../utilities/format'
import { AppFilter } from './AppFilter'
import { StackedTooltip } from './StackedTooltip'



const ALL_KEYS = Object.keys(CREATOR_CARDS)
const PAID_KEYS = ['docs', 'events', 'jobs']

const PRESETS = [
  { label: 'Toutes', keys: ALL_KEYS },
  { label: 'Apps payantes', keys: PAID_KEYS },
  { label: 'Socle', keys: ['news', 'messages'] },
]

export const CreatorsChart = ({ data }: { data: Array<Record<string, unknown>> }) => {

  const [selected, setSelected] = useState(ALL_KEYS)

  return (
    <section className="chart-section">
      <h2>Créateurs uniques par mois</h2>

      <AppFilter
        apps={CREATOR_CARDS}
        presets={PRESETS}
        defaultKeys={ALL_KEYS}
        onChange={setSelected}
      />

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={formatK} />
          <Tooltip content={<StackedTooltip />} cursor={TOOLTIP_CURSOR_LINE} />
          <Legend />

          {Object.entries(CREATOR_CARDS)
            .filter(([key]) => selected.includes(key))
            .map(([key, card]) => (
              <Line key={key} type="monotone" dataKey={key} name={card.label} stroke={card.color} strokeWidth={2} />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}
