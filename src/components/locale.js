import moment from 'moment'

export default {
  direction: 'ltr',
  format: moment.localeData().longDateFormat('L'),
  separator: ' - ',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  weekLabel: 'W',
  customRangeLabel: 'Custom Range',
  daysOfWeek: moment.weekdaysMin(),
  monthNames: moment.monthsShort(),
  firstDay: moment.localeData().firstDayOfWeek()
}