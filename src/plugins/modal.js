import ErrorHandler from '@/utils/logging/ErrorHandler';

const registry = new Map();

export function register(name, instance) {
  registry.set(name, instance);
}

export function unregister(name) {
  registry.delete(name);
}

export default {
  install(app) {
    app.config.globalProperties.$modal = {
      show(name) {
        const instance = registry.get(name);
        if (!instance) {
          ErrorHandler(`Modal '${name}' is not registered`);
          return;
        }
        instance.open();
      },
      hide(name) {
        const instance = registry.get(name);
        if (instance) instance.close();
      },
    };
  },
};
