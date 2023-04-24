  <template>
  <el-config-provider :locale="locales">
    <el-container
      class="root"
      :class="darkMode ? 'darkThemeContainer' : 'lightThemeContainer'"
    >
      <!-- language, theme -->

      <div class="topBar">
        <!-- theme swtich -->
        <LightDarkMode />

        <!-- language select -->
        <LanguageToggle />
      </div>

      <!-- header -->
      <Header />
      <el-card class="paper" :class="darkMode ? 'darkThemeCard' : ''">
        <!-- search are -->
        <div class="search">
          <el-input
            class="input"
            placeholder="Please input place"
            :prefix-icon="Search"
            v-model="place"
            @input="setPlace"
          >
          </el-input>
          <el-divider
            class="divider"
            direction="vertical"
            style="height: 29px"
          ></el-divider>
          <!-- info -->
          <el-tooltip placement="left" :effect="darkMode ? 'dark' : 'light'">
            <template #content>
              <InfoToolTip />
            </template>
            <el-icon style="cursor: pointer"><Warning /></el-icon>
          </el-tooltip>
        </div>
        <DateRange />
      </el-card>
      <!-- loading -->
      <Loading
        v-if="isLoading"
        :animated="true"
        :class="darkMode ? 'darkThemeSkeleton' : ''"
      />
      <!-- single line chart -->
      <template v-if="weatherData && !isLoading">
        <SingleDayLineChart
          v-for="(day, index) in weatherData?.forecast?.forecastday"
          :day="day"
          :key="index"
          :darkMode="darkMode"
        />
      </template>
      <!-- multiple lines chart -->
      <MultipleDateStackLineChart
        v-if="!isLoading && weatherData?.forecast?.forecastday.length > 1"
        :days="weatherData?.forecast?.forecastday"
        :darkMode="darkMode"
      />
    </el-container>
  </el-config-provider>
</template>


<script>
import { onMounted, watchEffect, ref, provide } from "vue";
// fetch api
import axios from "axios";

// i18n for element ui
import { ElConfigProvider } from "element-plus";
import en from "element-plus/lib/locale/lang/en";

import { useI18n } from "vue-i18n";

// compnents
import Header from "./components/Header";
import InfoToolTip from "./components/InfoToolTip";
import DateRange from "./components/DateRange";
import Loading from "./components/Loading";
import SingleDayLineChart from "./components/SingleDayLineChart";
import MultipleDateStackLineChart from "./components/MultipleDateStackLineChart";
import LightDarkMode from "./components/LightDarkMode";
import LanguageToggle from "./components/LanguageToggle";

// Icons
import { Search, Warning } from "@element-plus/icons";

export default {
  name: "App",
  components: {
    Header,
    InfoToolTip,
    DateRange,
    Loading,
    SingleDayLineChart,
    MultipleDateStackLineChart,
    ElConfigProvider,
    LightDarkMode,
    LanguageToggle,
  },
  setup() {
    // We need the date format strictly as 'yyyy-MM-dd' so for tricky
    const today = new Date();
    const currentDateYear = today.getFullYear();
    const currentDateMonth =
      new Date().getMonth() + 1 < 10
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1;
    const currentDateDate = today.getDate();
    const currentDate = `${currentDateYear}-${currentDateMonth}-${currentDateDate}`;

    // darkmode state
    let darkMode = ref(false);
    // language state
    let language = ref("en");
    // locale language state for element ui
    // i18n
    const { t } = useI18n({});
    let locales = ref(en);
    // from date state
    let selectedFromDate = ref(currentDate);
    // to date state
    let selectedToDate = ref(currentDate);
    // place state
    let place = ref("Guangzhou");
    // weather data state
    let weatherData = ref({});
    // loading state
    let isLoading = ref(true);

    // place input set place
    const setPlace = (e) => (place.value = e);

    // when app render, call getWheather fun
    onMounted(async () => {
      await getWheather(
        weatherData,
        isLoading,
        place.value,
        selectedFromDate.value,
        selectedToDate.value,
        language.value
      );
      console.log(
        weatherData.value,
        isLoading.value,
        selectedFromDate.value,
        selectedToDate.value,
        language.value
      );
    });
    // watch the api variables change
    watchEffect(() => {
      getWheather(
        weatherData,
        isLoading,
        place.value,
        selectedFromDate.value,
        selectedToDate.value,
        language.value
      );
    });

    // pass the props to other components
    provide("weatherData", weatherData);
    provide("selectedFromDate", selectedFromDate);
    provide("selectedToDate", selectedToDate);
    provide("isLoading", isLoading);
    provide("currentDate", currentDate);
    provide("darkMode", darkMode);
    provide("language", language);
    provide("locales", locales);
    return {
      place,
      setPlace,
      weatherData,
      isLoading,
      selectedFromDate,
      selectedToDate,
      darkMode,
      language,
      locales,
      t,
      locale: language,
      Search,
      Warning,
    };
  },
};

const getWheather = async (data, loading, q, dt, end_dt, lang) => {
  try {
    loading.value = true;
    const response = await axios.get(
      "https://weatherapi-com.p.rapidapi.com/history.json",
      {
        params: {
          q,
          dt,
          lang,
          end_dt,
        },
        headers: {
          "x-rapidapi-key":
            "f46521d9damsh8324844f27ff91bp1eb0b5jsn7ad1efaa0b97",
          "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
        },
      }
    );
    if (response.data) {
      loading.value = false;
      return (data.value = response.data);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>


<style lang='scss'>
/* import google font */
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap");
@import url("https://unpkg.com/element-plus/lib/theme-chalk/index.css");
@import "./element-variables.scss";
:root {
  font-family: "Roboto", sans-serif;
  height: 100%;
}

body {
  padding: 0;
  margin: 0;
  height: 100%;
}

ul,
li {
  list-style: none;
}

.el-container.root {
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
  min-height: 100vh;
  max-width: 100%;
  width: 100vw;
  padding-bottom: 50px;

  /* app component */
  .topBar {
    display: flex;
    padding-top: 15px;
    justify-content: space-between;
  }
  .paper {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    min-width: 600px;
    margin: 0 auto 15px;

    .el-card__body {
      width: 100%;
      padding: 0;
    }
  }
  .search {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 15px;
  }
  .input {
    flex: 1;
  }
  .divider {
    height: 28px;
    margin: 0 10px;
  }
}

.el-button {
  color: $--light-color-primary;
  &:hover {
    color: $--light-color-primary;
  }
}
/* theme text color */
.darkThemeContainer {
  background-color: $--dark-color-bg;
  color: $--dark-color-primary;
}

.darkThemeCard {
  &.el-card {
    background-color: $--dark-color-bg-sub;
    border-color: $--dark-color-bg-sub;
  }

  .el-button {
    color: $--dark-color-primary;
    &:hover {
      color: $--dark-color-primary;
    }
  }

  .el-input__inner,
  .el-picker-panel,
  .el-date-editor .el-range-input,
  .el-picker-panel__body {
    background-color: $--dark-color-bg !important;
    border-color: $--dark-color-bg;
    color: $--dark-color-primary;
  }

  .el-divider {
    background-color: $--dark-color-bg;
  }
  .el-icon-warning-outline,
  .el-button--text,
  .el-button--text:active,
  .el-date-editor .el-range-separator {
    color: $--dark-color-primary;
  }
}
.darkThemeSkeleton {
  &.el-skeleton {
    --el-skeleton-color: rgba(66, 66, 66, 1);
    --el-skeleton-to-color: rgba(33, 33, 33, 1);
  }
}
</style>
