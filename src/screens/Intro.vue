<template>
  <section>
    <header class="header">
      <LangSelector />
    </header>

    <div class="container">
      <h1 class="pagetitle" :class="{'pagetitle-fallback': ['hr', 'cs'].includes($i18n.locale)}">{{ $t('Intro.header') }}</h1>
      <div class="box">
        <div v-html="$t('Intro.body')"></div>
        <button class="button" @click="next">{{ $t('Intro.button') }}</button>
      </div>
    </div>
  </section>
</template>

<script>
import LangSelector from '@/components/LangSelector'

export default {
  name: 'Intro',
  components: {
    LangSelector
  },
  data() {
    return {
      title: process.env.VUE_APP_TITLE
    }
  },
  methods: {
    next() {
      this.$store.dispatch('showNextScreen')
    }
  }
}
</script>

