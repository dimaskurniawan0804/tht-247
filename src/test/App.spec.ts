import { mount } from "@vue/test-utils";
import AppVue from "../App.vue";

describe("AppVue Component", () => {
  const wrapper = mount(AppVue);
  it("should update inputNumber and call generateRandomNumbers", async () => {
    const vm = wrapper.vm;

    vm.inputNumber = "10";

    await vm.generateRandomNumbers();

    expect(vm.inputNumber).toBe(10);
    expect(vm.randomNumbers.length).toBe(10);
  });

  it("Click Summary Tab", async () => {
    const summaryTab = wrapper.find('[data-test="click-summary"]');
    summaryTab.trigger("click");
    expect(wrapper.vm.tab.summary).toBe(true);
  });
});
