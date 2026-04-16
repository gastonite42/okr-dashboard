import { Bar, BarChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TOOLTIP_CURSOR_BAR } from '../constants/theme'
import { StackedTooltip } from './StackedTooltip'



export const ImportsChart = ({ data }: { data: Array<Record<string, unknown>> }) => (
  <section className="chart-section">
    <h2>Imports CSV membres — volume et taux de réussite</h2>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" />
        <Tooltip content={<StackedTooltip />} cursor={TOOLTIP_CURSOR_BAR} />
        <Legend />
        <Bar yAxisId="left" dataKey="succeeded" name="Réussis" fill="#16a34a" stackId="a" />
        <Bar yAxisId="left" dataKey="failed" name="Échoués" fill="#dc2626" stackId="a" />
        <Line yAxisId="right" type="monotone" dataKey="rate" name="Taux réussite %" stroke="#000" strokeWidth={2} />
      </BarChart>
    </ResponsiveContainer>
  </section>
)
