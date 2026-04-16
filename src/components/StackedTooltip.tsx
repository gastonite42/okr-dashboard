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
    <div style={{ background: '#252526', border: '1px solid #3c3c3c', borderRadius: 4, padding: '10px 14px' }}>
      <div style={{ color: '#e8bf6a', marginBottom: 6, fontWeight: 600 }}>
        {label}
      </div>

      {payload.filter(p => p.value > 0).map(p => (
        <div key={p.name} style={{ color: p.color, fontSize: 13, marginBottom: 2 }}>
          {p.name}
          :
          {formatNumber(p.value)}
        </div>
      ))}

      <div style={{ borderTop: '1px solid #3c3c3c', marginTop: 6, paddingTop: 6, color: '#ffffff', fontWeight: 600, fontSize: 13 }}>
        Total:
        {' '}
        {formatNumber(total)}
      </div>
    </div>
  )
}
