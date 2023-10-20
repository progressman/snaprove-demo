<template>
  <section>
    <header class="header"></header>

    <div class="container">
      <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t("BeneficialOwnerDeclaration.header") }}</h1>
      <div class="box">
        <Progressbar :step="1" />
        <h2 class="step">{{ $t("step", {stepNumber: 1}) }}</h2>
        <div class="form">
          <ValidationObserver ref="form">
              <ValidationProvider rules="requiredRadio" v-slot="{ errors }">
                <div style="margin-bottom: 1rem;">
                  <label class="label">{{ $t(`BeneficialOwnerDeclaration.q1.label.${minorOrAdult}`) }}{{'\xa0'}}*</label>
                  <div style="display: flex;">
                    <Radio :label="$t('yes')" value="yes" v-model="isBeneficialOwner" style="margin-right: 20px;" />
                    <Radio :label="$t('no')" value="no" v-model="isBeneficialOwner" />
                  </div>
                  <span class="error" v-if="errors[0]">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
              <ValidationProvider v-if="isBeneficialOwner === 'no'" rules="requiredInput" v-slot="{ errors, required }">
                <Textinput textarea autocomplete="off" rows="4" :label="$t('BeneficialOwnerDeclaration.q2.label')" v-model="notes" :error="errors[0]" :required="required"  />
              </ValidationProvider>
              <Button @click="next" :loading="loading" :label="$t('BeneficialOwnerDeclaration.button')" />
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

import Progressbar from "@/components/ProgressBar";

export default {
  name: 'BenificialOwnerDeclaration',
  components: {
    Button,
    Radio,
    Textinput,
    Progressbar
  },
  data() {
    return {
      loading: false,
      isBeneficialOwner: undefined,
      notes: ""
    }
  },
  computed: {
    minorOrAdult() {
      return this.$store.getters.answer.isMinor === 'yes' ? 'minor' : 'adult'
    },
  },
  beforeMount() {
    this.isBeneficialOwner = this.$store.getters.answer.isBeneficialOwner || ""
    this.notes = this.$store.getters.answer.beneficialOwnerNotes || ""
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
          {question: 'isBeneficialOwner', answer: this.isBeneficialOwner},
          {question: 'beneficialOwnerNotes', answer: this.notes },
        ]
      })
      if (!this.$store.state.error.type) {
        this.$store.dispatch('showNextScreen')
      }
      this.loading = false
    }
  }
}
</script>
