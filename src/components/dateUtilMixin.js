export default {
  props: {
    dateUtil: {
      type: [Object, String],
      default: 'moment'
    },
  },
  created () {
    if(this.dateUtil instanceof Object)
      this.$dateUtil = this.dateUtil;
    else if (typeof this.dateUtil === 'string' || this.dateUtil instanceof String) {
      // console.log('using ' + this.dateUtil)
      this.$dateUtil = require('./date_util/' + this.dateUtil).default
    }
  }
}
