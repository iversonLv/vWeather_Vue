<template>
  <v-chart class="charBox" :option="option" :autoresize="true" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, inject, toRefs, computed } from "vue";

// color
import { DarkColor } from "@/color";

// i18n
import { useI18n } from "vue-i18n";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
]);

export default {
  name: "MultipleDateStackLineChart",
  components: {
    VChart,
  },
  provide() {
    return {
      [THEME_KEY]: computed(() => (this.darkMode ? "dark" : "light")),
    };
  },
  props: ["days", "darkMode"],
  setup(props) {
    const language = inject("language");
    const { t } = useI18n({});
    const { days, darkMode } = toRefs(props);
    const daysData = days.value;
    //console.log(days.value);

    // cal yAxis min and max in order that the chart will more focus on that area
    // Cal the highest and lowest temp then the yAxis could be more focus for the temp
    const calGreatest = (forecastday, minOrMax) => {
      let arr = [];
      (forecastday || []).forEach((day) => {
        const hTempCarr = day?.hour?.map((h) => h.temp_c);
        arr.push(...hTempCarr);
      });
      if (minOrMax === "min") {
        return Math.min(...arr);
      } else {
        return Math.max(...arr);
      }
    };

    // cal legends
    const calLegends = (forecastday) => {
      const arr = [];
      forecastday.forEach((day) => {
        arr.push({
          name: day.date,
          icon: `image://${day?.day?.condition?.icon}`,
        });
      });
      return arr;
    };

    // cal data for series
    const calData = (forecastday) => {
      const series = [];
      (forecastday || []).forEach((day) => {
        let singleDateData = {
          data: [],
          animation: false,
          type: "line",
          smooth: true,
          name: day.date,
          showSymbol: false,
        };
        (day.hour || []).forEach((h) => {
          const { temp_c, condition, time } = h;
          singleDateData.data.push({
            value: temp_c,
            content: { time, conditionText: condition.text },
          });
        });
        series.push(singleDateData);
      });
      return series;
    };

    const modeColor = computed((lightColor = "rgba(255, 255,255, 1)") => {
      return darkMode.value ? lightColor : DarkColor.mainColor;
    });

    const modeTooltipColor = computed(
      (lightColor = "rgba(255, 255,255, 1)") => {
        return darkMode.value ? DarkColor.backgroundColor : lightColor;
      }
    );

    const option = ref({
      backgroundColor: modeTooltipColor,
      legend: {
        type: "scroll",
        itemWidth: 35,
        itemHeight: 35,
        data: calLegends(daysData),
        textStyle: {
          color: modeColor,
        },
        pageTextStyle: {
          color: modeColor,
        },
      },
      xAxis: {
        type: "category",
        data: [...Array(24).keys()].map((i) => i + ":00"),
        boundaryGap: false,
        name: t("chart.Hour", {}, { locale: language.value }),
      },
      yAxis: {
        type: "value",
        name: "℃",
        min: calGreatest(daysData, "min") - 1,
        max: calGreatest(daysData, "max") + 1,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        borderColor: modeTooltipColor,
        backgroundColor: modeTooltipColor,
        formatter(params) {
          // console.log(params);
          let str = "";
          params.forEach((param) => {
            str += `<div style='color: ${param?.color}'>${param?.data?.content?.time} - ${param?.value}℃ <br/>
						${param?.data?.content?.conditionText}</div>
						<hr/>`;
          });
          return str;
        },
      },
      dataZoom: [{}],
      series: calData(daysData),
    });
    return { option };
  },
};
</script>

<style lang="scss" scoped>
.charBox {
  margin-bottom: 15px;
  height: 400px;
}
</style>