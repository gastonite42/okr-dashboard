import { formatNumber } from '../utilities/format'



export const StackedTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}) => {

  if (!active || !payload?.length)
    return null

  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0)

  return (
    <div style={{ background: '#252526', border: '1px solid #3c3c3c', borderRadius: 6, padding: '12px 16px', minWidth: 180 }}>
      <div style={{ color: '#e8bf6a', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
        {label}
      </div>

      {payload.filter(p => p.value > 0).map(p => (
        <div key={p.name} style={{ color: p.color, fontSize: 14, marginBottom: 4, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span>
            {p.name}
          </span>

          <span style={{ fontWeight: 600 }}>
            {formatNumber(p.value)}
          </span>
        </div>
      ))}

      <div style={{ borderTop: '1px solid #3c3c3c', marginTop: 8, paddingTop: 8, color: '#ffffff', fontWeight: 600, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
        <span>Total</span>

        <span>
          {formatNumber(total)}
        </span>
      </div>
    </div>
  )
}
