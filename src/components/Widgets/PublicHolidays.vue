<template>
<div class="public-holidays-wrapper">
  <div
    v-for="(holiday, indx) in holidays"
    :key="indx"
    v-tooltip="tooltip(holiday)"
    class="holiday-row"
  >
    <p class="holiday-date">{{ holiday.date }}</p>
    <p class="holiday-name">{{ holiday.name }}</p>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { timestampToDate, capitalize } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      holidays: [],
    };
  },
  computed: {
    country() {
      if (this.options.country) return this.options.country;
      return navigator.language.split('-')[1] || 'GB';
    },
    holidayType() {
      const options = ['all', 'public_holiday', 'observance',
        'school_holiday', 'other_day', 'extra_working_day'];
      const usersChoice = this.options.holidayType;
      if (usersChoice && options.includes(usersChoice)) return usersChoice;
      return 'public_holiday';
    },
    monthsToShow() {
      const usersChoice = this.options.monthsToShow;
      if (usersChoice && usersChoice > 0 && usersChoice <= 24) {
        return usersChoice;
      }
      return 12;
    },
    startDate() {
      const now = new Date();
      return `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    },
    endDate() {
      const now = new Date();
      const then = new Date((now.setMonth(now.getMonth() + this.monthsToShow)));
      return `${then.getDate()}-${then.getMonth() + 1}-${then.getFullYear()}`;
    },
    region() {
      if (this.options?.state) {
        return `&region=${this.options.state}`;
      }
      return '';
    },
    endpoint() {
      return `${widgetApiEndpoints.holidays}`
      + `&fromDate=${this.startDate}&toDate=${this.endDate}`
      + `&country=${this.country}&holidayType=${this.holidayType}`
      + `${this.region}`;
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch holiday data', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(holidays) {
      const results = [];
      const makeDate = (date) => timestampToDate(
        new Date(`${date.year}-${date.month}-${date.day}`).getTime(),
      );
      const formatType = (ht) => capitalize(ht.replaceAll('_', ' '));
      holidays.forEach((holiday) => {
        results.push({
          name: holiday.name
            .filter(p => p.lang === this.options.lang)[0].text || holiday.name[0].text,
          date: makeDate(holiday.date),
          type: formatType(holiday.holidayType),
          observed: holiday.observedOn ? makeDate(holiday.observedOn) : '',
        });
      });
      this.holidays = results;
    },
    tooltip(holiday) {
      const observed = holiday.observed ? `<br><b>Observed On</b>: ${holiday.observed}` : '';
      const content = `<b>Type</b>: ${holiday.type}${observed}`;
      return {
        content, trigger: 'hover focus', html: true, delay: 250, classes: 'in-modal-tt',
      };
    },
  },
};
</script>

<style scoped lang="scss">
.public-holidays-wrapper {
  padding: 0.5rem 0;
  .holiday-row {
    display: flex;
    justify-content: space-between;
    p {
      margin: 0.25rem 0;
      color: var(--widget-text-color);
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}

</style>
