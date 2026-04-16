const MONTHS = ['', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

export const formatMonth = (m: string) => {

  const [y, mo] = m.split('-')
  return `${MONTHS[Number(mo)]} ${y.slice(2)}`
}

export const formatNumber = (n: number) => n.toLocaleString('fr-FR')

export const formatK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
