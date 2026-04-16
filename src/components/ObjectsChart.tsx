import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { OBJECT_CARDS } from '../constants/cards'
import { TOOLTIP_CURSOR_BAR } from '../constants/theme'
import { formatK } from '../utilities/format'
import { AppFilter } from './AppFilter'
import { StackedTooltip } from './StackedTooltip'



const ALL_KEYS = Object.keys(OBJECT_CARDS)
const PAID_KEYS = ['docs', 'events', 'jobs']

const PRESETS = [
  { label: 'Toutes', keys: ALL_KEYS },
  { label: 'Apps payantes', keys: PAID_KEYS },
  { label: 'Socle', keys: ['news', 'messages'] },
]

export const ObjectsChart = ({ data }: { data: Array<Record<string, unknown>> }) => {

  const [selected, setSelected] = useState(ALL_KEYS)

  return (
    <section className="chart-section">
      <h2>Objets créés par mois</h2>

      <AppFilter
        apps={OBJECT_CARDS}
        presets={PRESETS}
        defaultKeys={ALL_KEYS}
        onChange={setSelected}
      />

      <ResponsiveContainer width="100%" height={600}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={formatK} />
          <Tooltip content={<StackedTooltip />} cursor={TOOLTIP_CURSOR_BAR} />
          <Legend />

          {Object.entries(OBJECT_CARDS)
            .filter(([key]) => selected.includes(key))
            .map(([key, card]) => (
              <Bar key={key} dataKey={key} name={card.label} stackId="a" fill={card.color} />
            ))}
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
