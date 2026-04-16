import { OBJECT_CARDS } from '../constants/cards'
import { formatNumber } from '../utilities/format'



export const DetailTable = ({
  latestMonth,
  latestCreatorMonth,
}: {
  latestMonth: Record<string, unknown> & {
    total: number
    label: string
  }
  latestCreatorMonth: Record<string, unknown> & {
    total: number
    label: string
  }
}) => (
  <section className="chart-section">
    <h2>
      Détail
      {latestMonth.label}
    </h2>

    <table>
      <thead>
        <tr>
          <th>Application</th>
          <th>Objets créés</th>
          <th>Créateurs uniques</th>
          <th>Obj / créateur</th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(OBJECT_CARDS).map(([key, card]) => {

          const obj = latestMonth[key] as number || 0
          const cre = latestCreatorMonth[key] as number || 0
          return (
            <tr key={key}>
              <td style={{ color: card.color, fontWeight: 600 }}>
                {card.label}
              </td>

              <td>
                {formatNumber(obj)}
              </td>

              <td>
                {cre ? formatNumber(cre) : '—'}
              </td>

              <td>
                {cre ? (obj / cre).toFixed(1) : '—'}
              </td>
            </tr>
          )
        })}

        <tr className="total-row">
          <td>
            <strong>TOTAL</strong>
          </td>

          <td>
            <strong>
              {formatNumber(latestMonth.total)}
            </strong>
          </td>

          <td>
            <strong>
              {formatNumber(latestCreatorMonth.total)}
            </strong>
          </td>

          <td>—</td>
        </tr>
      </tbody>
    </table>
  </section>
)
