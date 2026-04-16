import { useCallback, useEffect, useState } from 'react'
import { checkToken, parseImportRows, parseMonthlyRows, queryCard, type ImportRow } from './api/metabase'
import { CreatorsChart } from './components/CreatorsChart'
import { DetailTable } from './components/DetailTable'
import { ImportsChart } from './components/ImportsChart'
import { KpiCards } from './components/KpiCards'
import { LoginForm } from './components/LoginForm'
import { ModesTable } from './components/ModesTable'
import { ObjectsChart } from './components/ObjectsChart'
import { PaidCreatorsChart } from './components/PaidCreatorsChart'
import { PaidObjectsChart } from './components/PaidObjectsChart'
import { CREATOR_CARDS, IMPORT_CARDS, OBJECT_CARDS } from './constants/cards'
import { consolidate, type AppData } from './utilities/consolidate'
import { formatMonth } from './utilities/format'
import './App.css'



const App = () => {

  const [token, setToken] = useState(() => (import.meta.env.VITE_METABASE_TOKEN as string | undefined) ?? localStorage.getItem('mb_token') ?? '')
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [objectData, setObjectData] = useState<AppData>({})
  const [creatorData, setCreatorData] = useState<AppData>({})
  const [importData, setImportData] = useState<Array<ImportRow>>([])


  const connect = useCallback(async () => {

    setError(null)
    setLoading(true)

    const name = await checkToken(token)
    if (!name) {

      setError('Token invalide ou expiré')
      setLoading(false)
      return
    }

    setUser(name)
    localStorage.setItem('mb_token', token)

    try {

      const [objResults, creatorResults, importResults] = await Promise.all([
        Promise.all(
          Object.entries(OBJECT_CARDS).map(async ([key, card]) => {

            const result = await queryCard(token, card.id)
            return [key, parseMonthlyRows(result.rows)] as const
          }),
        ),
        Promise.all(
          Object.entries(CREATOR_CARDS).map(async ([key, card]) => {

            const result = await queryCard(token, card.id)
            return [key, parseMonthlyRows(result.rows)] as const
          }),
        ),
        queryCard(token, IMPORT_CARDS.imports.id),
      ])

      setObjectData(Object.fromEntries(objResults))
      setCreatorData(Object.fromEntries(creatorResults))
      setImportData(parseImportRows(importResults.rows))
    } catch (e) {

      setError(String(e))
    }

    setLoading(false)
  }, [token])


  useEffect(() => {

    if (token)
      void connect() // eslint-disable-line react-hooks/set-state-in-effect -- async init on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  // --- Derived data ---

  const objectConsolidated = consolidate(objectData, OBJECT_CARDS)
  const creatorConsolidated = consolidate(creatorData, CREATOR_CARDS)

  const importByMonth = importData.reduce<
    Record<string, {
      succeeded: number
      failed: number
      canceled: number
    }>
  >((acc, row) => {

    if (!acc[row.month])
      acc[row.month] = { succeeded: 0, failed: 0, canceled: 0 }

    const entry = acc[row.month]!
    if (row.state === 'succeeded')
      entry.succeeded += row.count
    else if (row.state === 'failed')
      entry.failed += row.count
    else if (row.state === 'canceled')
      entry.canceled += row.count
    return acc
  }, {})

  const importChartData = Object.entries(importByMonth)
    .map(([month, v]) => ({
      month,
      label: formatMonth(month),
      ...v,
      total: v.succeeded + v.failed,
      rate: v.succeeded + v.failed > 0 ? Math.round((v.succeeded / (v.succeeded + v.failed)) * 100) : 0,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  const latestMonth = objectConsolidated.at(-2) ?? null
  const latestCreatorMonth = creatorConsolidated.at(-2) ?? null
  const latestImport = importChartData.at(-2) ?? null

  const paidObjectsData = objectConsolidated.slice(-12).map(d => ({
    ...d,
    total_payant: Number(d.docs ?? 0) + Number(d.events ?? 0) + Number(d.jobs ?? 0),
  }))


  // --- Render ---

  if (!user) {

    return (
      <LoginForm
        token={token}
        loading={loading}
        error={error}
        user={user}
        onTokenChange={setToken}
        onConnect={() => void connect()}
      />
    )
  }

  if (loading) {

    return (
      <LoginForm
        token={token}
        loading={loading}
        error={error}
        user={user}
        onTokenChange={setToken}
        onConnect={() => void connect()}
      />
    )
  }

  return (
    <div className="dashboard">

      <header>
        <h1>Dashboard OKR Q2 2026 - Clément</h1>

        <span className="user">
          Connecté :
          {user}
        </span>
      </header>

      <KpiCards
        latestMonth={latestMonth}
        latestCreatorMonth={latestCreatorMonth}
        latestImport={latestImport}
      />

      <ObjectsChart data={objectConsolidated.slice(-12)} />
      <PaidObjectsChart data={paidObjectsData} />
      <CreatorsChart data={creatorConsolidated.slice(-12)} />
      <PaidCreatorsChart data={creatorConsolidated.slice(-12)} />
      <ImportsChart data={importChartData.slice(-12)} />
      {latestMonth && latestCreatorMonth ? <DetailTable latestMonth={latestMonth} latestCreatorMonth={latestCreatorMonth} /> : null}
      <ModesTable />

      <footer>
        <p>
          Données Metabase en temps réel — Cards:
          {Object.values(OBJECT_CARDS).map(c => c.id).join(', ')}
        </p>
      </footer>

    </div>
  )
}

export default App
