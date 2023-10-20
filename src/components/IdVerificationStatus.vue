<template>

  <div class="verification">
    <span v-if="inProgress" class="icon spinner"></span>
    <svg v-if="verified" class="icon" width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <svg v-if="failed" class="icon" width="36" height="36" fill="none" style="stroke: #F60000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <div class="title">{{ $t('idVerificationStatus.title') }}</div>
    <div class="value">{{ idDocumentState.toUpperCase() }}</div>
    <template v-if="failed">
      <div v-html="$t('idVerificationStatus.retryHTML')"></div>
      <a class="button" style="display: inline-block; margin-top: 0.6rem;" @click.prevent="retry">{{ $t('idVerificationStatus.retryAction') }}</a>
    </template>
    <div v-if="inProgress" v-html="$t('idVerificationStatus.waitHTML')"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        timer: null, // function
        limit: 480,
        ticks: 1
      }
    },
    computed: {
      idDocumentState() {
        switch (this.$store.state.dossier.id_document) {
          case 'confirming': return this.$t('idVerificationStatus.inProgress')
          case 'success': return this.$t('idVerificationStatus.verified')
          case 'failure': return this.$t('idVerificationStatus.failed')
          default: return this.$store.state.dossier.id_document
        }
      },
      inProgress() {
        return this.$store.state.dossier.id_document === 'confirming'
      },
      verified() {
        return this.$store.state.dossier.id_document === 'success'
      },
      failed() {
        return this.$store.state.dossier.id_document === 'failure'
      }
    },
    mounted() {
      // Start timer if ID DOC state == "confirming"
      if (this.$store.state.dossier.id_document === "confirming") {
        this.timer = setInterval(() => {
          this.ticks += 1
        }, 1000)
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    watch: {
      async ticks(newVal) {
        if (newVal % 5 === 0) {
          // Каждые 5 секунд
          console.log('Pool dossier')
          await this.$store.dispatch('getDossier')
        }
      },
      idDocumentState(newVal, oldVal) {
        if (oldVal !== newVal) {
          clearInterval(this.timer)
        }
      }
    },
    methods: {
      retry() {
        this.$store.commit('setCurrentStep', 'NetVerify')
      }
    }
  }
</script>

<style scoped>
@keyframes spinAround {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

span.spinner {
  margin-left: 4px;
  margin-top: 4px;
  animation: spinAround 0.5s infinite linear;
  border: 2px solid #005598;
  border-radius: 290486px;
  border-right-color: transparent;
  border-top-color: transparent;
  content: "";
  display: inline-block;
  height: 22px;
  width: 22px;
  padding-left: 0px;
  border-width: 3px;
}
</style>