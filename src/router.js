import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import conf from '../public/conf.yml'; // Main site configuration
import { pageInfo as defaultPageInfo } from './utils/defaults';

Vue.use(Router);

const { sections, pageInfo, appConfig } = conf;

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: {
        sections: sections || [],
        pageInfo: pageInfo || defaultPageInfo,
        appConfig: appConfig || {},
      },
      meta: {
        title: 'Home Page',
        metaTags: [
          {
            name: 'description',
            content: 'A simple static homepage for you\'re server',
          },
        ],
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});

const defaultTitle = 'Speed Dial';
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || defaultTitle;
  });
});

export default router;
