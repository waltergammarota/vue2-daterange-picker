import moment from 'moment'

export default {
  isSame: (date1, date2, granularity = 'date') => {
    // console.log(date1 instanceof Date, date2 instanceof Date)
    return moment(date1).isSame(date2, granularity)
  },
  daysInMonth: (year, month) => {
    return moment([year, month]).daysInMonth()
  }
}
