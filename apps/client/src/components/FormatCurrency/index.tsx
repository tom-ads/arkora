import { useMemo } from 'react'

type FormatCurrencyProps = {
  value: number | null
  currency?: string
  className?: string
}

export const FormatCurrency = ({
  value,
  currency = 'GBP',
  className,
}: FormatCurrencyProps): JSX.Element => {
  const formatter = useMemo(() => {
    // Locale will default to users browser
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [currency])

  if (!value === undefined || value === null || isNaN(value)) {
    return <span>- - -</span>
  }

  return <span className={className}>{formatter.format(value)}</span>
}
