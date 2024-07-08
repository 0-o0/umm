import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('now version is old, please refresh page!')) {
      updateSW();
    }
  },
  onOfflineReady() {},
});
