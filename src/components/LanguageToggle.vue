<template>
  <el-radio-group
    @change="setLanguage"
    v-model="language"
    size="mini"
    :text-color="darkMode ? 'white' : 'black'"
    :fill="darkMode ? 'rgba(0, 0, 0, .3)' : 'rgba(0, 0, 0, .1)'"
    :class="darkMode ? 'darkTheme' : 'lightTheme'"
  >
    <el-radio-button label="en">EN</el-radio-button>
    <el-radio-button label="zh">中文</el-radio-button>
  </el-radio-group>
</template>

<script>
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import en from "element-plus/lib/locale/lang/en";
import { inject } from "vue";
export default {
  name: "LanguageToggle",
  setup() {
    const darkMode = inject("darkMode");
    const language = inject("language");
    const locales = inject("locales");

    const setLanguage = () => {
      locales.value = language.value === "zh" ? zhCn : en;

      console.log(language.value, locales.value);
    };
    return { language, setLanguage, darkMode };
  },
};
</script>

<style lang="scss" scope>
@import "../element-variables.scss";
.darkTheme {
  .el-radio-button__inner {
    &:hover {
      color: $--dark-color-primary;
    }
  }
}
.lightTheme {
  .el-radio-button__inner {
    &:hover {
      color: $--light-color-primary;
    }
  }
}
</style>