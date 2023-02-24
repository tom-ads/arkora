import { DateTime, DateTimeFormatOptions } from 'luxon'

type FormatDateTimeProps = {
  value: DateTime | string | null | undefined
  format: DateTimeFormatOptions | string
  className?: string
}

export const FormatDateTime = ({ value, format, className }: FormatDateTimeProps): JSX.Element => {
  if (typeof value === 'string') {
    value = DateTime.fromISO(value)
  }

  if (!value || !value?.isValid) {
    return <span>- - -</span>
  }

  /* 
    navigator.language is used to pull the locale from the browser,
    it will default to en-GB if one cannot be determined.
  */
  const formattedDateTime: string =
    typeof format === 'string'
      ? value.setLocale(navigator.language ?? 'en-GB').toFormat(format)
      : value.toLocaleString(format)

  return <span className={className}>{formattedDateTime}</span>
}
