<template>
  <section>
    <header class="header"></header>

    <div class="container">
      <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t("BirthCertificate.header") }}</h1>
      <div class="box">
        <Progressbar :step="6" />
        <h2 class="step">{{ $t("step", {stepNumber: 6}) }}</h2>
        <div class="form">
          <div v-html="$t('BirthCertificate.subheaderHTML')"></div>
              
          <ValidationObserver ref="form">
            <ValidationProvider 
              rules="requiredInput|mimes:image/png,image/jpeg,application/pdf"
              ref="file"
              name="file"
              v-slot="{ errors }"
            >

              <Fileinput
              style="margin-top: 2rem;"
                :label="$t('BirthCertificate.q1.birthCertificateFile')"
                accept="image/png, image/jpeg, application/pdf"
                :required="true"
                capture
                :error="errors[0]"
                v-model="birthCertificateFile"
              />
    
              <!-- <label class="label">
                <p>{{ $t("BirthCertificate.q1.birthCertificateFile") }} *</p>
                <input
                  capture
                  type="file"
                  value="birthCertificateFile"
                  @change="changeFile"
                  accept="image/png, image/jpeg, application/pdf"
                />
              </label>
              <div class="error" v-if="errors[0]">{{ errors[0] }}</div> -->
            </ValidationProvider>

            <Button @click="next" :loading="loading" :label="$t('BirthCertificate.button')" />
          </ValidationObserver>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Button from "@/components/forms/Button";
import Progressbar from "@/components/ProgressBar";
import Fileinput from "@/components/forms/Fileinput";
import { extend } from "vee-validate";
import { mimes } from "vee-validate/dist/rules";


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
  name: "Minor_BirthCertificate",
  components: {
    Button,
    Progressbar,
    Fileinput
  },
  data() {
    return {
      loading: false,
      birthCertificateFile: this.$store.getters.answer?.birthCertificateFile
    };
  },
  created() {
    if (this.isAdult) {
      this.$store.dispatch("showNextScreen");
    }
  },
  computed: {
    isAdult() {
      return this.$store.getters.answer.isMinor === "no";
    },
  },
  methods: {
    async changeFile(e) {
      this.birthCertificateFile = e.target.files[0];
      await this.$refs.file.validate(e);
    },
    async next() {
      const valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      this.loading = true;
      if (this.birthCertificateFile.constructor === File) {
        await this.$store.dispatch("answerQuestions", {
          arr: [
            {
              question: "birthCertificateFile",
              answer: this.birthCertificateFile.name,
            },
          ],
        });
        const formData = new FormData();
        if (this.birthCertificateFile.type.match(/image\/(png|jpg|jpeg)/)) {
          formData.append("front", this.birthCertificateFile);
        } else {
          formData.append("file", this.birthCertificateFile);
        }
        await this.$store.dispatch("uploadFile", {
          docType: "utility_bill",
          question: "birthCertificateFile",
          formData,
        });
        await this.$nextTick();
        // File Validation Error
        if (this.$store.state.error.type.match(/malformed-parameter/)) {
          const errorMessage = `${this.$store.state.error.description}`
          this.$refs.form.setErrors({[`file`]: [errorMessage]})
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
