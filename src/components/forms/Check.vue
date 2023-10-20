<template>
  <div class="checkbox">
    <!-- <label for="sCDERetNewsletter" class="mktoLabel mktoHasWidth"
      >This is a label <div class="mktoAsterix">*</div></label
    > -->

    <input :id="_uid" type="checkbox" :value="value" :checked="isChecked" @change="updateInput" />
    <label class="label" :for="_uid">
      {{ label }}
    </label>
    <div class="hint">
      <slot name="hint" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Chechbox",
  model: {
    prop: "nativeValue",
    event: "change",
  },
  props: {
    value: { type: String },
    nativeValue: { default: "" },
    label: {
      type: String,
      default: "",
    },
    trueValue: { default: true },
    falseValue: { default: false },
  },
  computed: {
    isChecked() {
      if (this.nativeValue instanceof Array) {
        return this.nativeValue.includes(this.value);
      }
      // Note that `true-value` and `false-value` are camelCase in the JS
      return this.nativeValue === this.trueValue;
    },
  },
  methods: {
    updateInput(event) {
      let isChecked = event.target.checked;
      if (this.nativeValue instanceof Array) {
        let newValue = [...this.nativeValue];
        if (isChecked) {
          newValue.push(this.value);
        } else {
          newValue.splice(newValue.indexOf(this.value), 1);
        }
        this.$emit("change", newValue);
      } else {
        this.$emit("change", isChecked ? this.trueValue : this.falseValue);
      }
    },
  },
};
</script>

<style scoped>
.hint {
  font-weight: 400px;
  color: #767676;
  padding: 2px 0 2px 32px;
}

.label {
  font-weight: normal;
  font-family: "Trade Gothic W01 Cn_18", Arial, sans-serif;
}
.checkbox {
  position: relative;
  margin-top: 12px;
  margin-bottom: 12px;
}

.checkbox [type="checkbox"]:focus + label:before {
  box-shadow: 0 0 0 6px #a5d7f5;
}

.checkbox [type="checkbox"] {
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

.checkbox [type="checkbox"] + label {
  display: block;
  position: relative;
  margin-bottom: 0;
  padding: 2px 0 2px 32px;
  font-weight: 500;
}

.checkbox [type="checkbox"]:checked + label:after {
  transform: scale(1) rotate(-45deg);
}

/* checkmark */
.checkbox [type="checkbox"] + label:after {
  position: absolute;
  box-sizing: border-box;
  width: 10px;
  height: 6px;
  top: 8px;
  left: 7px;
  content: "";
  border-left: 2px solid #005598;
  border-bottom: 2px solid #005598;
  transform: scale(0) rotate(-45deg);
}

.checkbox [type="checkbox"] + label:before {
  content: "";
  cursor: pointer;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border: 2px solid #005598;
  box-sizing: border-box;
  border-radius: 2px;
  margin-right: 16px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
