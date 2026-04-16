import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { OBJECT_CARDS } from '../constants/cards'
import { TOOLTIP_CURSOR_BAR } from '../constants/theme'
import { StackedTooltip } from './StackedTooltip'



export const PaidObjectsChart = ({ data }: { data: Array<Record<string, unknown>> }) => (
  <section className="chart-section">
    <h2>Objets créés par mois — apps payantes uniquement (Docs + Events + Jobs)</h2>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip content={<StackedTooltip />} cursor={TOOLTIP_CURSOR_BAR} />
        <Legend />
        <Bar dataKey="docs" name="Documents" stackId="a" fill={OBJECT_CARDS.docs.color} />
        <Bar dataKey="events" name="Events" stackId="a" fill={OBJECT_CARDS.events.color} />
        <Bar dataKey="jobs" name="Jobs" stackId="a" fill={OBJECT_CARDS.jobs.color} />
      </BarChart>
    </ResponsiveContainer>
  </section>
)
