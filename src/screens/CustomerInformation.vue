<template>
  <section>
    <header class="header"></header>
    <div class="container">
      <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t("CustomerInformation.header") }}</h1>  
      <div class="box">
        <progressbar :step="7" />

        <ValidationObserver ref="form" class="form" tag="form">
          <ValidationProvider rules="partynumber" v-slot="{ errors }">
            <Textinput 
            :help="$t('CustomerInformation.partyNumberHelp')"
            :label="$t('CustomerInformation.shareholderPartyNumber')" placeholder="FT00000000" v-model="shareholderPartyNumber" :error="errors[0]" />
          </ValidationProvider>

          <ValidationProvider rules="requiredInput" v-slot="{ errors, required}">
            <Textinput 
              :help="$t('CustomerInformation.shareholderNameHelp')"
              :label="$t('CustomerInformation.shareholderName')" v-model="shareholderName" :error="errors[0]" :required="required" autocomplete="name" />
          </ValidationProvider>
          
          <ValidationProvider rules="requiredInput|caseid" v-slot="{ errors, required }">
            <Textinput
              :help="$t('CustomerInformation.caseIdHelp')"
              :label="$t('CustomerInformation.caseId')" v-model="caseId" :error="errors[0]" :required="required" />
          </ValidationProvider>
          
          <ValidationProvider rules="requiredRadio" v-slot="{ errors }">  
            <div>
              <label class="label">
                {{ $t('CustomerInformation.isMinor')}}{{'\xa0'}}*
              </label>
              <div style="display: flex;">
                <Radio :label="$t('yes')" value="yes" v-model="isMinor" style="margin-right: 20px;" />
                <Radio :label="$t('no')" value="no" v-model="isMinor" />
              </div>
              <span class="error">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <Button @click.prevent="next" :loading="loading" :label="$t('CustomerInformation.button')" />

        </ValidationObserver>
      </div>
    </div>
  </section>
</template>

<script>
import Button from "@/components/forms/Button";
import Textinput from "@/components/forms/Input";
import Radio from '@/components/forms/Radio.vue'
import Progressbar from '@/components/ProgressBar.vue'
import { extend } from 'vee-validate';

extend('partynumber', {
  validate: value => {
    return value.match(/^FT\d{8}$/);
  },
  message: 'Please enter valid Client Reference Number'
});


export default {
  name: 'CustomerInformation',
  components: {
    Button,
    Textinput,
    Radio,
    Progressbar
  },
  data() {
    return {
      shareholderName: "",
      caseId: "",
      shareholderPartyNumber: "",
      isMinor: undefined,
      loading: false 
    }
  },
  beforeMount() {
    this.shareholderName = this.$store.getters.answer.shareholderName || ""
    this.caseId = this.$store.getters.answer.caseId || this.$store.state.customerId?.substring(0,10)
    this.shareholderPartyNumber = this.$store.getters.answer.shareholderPartyNumber || ""
    this.isMinor = this.$store.getters.answer.isMinor || ""
  },
  watch: {
    shareholderPartyNumber(newValue) {
      this.shareholderPartyNumber = newValue.toUpperCase()
    }
  },
  methods: {
    async next() {
      const valid = await this.$refs.form.validate()
      if (!valid) {
        this.$nextTick(() => {
          // Scroll to the first invalid field
          const el = document.querySelector(".textinput-error:first-of-type input")
          // el could be undefined becouse of radiobuttons
          el?.focus()
        })
        return
      }
      this.$store.dispatch('showSpinner')
      // Check if isMinor value changed
      if (this.isMinor !== this.$store.getters.answer.isMinor) {
        // Remove isReview flag
        this.$store.commit('setReviewMode', false)
        localStorage.setItem(`${this.$store.state.customerId}.reviewMode`, false);
      }
      
      this.loading = true
      await this.$store.dispatch('answerQuestions', {
        arr: [
          {question: 'caseId', answer: this.caseId},
          {question: 'shareholderName', answer: this.shareholderName},
          {question: 'shareholderPartyNumber', answer: this.shareholderPartyNumber},
          {question: 'isMinor', answer: this.isMinor}
        ]
      })
      await this.$store.dispatch('getDossierData')
      this.$store.dispatch('hideSpinner')
      this.loading = false

      if (!this.$store.state.error.type) {
        this.$store.dispatch('showNextScreen')
      } else {
        // Process Backend Errors
        if (this.$store.state.error.type.match(/\/limit-reached$/)) {
          this.$store.state.currentStep = 'Error'
        }
      }
    }
  }
};
</script>
