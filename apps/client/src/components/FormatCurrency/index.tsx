import { useMemo } from 'react'

type FormatCurrencyProps = {
  value: number | null
  currency?: string
}

export const FormatCurrency = ({ value, currency = 'GBP' }: FormatCurrencyProps): JSX.Element => {
  const formatter = useMemo(() => {
    // Locale will default to users browser
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }, [currency])

  if (!value === undefined || value === null || isNaN(value)) {
    return <p>- - -</p>
  }

  return <span>{formatter.format(value)}</span>
}
