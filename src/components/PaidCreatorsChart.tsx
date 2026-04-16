import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CREATOR_CARDS } from '../constants/cards'
import { TOOLTIP_CURSOR_LINE } from '../constants/theme'
import { StackedTooltip } from './StackedTooltip'



export const PaidCreatorsChart = ({ data }: { data: Array<Record<string, unknown>> }) => (
  <section className="chart-section">
    <h2>Créateurs par mois — apps payantes (Docs + Events + Jobs)</h2>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip content={<StackedTooltip />} cursor={TOOLTIP_CURSOR_LINE} />
        <Legend />
        <Line type="monotone" dataKey="docs" name="Documents" stroke={CREATOR_CARDS.docs.color} strokeWidth={2} />
        <Line type="monotone" dataKey="events" name="Events" stroke={CREATOR_CARDS.events.color} strokeWidth={2} />
        <Line type="monotone" dataKey="jobs" name="Jobs" stroke={CREATOR_CARDS.jobs.color} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </section>
)
