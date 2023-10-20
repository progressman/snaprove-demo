<template>
  <section>
    <header class="header"></header>

    <div class="container">
    <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t(`Profession.header.${investorType}`) }}</h1>

    <div class="box">
      <Progressbar :step="4" />
      <h2 class="step">{{ $t("step", {stepNumber: 4}) }}</h2>
      <div class="form">
        
         <ValidationObserver ref="form">
            <ValidationProvider v-if="isMinor" rules="requiredRadio" v-slot="{ errors }">
              <div style="margin-bottom: 2rem;">
                <label class="label">{{ $t("Profession.q1.label") }}{{'\xa0'}}*</label>
                <!-- <Radio :label="$t('Profession.q1.parent')" value="parent" v-model="relationship" /> -->
                <Radio :label="$t('Profession.q1.grandparent')" value="grandparent" v-model="relationship" />
                <Radio :label="$t('Profession.q1.brother')" value="brother" v-model="relationship" />
                <Radio :label="$t('Profession.q1.sister')" value="sister" v-model="relationship" />
                <Radio :label="$t('Profession.q1.uncle')" value="uncle" v-model="relationship" />
                <Radio :label="$t('Profession.q1.aunt')" value="aunt" v-model="relationship" />
                <span class="error" v-if="errors[0]">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>

            <ValidationProvider rules="requiredRadio" v-slot="{ errors }">
              <div style="margin-bottom: 2rem;">
                <label class="label">{{ $t(`Profession.q2.label.${investorType}`) }}{{'\xa0'}}*</label>
                <Radio :label="$t('Profession.q2.employed')" value="employed" v-model="employment" />
                <Radio :label="$t('Profession.q2.retired')" value="retired" v-model="employment" />
                <Radio :label="$t('Profession.q2.unemployed')" value="unemployed" v-model="employment" />
                <span class="error" v-if="errors[0]">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>

            <template v-if="['employed', 'retired'].includes(employment)">
              <ValidationProvider rules="requiredInput" v-slot="{ errors, required }">
                <Textinput :label="$t(`Profession.q3.label.${employment}`)" v-model="profession" type="text" :required="required" :error="errors[0]"/>
              </ValidationProvider>

              
              <ValidationProvider rules="requiredRadio" v-slot="{ errors }">
                <div style="margin-bottom: 2rem;">
                  <label class="label">{{ $t(`Profession.q4.label.${employment}.${investorType}`) }}{{'\xa0'}}*</label>
                  <Radio :label="$t('Profession.q4.moneyChanger')" value="moneyChanger" v-model="sector" />
                  <Radio :label="$t('Profession.q4.casinos')" value="casinos" v-model="sector" />
                  <Radio :label="$t('Profession.q4.carDealership')" value="carDealership" v-model="sector" />
                  <Radio :label="$t('Profession.q4.travelAgency')" value="travelAgency" v-model="sector" />
                  <Radio :label="$t('Profession.q4.artDealership')" value="artDealership" v-model="sector" />
                  <Radio :label="$t('Profession.q4.jewelDealership')" value="jewelDealership" v-model="sector" />
                  <Radio :label="$t('Profession.q4.mining')" value="mining" v-model="sector" />
                  <Radio :label="$t('Profession.q4.oil')" value="oil" v-model="sector" />
                  <Radio :label="$t('Profession.q4.defense')" value="defense" v-model="sector" />
                  <Radio :label="$t('Profession.q4.nuclear')" value="nuclear" v-model="sector" />
                  <Radio :label="$t('Profession.q4.realEstate')" value="realEstate" v-model="sector" />
                  <Radio :label="$t('Profession.q4.civilConstruction')" value="civilConstruction" v-model="sector" />
                  <Radio :label="$t('Profession.q4.transport')" value="transport" v-model="sector" />
                  <Radio :label="$t('Profession.q4.fintech')" value="fintech" v-model="sector" />
                  <Radio :label="$t('Profession.q4.charities')" value="charities" v-model="sector" />
                  <Radio :label="$t('Profession.q4.none')" value="none" v-model="sector" />
                  <span class="error" v-if="errors[0]">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
              
              <ValidationProvider v-if="sector === 'none'" rules="requiredInput" v-slot="{ errors }">
                <Textinput v-if="sector === 'none'" :label="$t('Profession.q5.label')" v-model="userSector" type="text" required :error="errors[0]" />
              </ValidationProvider>
            </template>

            <ValidationProvider v-if="employment === 'unemployed' && (investorType === 'adult' || (investorType === 'minor' && $store.getters.answer.whoProvidedMoney === 'thirdParty')) && $store.getters.answer.sourceOfWealth === 'income'" rules="requiredInput" v-slot="{ errors }">
              <Textinput textarea autocomplete="off" rows="4" :label="$t('SourceOfWealth.q3.label')" v-model="notes" required :error="errors[0]" />
            </ValidationProvider>

            <Button @click="next" :loading="loading" :label="$t('Profession.button')" />
         </ValidationObserver>
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import Button from '@/components/forms/Button'
import Radio from '@/components/forms/Radio'
import Textinput from '@/components/forms/Input'
import Progressbar from '@/components/ProgressBar.vue'


export default {
  name: 'Profession',
  components: {
    Button,
    Radio,
    Textinput,
    Progressbar
  },
  data() {
    return {
      loading: false,
      relationship: undefined,
      employment: undefined,
      profession: "",
      sector: undefined,
      userSector: "",
      notes: ""
    }
  },
  beforeMount() {
    if (this.isMinor && this.$store.getters.answer.whoProvidedMoney !== 'thirdParty') {
      // console.warn('Money in not from Third Party. Skip Profession screen')
      this.$store.dispatch('showNextScreen')
      return
    }
    this.relationship = this.$store.getters.answer.relationship || ""
    this.employment = this.$store.getters.answer.employment || ""
    this.profession = this.$store.getters.answer.profession || ""
    this.sector = this.$store.getters.answer.sector || ""
    this.notes = this.$store.getters.answer.professionNotes || ""
    this.userSector = this.$store.getters.answer.sectorUserInput || ""
  },
  computed: {
    isMinor() {
      return this.$store.getters.answer.isMinor === 'yes'
    },
    investorType() {
      return this.isMinor ? 'minor' : 'adult'
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
          { question: 'relationship', answer: this.relationship},
          { question: 'employment', answer: this.employment},
          { question: 'sector', answer: this.sector },
          { question: 'sectorUserInput', answer: this.userSector },
          { question: 'profession', answer: this.profession},
          { question: 'professionNotes', answer: this.notes}
        ]
      })
      if (!this.$store.state.error.type) {
        this.$store.dispatch("showNextScreen");
      }
      this.loading = false
    }
  }
  
}
</script>
