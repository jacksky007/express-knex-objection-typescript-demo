export function formatDatetimeFromNow(datetime: string) {
  const date = new Date(datetime)

  // convert local time to UTC time
  const now = Date.now() + 1000 * 60 * date.getTimezoneOffset()
  const delta = Math.round((now - date.getTime()) / 1000)

  const units = [
    {
      seconds: 3600 * 24 * 365,
      singular: 'year',
      plural: 'years',
    },
    {
      seconds: 3600 * 24 * 30,
      singular: 'month',
      plural: 'months',
    },
    {
      seconds: 3600 * 24 * 7,
      singular: 'week',
      plural: 'weeks',
    },
    {
      seconds: 3600 * 24,
      singular: 'day',
      plural: 'days',
    },
    {
      seconds: 3600,
      singular: 'hour',
      plural: 'hours',
    },
    {
      seconds: 60,
      singular: 'minute',
      plural: 'minutes',
    },
    {
      seconds: 1,
      singular: 'second',
      plural: 'seconds',
    },
  ]

  for (const unit of units) {
    const count = Math.floor(delta / unit.seconds)
    if (count >= 1) {
      return `${count} ${count > 1 ? unit.plural : unit.singular} ago`
    }
  }
  return 'right now'
}
