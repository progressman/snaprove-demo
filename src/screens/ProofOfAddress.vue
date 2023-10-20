<template>
  <section>
    <header class="header"></header>

    <div class="container">
    <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t("ProofOfAddress.header") }}</h1>

    <div class="box">
      <Progressbar :step="5" />
      <h2 class="step">{{ $t("step", {stepNumber: 5}) }}</h2>
      <div class="form">
        <p>{{ $t("ProofOfAddress.subheader") }}</p>
        <ValidationObserver ref="form">
          <ValidationProvider rules="requiredRadio" v-slot="{ errors }">
            <div style="margin-bottom: 1rem; margin-top: 1.5rem;">
              <label class="label">{{ $t(`ProofOfAddress.q1.southAfricaResident.${minorOrAdult}`) }}{{'\xa0'}}*</label>
              <div style="display: flex">
                <Radio
                  :label="$t('yes')"
                  value="yes"
                  v-model="southAfricaResident"
                  style="margin-right: 20px"
                />
                <Radio
                  :label="$t('no')"
                  value="no"
                  v-model="southAfricaResident"
                />
              </div>
              <span class="error" v-if="errors[0]">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider rules="requiredRadio" v-slot="{ errors }">
            <div style="margin-bottom: 1rem">
              <label class="label">{{ $t(`ProofOfAddress.q2.usingPoBox.${minorOrAdult}`) }}{{'\xa0'}}*</label>
              <div style="display: flex">
                <Radio
                  :label="$t('yes')"
                  value="yes"
                  v-model="poBox"
                  style="margin-right: 20px"
                />
                <Radio :label="$t('no')" value="no" v-model="poBox" />
              </div>
              <span class="error" v-if="errors[0]">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
          
          
          <ValidationProvider
            v-if="southAfricaResident === 'yes' || poBox === 'yes'"
            rules="requiredInput|mimes:image/png,image/jpeg,application/pdf"
            ref="file"
            name="file"
            v-slot="{ errors }"
          >
            <div v-html="$t('ProofOfAddress.proofRequirmentsHTML')"></div>
          

            <Fileinput
              style="margin-top: 2rem;"
              :label="$t('ProofOfAddress.q3.proofOfAddressFile')"
              accept="image/png, image/jpeg, application/pdf"
              :required="true"
              capture
              :error="errors[0]"
             
              v-model="proofOfAddressFile"
            />

          </ValidationProvider>

          <Button @click="next" :loading="loading" :label="$t('ProofOfAddress.button')" />
        </ValidationObserver>
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import Button from "@/components/forms/Button";
import Radio from "@/components/forms/Radio";
import Progressbar from '@/components/ProgressBar.vue'
import Fileinput from "@/components/forms/Fileinput";

import { extend } from "vee-validate";
import { mimes } from "vee-validate/dist/rules";

// Override the default message.
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
  name: "ProofOfAddress",
  components: {
    Button,
    Radio,
    Fileinput,
    Progressbar
  },
  data() {
    return {
      loading: false,
      southAfricaResident: undefined,
      poBox: undefined,
      proofOfAddressFile: this.$store.getters.answer?.proofOfAddressFile
    };
  },
  beforeMount() {
    this.southAfricaResident = this.$store.getters.answer.southAfricaResident
    this.poBox = this.$store.getters.answer.poBox
  },
  watch: {
    async proofOfAddressFile(newValue) {
      await this.$refs.file.validate(newValue);
    }
  },
  // created() {
  //   if (this.isMinor) {
  //     this.$store.dispatch("showNextScreen");
  //   }
  // },
  computed: {
    isMinor() {
      return this.$store.getters.answer.isMinor === "yes";
    },
    minorOrAdult() {
      return this.$store.getters.answer.isMinor === 'yes' ? 'minor' : 'adult'
    },
  },
  methods: {
    async next() {
      const valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      this.loading = true;
      // let fileName = ''
      // if (this.southAfricaResident === 'yes' || this.poBox === 'yes') {
      //   fileName = ''
      // } else {
      //   fileName = this.proofOfAddressFile?.constructor === File ? this.proofOfAddressFile.name : this.proofOfAddressFile || "" }
      // }
      await this.$store.dispatch("answerQuestions", {
        arr: [
          { question: "southAfricaResident", answer: this.southAfricaResident },
          { question: "poBox", answer: this.poBox },
          { question: "proofOfAddressFile", answer: this.proofOfAddressFile?.constructor === File ? this.proofOfAddressFile?.name : this.proofOfAddressFile || "" },
        ],
      });
      if (this.southAfricaResident === 'yes' || this.poBox === 'yes') {
         if (this.proofOfAddressFile.constructor === File) {
          const formData = new FormData();
          if (this.proofOfAddressFile.type.match(/image\/(png|jpg|jpeg)/)) {
            formData.append("front", this.proofOfAddressFile);
          } else {
            formData.append("file", this.proofOfAddressFile);
          }
          await this.$store.dispatch("uploadFile", {
            docType: "utility_bill",
            question: "proofOfAddressFile",
            formData,
          });
          
          await this.$nextTick();
          // File Validation Error
          if (this.$store.state.error.type.match(/malformed-parameter/)) {
            const errorMessage = `${this.$store.state.error.description}`
            this.$refs.form.setErrors({[`file`]: [errorMessage]})
          }
        }
      }
      
      if (!this.$store.state.error.type) {
        this.$store.dispatch("showNextScreen");
      }
      this.loading = false;
    },
  },
};
</script>
