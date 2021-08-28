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
  MarkAreaComponent,
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
  MarkAreaComponent,
]);
export default {
  name: "SingleDayLineChart",
  components: {
    VChart,
  },
  props: ["day", "darkMode"],
  provide() {
    return {
      [THEME_KEY]: computed(() => (this.darkMode ? "dark" : "light")),
    };
  },
  setup(props) {
    const language = inject("language");
    const { t, locale } = useI18n({});
    const { day, darkMode } = toRefs(props);
    const dayData = day.value;
    //console.log(day.value);

    const modeColor = computed((lightColor = "rgba(255, 255,255, 1)") => {
      return darkMode.value ? lightColor : DarkColor.mainColor;
    });

    // const modeColor = (mode, lightColor = "rgba(255, 255,255, 1)") =>
    //   darkMode.value ? lightColor : DarkColor.mainColor;
    const modeTooltipColor = computed(
      (lightColor = "rgba(255, 255,255, 1)") => {
        return darkMode.value ? DarkColor.backgroundColor : lightColor;
      }
    );

    console.log(darkMode.value);

    const calData = (data) => {
      const arr = [];
      (data || []).forEach((h) => {
        const { temp_c, condition, time } = h;
        arr.push({
          value: temp_c,
          symbol: `image://${condition.icon}`,
          content: { time, conditionText: condition.text },
        });
      });
      return arr;
    };

    // Cal the highest and lowest temp then the yAxis could be more focus for the temp
    const calGreatest = (data, minOrMax) => {
      if (minOrMax === "min") {
        return Math.min(...(data || []).map((h) => h.temp_c));
      } else {
        return Math.max(...(data || []).map((h) => h.temp_c));
      }
    };

    const option = ref({
      backgroundColor: modeTooltipColor,
      title: {
        text: dayData?.date,
        left: "center",
        top: "0%",
        textStyle: {
          fontSize: 13,
          fontWeight: 300,
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
        min: calGreatest(dayData?.hour, "min") - 1,
        max: calGreatest(dayData?.hour, "max") + 1,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        textStyle: {
          color: modeColor,
        },
        borderColor: modeTooltipColor,
        backgroundColor: modeTooltipColor,
        formatter(params) {
          //console.log(params[0])
          return `${params[0].data.content.time} - ${params[0].value}℃ <br/>
					${params[0].data.content.conditionText}`;
        },
      },
      dataZoom: [{}],
      series: [
        {
          data: calData(dayData?.hour),
          animation: false,
          lineStyle: {
            color: modeColor,
          },
          markArea: {
            silent: true,
            itemStyle: {},
            label: {
              color: modeColor,
              show: true,
              position: [0, -30],
            },
            data: [
              [
                {
                  name: `${t(
                    "chart.DayFrom",
                    {},
                    { locale: language.value }
                  )} From ${dayData?.astro?.sunrise} - ${
                    dayData?.astro?.sunset
                  }`,
                  xAxis: +dayData?.astro?.sunrise?.slice(1, 2),
                },
                {
                  xAxis: +dayData?.astro?.sunset?.slice(1, 2) + 12,
                },
              ],
            ],
          },
          type: "line",
          smooth: true,
          symbolSize: 35,
          label: {
            color: modeColor,
            show: true,
            fontSize: 12,
            fontWeight: 300,
            formatter: "{c} ℃",
          },
        },
      ],
    });

    return { option };
  },
};
</script>

<style lang="scss" scoped>
.charBox {
  margin-bottom: 15px;
  height: 400px;
  width: auto;
}
</style>