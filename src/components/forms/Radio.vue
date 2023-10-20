<template>
  <div class="radiobox">
    <input
      :id="_uid"
      type="radio"
      :value="value"
      :checked="isChecked"
      @change="$emit('change', value)"
    />
      <label v-if="label" class="radiobox__label" :for="_uid">{{ label }}</label>
      <label v-else-if="$slots.default" class="radiobox__label" :for="_uid">
        <slot />
      </label>
  </div>
</template>

<script>
export default {
  model: {
    prop: "nativeValue",
    event: "change",
  },
  name: "RadioBox",

  props: {
    value: { type: [String, Number] },
    nativeValue: { default: "" },
    label: {
      type: String,
      default: "",
    },
  },
  computed: {
    isChecked() {
      return this.nativeValue == this.value
    }
  }
};
</script>

<style scoped>
.radiobox {
  position: relative;
  margin-top: 12px;
  margin-bottom: 12px;
}

.radiobox [type="radio"]:focus + .radiobox__label:before {
  box-shadow: 0 0 0 6px #a5d7f5;
}

.radiobox [type="radio"] {
  clip: rect(1px, 1px, 1px, 1px);
  -webkit-clip-path: inset(50%);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
}

.radiobox [type="radio"] + .radiobox__label {
  display: block;
  position: relative;
  margin-bottom: 0;
  padding: 2px 0 2px 32px;
}

.radiobox [type="radio"]:checked + .radiobox__label:after {
  background-color: #005598;
}

/* checkmark */
.radiobox [type="radio"] + .radiobox__label:after {
  position: absolute;
  box-sizing: border-box;
  width: 10px;
  height: 10px;
  top: 7px;
  left: 7px;
  content: "";

  border-radius: 50px;
}

.radiobox [type="radio"] + label:before {
  content: "";
  cursor: pointer;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border: 2px solid #005598;
  box-sizing: border-box;
  border-radius: 50px;
  margin-right: 16px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>