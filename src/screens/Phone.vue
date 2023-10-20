<template>
  <section>
    <header class="header"></header>

    <div class="container">
      <h1 class="pagetitle" :class="{ 'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale) }">
        {{ $t("PhoneVerification.header") }}
      </h1>

      <div class="box">
        <progressbar :step="7" />
        <p>{{ $t("PhoneVerification.subheader") }}</p>

        <div
          class="textinput"
          :class="{ 'textinput-error': errors.phoneNumber }"
          style="margin-top: 2rem; padding-right: 46px;"
        >
          <div>
            <div class="textinput__label">{{ $t("PhoneVerification.q1.label") }} *</div>
            <div class="textinput__help">{{ $t("PhoneVerification.q1.help") }}</div>
            <div class="textinput__control">
              <vue-tel-input
                ref="tel"
                v-model="phoneNumber"
                mode="international"
                :disabled="timeForCode"
                :autoDefaultCountry="false"
                :defaultCountry="`${defaultCountry}`"
                :inputOptions="{ placeholder: $t('PhoneVerification.q1.placeholder') }"
              >
              </vue-tel-input>
            </div>
            <div class="textinput__error">{{ errors.phoneNumber }}</div>
          </div>
        </div>

        <div v-if="timeForCode">
          <Textinput
            ref="code"
            :label="$t('PhoneVerification.q2.label')"
            :error="errors.confirmationCode"
            :hint="timeLeft"
            v-model="confirmationCode"
            type="text"
            inputmode="numberic"
            required
            autocomplete="one-time-code"
          />
          <Button @click="next" :loading="loading" :label="$t('PhoneVerification.button.verify')" />
          <Button
            @click="timeForCode = false"
            :label="$t('PhoneVerification.button.resend')"
            class="button button--secondary"
          />
        </div>

        <Button
          v-if="!timeForCode"
          @click="getCode('sms')"
          :loading="loadingSMS"
          :disabled="disabled"
          :label="$t('PhoneVerification.button.getCodeViaSMS')"
        />

        <Button
          class="button button--secondary"
          v-if="!timeForCode && codeRetryCounter >= 3 && !(loadingSMS && codeRetryCounter == 3)"
          @click="getCode('call')"
          :loading="loadingCall"
          :disabled="disabled"
          :label="$t('PhoneVerification.button.getCodeViaCall')"
        />
      </div>
    </div>
  </section>
</template>

<script>
import Textinput from "@/components/forms/Input";
import Progressbar from "@/components/ProgressBar";
import Button from "@/components/forms/Button";

import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/dist/css/sprite.css";
import "vue-tel-input/dist/css/component.css";

export default {
  components: {
    Textinput,
    Progressbar,
    Button,
    VueTelInput,
  },
  data() {
    return {
      phoneNumber: "",
      confirmationCode: "",
      timeForCode: false,
      timeLimit: 120,
      errors: {},
      disabled: false,
      loading: false,
      loadingSMS: false,
      loadingCall: false,
      codeRetryCounter: 0,
    };
  },
  computed: {
    defaultCountry() {
      return this.$store.state.defaultCountry;
    },
    error() {
      return this.$store.state.error;
    },
    timeLeft() {
      let s = this.timeLimit;
      return (
        this.$t("PhoneVerification.timeLeft") +
        ": " +
        (s - (s %= 60)) / 60 +
        (9 < s ? ":" : ":0") +
        s
      );
    },
  },
  created() {
    // If Phone verification allready passed, then move to next step
    if (this.$store.state.dossier.phone === "success") {
      this.$store.dispatch("showNextScreen");
    }
  },
  // mounted() {
  //   this.$store.dispatch("getCurrentCounty");
  // },
  watch: {
    timeForCode(newValue) {
      if (newValue === false) {
        clearInterval(this.timer);
        this.$nextTick(() => this.$refs.tel.focus());
      }
    },
    timeLimit(val) {
      if (val === 0) {
        clearInterval(this.timer);
        this.timeForCode = false;
      }
    },
  },
  methods: {
    async getCode(channel = "sms") {
      this.errors = {};
      this.$store.dispatch("showSpinner");
      // console.log(this.phoneNumber)
      if (channel === "sms") this.loadingSMS = true;
      if (channel === "call") this.loadingCall = true;
      this.disabled = true;
      this.codeRetryCounter = this.codeRetryCounter + 1;
      await this.$store.dispatch("addPhone", {
        phone: this.phoneNumber,
        channel: channel,
        locale: this.$i18n.locale,
      });
      this.loadingSMS = false;
      this.loadingCall = false;
      this.disabled = false;
      this.$store.dispatch("hideSpinner");
      if (!this.error.type) {
        this.timeLimit = 120;
        this.confirmationCode = "";
        this.timeForCode = true;
        this.$nextTick(() => this.$refs.code.focus());
        this.timer = setInterval(() => {
          this.timeLimit -= 1;
        }, 1000);
      } else {
        // Process Wrong Phone Number
        if (this.$store.state.error.type.match(/malformed-parameter/)) {
          this.errors = { phoneNumber: this.$t("PhoneVerification.error.phoneNumber") };
          return;
        }
        this.$store.commit("setCurrentStep", "Error");
      }
    },
    async next() {
      this.errors = {};
      this.$store.dispatch("showSpinner");
      this.loading = true;
      await this.$store.dispatch("confirmPhone", {
        phone: this.phoneNumber,
        code: this.confirmationCode,
      });
      this.loading = false;
      this.$store.dispatch("hideSpinner");

      if (!this.$store.state.error.type) {
        this.$store.dispatch("showNextScreen");
      } else {
        // Process Wrong Code
        if (this.$store.state.error.type.match(/wrong-code/)) {
          this.errors = { confirmationCode: this.$t("PhoneVerification.error.confirmationCode") };
          return;
        }
        // Process Limit Reach
        this.$store.commit("setCurrentStep", "Error");
      }
    },
  },
};
</script>

<style scoped>
.vue-tel-input:focus-within {
  box-shadow: 0 0 0 2px #005598;
  color: black;
  background-color: #fafafa;
  outline: none;
}

.textinput {
  margin-bottom: 2rem;
  padding-right: 36px;
}

.textinput-error .vue-tel-input {
  box-shadow: 0 0 0 1px #b30000;
}

.textinput-error .vue-tel-input:focus-within {
  box-shadow: 0 0 0 2px #005598;
}

.textinput__label {
  font-family: "Trade Gothic W01 Bold_2";
  font-weight: 700;
  margin-bottom: 0px;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 5px;
}

.textinput__help {
  font-size: 12px;
  line-height: 15px;
  color: #767676;
  margin-top: -6px;
  margin-bottom: 5px;
}

.textinput__error {
  color: #b30000;
  font-size: 16px;
  line-height: 22px;
  padding-top: 4px;
}
</style>
