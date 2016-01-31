import Router from './lib/router';

import commonAction from './common';
import barChart from './contents/barChart';
import columnChart from './contents/columnChart';

const router = new Router({
  '*': commonAction,
  '/barchart': barChart,
  '/columnchart': columnChart
}, {
  rootPath: ''
});

router.run();
