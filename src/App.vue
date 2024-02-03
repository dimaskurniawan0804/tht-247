<template>
  <div id="main-wrapper">
    <Menubar :model="items">
      <template #start></template>
      <template #end>{{ date }}</template>
    </Menubar>
    <div class="content-wrapper">
      <div class="content">
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
          <div class="button-tab">
            <Button data-test="click-input" label="Input" @click="tabHandler('input')" severity="info" :outlined="tab.input ? false : true" />
            <Button data-test="click-table" label="Table" @click="tabHandler('table')" severity="info" :outlined="tab.table ? false : true" />
            <Button data-test="click-summary" label="Summary" @click="tabHandler('summary')" severity="info" :outlined="tab.summary ? false : true" />
          </div>
          <div class="clock" style="color: white">
            {{ clock }}
          </div>
        </div>
        <Divider />
        <!--INPUT-->
        <div class="content-input" v-if="tab.input">
          <div class="user-input">
            <div class="user-input_input">
              <label for="username">Generate Random Number</label>
              <InputText data-test="input" type="number" id="username" v-model="inputNumber" style="width: 300px" />
              <small id="username-help">Enter a number between 1 - 10000</small>
            </div>
            <div class="user-input_button">
              <Button label="Generate" severity="info" @click="generateRandomNumbers" :disabled="!isEnableGenerateButton" />
            </div>
          </div>
          <div class="quote">
            <h5>Quote of the day</h5>
            <h1>`{{ quote }}`</h1>
          </div>
        </div>
        <!--TABLE-->
        <div class="content-table" v-if="tab.table">
          <div v-if="randomNumbers.length < 1" class="empty-table">
            <h1 class="empty">PLEASE GENERATE NEW NUMBERS</h1>
          </div>
          <h3 style="color: white; margin-bottom: 16px">You have generated {{ randomNumbers.length }}</h3>
          <table v-for="(item, idx) of splitArrayData">
            <thead>
              <tr>
                <th v-for="(_, index) in item" :key="index">{{ 10 * idx + (index + 1) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="(data, index) in item" :key="index">{{ data }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--SUMARY-->
        <div class="content-summary" v-if="tab.summary">
          <div class="summary" style="display: flex; flex-direction: column; gap: 8px" v-if="!summary">
            <h1 v-if="randomNumbers.length < 1" class="empty">PLEASE GENERATE NEW NUMBERS</h1>
            <Button label="Get Summary" severity="info" :disabled="randomNumbers.length < 1" @click="findSmallestNumber" />
          </div>
          <div class="summary" v-if="summary">
            <h1 style="color: white" data-test="summry-value">Sumary is : {{ summary }}</h1>
            <div class="quote">
              <h5>Quote of the day</h5>
              <h1>`{{ quote }}`</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>Saturday, 3 February 2024</footer>
  </div>
</template>

<script lang="ts">
import { ref, watch, reactive, onMounted, defineComponent } from "vue";
export default defineComponent({
  setup() {
    const inputNumber = ref<string>("");
    const randomNumbers = ref<number[]>([]);
    const splitArrayData = ref<number[][]>([]);
    const summary = ref<number>(0);
    const isEnableGenerateButton = ref(false);
    const quote = ref("");
    const tab = reactive({
      input: true,
      table: false,
      summary: false,
    });
    const clock = ref("");
    const date = ref("");
    const items = ref([
      {
        label: "Dimas Kurniawan",
        icon: "pi pi-home",
        command: () => {
          window.open("https://www.linkedin.com/in/dimaskurniawan-bej/", "_blank");
        },
      },
    ]);

    watch(
      inputNumber,
      (val) => {
        if (+val > 0 && +val < 10001) {
          isEnableGenerateButton.value = true;
        } else {
          isEnableGenerateButton.value = false;
        }
      },
      { immediate: true }
    );

    watch(
      () => tab.input,
      () => {
        if (inputNumber.value && +inputNumber.value > 0 && +inputNumber.value < 10001) {
          isEnableGenerateButton.value = true;
        } else {
          isEnableGenerateButton.value = false;
        }
      }
    );

    function generateRandomNumbers() {
      randomNumbers.value = [];
      summary.value = 0;
      if (inputNumber.value !== undefined) {
        for (let i = 0; i < +inputNumber.value; i++) {
          const randomNumber = Math.floor(Math.random() * (1000000 - -1000000 + 1)) + -1000000;
          randomNumbers.value.push(randomNumber);
        }
        isEnableGenerateButton.value = false;
        splitArray(randomNumbers.value, 10);
      }
    }

    function splitArray(array: any, size: number) {
      const temp = [];

      for (let i = 0; i < array.length; i += size) {
        temp.push(array.slice(i, i + size));
      }

      splitArrayData.value = temp;
      tab.input = false;
      tab.table = true;
    }

    function findSmallestNumber() {
      const sortArray = randomNumbers.value.sort((a, b) => a - b).filter((el) => el > 0);
      summary.value = sortArray[0] - 1;
    }

    function tabHandler(activeTab: string) {
      switch (activeTab) {
        case "input":
          tab.input = true;
          tab.table = false;
          tab.summary = false;
          break;
        case "table":
          tab.input = false;
          tab.table = true;
          tab.summary = false;
          break;
        case "summary":
          tab.input = false;
          tab.table = false;
          tab.summary = true;
          break;
        default:
          break;
      }
    }

    // https://github.com/lukePeavey/quotable //
    async function generateRandomQuote() {
      try {
        const response = await fetch("https://api.quotable.io/random");
        const res = await response.json();
        quote.value = res.content;
      } catch (error) {
        console.error(error);
      }
    }

    function padZero(num: number) {
      return num < 10 ? "0" + num : num;
    }

    async function generateRealtimeClock() {
      setInterval(() => {
        const now = new Date();
        const hours = padZero(now.getHours());
        const minutes = padZero(now.getMinutes());
        const seconds = padZero(now.getSeconds());
        clock.value = `${hours}:${minutes}:${seconds}`;
      }, 1000);
    }

    function generateDate() {
      const now = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dayOfWeek = days[now.getDay()];
      const dayOfMonth = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      date.value = `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
    }

    onMounted(() => {
      generateRandomQuote();
      generateRealtimeClock();
      generateDate();
    });
    return {
      inputNumber,
      quote,
      splitArrayData,
      isEnableGenerateButton,
      tab,
      items,
      randomNumbers,
      summary,
      clock,
      date,
      generateRandomNumbers,
      findSmallestNumber,
      tabHandler,
    };
  },
});
</script>

<style scoped lang="scss">
#main-wrapper {
  background-image: url("https://www.researchsat.space/images/svr2.jpg");
  background-size: cover;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: 18px;

  .content-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
      padding: 16px;
      width: 90vw;
      height: 80vh;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      .button-tab {
        display: flex;
        gap: 8px;
      }

      .content-input {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 80px;
        .user-input {
          display: flex;
          flex-direction: row;
          gap: 6px;
          align-items: center;
          width: 100%;
          color: white;
          &_input {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
        }
      }
      .quote {
        background: rgba(255, 255, 255, 0.53);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(9.1px);
        -webkit-backdrop-filter: blur(9.1px);
        border: 1px solid rgba(255, 255, 255, 0.61);
        text-align: center;
        // color: white;
        font-weight: bolder;
        width: 60%;
        padding: 16px;
        h1 {
          font-style: italic;
        }
      }

      .empty-table,
      .summary {
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      .summary {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .content-table,
      .content-summary {
        height: 85%;
        overflow: scroll;
        table,
        th,
        td {
          border: 1px solid;
        }
        th {
          width: 130px;
          background-color: #0ea5e9;
        }
        td {
          background-color: white;
        }
      }

      .content-summary,
      .content-table {
        .empty {
          color: white;
        }
      }
    }
  }
  footer {
    flex-shrink: 0;
    background-color: #f5f5f5;
    padding: 14px;
    text-align: center;
    margin-top: auto;
  }
}
</style>
