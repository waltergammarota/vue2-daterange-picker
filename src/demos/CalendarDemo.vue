<template>
    <div class="container bg-light p-5">
        <h1>Calendar component</h1>
        <div class="bg-white p-3">
            <fieldset>
                <legend>Properties</legend>
                <div class="form-check">
                    <input type="checkbox" id="showWeekNumbers" v-model="showWeekNumbers" class="form-check-input">
                    <label for="showWeekNumbers" class="form-check-label">showWeekNumbers</label>
                </div>
                <div class="form-check">
                    <input type="checkbox" id="showDropdowns" v-model="showDropdowns" class="form-check-input">
                    <label for="showDropdowns" class="form-check-label">showDropdowns</label>
                </div>
            </fieldset>
        </div>
        <div class="d-flex my-3">
            <div>
                <h5>Date range picker</h5>
                <div class="demo border" style="width: 17rem;">
                    <calendar
                            :show-week-numbers="showWeekNumbers"
                            :show-dropdowns="showDropdowns"
                            :single-date-picker="false"
                            v-model="range_value"
                            :singleDatePicker="singleDatePicker"
                    ></calendar>
                </div>
            </div>
            <div class="ml-5">
                <h5>Single date picker</h5>
                <div class="demo border" style="width: 17rem;">
                    <calendar
                            :show-week-numbers="showWeekNumbers"
                            :show-dropdowns="showDropdowns"
                            :single-date-picker="true"
                            v-model="date_value"
                    ></calendar>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Calendar from "../components/Calendar";

  export default {
    name: "CalendarDemo",
    components: {Calendar},
    data () {
      return {
        showWeekNumbers: true,
        showDropdowns: true,
        singleDatePicker: false,
        date_value: new Date(2019, 4, 3),
        range_value: {
          startDate: new Date(2019, 3, 4),
          endDate: new Date(2019, 3, 10),
        }
      }
    }
  }
</script>

<style>
    .calendar th, td {
        font-size: 12px;
    }
</style>