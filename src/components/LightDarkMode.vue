<template>
  <el-switch
    v-model="darkMode"
    :active-color="darkMode ? 'gray' : ''"
    inactive-color="gray"
    :active-text="
      darkMode
        ? t('switch.SwitchToLight', {}, { locale })
        : t('switch.SwitchToLight', {}, { locale })
    "
    :class="darkMode ? 'darkTheme' : 'lightTheme'"
  ></el-switch>
</template>

<script>
import { inject } from "vue";

// i18n
import { useI18n } from "vue-i18n";
export default {
  name: "LightDarkMode",
  setup() {
    const language = inject("language");
    const darkMode = inject("darkMode");
    // i18n
    const { t } = useI18n({});
    return { darkMode, t, locale: language, language };
  },
};
</script>


<style lang="scss" scope>
@import "../element-variables.scss";
.darkTheme {
  .el-switch__label,
  .el-switch__label.is-active {
    color: $--dark-color-primary;
  }

  .el-switch__core .el-switch__action {
    background-color: black;
  }
}

.lightTheme {
  .el-switch__label,
  .el-switch__label.is-active {
    color: $--light-color-primary;
  }
}
</style>