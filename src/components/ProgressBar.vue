<template>
  <div class="bar">
    <div class="progress" :style="{width: `${step/totalSteps*100}%`}"></div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1
    }
  },
 
  computed: {
    totalSteps() {
      return 7
    
      // if (this.$store.state.reviewMode) {
      //   return this.step
      // }
      // if (this.$store.getters.isMinor === 'yes') {
      //   return 10
      // } else {
      //   return 10
      // }
    }
  }
}
</script>

<style scoped>
.bar {
  position: absolute;
  height: 2px;
  background-color: #dcf0fc;
  top: 0;
  left: 0;
  right: 0;
}
.progress {
  background-color: #005598;
  height: 2px;
}
</style>