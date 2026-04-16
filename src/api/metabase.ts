import  { type MonthlyRow } from '../utilities/consolidate'



const BASE = '/api'

export type ImportRow = {
  month: string
  state: string
  count: number
}

type MetabaseCol = {
  display_name?: string
  name: string
}

type MetabaseQueryResponse = {
  data: {
    cols: Array<MetabaseCol>
    rows: Array<Array<unknown>>
  }
}

type MetabaseUserResponse = {
  first_name: string
  last_name: string
}


export const queryCard = async (
  token: string,
  cardId: number,
): Promise<{
  cols: Array<string>
  rows: Array<Array<unknown>>
}> => {

  const res = await fetch(`${BASE}/card/${cardId}/query`, {
    method: 'POST',
    headers: {
      'X-Metabase-Session': token,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok)
    throw new Error(`Card ${cardId}: ${res.status}`)

  const data = await res.json() as MetabaseQueryResponse

  return {
    cols: data.data.cols.map(c => c.display_name || c.name),
    rows: data.data.rows,
  }
}

export const parseMonthlyRows = (rows: Array<Array<unknown>>): Array<MonthlyRow> => (
  rows
    .filter(r => r[0] && r[1] != null)
    .map(r => ({
      month: String(r[0]).substring(0, 7),
      value: Number(r[1]),
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
)

export const parseImportRows = (rows: Array<Array<unknown>>): Array<ImportRow> => (
  rows
    .filter(r => r[0] && r[1] && r[2] != null)
    .map(r => ({
      month: String(r[0]).substring(0, 7),
      state: String(r[1]),
      count: Number(r[2]),
    }))
)

export const checkToken = async (token: string): Promise<string | null> => {

  try {

    const res = await fetch(`${BASE}/user/current`, {
      headers: { 'X-Metabase-Session': token },
    })
    if (!res.ok)
      return null

    const data = await res.json() as MetabaseUserResponse
    return `${data.first_name} ${data.last_name}`
  } catch {

    return null
  }
}
