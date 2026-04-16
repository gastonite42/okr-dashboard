import { formatNumber } from '../utilities/format'



export const KpiCards = ({
  latestMonth,
  latestCreatorMonth,
  latestImport,
}: {
  latestMonth: {
    total: number
    label: string
  } | null
  latestCreatorMonth: {
    total: number
    label: string
  } | null
  latestImport: {
    rate: number
    label: string
    succeeded: number
    failed: number
  } | null
}) => (
  <section className="kpis">
    <div className="kpi">
      <div className="kpi-value">
        {latestMonth ? formatNumber(latestMonth.total) : '—'}
      </div>

      <div className="kpi-label">Objets créés/mois</div>

      <div className="kpi-sub">
        {latestMonth?.label}
        {' '}
        — toutes apps
      </div>
    </div>

    <div className="kpi">
      <div className="kpi-value">
        {latestCreatorMonth ? formatNumber(latestCreatorMonth.total) : '—'}
      </div>

      <div className="kpi-label">Créateurs/mois (somme par app)</div>

      <div className="kpi-sub">
        {latestCreatorMonth?.label}
        {' '}
        — avec doublons cross-app
      </div>
    </div>

    <div className="kpi">
      <div className="kpi-value">
        {latestImport ? `${latestImport.rate}%` : '—'}
      </div>

      <div className="kpi-label">Taux réussite imports CSV</div>

      <div className="kpi-sub">
        {latestImport?.label}
        {' '}
        —
        {latestImport ? `${latestImport.succeeded} ok / ${latestImport.failed} fail` : ''}
      </div>
    </div>
  </section>
)
