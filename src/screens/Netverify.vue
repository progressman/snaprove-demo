<template>
  <div>
    <header class="header"></header>
    <template v-if="!redirectUrl">
      <div class="container">
      <h1 class="pagetitle">{{ $t("Netverify.header") }}</h1>      
      
      <div class="box">
        <progressbar :step="7" />
        <div v-html="$t('Netverify.subheaderHTML')"></div>
      
        <ValidationObserver ref="form" class="form">
           <ValidationProvider rules="requiredRadio" v-slot="{ errors }">
              <div style="margin: 2rem 0;">
                  <label class="label">{{ $t("Netverify.q1.label") }} *</label>
                    <Radio :value="200" v-model="workflowId">
                      {{ $t('Netverify.q1.idAndFace') }}
                      <p class="desc">{{ $t('Netverify.q1.idAndFaceHint') }}</p>
                    </Radio>
                    <Radio :value="100" v-model="workflowId">
                      {{ $t('Netverify.q1.idOnly') }}
                      <p class="desc">{{ $t('Netverify.q1.idOnlyHint') }}</p>
                    </Radio>
                    <span class="error" v-if="errors[0]">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>

          <!-- <Checkbox v-model="biometricAgreement" label="I want to proceed with Face verification" /> -->
          <p>{{ $t("Netverify.CTA") }}</p>

          <button class="button" @click="start">
            {{ $t("Netverify.button") }}
          </button>

        </ValidationObserver>
      </div>
      </div>
    </template>
      
    <iframe v-else :src="redirectUrl" allow="camera;fullscreen;accelerometer;gyroscope;magnetometer" allowfullscreen id="netverify"></iframe>
  </div>
</template>

<script>
import Progressbar from "@/components/ProgressBar";
import Radio from "@/components/forms/Radio"


export default {
  name: 'Netverify',
  components: {
    Progressbar,
    Radio
  },
  data() {
    return {
      workflowId: 200,
      // biometricAgreement: false,
      redirectUrl: null
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.processMessageFromJumio)
  },
  async beforeMount() {
    if (this.isMinor) {
      console.warn('MINOR; Skip netverify')
      this.$store.dispatch('showNextScreen')
      return
    }
    if (['confirming', 'success'].includes(this.$store.state.dossier.id_document)) {
      this.$store.dispatch('showNextScreen')
      return
    }
    window.addEventListener('message', this.processMessageFromJumio, false)
  },
  computed: {
    isMinor() {
      return this.$store.getters.answer.isMinor === 'yes'
    }
  },
  methods: {
    async start() {
      const valid = await this.$refs.form.validate()
      if (!valid) {
        return
      }
      this.redirectUrl = await this.$store.dispatch('startNetverify', {
        workflowId: this.workflowId,
        locale: this.$i18n.locale
      })
    },
    async processMessageFromJumio(event) {
      if (event.origin.match(/^https:\/\/snapswap/)) {
        const data = JSON.parse(event.data)
        console.log('Event value:', data.payload.value)
        if (data.payload.value === 'success') {
          window.localStorage.removeItem(this.$store.state.customerId)
          // vm.$store.state.currentStep = 'intro'
          await this.$store.dispatch('getDossier')
          this.$store.dispatch('showNextScreen')
        }
        if (data.payload.value === 'error') {
          console.log('event metainfo:', data.payload.metainfo)
          // Process errors acording to
          // https://github.com/Jumio/implementation-guides/blob/master/netverify/netverify-web-v4.md#after-the-user-journey
          switch (data.payload.metainfo.code) {
            case 9100:
              // Error occurred on Jumio's server.
              break
            case 9200:
              // Authorization token missing, invalid, or expired.
              window.localStorage.removeItem(this.$store.state.customerId)
              this.redirectUrl = await this.$store.dispatch('startNetverify', { workflowId: this.workflowId, locale: this.$i18n.locale })
              break
            case 9210:
              // Authorization token missing, invalid, or expired.
              window.localStorage.removeItem(this.$store.state.customerId)
              this.redirectUrl = await this.$store.dispatch('startNetverify', { workflowId: this.workflowId, locale: this.$i18n.locale })
              break
            default:
              // Show our error screen
              this.$store.commit('setError', {
                status: data.payload.metainfo.code,
                title: '3rd party error',
                type: '3rd party error',
                //description: error.response.statusText
              })
              break
          }
        }
      }
    }
  }
}
</script>

<style scoped>
#netverify {
  /* position: fixed; */
  width: 100%;
  left: 0;
  right: 0;
  height: calc(100vh - 60px);
  border: none;
}

p.desc {
  padding: 0;
  margin: 0;
  color: #767676;
}
</style>
