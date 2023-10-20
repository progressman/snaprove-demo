<template>
  <section>
    <header class="header"></header>

    <div class="container">
    <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t("SourceOfFunds.header") }}</h1>

    <div class="box">
      <Progressbar :step="2" />
      <h2 class="step">{{ $t("step", {stepNumber: 2}) }}</h2>
      <div class="form">
        <div class="intro">{{ $t("SourceOfFunds.subheader") }}</div>
           
        <!-- This is only needed for a Minor Investor workflow -->
        <ValidationObserver ref="form">
          <ValidationProvider v-if="isMinor" rules="requiredRadio" v-slot="{ errors }">
            <div style="margin-bottom: 1.5rem;">
              <label class="label">{{ $t("SourceOfFunds.q1.label") }}{{'\xa0'}}*</label>
              <Radio :label="$t('SourceOfFunds.q1.legalGuardian')" value="legalGuardian" v-model="whoProvidedMoney" />
              <Radio :label="$t('SourceOfFunds.q1.thirdParty')" value="thirdParty" v-model="whoProvidedMoney" />
              <span class="error">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider rules="requiredRadio" v-slot="{ errors }">
          <div style="margin-bottom: 1.5rem;">
            <label class="label">{{ $t("SourceOfFunds.q2.label") }}{{'\xa0'}}*</label>
             <Check :label="$t('SourceOfFunds.q2.professionalIncome')" value="professionalIncome" v-model="sourceOfFunds">
              <template v-slot:hint>
                {{ $t('SourceOfFunds.q2.professionalIncomeHint') }}
              </template>
            </Check>
            <Check :label="$t('SourceOfFunds.q2.businessOwnership')" value="businessOwnership" v-model="sourceOfFunds" />
            <Check :label="$t('SourceOfFunds.q2.familyIncome')" value="familyIncome" v-model="sourceOfFunds">
              <template v-slot:hint>
                {{ $t('SourceOfFunds.q2.familyIncomeHint') }}
              </template>
            </Check>
            <Check :label="$t('SourceOfFunds.q2.inheritance')" value="inheritance" v-model="sourceOfFunds" />
            <Check :label="$t('SourceOfFunds.q2.saleOfProperty')" value="saleOfProperty" v-model="sourceOfFunds" />
            <Check :label="$t('SourceOfFunds.q2.saleOfCompany')" value="saleOfCompany" v-model="sourceOfFunds" />
            <Check :label="$t('SourceOfFunds.q2.investmentProfit')" value="investmentProfit" v-model="sourceOfFunds" />
            <Check :label="$t('SourceOfFunds.q2.rentalIncome')" value="rentalIncome" v-model="sourceOfFunds" />
            <Check :label="$t('SourceOfFunds.q2.other')" value="other" v-model="sourceOfFunds" />
            <span class="error">{{ errors[0] }}</span>
          </div>
          </ValidationProvider>

          <ValidationProvider v-if="sourceOfFunds.includes('other') || isMinor && whoProvidedMoney && whoProvidedMoney === 'minor'" rules="requiredInput" v-slot="{ errors }">
            <Textinput textarea autocomplete="off" rows="4" :label="$t('SourceOfFunds.q3.label')" :error="errors[0]" v-model="notes" required />
          </ValidationProvider>

          <Button @click="next" :loading="loading" :label="$t('SourceOfFunds.button')" />
        </ValidationObserver>
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import Button from '@/components/forms/Button'
import Radio from '@/components/forms/Radio'
import Check from '@/components/forms/Check'
import Textinput from '@/components/forms/Input'
import Progressbar from '@/components/ProgressBar.vue'


export default {
  name: 'SourceOfFunds',
  components: {
    Button,
    Radio,
    Check,
    Textinput,
    Progressbar
  },
  data() {
    return {
      loading: false,
      whoProvidedMoney: undefined,
      sourceOfFunds: [],
      notes: ""
    }
  },
  beforeMount() {
    this.whoProvidedMoney = this.$store.getters.answer.whoProvidedMoney || ""
    this.sourceOfFunds = this.$store.getters.answer.sourceOfFunds || []
    this.notes = this.$store.getters.answer.sourceOfFundsNotes || ""
  },
  computed: {
    isMinor() {
      return this.$store.getters.answer.isMinor === 'yes'
    }
  },
  methods: {
    async next() {
      const valid = await this.$refs.form.validate()
      if (!valid) {
        return
      }
      this.loading = true
      await this.$store.dispatch('answerQuestions', {
        arr: [
          {question: 'whoProvidedMoney', answer: this.whoProvidedMoney},
          {question: 'sourceOfFunds', answer: this.sourceOfFunds},
          {question: 'sourceOfFundsNotes', answer: this.sourceOfFunds.includes('other') ? this.notes : ''}
        ]
      })
      await this.$store.dispatch('getDossierData')
      if (!this.$store.state.error.type) {
        this.$store.dispatch('showNextScreen')
      }
    }
  }
  
}
</script>

<style scoped>
.intro {
  /* color: #767676; */
  margin-bottom: 12px;
}
</style>
