import Vue from "vue";
import Vuex from "vuex";
import rkycClient from "@/libs/rkyc-client";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    customerId: "",
    onReturn: null,
    defaultCountry: "",

    phone: "",
    phoneCode: "",
    mail: "",
    mailCode: "",

    jwtToken: null,
    mailCodeSent: false,
    spinner: true,

    // acceptedIds: [],
    // documents: [],
    error: {
      status: null,
      type: "",
      title: "",
      description: "",
      timestamp: "",
    },

    netVerify: {
      issuingCountry: "",
      docType: "",
      frontView: null,
      backView: null,
      selfie: null,
    },

    dossier: {},
    dossierData: {},
    stepIndex: 0,
    currentStep: "",

    reviewMode: false,
    flow: [
      "Intro",
      // "CustomerInformation",
      // "Phone",
      // "Email",
      "NetVerify", // only For Adult
      // "BeneficialOwnerDeclaration",
      // "SourceOfFunds",
      // "Clarification",
      // "Profession",
      // "ProofOfAddress",
      // "BirthCertificate", // only For Minor
      // "Review",
      "ThankYou",
    ],
  },

  getters: {
    riskCode(state) {
      // Risk is submitted as an extra char in Customer_ID
      // In normal situation, this will be a char number 11
      return state.customerId[10] === "A" ? "H" : "L";
    },
    answer(state) {
      if (state.dossierData.questions) {
        return state.dossierData.questions.reduce(
          (result, x) => Object.assign(result, { [x.question]: x.answer }),
          {}
        );
      } else {
        return {};
      }
    },
    isMinor(_, getters) {
      return getters.answer.isMinor === "yes";
    },
    //
    incompleteSteps(state, getters) {
      const result = state.flow.filter((step) =>
        ["failure", "pending"].includes(getters.flatDossier[step])
      );
      // Если у нас уже есть URL для NetVerify v.4, а статус id_document = "confirming",
      // то добавляем if_document в начало списка result
      const redirectUrl = window.localStorage.getItem(state.customerId);
      if (redirectUrl && state.dossier.id_document === "confirming") {
        return ["id_document", ...result];
      } else {
        return result;
      }
    },
    confirmingSteps(state, getters) {
      return state.flow.filter((step) => getters.flatDossier[step] === "confirming");
    },
    failedSteps(state, getters) {
      return state.flow.filter((step) => getters.flatDossier[step] === "failure");
    },
    polling(state, getters) {
      if (getters.incompleteSteps.length === 0) {
        if (getters.confirmingSteps.length > 0) {
          return true;
        }
      }
      return false;
    },

    flatDossier(state) {
      const result = {};
      const dossier = state.dossier;
      console.log("FLATTING Dossier");
      console.log(dossier);

      state.flow.forEach((step) => {
        // console.log(`step - ${step}`)

        switch (step) {
          case "residential_address_evidence":
            if (dossier.documents && dossier.documents[step.replace(/_evidence/, "")]) {
              result[step] = dossier.documents[step.replace(/_evidence/, "")];
            } else {
              result[step] = "pending";
            }
            console.log(result[step]);
            break;
          case "questions":
            if (dossier.questions) {
              // result.questions = dossier.questions.tbd;
              result.questions = Object.values(dossier.questions).some((v) => v === "pending")
                ? "pending"
                : "confirmed";
            } else {
              result.questions = "pending";
            }
            console.log(result[step]);
            break;
          default:
            result[step] = state.dossier[step] || "pending";
            console.log(result[step]);
            break;
        }
      });
      return result;
    },

    // Возвращает кол-во завершенных шагов
    stepsPassed(state, getters) {
      let completed = Object.keys(getters.flatDossier)
        .filter((x) => ["success", "confirming"].includes(getters.flatDossier[x]))
        .reduce((s, x) => s + state.steps[x], 0);
      if (state.dossier.phone === "confirming" || state.dossier.email === "confirming") {
        completed -= 1;
      }
      return completed + 1 + state.stepIndex;
    },

    // nextStep: (state, getters) => () => {
    //   if (state.dossier.consistency === 'success') {
    //     if (state.dossier.delivery === 'success') {
    //       return 'final'
    //     } else {
    //       return 'awaiting'
    //     }
    //   }
    //   // email confirming state is different(means that the password has been send)
    //   if (state.dossier.email === "confirming") {
    //     return "email";
    //   }
    //   // if (state.dossier.phone === "confirming") {
    //   //   return "phone";
    //   // }
    //   if (getters.incompleteSteps[0]) {
    //     return getters.incompleteSteps[0]; //.replace(/_/g, "-");
    //   } else {
    //     return state.flow.includes("awaiting") ? "awaiting" : "final";
    //   }
    // },

    idDocument(state) {
      return state.dossierData.id_document;
    },
  },

  mutations: {
    setCurrentStep(state, data) {
      state.currentStep = data;
    },

    setReviewMode(state, data) {
      state.reviewMode = data;
    },

    // Error oject is varying from context
    // We are tring to type cast it.
    setError(state, data) {
      console.log("Set Error");
      console.warn(data);
      state.error.status = data.status;
      if (data.type && data.type.toString().match(/\/api\/errors\/(.*)$/)) {
        state.error.type = data.type.toString().match(/\/api\/errors\/(.*)$/)[1];
      } else {
        state.error.type = data?.type || "";
      }
      state.error.sub_type = data.sub_type;
      state.error.title = data.title;
      state.error.description = data.description || data.detail;
      state.error.timestamp = new Date().getTime();
    },
    setMail(state, data) {
      state.mail = data;
    },
    setSpinner(state, data) {
      state.spinner = data;
    },
    mailCodeSent(state, data) {
      state.mailCodeSent = data;
    },
    installJwtToken(state, data) {
      state.jwtToken = data;
      // Add to LocalStorage
      // localStorage.setItem('jwtToken', data)
    },
    setDossier(state, data) {
      state.dossier = data;
    },
    setJumioDocumentId(state, data) {
      state.jumioDocumentId = data;
    },
    setCustomerId(state, data) {
      console.log("setCustomerId");
      state.customerId = data;
    },
    setDossierData(state, data) {
      state.dossierData = data;
    },
    setSelfie(state, data) {
      state.netVerify.selfie = data;
    },
    setNetVerify(state, { issuingCountry, docType, frontView, backView }) {
      state.netVerify.issuingCountry = issuingCountry;
      state.netVerify.docType = docType;
      state.netVerify.frontView = frontView;
      state.netVerify.backView = backView;
    },
    setAcceptedIds(state, data) {
      state.acceptedIds = data;
    },
    setDefaultCountry(state, data) {
      state.defaultCountry = data;
    },
    processCriticalErrors(state, error) {
      if (state.error.status >= 500) {
        state.error.title = "No connection to server.";
        state.currentStep = "error";
      }
      if (state.error.type.match(/\/limit-reached$/)) {
        state.currentStep = "error";
      }
      if (state.error.status === 413) {
        state.error.title = "Upload error";
        state.error.description = "The file is too big. The maximum limit is 10MB.";
      }
      throw error;
    },
  },

  actions: {
    clearError({ commit }) {
      commit("setError", {
        status: null,
        type: "",
        title: "",
        description: "",
        timestamp: "",
      });
    },

    showSpinner({ commit }) {
      commit("setSpinner", true);
    },

    hideSpinner({ commit }) {
      commit("setSpinner", false);
    },

    // forcedScreen is a screen which need to be show because of a change on a current one
    showNextScreen({ state, commit }, forcedScreen) {
      console.log("show next screen:", forcedScreen || "default");
      let nextStep;

      if (forcedScreen) {
        nextStep = forcedScreen;
      } else {
        if (state.dossier.delivery !== "pending") {
          nextStep = "ThankYou";
        } else {
          nextStep = state.flow[state.flow.findIndex((x) => x === state.currentStep) + 1];
        }
      }
      commit("setCurrentStep", nextStep);
    },

    // moveNextStep({ state, getters }) {
    //   state.stepIndex = 0
    //   state.currentStep = getters.nextStep()
    // },

    // Create a new Dossier using uniq customerId
    async createDossier({ commit, dispatch, state }) {
      console.log("createDossier");
      const customerId = state.customerId;
      try {
        const { data } = await rkycClient.post(
          "dossier",
          { client_id: process.env.VUE_APP_CLIENT_ID, customer_id: customerId },
          { headers: { Authorization: "1234567890" } }
        );

        commit("installJwtToken", data["auth"]["token"]);

        rkycClient.interceptors.request.use(
          (request) => {
            console.log("REQUEST");
            dispatch("clearError");
            request.headers.Authorization = `Bearer ${state.jwtToken}`;
            return request;
          }
          // ,
          // error => {
          //   // Do something with request error
          //   return Promise.reject(error)
          // }
        );

        rkycClient.interceptors.response.use(
          (response) => {
            console.log("RESPONSE");
            // console.log(response)
            return response;
          },
          async (error) => {
            dispatch("hideSpinner");
            console.log(error);
            if (error.response) {
              console.log(error.response);
              let originalRequest = error.response.config;
              if (error.response.status === 401 && !error.response.config.__isRetryRequest) {
                console.log("401 - Recreate dossier");
                await this.dispatch("createDossier");
                // Repeat failed request
                error.response.config.__isRetryRequest = true;
                // Povide a new JWT token
                originalRequest.headers["Authorization"] = "Bearer " + state.jwtToken;
                const reply = await rkycClient.request(originalRequest);
                // console.log(data)
                return reply;
              }
              if (error.response.status === 423 && error.config.url.match(/jumio\/web4/)) {
                console.warn("A previous attempt is still in progress.");
                console.warn("Cansoling previous attempt...");
                await dispatch("abortJumioDocumentId");
                const reply = await rkycClient.request(originalRequest);
                return reply;
              }
              if (error.response.data) {
                commit("setError", error.response.data);
              } else {
                commit("setError", {
                  status: error.response.status,
                  title: "Network Error",
                  type: "network_error",
                  description: error.response.statusText,
                });
              }
              // state.currentStep = "error"
              // commit("processCriticalErrors", error)
            } else {
              console.log("Probably Incorrect CORS headers");
              commit("setError", {
                type: "network_error",
                title: "Network error",
                description: "Unable to connect to the server",
              });
              state.currentStep = "error";
            }
          }
        );
      } catch (e) {
        commit("setError", {
          type: -1,
          title: "Connection error",
          description: "No connection to server. Try again later.",
        });
        state.currentStep = "error";
      }
    },

    // // Initialize
    // async initialize({ dispatch }) {
    //   try {
    //     await Promise.all([
    //       dispatch('getDossier'),
    //     ]);
    //     dispatch('moveNextStep')
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },

    // Resend email with a secret code
    async recoverDossier() {
      try {
        await rkycClient.post(`email/${encodeURI(this.state.mail)}/recovery`, {
          client_id: this.state.clientId,
        });
      } catch (e) {
        console.log(e);
      }
    },

    // Deliver Dossier
    async deliverDossier() {
      try {
        await rkycClient.post("dossier/delivery", {});
      } catch (e) {
        console.log(e);
      }
    },

    // AML Check
    async amlCheck() {
      try {
        await rkycClient.post("dossier/aml_check", {});
      } catch (e) {
        console.log(e);
      }
    },

    async addEmail({ commit }, { email }) {
      try {
        const { data } = await rkycClient.post("dossier/email", {
          email: email.toLowerCase(),
        });
        commit("setDossier", data);
      } catch (e) {
        console.log(e);
      }
    },

    async confirmEmail({ commit }, { email, code }) {
      try {
        const { data } = await rkycClient.post("dossier/email/confirmation", {
          email: email.toLowerCase(),
          code: code.replace(/\D/, ""),
        });
        commit("setDossier", data);
      } catch (e) {
        console.log(e);
      }
    },

    async addPhone({ commit }, { phone, channel, locale }) {
      try {
        console.log("Adding Phone");
        const { data } = await rkycClient.post("dossier/phone", {
          phone: phone.replace(/[^0-9]/, ""),
          verify: true,
          voice_call_verify: channel === "call",
          language: locale,
        });
        commit("setDossier", data);
      } catch (e) {
        console.log(e);
      }
    },

    async confirmPhone({ commit }, { phone, code }) {
      try {
        const { data } = await rkycClient.post("dossier/phone/confirmation", {
          phone: phone.replace(/[^0-9]/, ""),
          code: code.replace(/[^0-9]/, ""),
        });
        commit("setDossier", data);
      } catch (e) {
        console.log(e);
      }
    },

    async answerQuestions({ commit, dispatch }, { arr }) {
      try {
        const { data } = await rkycClient.post("dossier/questions", arr);
        commit("setDossier", data);
        dispatch("getDossierData");
      } catch (e) {
        console.log(e);
      }
    },

    async getDossier({ commit }) {
      console.log("getDossier");
      const { data } = await rkycClient.get("dossier");
      commit("setDossier", data);
    },

    async getDossierData({ commit }) {
      const { data } = await rkycClient.get("dossier/data");
      commit("setDossierData", data);
    },

    async getAcceptedIds({ commit }) {
      const { data } = await rkycClient.get("dossier/id_document/allowed");
      commit("setAcceptedIds", data);
    },

    // Delete current Jumio Attempt
    // Jumio - Abort particular id document verification attempt
    async abortJumioDocumentId({ commit }) {
      try {
        console.log("ID: ");
        console.log(this.state.jumioDocumentId);
        await rkycClient.delete("dossier/id_document/jumio/latest");
        commit("setJumioDocumentId", {});
      } catch (e) {
        console.log(e);
      }
    },

    async performNetverify({ state, commit }, { formData }) {
      try {
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        console.log("Request for NetVerify");
        const docType = state.netVerify.docType.toLowerCase();
        const { data } = await rkycClient.post(
          `dossier/id_document/${docType}/${state.netVerify.issuingCountry}`,
          formData,
          config
        );
        commit("setDossier", data);
      } catch (e) {
        console.log(e);
      }
    },

    // Get the URL to run Netverify v4 in iframe
    async startNetverify({ state }, { workflowId, locale }) {
      const redirectUrl = window.localStorage.getItem(state.customerId);
      if (redirectUrl) {
        return redirectUrl;
      }
      try {
        const { data } = await rkycClient.post(`dossier/id_document/jumio/web4`, {
          workflow_id: workflowId,
          locale: locale,
        });
        // Save a pare of custmer_id and redirect_url
        window.localStorage.setItem(state.customerId, data.redirect_url);
        return data.redirect_url;
      } catch (e) {
        console.log(e);
      }
    },

    async uploadFile({ commit }, { docType, question, formData }) {
      try {
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const response = await rkycClient.post(
          `dossier/documents/questions/${docType}/${question}`,
          formData,
          config
        );
        console.warn("setDossier");
        console.log(response?.data);
        if (response) {
          commit("setDossier", response.data);
        }
      } catch (e) {
        console.log(e);
      }
    },

    async addResidentialAddress(
      { commit },
      { country, region, city, postal_code, street_address }
    ) {
      try {
        const { data } = await rkycClient.post("dossier/residential_address", {
          country,
          region,
          city,
          postal_code,
          street_address,
        });
        commit("setDossier", data);
      } catch (e) {
        console.log(e);
      }
    },

    async questions({ commit }, answersArray) {
      try {
        const { data } = await rkycClient.post("dossier/questions", answersArray);
        commit("setDossier", data);
      } catch (e) {
        console.log(e);
      }
    },

    // Detect current country based on IP
    async getCurrentCounty({ commit, state }) {
      try {
        if (state.defaultCountry.length !== 3) {
          const { data } = await rkycClient.get("ipinfo");
          const countryCode = data.country;
          commit("setDefaultCountry", countryCode);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
});
