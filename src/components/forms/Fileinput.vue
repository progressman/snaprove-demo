<template>
  <div class="fileinput" :class="{'fileinput-error': error}">
    <label>
      <div class="fileinput__label">{{ label }}<span v-if="required">{{'\xa0'}}*</span></div>
      <div class="fileinput__help" v-if="help">{{ help }}</div>
      <div class="fileinput__control"> 
        
        <div class="fileinput__input">
          <input type="file" ref="input" v-on="listeners" v-bind="$attrs" />
          <svg v-if="value" class="fileinput__clip" height="16" viewBox="0 0 11 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 24C4.04182 23.9983 2.64384 23.4078 1.61275 22.3579C0.581661 21.3081 0.00166364 19.8847 0 18.4V4C0 2.93913 0.413902 1.92172 1.15065 1.17157C1.8874 0.421427 2.88665 0 3.92857 0C4.97049 0 5.96974 0.421427 6.70649 1.17157C7.44324 1.92172 7.85714 2.93913 7.85714 4V18.4C7.85714 19.0365 7.6088 19.647 7.16675 20.0971C6.7247 20.5471 6.12515 20.8 5.5 20.8C4.87485 20.8 4.2753 20.5471 3.83325 20.0971C3.3912 19.647 3.14286 19.0365 3.14286 18.4V5.6C3.14286 5.38783 3.22564 5.18434 3.37299 5.03431C3.52034 4.88429 3.72019 4.8 3.92857 4.8C4.13696 4.8 4.3368 4.88429 4.48416 5.03431C4.63151 5.18434 4.71429 5.38783 4.71429 5.6V18.4C4.71429 18.6122 4.79707 18.8157 4.94442 18.9657C5.09177 19.1157 5.29162 19.2 5.5 19.2C5.70838 19.2 5.90823 19.1157 6.05558 18.9657C6.20293 18.8157 6.28571 18.6122 6.28571 18.4V4C6.28571 3.36348 6.03737 2.75303 5.59532 2.30294C5.15327 1.85286 4.55372 1.6 3.92857 1.6C3.30342 1.6 2.70387 1.85286 2.26182 2.30294C1.81977 2.75303 1.57143 3.36348 1.57143 4V18.4C1.57143 19.4609 1.98533 20.4783 2.72208 21.2284C3.45883 21.9786 4.45808 22.4 5.5 22.4C6.54192 22.4 7.54117 21.9786 8.27792 21.2284C9.01467 20.4783 9.42857 19.4609 9.42857 18.4V5.6C9.42857 5.38783 9.51135 5.18434 9.6587 5.03431C9.80605 4.88429 10.0059 4.8 10.2143 4.8C10.4227 4.8 10.6225 4.88429 10.7699 5.03431C10.9172 5.18434 11 5.38783 11 5.6V18.4C10.9983 19.8847 10.4183 21.3081 9.38725 22.3579C8.35616 23.4078 6.95818 23.9983 5.5 24Z" />
</svg>
          <div class="fileinput__value">{{ (value && value.name || value) }}</div>
         
          <a v-if="!value" class="fileinput__button">{{ $t('attachFile') }}</a>
          <a @click.prevent="$emit('input', null)" v-else class="fileinput__reset">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 1.53784L22.4622 0L12 10.4622L1.5375 0L0 1.53784L10.4625 12L0 22.4622L1.5375 24L12 13.5378L22.4622 24L24 22.4622L13.5381 12L24 1.53784Z" fill="#333333"/>
            </svg>
          </a>
          
        </div>
        
        <!-- <button class="fileinput__selector">Select file</button> -->
        <svg v-if="error" class="fileinput__icon" width="24" height="21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.555 17.744a1.182 1.182 0 01-.589-.5c-.42-1.087.42-2.005 1.514-1.588.252.084.42.334.504.585.337.919-.336 1.837-1.43 1.503zm1.766-9.018c0 1.67-.757 4.174-.925 4.76-.169.584-.673.584-.841 0-.168-.668-.925-3.174-.925-4.76 0-2.171 2.69-2.171 2.69 0zM11.218.376L.118 19.748C-.218 20.332.203 21 .875 21H23.16c.672 0 1.009-.668.756-1.252L12.732.376c-.336-.501-1.177-.501-1.514 0z" fill="#B30000"/></svg>
      </div>
      <div class="fileinput__hint" v-if="hint">{{ hint }}</div>
      <div class="fileinput__error">{{ error }}</div>
    </label>
    
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    name: 'FileInput',
    props: {
    value: {
      type: [File, String],
      default: null
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
        // ...this.$listeners,
        change: event => this.$emit('input', event.target.files[0])
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
.fileinput {
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding-right: 36px;
}

.fileinput__input  {
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
  letter-spacing: 0.2px;
  display: flex;
}

.fileinput__input input {
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  position: absolute;
}


.fileinput__label {
  font-family: "Trade Gothic W01 Bold_2";
  font-weight: 700;
  margin-bottom: 0px;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 5px;
  color: #333;
}

.fileinput__help {
  font-size: 12px;
  line-height: 22px;
  color: #767676;
  margin-top: -10px;
  margin-bottom: 4px;
}

.fileinput__error {
  color: #B30000;
  font-size: 16px;
  line-height: 22px;
  padding-top: 4px;
}
.fileinput__hint {
  padding-top: 4px;
}

.fileinput-error .fileinput__input {
  box-shadow: 0 0 0 1px #B30000;
}

/* .fileinput-error .fileinput__button {
  display: none;
} */

.fileinput-error .fileinput__clip {
  fill: #B30000;
}

.fileinput__button {
  color: #005598;
  background-color: white;
  border: none;
  font-size: 16px;
  font-size: 10px;
  margin-top: -2px;
  line-height: 18px;
  padding: 2px 12px;
  text-transform: uppercase;
  border-radius: 3px;
  border: 1px solid #005598;
  text-decoration: none;
  margin-left: auto;
  display: block;
  white-space: nowrap;
}

.fileinput__clip {
  padding-right: 14px; 
  padding-top: 2px;
  padding-left: 2px;
  fill: black;
  display: block;
  flex-shrink: 0;
}

.fileinput__reset {
  margin-left: auto;
  padding-top: 2px;
  padding-left: 12px;
}

.fileinput__value {
  white-space: nowrap;
  overflow: hidden; 
  text-overflow: ellipsis;
  min-height: 22px;
}

.fileinput__reset svg {
  display: block;
}
/* .fileinput__input:focus, .fileinput__input:-webkit-autofill:focus {
  box-shadow: 0 0 0 2px #005598;
  color: black;
  background-color: #fafafa;
} */

.fileinput__input:focus-within  {
  box-shadow: 0 0 0 2px #005598;
  color: black;
  background-color: #fafafa;
}

.fileinput__input:focus-within .fileinput__clip {
  fill: #005598;
}


.fileinput__control {
  position: relative;
}

.fileinput__icon {
  position: absolute;
  top: 8px;
  right: -24px;
}

.fileinput__input:-webkit-autofill  {
  box-shadow: 0 0 0px 1000px white inset, 0 0 0 1px #E8E8E8;
}

</style>