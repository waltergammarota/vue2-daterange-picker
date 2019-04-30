<template>
  <div id="app">
    <date-range-picker-demo
            v-if="true"
    ></date-range-picker-demo>
    <calendar-demo v-if="true"></calendar-demo>
  </div>
</template>

<script>
import DateRangePickerDemo from "./demos/DateRangePickerDemo";
import CalendarDemo from "./demos/CalendarDemo";

export default {
  name: 'app',
  components: {
    CalendarDemo,
    DateRangePickerDemo,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
