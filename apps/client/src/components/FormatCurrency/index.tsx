import { RootState } from '@/stores/store'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

type FormatCurrencyProps = {
  value: number | null
  className?: string
}

export const FormatCurrency = ({ value, className }: FormatCurrencyProps): JSX.Element => {
  const currency = useSelector((state: RootState) => state.organisation.currency?.code)

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
