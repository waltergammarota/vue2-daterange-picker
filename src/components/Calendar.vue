<template>
    <div class="calendar">
        <table class="table-condensed">
            <thead>
            <tr>
                <th class="prev available" @click="prevMonth"><span/></th>
                <th
                        v-if="showDropdowns"
                        :colspan="showWeekNumbers ? 6 : 5"
                        class="month"
                >
                    <div class="month_year_dropdown">
                        <select v-model="month" class="monthselect">
                            <option v-for="(m, idx) in months" :key="m" :value="idx">{{m}}</option>
                        </select>
                        <select v-model="year" class="yearselect">
                            <option v-for="y in years" :key="y" :value="y">{{y}}</option>
                        </select>
                    </div>
                </th>
                <th
                        v-else
                        :colspan="showWeekNumbers ? 6 : 5"
                        class="month">{{monthName}} {{year}}
                </th>
                <th class="next available" @click="nextMonth"><span/></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th v-if="showWeekNumbers" class="week">{{locale.weekLabel}}</th>
                <th v-for="weekDay in locale.daysOfWeek" :key="weekDay">{{weekDay}}</th>
            </tr>
            <tr
                    v-for="(dateRow, index) in calendar"
                    :key="index"
            >
                <td v-if="showWeekNumbers && (index%7 || index===0)" class="week">
                    {{dateRow[0] | weeknumber}}
                </td>
                <slot name="date-slot" v-for="(date, idx) in dateRow">
                    <td
                            :class="dayClass(date)"
                            @click="dateClick($event, date)"
                            @mouseover="mouseOver($event, date)"
                            :key="idx"
                    >
                        {{date | dateNum}}
                    </td>
                </slot>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import moment from 'moment'
  import default_locale from './locale'
  import {nextMonth, prevMonth} from "./util";

  export default {
    name: 'calendar',
    props: {
      viewDate: Date,
      localeData: Object,
      minDate: Date,
      maxDate: Date,
      startDate: Date,
      endDate: Date,
      showDropdowns: {
        type: Boolean,
        default: false,
      },
      showWeekNumbers: {
        type: Boolean,
        default: false,
      },
      singleDatePicker: {
        type: Boolean,
        default: true,
      },
      value: {
        type: [Date, String, Object],
      }
    },
    data () {
      return {
        monthDate: this.viewDate || new Date(),
        start: null,
        end: null,
        in_selection: false,
      }
    },
    methods: {
      changeMonth (newDate) {
        this.monthDate = newDate

        this.$emit('change-month', {
          month: this.monthDate.getMonth(),
          year: this.monthDate.getFullYear(),
        });
      },
      prevMonth () {
        this.changeMonth(prevMonth(new Date(this.monthDate.getFullYear(),
          this.monthDate.getMonth(), 1)));
      },
      nextMonth () {
        this.changeMonth(nextMonth(new Date(this.monthDate.getFullYear(),
          this.monthDate.getMonth(), 1)));
      },
      dateClick($event, date) {
        //always emit dayClick event
        this.$emit('dateClick', date)
        if(this.singleDatePicker) {
          if(!this.value.hasOwnProperty('startDate')) {
            this.$emit('input', date.toDate())
          } else {
            this.$emit('input', { startDate: date.toDate(), endDate: date.toDate() })
          }
        } else {
          if(!this.in_selection) {
            this.in_selection = true
            this.start = date.toDate()
            this.end = date.toDate()
          } else {
            this.in_selection = false
            if(date.isBefore(this.start)) {
              this.end = this.start
              this.start = date.toDate()
            } else {
              this.end = date.toDate()
            }
            this.$emit('input', { startDate: this.start, endDate: this.end })
          }
        }
      },
      mouseOver ($event, date) {
        if (!this.singleDatePicker && this.in_selection) {
          this.end = date.toDate()
        }
        this.$emit('hoverDate', date)
      },
      dayClass (date) {
        let dt = new Date(date)
        dt.setHours(0, 0, 0, 0)
        let start = new Date(this.start < this.end ? this.start.getTime() : this.end.getTime())
        start.setHours(0, 0, 0, 0)
        let end = new Date(this.start < this.end ? this.end.getTime() : this.start.getTime())
        end.setHours(0, 0, 0, 0)

        return {
          off: date.month() !== this.month,
          weekend: date.isoWeekday() > 5,
          today: dt.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0),
          active: dt.setHours(0, 0, 0, 0) == new Date(this.start).setHours(0, 0, 0, 0) || dt.setHours(0, 0, 0, 0) == new Date(this.end).setHours(0, 0, 0, 0),
          'in-range': dt >= start && dt <= end,
          'start-date': dt.getTime() === start.getTime(),
          'end-date': dt.getTime() === end.getTime(),
          disabled: (this.minDate && moment(dt).startOf("day").isBefore(moment(this.minDate).startOf("day")))
            || (this.maxDate && moment(dt).startOf("day").isAfter(moment(this.maxDate).startOf("day"))),
        }
      }
    },
    computed: {
      locale () {
        return {...default_locale, ...this.localeData}
      },
      monthName () {
        return this.locale.monthNames[this.monthDate.getMonth()]
      },
      year: {
        get () {
          return this.monthDate.getFullYear()
        },
        set (value) {
          let newDate = new Date(value, this.month, 1);
          this.monthDate = newDate
        }
      },
      month: {
        get () {
          return this.monthDate.getMonth()
        },
        set (value) {
          let newDate = new Date(this.year, value, 1);
          this.monthDate = newDate
        }
      },
      calendar () {
        let month = this.month
        let year = this.monthDate.getFullYear()
        let daysInMonth = new Date(year, month, 0).getDate()
        let firstDay = new Date(year, month, 1)
        let lastDay = new Date(year, month, daysInMonth)
        let lastMonth = moment(firstDay).subtract(1, 'month').month()
        let lastYear = moment(firstDay).subtract(1, 'month').year()
        let daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth()

        let dayOfWeek = firstDay.getDay()

        let calendar = []

        for (let i = 0; i < 6; i++) {
          calendar[i] = [];
        }

        let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1
        if (startDay > daysInLastMonth)
          startDay -= 7

        if (dayOfWeek === this.locale.firstDay)
          startDay = daysInLastMonth - 6;

        let curDate = moment([lastYear, lastMonth, startDay, 12, 0, 0]);
        for (let i = 0, col = 0, row = 0; i < 6 * 7; i++, col++, curDate = moment(curDate).add(1, 'day')) {
          if (i > 0 && col % 7 === 0) {
            col = 0;
            row++;
          }
          calendar[row][col] = curDate.clone()
          curDate.hour(12);
        }

        return calendar
      },
      months () {
        if (this.maxDate && this.minDate) {
          let y = this.maxDate.getFullYear() - this.minDate.getFullYear();
          if (y < 2) {
            // get months
            let months = [];
            if (y < 1) {
              for (let i = this.minDate.getMonth(); i <= this.maxDate.getMonth(); i++) {
                months.push(i);
              }
            } else {
              for (let i = 0; i <= this.maxDate.getMonth(); i++) {
                months.push(i);
              }
              for (let i = this.minDate.getMonth(); i < 12; i++) {
                months.push(i);
              }
            }

            // do filter
            if (months.length > 0) {
              return this.locale.monthNames.filter((m, index) => {
                return months.findIndex(i => i === index) > -1;
              });
            }
          }
        }
        return this.locale.monthNames;
      },
      years () {
        let values = []
        let count = 0
        // for (let i = this.minDate.getFullYear(); i <= this.maxDate.getFullYear() && count <= 20; i++) {
        let year = this.start ? this.start.getFullYear() : new Date().getFullYear()
        for (let i = year; count <= 20; i++) {
          count++
          values.push(i - 10)
        }
        return values;
      }
    },
    filters: {
      dateNum (value) {
        return value.date()
      },
      weeknumber (value) {
        return value.week()
      }
    },
    watch: {
      startDate: {
        handler (value) {
          if (value <= this.end || this.start === null)
            this.start = value
          else {
            this.start = this.end
            this.end = value
          }
        },
        immediate: true
      },
      endDate: {
        handler (value) {
          if(value >= this.start || this.end === null)
            this.end = value
          else {
            this.end = this.start
            this.start = value
          }
        },
        immediate: true
      },
      value: {
        handler (input) {
          if(input === undefined)
            return
          if (input.hasOwnProperty('startDate') && input.hasOwnProperty('endDate')) {
            this.start = input.startDate
            this.end = this.singleDatePicker ? input.startDate : input.endDate
          } else if(input instanceof Date) {
            this.start = input
            this.end = input
          } else if (input instanceof String && this.singleDatePicker) {
            this.start = new Date(input)
            this.end = new Date(input)
          // } else if (input === null) {
          } else {
            console.error('Wrong input value', input)
          }
        },
        immediate: true
      },
      viewDate: {
        handler (value) {
          if(!value) {
            this.monthDate = this.value.hasOwnProperty('startDate') ? this.value.startDate : this.value
            if(!this.monthDate)
              this.monthDate = new Date()
            return
          }
          let dt = new Date(value)
          if (this.monthDate.getFullYear() !== dt.getFullYear() || this.monthDate.getMonth() !== dt.getMonth())
            this.monthDate = value
        },
        immediate: true
      }
    }
  }
</script>

<style scoped lang="scss">
    .calendar table {
        width: 100%;
        margin: 0;
        border-spacing: 0;
        border-collapse: collapse;
        min-width: 15rem;
        max-width: 20rem;

        .month {
            text-align: center;
        }

        th, td {
            text-align: center;
            vertical-align: middle;
            min-width: 32px;
            width: 32px;
            height: 24px;
            line-height: 24px;
            border-radius: 4px;
            border: 1px solid transparent;
            white-space: nowrap;
            cursor: pointer;

            padding: 2px;
            background-color: white;

        }

        td.off {
            background-color: #fff !important;
            border-color: transparent;
            color: #999 !important;
        }

        td.today {
            font-weight: bold;
        }

        td.disabled {
            pointer-events: none;
            background-color: #eee;
            border-radius: 0;
            opacity: 0.6;
        }

        td.week, th.week {
            font-size: 80%;
            color: #ccc;
        }

        td.in-range {
            background-color: #ebf4f8;
            border-color: transparent;
            color: #000;
            border-radius: 0;
        }

        td.start-date {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        td.end-date {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }

        td.active {
            background-color: #357ebd;
            border-color: transparent;
            color: #fff;
        }
    }

    @function str-replace($string, $search, $replace: "") {
        $index: str-index($string, $search);

        @if $index {
            @return str-slice($string, 1, $index - 1) + $replace + str-replace(str-slice($string, $index + str-length($search)), $search, $replace);
        }

        @return $string;
    }

    $carousel-control-color: #ccc !default;
    $viewbox: '-2 -2 10 10';
    $carousel-control-prev-icon-bg: str-replace(url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='#{$viewbox}'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E"), "#", "%23") !default;
    $carousel-control-next-icon-bg: str-replace(url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='#{$viewbox}'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E"), "#", "%23") !default;

    .fa {
        display: inline-block;
        width: 100%;
        height: 100%;
        background: transparent no-repeat center center;
        background-size: 100% 100%;
        fill: $carousel-control-color;
    }

    .prev, .next {
        &:hover {
            background-color: transparent !important;
        }

        .fa:hover {
            opacity: 0.6;
        }

        span {
            color: #fff;
            border: solid #000;
            border-width: 0 2px 2px 0;
            border-radius: 0;
            display: inline-block;
            padding: 3px;
        }
    }

    .prev span {
        transform: rotate(135deg);
    }

    .next span {
        transform: rotate(-45deg);
    }

    .chevron-left {
        width: 16px;
        height: 16px;
        display: block;
        background-image: $carousel-control-prev-icon-bg;
    }

    .chevron-right {
        width: 16px;
        height: 16px;
        display: block;
        background-image: $carousel-control-next-icon-bg;
    }
</style>