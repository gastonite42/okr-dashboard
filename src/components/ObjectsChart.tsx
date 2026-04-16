import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { OBJECT_CARDS } from '../constants/cards'
import { TOOLTIP_CURSOR_BAR } from '../constants/theme'
import { formatK } from '../utilities/format'
import { StackedTooltip } from './StackedTooltip'



export const ObjectsChart = ({ data }: { data: Array<Record<string, unknown>> }) => (
  <section className="chart-section">
    <h2>Objets créés par mois — par application</h2>

    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis tickFormatter={formatK} />
        <Tooltip content={<StackedTooltip />} cursor={TOOLTIP_CURSOR_BAR} />
        <Legend />

        {Object.entries(OBJECT_CARDS).map(([key, card]) => (
          <Bar key={key} dataKey={key} name={card.label} stackId="a" fill={card.color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </section>
)
