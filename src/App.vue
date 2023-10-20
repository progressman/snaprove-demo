<template>
  <div id="app">
    <div class="current-step">
      <component :is="$store.state.currentStep"></component>
    </div>
    <!-- <Intro />
    <CustomerInformation />
    <MinorInstructions />
    <Phone />
    <BeneficialOwnerDeclaration /> -->
    <!-- <SourceOfFunds /> -->
    <!-- <ThirdPartyInformation />
    <ProofOfAddress />
    <BirthCertificate />
    <Review />
    <ThankYou /> -->
    <!-- <Clarification /> -->
  </div>
</template>

<script>
import Error from "./screens/Error";
import Intro from "./screens/Intro";
import CustomerInformation from "./screens/CustomerInformation";
import Phone from "./screens/Phone";
import Email from "./screens/Email";
import BeneficialOwnerDeclaration from "./screens/BeneficialOwnerDeclaration";
import SourceOfFunds from "./screens/SourceOfFunds";
import Profession from "./screens/Profession";
import ProofOfAddress from "./screens/ProofOfAddress";
import BirthCertificate from "./screens/BirthCertificate";
import Review from "./screens/Review";
import ThankYou from "./screens/ThankYou";
import NetVerify from "./screens/Netverify";
import Clarification from "./screens/Clarification";
import * as Sentry from "@sentry/browser";

export default {
  name: "App",
  components: {
    Error,
    Intro,
    CustomerInformation,
    Phone,
    Email,
    BeneficialOwnerDeclaration,
    SourceOfFunds,
    Profession,
    ProofOfAddress,
    BirthCertificate,
    Review,
    ThankYou,
    NetVerify,
    Clarification,
  },
  async created() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get("customer_id");
    // Chack that customerId is valid
    if (!customerId) {
      this.$store.commit("setError", {
        status: -1,
        type: "bad_customer_id",
      });
      this.$store.state.currentStep = "Error";
      return;
    }

    this.$store.commit("setCustomerId", customerId);
    Sentry.setUser({ id: customerId });
    const reviewMode = JSON.parse(localStorage.getItem(`${customerId}.reviewMode`) || "false");
    if (window.location.href !== document.referrer) {
      localStorage.setItem("referrer", document.referrer);
      console.log("Referrer:", document.referrer);
    }

    this.$store.state.reviewMode = reviewMode;

    this.$store.dispatch("showSpinner");
    console.log("Creating new dossier state..");
    // Create new dossier
    await this.$store.dispatch("createDossier");

    await Promise.all([
      this.$store.dispatch("getDossier"),
      this.$store.dispatch("getDossierData"),
      this.$store.dispatch("getCurrentCounty"),
    ]);

    // Initialize
    // try {
    //   await this.$store.dispatch('initialize')
    // } catch (e) {
    //   console.log(e)
    //   this.$store.state.currentStep = 'error'
    // }
    // console.log('Initialization complete')
    this.$store.dispatch("showNextScreen");
    this.$store.dispatch("hideSpinner");

    // window.onbeforeunload = function (e) {
    //   var dialogText = "You will be redirected to process start. Are you sure?";
    //   e.returnValue = dialogText;
    //   return dialogText;
    // };
  },
};
</script>

<style>
@import "./assets/styles.css";
</style>
