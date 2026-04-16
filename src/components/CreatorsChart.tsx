import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CREATOR_CARDS } from '../constants/cards'
import { TOOLTIP_CURSOR_LINE } from '../constants/theme'
import { formatK } from '../utilities/format'
import { StackedTooltip } from './StackedTooltip'



export const CreatorsChart = ({ data }: { data: Array<Record<string, unknown>> }) => (
  <section className="chart-section">
    <h2>Créateurs uniques par mois — par application</h2>

    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis tickFormatter={formatK} />
        <Tooltip content={<StackedTooltip />} cursor={TOOLTIP_CURSOR_LINE} />
        <Legend />

        {Object.entries(CREATOR_CARDS).map(([key, card]) => (
          <Line key={key} type="monotone" dataKey={key} name={card.label} stroke={card.color} strokeWidth={2} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </section>
)
