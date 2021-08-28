<template>
  <ul>
    <li>
      {{
        t(
          "search.ForHistoryTheDateShouldNotBeLessThanEightDaysAgoAndTwodaysFutuerDueToAPILimit",
          {},
          { locale }
        )
      }}
    </li>
    <li>
      {{
        t(
          "search.ForHistoryTheEndDateShouldBeEqualToOrGreaterThanFromDate",
          {},
          { locale }
        )
      }}
    </li>
    <li>
      {{ t("search.cityName", {}, { locale }) }}
      <span class="infoHighlighted">
        {{ t("search.EG", {}, { locale }) }}: q=Paris
      </span>
    </li>
    <li>
      {{ t("search.USZip", {}, { locale }) }}
      <span class="infoHighlighted">
        {{ t("search.EG", {}, { locale }) }}: q=10001
      </span>
    </li>
    <li>
      {{ t("search.UKPstcode", {}, { locale }) }}
      <span class="infoHighlighted">
        {{ t("search.EG", {}, { locale }) }}: q=SW1
      </span>
    </li>
    <li>
      {{ t("search.CanadaPostalCode", {}, { locale }) }}
      <span class="infoHighlighted">
        {{ t("search.EG", {}, { locale }) }} q=G2J
      </span>
    </li>
    <li>
      {{ t("search.metar", {}, { locale }) }}
      <span class="infoHighlighted">
        {t('search.EG', {}, { locale })}}: q=metar:EGLL
      </span>
    </li>
    <li>
      {{ t("search.iata", {}, { locale }) }}
      <span class="infoHighlighted">
        {{ t("search.EG", {}, { locale }) }}: q=iata:DXB
      </span>
    </li>
    <li>
      {{ t("search.autoIPLookup", {}, { locale }) }}
      <span class="infoHighlighted">
        {{ t("search.EG", {}, { locale }) }}: q=auto:ip
      </span>
    </li>
    <li>
      {{ t("search.IPAddress", {}, { locale }) }}
      <span class="infoHighlighted">
        {{ t("search.EG", {}, { locale }) }}: q=100.0.0.1
      </span>
    </li>
  </ul>
</template>

<script>
import { inject } from "vue";
// i18n
import { useI18n } from "vue-i18n";
export default {
  name: "InfoToolTip",
  setup() {
    const language = inject("language");
    const { t } = useI18n({});
    return { t, locale: language };
  },
};
</script>

<style lang="scss" scoped>
.infoHighlighted {
  font-weight: bold;
}
</style>