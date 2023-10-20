<template>
  <section v-if="this.$store.state.dossierData">
    <header class="header">
       <LangSelector />
    </header>

    <div class="container">
    <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t("Review.header") }}</h1>

    <div class="box">
      <Progressbar :step="7" />
      <h2 class="step">{{ $t("step", {stepNumber: 7}) }}</h2>
      <div>
        <p>{{ $t("Review.subheader") }}</p>

        <div class="verification" v-if="this.$store.state.dossier.email === 'success'">
          <svg width="36" height="36" class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div class="title">E-mail</div>
          <div class="value">{{ this.$store.state.dossierData.email && this.$store.state.dossierData.email.address }} </div>
        </div>
        
        <div class="verification">
          <svg width="36" height="36" class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div class="title">{{ $t('Review.question.phoneNumber') }}</div>
          <div class="value">{{ this.$store.state.dossierData.phone && this.$store.state.dossierData.phone.digits }}</div>
        </div>

        <id-verification-status v-if="!isMinor" />

        <h2>{{ $t('Review.intoTitle') }}</h2>
        <section class="step">
          <a class="edit" href="#" @click.prevent="$store.commit('setCurrentStep', 'CustomerInformation')" title="edit"></a>
          <span>{{ $t('CustomerInformation.shareholderName') }}: {{ answer.shareholderName }}</span>
          <span>{{ $t('CustomerInformation.caseId') }}: {{ answer.caseId }}</span>
          <span>{{ $t('CustomerInformation.shareholderPartyNumber') }}: {{ answer.shareholderPartyNumber }} </span>
          <span>{{ $t('Review.question.isMinor') }}: {{ $t(answer.isMinor) }} </span>
        </section>

        <section class="step">
          <a class="edit" href="#" @click.prevent="$store.commit('setCurrentStep', 'BeneficialOwnerDeclaration')" title="edit"></a>
          <span>{{ $t(`Review.question.isBeneficialOwner.${investorType}`) }}: {{ $t(answer.isBeneficialOwner) }}</span>
          <span class="freeform">{{ answer.beneficialOwnerNotes }}</span>
        </section>

        <section class="step">
          <a class="edit" href="#" @click.prevent="$store.commit('setCurrentStep', 'SourceOfFunds')" title="edit"></a>
          <span v-if="isMinor">{{ $t('Review.question.whoProvidedMoney') }}: {{ $t(`SourceOfFunds.q1.${answer.whoProvidedMoney}`) }}</span>
          <span>{{ $t('Review.question.sourceOfWealth') }}: 
            <ul style="margin-bottom: 0px;">
            <li v-for="source in sortedSouceOfFunds" :key="source">
              {{ $t(`SourceOfFunds.q2.${source}`) }}
            </li>
            </ul>
          </span>
          <span class="freeform">{{ answer.sourceOfFundsNotes }}</span>
        </section>

        <section class="step" v-if="$store.getters.riskCode === 'H' && sortedDetails.length > 0">
          <a class="edit" href="#" @click.prevent="$store.commit('setCurrentStep', 'Clarification')" title="edit"></a>
          <span v-for="k in sortedDetails" :key="k">
            <div>{{ $t(`Clarification.q1.${k}`) }}</div>
            <span class="freeform">{{ details[k] }}</span>
          </span>
          <span>{{ $t('Review.clarification.supported_files.title') }}: 
            <span v-if="Object.keys($store.getters.answer).filter( x => x.match(/^Doc/) ).length > 0">{{ Object.keys($store.getters.answer).filter( x => x.match(/^Doc/) ).length }}x {{ $t('Review.clarification.supported_files.uploaded') }}</span>
            <span v-else>{{ $t('Review.clarification.supported_files.not_provided') }}</span>
          </span>
        </section>

        <section class="step" v-if="!isMinor || (isMinor && answer.whoProvidedMoney === 'thirdParty')" title="edit">
          <a class="edit" href="#" @click.prevent="$store.commit('setCurrentStep', 'Profession')"></a>
          <span v-if="isMinor">{{ $t('Review.question.relationship') }}: {{ $t(`Profession.q1.${answer.relationship}`) }}</span>
          <span>{{ $t(`Review.question.employment`) }}: {{ $t(`Profession.q2.${answer.employment}`) }}</span>
          <span v-if="['employed', 'retired'].includes(answer.employment)">{{ $t(`Review.question.profession`) }}: {{ answer.profession }}</span>
          <span v-if="['employed', 'retired'].includes(answer.employment)">{{ $t(`Review.question.sector`) }}: {{ answer.sector === 'none' ? answer.sectorUserInput : $t(`Profession.q4.${answer.sector}`)}}</span>
          <span class="freeform">{{ answer.professionNotes }}</span>
        </section>

        <section class="step">
          <a class="edit" href="#" @click.prevent="$store.commit('setCurrentStep', 'ProofOfAddress')" title="edit"></a>
          <span>{{ $t(`ProofOfAddress.q1.southAfricaResident.${investorType}`) }}: {{ $t(answer.southAfricaResident) }}</span>
          <span>{{ $t(`ProofOfAddress.q2.usingPoBox.${investorType}`) }}: {{ $t(answer.poBox) }}</span>
          <span v-if="(answer.poBox === 'yes' || answer.southAfricaResident === 'yes' )">{{ $t('ProofOfAddress.q3.proofOfAddressFile') }}: {{ $t('uploaded') }}</span>
        </section>

        <section class="step" v-if="isMinor">
          <a class="edit" href="#" @click.prevent="$store.commit('setCurrentStep', 'BirthCertificate')" title="edit"></a>
          <span>{{ $t('BirthCertificate.header') }}: {{ $t('uploaded') }}</span>
        </section>

        

        <div style="margin-top: 3em; margin-bottom: 0em;">
          <p>{{ $t('Review.disclaimer_0') }}</p>
          <p>{{ $t('Review.disclaimer') }}</p>
        </div>

        <Button @click="next" :loading="loading" :label="$t('Review.button')" />
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import Button from "@/components/forms/Button"
import Progressbar from "@/components/ProgressBar"
import IdVerificationStatus from "@/components/IdVerificationStatus"
import LangSelector from "@/components/LangSelector"

import difference from 'lodash/difference';

export default {
  name: "Minor_Review",
  components: {
    Button,
    Progressbar,
    IdVerificationStatus,
    LangSelector
  },
  data() {
    return {
      loading: false
    };
  },
  async mounted() {
    await this.$store.dispatch('getDossier')
    await this.$store.dispatch('getDossierData')
    // Set reviewMode = true
    this.$store.commit('setReviewMode', true)
    localStorage.setItem(`${this.$store.state.customerId}.reviewMode`, 'true');
  },
  computed: {
    details() {
      return JSON.parse(this.answer.clarificationDetails || '{}')
    },
    answer() {
      return this.$store.getters.answer
    },
    isMinor() {
      return this.$store.getters.answer.isMinor === 'yes'
    },
    investorType() {
      return this.isMinor ? 'minor' : 'adult'
    },
    idDocumentVerified() {
      if (this.isMinor) return true
      return this.$store.state.dossier.id_document === 'success'
    },
    sortedSouceOfFunds() {
      return ['professionalIncome', 'businessOwnership', 'familyIncome', 'inheritance', 'saleOfProperty', 'saleOfCompany', 'investmentProfit', 'rentalIncome', 'other'].filter(s => this.answer.sourceOfFunds.includes(s))
    },
    sortedDetails() {
      // let result = {};
      return ['professionalIncome', 'businessOwnership', 'familyIncome', 'inheritance', 'saleOfProperty', 'saleOfCompany', 'investmentProfit', 'rentalIncome', 'other'].filter(s => Object.keys(this.details).includes(s))
      // .forEach(s => Object.assign(result, {[s]: this.details[s]}))
      // return result
    },
    clarificationUploadsPossible() {
      return difference(this.sourceOfFunds, ["professionalIncome"]).length !== 0
    }

  },
  methods: {
    async next() {
      if (!this.idDocumentVerified) {
        alert("Please wait for ID document verification")
        return
      }
      this.loading = true
      await this.$store.dispatch('deliverDossier')
      await this.$store.dispatch('showNextScreen')
      this.loading = false
    }
  }
};
</script>

<style scoped>
.form {
  max-width: 385px;
}
.step {
  border-bottom: 1px solid #ccc;
  margin: 1rem 0;
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-right: 3rem;
}
.step span {
  margin-bottom: 0.5rem;
}
.step .edit {
  position: absolute;
  top: -6px;
  right: 0;
  display: block;
  width: 32px;
  height: 30px;
  background-image: url("data:image/svg+xml,%3Csvg width='32' height='30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M31.49 5l-2.1-1.84a2 2 0 00-2.77.18l-1.76 2 4.72 4.13 2.06-2.35A1.51 1.51 0 0031.48 5h.01zm-7.17 1L29 10.16 18.59 22.11 13.87 18 24.32 6zM12.656 24.324a.5.5 0 01-.166-.464l.79-5.11L18 22.88l-4.86 1.54a.5.5 0 01-.484-.096z' fill='%23205593'/%3E%3Cpath d='M22.77 18.33v8.36a2.58 2.58 0 01-2.58 2.58H2.58A2.58 2.58 0 010 26.69V3.31A2.58 2.58 0 012.58.73h17.61a2.58 2.58 0 012.58 2.58v3.54l-2.21 2.42v-6a.37.37 0 00-.37-.37H2.58a.37.37 0 00-.37.37v23.42c0 .204.166.37.37.37h17.61a.37.37 0 00.37-.37v-5.84l2.21-2.52z' fill='%23205593'/%3E%3Cpath d='M17.59 8.6H5.18a.74.74 0 01-.74-.74v-.8a.74.74 0 01.74-.74h12.41a.74.74 0 01.74.74v.81a.74.74 0 01-.74.73zM15.28 13.58H5.18a.74.74 0 01-.74-.74V12a.74.74 0 01.74-.74H16c.88 0 1.13.55.56 1.22l-.69.81a.85.85 0 01-.59.29zM11 18.57H5.18a.74.74 0 01-.74-.74V17a.74.74 0 01.74-.74h6.53c.86 0 1.12.54.57 1.21l-.67.81a.85.85 0 01-.61.29zM9.88 23.81h-4.7a.74.74 0 01-.74-.74v-.81a.74.74 0 01.74-.74H10a.72.72 0 01.73.81l-.08.81a.74.74 0 01-.77.67z' fill='%23205593'/%3E%3C/svg%3E");
}

.step .freeform {
  border-left: 0.25rem solid #c3c3c3;
  padding-left: 0.5rem;
}

.step .freeform:empty {
  margin-bottom: 0;
}

b {
  font-family: TradeGothicW01-BoldCn20_675334,Arial Narrow,Arial,sans-serif;
  text-transform: uppercase;
  font-size: 24px;
  color: #5e5e5e;
}

h2 {
  margin-top: 3rem;
  font-weight: normal;
  text-transform: uppercase;
  font-size: 20px;
  line-height: 24px;
  color: black;
}

</style>