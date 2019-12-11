import { shallowMount } from '@vue/test-utils';
import Home from '../Home';

jest.mock('../../utils/aeternity');

describe('Home.vue', () => {

  let wrapper = null;
  let methods = null;

  beforeEach(() => {
    methods = {
      loadData: jest.fn().mockName('loadData'),
    };
    wrapper = shallowMount(Home, { methods });
  });

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test('should call loadData on created', () => {
    expect(methods.loadData).toHaveBeenCalledTimes(1);
  });

  test('renders the address', async () => {
    wrapper.setData({
      address: process.env.PUBLIC_KEY
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.address').text()).toBe(process.env.PUBLIC_KEY);
  });
});
