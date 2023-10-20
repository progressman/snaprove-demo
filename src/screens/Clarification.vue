<template>
  <section>
    <header class="header"></header>

    <div class="container">
      <h1
        class="pagetitle"
        :class="{ 'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale) }"
      >
        {{ $t("Clarification.header") }}
      </h1>

      <div class="box">
        <Progressbar :step="3" />
        <h2 class="step">{{ $t("step", { stepNumber: 3 }) }}</h2>
        <ValidationObserver ref="form">
        <div class="form">     
          <p>{{ $t("Clarification.subheader") }}</p>
          
           <div v-if="$store.getters.answer.sourceOfFunds.includes('businessOwnership')">
            <ValidationProvider
              rules="requiredInput"
              v-slot="{ errors }"
            >
              <Textinput
                textarea
                autocomplete="off"
                rows="3"
                :help="$t('Clarification.sources.businessOwnership')"
                :label="$t('Clarification.q1.businessOwnership')"
                :error="errors[0]"
                v-model="details.businessOwnership"
                required
              />
            </ValidationProvider>
          </div>
          
          <div v-if="$store.getters.answer.sourceOfFunds.includes('familyIncome')">
            <ValidationProvider
              rules="requiredInput"
              v-slot="{ errors }"
            >
              <Textinput
                textarea
                autocomplete="off"
                rows="3"
                :help="$t('Clarification.sources.familyIncome')"
                :label="$t('Clarification.q1.familyIncome')"
                :error="errors[0]"
                v-model="details.familyIncome"
                required
              />
            </ValidationProvider>
          </div>

          <div v-if="$store.getters.answer.sourceOfFunds.includes('inheritance')">
            <ValidationProvider
              rules="requiredInput"
              v-slot="{ errors }"
            >
              <Textinput
                textarea
                autocomplete="off"
                rows="3"
                :help="$t('Clarification.sources.inheritance')"
                :label="$t('Clarification.q1.inheritance')"
                :error="errors[0]"
                v-model="details.inheritance"
                required
              />
            </ValidationProvider>
          </div>

          <div v-if="$store.getters.answer.sourceOfFunds.includes('saleOfProperty')">
            <ValidationProvider
              rules="requiredInput"
              v-slot="{ errors }"
            >
              <Textinput
                textarea
                autocomplete="off"
                rows="3"
                :help="$t('Clarification.sources.saleOfProperty')"
                :label="$t('Clarification.q1.saleOfProperty')"
                :error="errors[0]"
                v-model="details.saleOfProperty"
                required
              />
            </ValidationProvider>
          </div>         

          <div v-if="$store.getters.answer.sourceOfFunds.includes('saleOfCompany')">
            <ValidationProvider
              rules="requiredInput"
              v-slot="{ errors }"
            >
              <Textinput
                textarea
                autocomplete="off"
                rows="3"
                :help="$t('Clarification.sources.saleOfCompany')"
                :label="$t('Clarification.q1.saleOfCompany')"
                :error="errors[0]"
                v-model="details.saleOfCompany"
                required
              />
            </ValidationProvider>
          </div>

          <div v-if="$store.getters.answer.sourceOfFunds.includes('investmentProfit')">
            <ValidationProvider
              rules="requiredInput"
              v-slot="{ errors }"
            >
              <Textinput
                textarea
                autocomplete="off"
                rows="3"
                :help="$t('Clarification.sources.investmentProfit')"
                :label="$t('Clarification.q1.investmentProfit')"
                :error="errors[0]"
                v-model="details.investmentProfit"
                required
              />
            </ValidationProvider>
          </div>

          <div v-if="$store.getters.answer.sourceOfFunds.includes('rentalIncome')">
            <ValidationProvider
              rules="requiredInput"
              v-slot="{ errors }"
            >
              <Textinput
                textarea
                autocomplete="off"
                rows="3"
                :help="$t('Clarification.sources.rentalIncome')"
                :label="$t('Clarification.q1.rentalIncome')"
                :error="errors[0]"
                v-model="details.rentalIncome"
                required
              />
            </ValidationProvider>
          </div>

          <div v-if="$store.getters.answer.sourceOfFunds.includes('other')">
            <ValidationProvider
              rules="requiredInput"
              v-slot="{ errors }"
            >
              <Textinput
                textarea
                autocomplete="off"
                rows="3"
                :help="$t('Clarification.sources.other')"
                :label="$t('Clarification.q1.other')"
                :error="errors[0]"
                v-model="details.other"
                required
              />
            </ValidationProvider>
          </div>
    

          <template v-if="uploadVisible">
            <div class="textinput__label">{{ $t('Clarification.q2.label') }}</div>
            <div class="textinput__help">{{ $t('Clarification.q2.help') }}</div>
            <!-- <ValidationProvider v-for="(file, idx) in files.slice(0, this.required)" :key="idx"
              rules="requiredInput|mimes:image/png,image/jpeg,application/pdf"
              ref="file"
              v-slot="{ errors }"
            >
              <Fileinput 
                class="small-margin"
                accept="image/png, image/jpeg, application/pdf"
                capture
                :error="errors[0]"
                v-model="files[idx]"
              />
            </ValidationProvider> -->
            
           
            <ValidationProvider v-for="(file, idx) in files.slice(this.required, files.length)" :key="idx + required"
              rules="mimes:image/png,image/jpeg,application/pdf"
              ref="file"
              :name="`Doc-${idx}-file`"
              v-slot="{ errors }"
            >
              <Fileinput 
                class="small-margin"
                accept="image/png, image/jpeg, application/pdf"
                capture
                :error="errors[0]"
                v-model="files[idx + required]"
              />
            </ValidationProvider>
            

            <div>
              <a class="add" href="#" @click.prevent="files.push(null)">{{ $t('Clarification.addDocument') }}</a><br />
            </div>
          </template>

            <Button
              @click="next"
              :loading="loading"
              :label="$t('ProofOfAddress.button')"
            />
          
        </div>
        </ValidationObserver>
      </div>
    </div>
    
  </section>
</template>

<script>
import Button from "@/components/forms/Button";
import Progressbar from "@/components/ProgressBar";
import Textinput from "@/components/forms/Input";
import Fileinput from "@/components/forms/Fileinput";

import { extend } from "vee-validate";
import { mimes } from "vee-validate/dist/rules";

import pick from 'lodash/pick';
import difference from 'lodash/difference';

// Override the default message.
extend("mimes", {
  ...mimes,
  validate: value => {
    if (value.constructor === String) {
      return value.match(/^.*\..{3,4}$/);
    } else {
      return mimes.validate
    }
  },
  message: "Use image or pdf",
});


export default {
  name: "Clarification",
  components: {
    Button,
    Textinput,
    Fileinput,
    Progressbar,
  },
  data() {
    return {
      files: [],
      loading: false,
      details: {}
    };
  },
  async created() {
    if (this.$store.getters.riskCode !== 'H') {
      this.$store.dispatch("showNextScreen");
      return null
    }
    // skip if only professional and (or) family income
    if (difference(this.sourceOfFunds, ["professionalIncome"]).length === 0) {
      // Удаляем все sourceOfFunds details которые могли быть проставлены ранее
      const arr = [{question: 'clarificationDetails', answer: JSON.stringify({})}]
      await this.$store.dispatch("answerQuestions", {
        arr: arr
      });
      
      this.$store.dispatch("showNextScreen");
      return null
    }
  },
  beforeMount() {
    this.details = JSON.parse(this.$store.getters.answer.clarificationDetails || '{}');
    this.files = Object.keys(this.$store.getters.answer).filter(x => x.match(/^Doc/)).map(x => this.$store.getters.answer[x])
    
    const delta = this.required - this.files.length  
    for(var i=0; i < delta; i++){
      this.files.push(null)
    }
  },
  computed: {
    uploadVisible() {
      return difference(this.sourceOfFunds, ["familyIncome", "professionalIncome"]).length
    },
    required() {
      // For now all uploads are optional
      return 0
      // return difference(this.sourceOfFunds, ["familyIncome", "professionalIncome"]).length
    },
    sourceOfFunds() {
      return this.$store.getters.answer.sourceOfFunds;
    },
    notEmptyFiles() {
      return this.files.filter(x => x !== null)
    }
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async next() {
      const valid = await this.$refs.form.validate();
      if (!valid) {
        window.document.body.scrollTop = 0; // For Safari
        window.document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        return;
      }
      this.loading = true;

      const arr = {question: 'clarificationDetails', answer: JSON.stringify(pick(this.details, this.sourceOfFunds))}
      await this.$store.dispatch("answerQuestions", {
        arr: this.notEmptyFiles.map((file,idx) => ({ question: `Doc-${idx}-file`, answer: file?.name || file || "" }) ).concat(arr)
      });
     
      let uploadErrors = false
      let formErrors = {}
      for (var idx = 0; idx < this.notEmptyFiles.length; idx++) {
        const file = this.notEmptyFiles[idx]
        if (!file) { continue; }
        if (file.constructor === String) { continue; }
        const formData = new FormData();
        if (file.type.match(/image\/(png|jpg|jpeg)/)) {
          formData.append("front", file);
        } else {
          formData.append("file", file);
        }
        
        await this.$store.dispatch("uploadFile", {
          docType: "utility_bill",
          question: `Doc-${idx}-file`,
          formData,
        });

        await this.$nextTick();
        // File Validation Error
        if (this.$store.state.error.type.match(/malformed-parameter/)) {
          uploadErrors = true
          const errorMessage = `${this.$store.state.error.description}`
          Object.assign(formErrors, {[`Doc-${idx}-file`]: [errorMessage]} )
          // this.$refs.form.setErrors({[`Doc-${idx}-file`]: [errorMessage]})
        } else {
          // Wait for OCR to complete before upload another file
          await this.$store.dispatch('getDossier')
          while (this.$store.state.dossier.documents.questions === "confirming") {
            // wait 1 second and recheck
            await this.sleep(1000)
            await this.$store.dispatch('getDossier')
          }
        }
      }
      this.$refs.form.setErrors(formErrors)
      this.loading = false
      if (!uploadErrors && !this.$store.state.error.type) {
        this.$store.dispatch("showNextScreen");
      }
    },
  },
};
</script>

<style scoped>
li {
  padding-bottom: 0.375em;
}
.add {
  display: inline-block;
  margin-top: 0px;
  margin-right: auto;
  border: 1px solid #005598;
  border-radius: 4px;
  padding: 10px 32px 10px 14px;
  background-repeat: no-repeat;
  background-position-y: 50%;
  background-position-x: calc(100% - 10px);
  background-image: url("data:image/svg+xml,%3Csvg width='15' height='15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23a)' stroke='%23005598' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7.3 14.259a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z' stroke-width='1.2'/%3E%3Cpath d='M5.2 7.66h4.1M7.3 5.259v4.9' stroke-width='1.5'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath fill='%23fff' transform='translate(0 .459)' d='M0 0h14.5v14.5H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
}
.small-margin {
  margin-top: 0px;
  margin-bottom: 0.5em;
}
.textinput__label {
  font-family: "Trade Gothic W01 Bold_2";
  font-weight: 700;
  margin-bottom: 0px;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 5px;
  color: #333;
}
.textinput__help {
  font-size: 12px;
  line-height: 15px;
  color: #767676;
  margin-top: -6px;
  margin-bottom: 5px;
}
</style>
