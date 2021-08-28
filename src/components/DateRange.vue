<template>
  <div class="date-range">
    <el-date-picker
      :popper-class="darkMode ? 'darkThemePicker' : ''"
      class="date-range__picker"
      v-model="fromToDate"
      type="daterange"
      range-separator="To"
      :start-placeholder="selectedFromDate"
      :end-placeholder="selectedToDate"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :clearable="false"
      :editable="false"
      @change="setSelectedFromToDate"
      :disabledDate="disabledDate"
    >
    </el-date-picker>
    <el-button type="text" @click="handleToday">{{
      t("search.Today", {}, { locale })
    }}</el-button>
  </div>
</template>

<script>
import { ref, inject, onMounted } from "vue";
// i18n
import { useI18n } from "vue-i18n";
export default {
  setup() {
    // i18n
    const { t } = useI18n({});
    const language = inject("language");
    // inject the props from App.vue
    const darkMode = inject("darkMode");
    let selectedFromDate = inject("selectedFromDate");
    let selectedToDate = inject("selectedToDate");
    let currentDate = inject("currentDate");
    let fromToDate = ref([selectedFromDate, selectedToDate]);

    // CLick today will reset to current day
    const handleToday = () => {
      fromToDate.value = [currentDate, currentDate];
      selectedFromDate.value = currentDate;
      selectedToDate.value = currentDate;
    };

    // here, if we change the date range, then the selected From Date and select To Date will be watched as well
    const setSelectedFromToDate = (e) => {
      selectedFromDate.value = fromToDate.value[0];
      selectedToDate.value = fromToDate.value[1];
    };

    // api limit, we could only fetch 7 days ago and 2 days later data
    // So here we need limit user to select the range
    const limitDaysAgo = (days) => {
      const today = new Date();
      return today.setDate(today.getDate() - days);
    };
    const limitDaysAfter = (days) => {
      const today = new Date();
      return today.setDate(today.getDate() + days);
    };

    const disabledDate = (date) => {
      // if date is 8 days ago and 2 days after, then enable it
      if (date >= limitDaysAgo(8) && date <= limitDaysAfter(2)) {
        return false;
      }
      // other date will be disabled
      return true;
    };

    // onMounted
    onMounted(() => {
      // here, on mounted, the fromToDate will automatically set to today
      // If won't set below code, the picker input will just show a placeholder with gray color text
      fromToDate.value = [currentDate, currentDate];
    });
    return {
      disabledDate,
      currentDate,
      handleToday,
      setSelectedFromToDate,
      fromToDate,
      selectedFromDate,
      selectedToDate,
      darkMode,
      t,
      locale: language,
    };
  },
};
</script>

<style lang="scss">
@import "../element-variables.scss";
.date-range {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  .el-range-editor.el-input__inner {
    width: calc(100% - 45px);
  }
}
.el-button--text {
  &:hover {
    color: $--light-color-primary;
  }
  color: $--light-color-primary;
}
.darkThemePicker {
  &.el-picker__popper.el-popper[role="tooltip"],
  .el-picker-panel {
    background: black;
    color: white;
  }
  button {
    &:hover {
      color: $--dark-color-primary;
    }
    color: $--dark-color-primary;
  }
  .el-date-table td.disabled div {
    background: $--dark-color-main;
  }
  .el-date-table td.available div {
    background: $--dark-color-bg-sub;
  }
  .el-date-table td.today.end-date span,
  .el-date-table td.today.start-date span {
    color: $--dark-color-main;
  }
  .el-date-table td.today span {
    color: $--dark-color-primary;
  }
  .el-date-table td.available {
    &:hover {
      color: $--dark-color-primary;
    }
  }
  .el-date-table td.end-date span,
  .el-date-table td.start-date span {
    background: $--dark-color-primary;
    color: $--dark-color-main;
  }
  .el-popper__arrow::before {
    background: $--dark-color-main !important;
  }
}
</style>