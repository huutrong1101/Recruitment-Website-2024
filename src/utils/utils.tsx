import moment from 'moment'

export const formatDay = (day: any) => {
  const originalDate = day
  const formattedDate = moment(originalDate).format('DD/MM/YYYY')
  return formattedDate
}
