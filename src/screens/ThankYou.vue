<template>
  <section>
    <header class="header"></header>

    <div class="container">
      <h1 class="pagetitle" :class="{ 'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale) }">
        {{ $t("ThankYou.header") }}
      </h1>

      <div class="box">
        <div class="form" v-html="$t('ThankYou.text', { link: referrer })"></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ThankYou",
  data() {
    return {
      birthSertificateFile: undefined,
      referrer: null,
    };
  },
  async mounted() {
    await this.$store.dispatch("deliverDossier");
  },
};
</script>
