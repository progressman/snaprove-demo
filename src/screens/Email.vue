<template>
  <section>
    <header class="header"></header>

    <div class="container">
      <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t("EmailVerification.header") }}</h1>
      <div class="box">
        <Progressbar :step="7" />
        <p>{{ $t("EmailVerification.subheader") }}</p>
        <Textinput
          ref="email"
          :label="$t('EmailVerification.q1.label')"
          :error="errors.email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          :disabled="timeForCode"
        />
        <div v-if="timeForCode">
          <Textinput
            ref="code"
            :label="$t('EmailVerification.q2.label')"
            :error="errors.confirmationCode"
            v-model="confirmationCode"
            type="text"
            inputmode="numberic"
            required
            autocomplete="one-time-code"
          />

          <Button
            @click="next"
            :loading="loading"
            :label="$t('EmailVerification.button.verify')"
          />
          <Button
            @click="timeForCode = false"
            :label="$t('EmailVerification.button.resend')"
            class="button button--secondary"
          />
        </div>
        <div v-else>
          <Button
            @click="getCode"
            :loading="loading"
            :label="$t('EmailVerification.button.getCode')"
          />
          <Button
            @click.once="$store.dispatch('showNextScreen')"
            :label="$t('EmailVerification.button.skip')"
            class="button button--secondary"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Textinput from "@/components/forms/Input";
import Progressbar from "@/components/ProgressBar";
import Button from "@/components/forms/Button";

export default {
  name: "Email",
  components: {
    Textinput,
    Progressbar,
    Button,
  },
  data() {
    return {
      email: "",
      confirmationCode: "",
      timeForCode: false,
      timeLimit: 120,
      errors: {},
      loading: false,
    };
  },
  computed: {
    error() {
      return this.$store.state.error;
    },
  },
  created() {
    // If Email verification allready passed, then move to next step
    if (this.$store.state.dossier.email === "success") {
      this.$store.dispatch("showNextScreen");
    }
  },
  watch: {
    timeForCode(newValue) {
      if (newValue === false) {
        clearInterval(this.timer);
        this.$nextTick(() => this.$refs.email.focus());
      }
    },
  },
  methods: {
    async getCode() {
      this.errors = {};
      console.log(this.phoneNumber);
      this.loading = true;
      await this.$store.dispatch("addEmail", { email: this.email });
      this.loading = false;
      if (!this.error.type) {
        this.timeForCode = true;
        this.$nextTick(() => this.$refs.code.focus());
        this.timer = setInterval(() => {
          this.timeLimit -= 1;
        }, 1000);
      } else {
        // Process Wrong Email Format
        if (this.$store.state.error.type.match(/malformed-parameter/)) {
          this.errors = { email: this.$t("EmailVerification.error.email") };
        }
      }
    },
    async next() {
      this.errors = {};
      this.loading = true;
      await this.$store.dispatch("confirmEmail", {
        email: this.email,
        code: this.confirmationCode,
      });
      this.loading = false;

      if (!this.$store.state.error.type) {
        this.$store.dispatch("showNextScreen");
      } else {
        // Process Wrong Code
        if (this.$store.state.error.type.match(/wrong-code/)) {
          this.errors = {
            confirmationCode: this.$t(
              "EmailVerification.error.confirmationCode"
            ),
          };
          return;
        }
        // Process Limit Reach
        this.$store.commit("setCurrentStep", "Error");
      }
    },
  },
};
</script>