<template>
  <button class="button" :class="{'is-loading': loading}" v-on="$listeners">
    <span v-if="label">{{ label }}</span>
    <span v-else-if="$slots.default">
      <slot />
    </span>  
  </button>
</template>


<script>
export default {
  name: 'Button',
  props: ['label', 'loading']
}
</script>

<style scoped>
  .button {
    position: relative;
  }

  .button:hover {
    background-color: #003865;
  }

  @keyframes spinAround {
    from {transform: rotate(0deg)}
    to {transform: rotate(359deg)}
  }

  .button.is-loading:after {
    animation: spinAround .5s infinite linear;
    border: 2px solid #dbdbdb;
    border-radius: 290486px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    display: block;
    height: 16px;
    width: 16px;
    position: absolute;
    top: calc(50% - 12px);
    left: calc(50% - 12px);
    border-width: 0.25em;
  }

  .button.is-loading {
    color: transparent!important;
    pointer-events: none;
}
</style>