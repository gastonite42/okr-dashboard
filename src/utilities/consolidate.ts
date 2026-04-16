import { formatMonth } from './format'



export type MonthlyRow = {
  month: string
  value: number
}

export type AppData = Record<string, Array<MonthlyRow>>

export type ConsolidatedRow = {
  month: string
  label: string
  total: number
  [app: string]: string | number
}

export const consolidate = (data: AppData, cards: Record<string, { label: string }>): Array<ConsolidatedRow> => {

  const monthMap = new Map<string, Record<string, number>>()

  for (const [key, rows] of Object.entries(data)) {

    if (!(key in cards))
      continue
    for (const { month, value } of rows) {

      if (!monthMap.has(month))
        monthMap.set(month, {})
      monthMap.get(month)![key] = value
    }
  }

  return Array.from(monthMap.entries())
    .map(([month, values]) => ({
      month,
      label: formatMonth(month),
      ...values,
      total: Object.values(values).reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}
