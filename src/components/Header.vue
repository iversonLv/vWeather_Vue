<template>
  <header>
    <h1 class="title">
      <!-- logo -->
      <i class="el-icon-cloudy logo"></i>
      <!-- title -->
      mWeather | Vue3
      <!-- location -->
      <span class="subTitle" :class="darkMode ? 'darkSubTitle' : ''">
        <span class="subTitleSpan" :class="darkMode ? 'darkSubTitleSpan' : ''">
          {{
            weatherData && !isLoading
              ? `${weatherData?.location?.name} , ${weatherData?.location?.country}`
              : ""
          }},
        </span>
      </span>
    </h1>
  </header>
</template>

<script>
import { inject } from "vue";

export default {
  name: "Header",
  setup() {
    const darkMode = inject("darkMode");
    const weatherData = inject("weatherData");
    const isLoading = inject("isLoading");

    return {
      weatherData,
      isLoading,
      darkMode,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../element-variables.scss";
.logo {
  font-size: 70px;
}
.title {
  display: flex;
  flex-direction: column;
  align-items: center;

  .subTitle {
    font-size: 12px;
    font-weight: 300;
    width: 50%;
    margin-top: 10px;
    text-align: center;
    justify-content: center;
    line-height: 0.1em;
    border-bottom: 1px solid $--dark-color-main;

    &.darkSubTitle {
      border-bottom-color: $--light-color-main;
    }
    .subTitleSpan {
      padding: 0 10px;
      background: $--light-color-main;

      &.darkSubTitleSpan {
        background: $--dark-color-bg;
      }
    }
  }
}
</style>