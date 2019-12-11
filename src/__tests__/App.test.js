import { shallowMount } from '@vue/test-utils';
import App from '../App';

jest.mock('../utils/aeternity');

describe('App.vue', () => {

  let wrapper = null;

  beforeAll(() => {
    wrapper = shallowMount(App, {
      stubs: ['router-link', 'router-view'],
    });
  });

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
