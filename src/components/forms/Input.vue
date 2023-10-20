<template>
  <div class="textinput" :class="{'textinput-error': error}">
    <label>
      <div class="textinput__label">{{ label }}<span v-if="required">{{'\xa0'}}*</span></div>
      <div class="textinput__help" v-if="help">{{ help }}</div>
      <div class="textinput__control"> 
        <textarea v-if="textarea" class="textinput__input" ref="input" :value="value" v-on="listeners" v-bind="$attrs" maxlength="1000" />
        <input v-else class="textinput__input" ref="input" :value="value" v-on="listeners" v-bind="$attrs" maxlength="1000" />
        <svg v-if="error" class="textinput__icon" width="24" height="21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.555 17.744a1.182 1.182 0 01-.589-.5c-.42-1.087.42-2.005 1.514-1.588.252.084.42.334.504.585.337.919-.336 1.837-1.43 1.503zm1.766-9.018c0 1.67-.757 4.174-.925 4.76-.169.584-.673.584-.841 0-.168-.668-.925-3.174-.925-4.76 0-2.171 2.69-2.171 2.69 0zM11.218.376L.118 19.748C-.218 20.332.203 21 .875 21H23.16c.672 0 1.009-.668.756-1.252L12.732.376c-.336-.501-1.177-.501-1.514 0z" fill="#B30000"/></svg>
      </div>
      <div class="textinput__hint" v-if="hint">{{ hint }}</div>
      <div class="textinput__error">{{ error }}</div>
    </label>
    
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'Textinput',
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    textarea: {
      type: Boolean,
      default: false
    },
    help: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean
    }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => this.$emit('input', event.target.value)
      }
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    }
  }
}
  
</script>

<style scoped>
.textinput {
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding-right: 36px;
}
.textinput__input  {
  -webkit-appearance: none;
  border: none;
  border-radius: 2px;
  box-shadow: 0 0 0 1px #E8E8E8;
  padding: 9px 11px 7px 11px;
  font-size: 16px;
  line-height: 22px;
  display: block;
  color: black;
  outline: none;
  width: calc(100% - 34px);
  resize: vertical;
  letter-spacing: 0.2px;
}

.textinput__label {
  font-family: "Trade Gothic W01 Bold_2";
  font-weight: 700;
  margin-bottom: 0px;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 5px;
  color: #333;
}

.textinput__help {
  font-size: 12px;
  line-height: 15px;
  color: #767676;
  margin-top: -6px;
  margin-bottom: 5px;
}

.textinput__error {
  color: #B30000;
  font-size: 16px;
  line-height: 22px;
  padding-top: 4px;
}
.textinput__hint {
  padding-top: 4px;
}

.textinput-error .textinput__input {
  box-shadow: 0 0 0 1px #B30000;
}

.textinput__input:focus, .textinput__input:-webkit-autofill:focus {
  box-shadow: 0 0 0 2px #005598;
  color: black;
  background-color: #fafafa;
}

.textinput__control {
  position: relative;
}

.textinput__icon {
  position: absolute;
  top: 8px;
  right: -24px;
}

.textinput__input:-webkit-autofill  {
  box-shadow: 0 0 0px 1000px white inset, 0 0 0 1px #E8E8E8;
}

</style>