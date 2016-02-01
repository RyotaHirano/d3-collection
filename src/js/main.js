import Router from './lib/router';

import commonAction from './common';
import barChart from './contents/barChart';
import columnChart from './contents/columnChart';
import lineChart from './contents/lineChart';

const router = new Router({
  '*': commonAction,
  '/barchart': barChart,
  '/columnchart': columnChart,
  '/linechart': lineChart
}, {
  rootPath: ''
});

router.run();
