<template>
  <section>
    <header class="header"></header>

    <div class="container">
      <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t("Error.header") }}</h1>
      <div class="box">
        <template v-if="$te(`Error.type.${error_type}.title`)">
          <h2 class="step">{{ $t(`Error.type.${error_type}.title`) }}</h2>
          <p>{{ $t(`Error.type.${error_type}.description`) }}</p>
        </template>
        <template v-else>
          <h2 class="step">{{ error_type }}</h2>
          <p>{{ $t(`Error.type.universal.description`) }}</p>
        </template>
        <button class="button" @click.prevent="restart">{{ $t('Error.button') }}</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    window.onbeforeunload = null;
  },
  computed: {
    error_type() {
      return this.$store.state.error.type;
    },
  },
  methods: {
    restart() {
      location.reload()
    }
  }

};
</script>