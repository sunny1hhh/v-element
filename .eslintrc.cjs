/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
  ],
  rules:{
    //关闭组件命名规则
    "vue/multi-word-component-names": ["error",{
      "ignores": ["Button", "Collapse", "Icon", "Tooltip", "Dropdown", "Message", "Input", "Switch", "Select", "Form"]//需要忽略的组件名
    }]
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
