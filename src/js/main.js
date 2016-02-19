import pathDispatcher from 'path-dispatcher';

import commonAction from './common';
import topAction from './top';
import barChart from './contents/barChart';
import columnChart from './contents/columnChart';
import lineChart from './contents/lineChart';
import pieChart from './contents/pieChart';

const dispatcher = pathDispatcher({
  '*': commonAction,
  '/': topAction,
  '/barchart': barChart,
  '/columnchart': columnChart,
  '/linechart': lineChart,
  '/piechart': pieChart
}, {
  rootPath: '/d3-collection'
});

dispatcher.dispatch();
