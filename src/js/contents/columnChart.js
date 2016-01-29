import d3 from 'd3';
const dataNum = 10;
const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
};
const width = 600 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const graphTextTop = height - 4;
const maxY = 100;
let data;
const dataX = ['A', 'B', 'C', 'D', 'E', 'F','G','H','I','J'];
const fill = d3.scale.category20();
const intervalY = [height, 0];
let scaleX;
let scaleY;
let svg;
let svgGroup;
let svgBars;
let svgTexts;
const stage = '#stage';


export default function columnChart() {
  data = createRandomArray(dataNum);

  svg = d3.select(stage)
    .append('svg')
    .attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom
    });
  scaleX = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
  scaleY = d3.scale.linear()
    .rangeRound(intervalY);
  createGraph();

  d3.select('.js-reset')
    .on('click', () => {
      resetData();
    });
}

function createRandomArray(count) {
  const returnArray = [];
  for (let i = 0; i < count; i++) {
    returnArray.push([Math.floor(Math.random() * maxY)]);
  }
  return returnArray;
}

function createGraph() {
  svgGroup = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom,
      transform: `translate(${margin.left}, ${margin.top})`
    });

  // 初期表示時に下からのアニメーションにしたいが、うまくできなかったので、
  // 一旦見えないグラフを作成し、resetData()を使って描画し直している。
  svgBars = svgGroup
    .append('rect')
    .attr({
      x(d, i) {
        return i * 52;
      },
      'y': height,
      'width': 30,
      'height': 0,
      fill(d, i) {
        return fill(i);
      },
      'fill-opacity': 0,
      'transform': 'translate(17, 0)',
      'class': 'bar'
    });

  const svgAxisX = d3.svg.axis()
    .scale(scaleX)
    .orient('bottom');

  const svgAxisY = d3.svg.axis()
    .scale(scaleY)
    .orient('left');

  scaleX.domain(data.map(function(d, i) {
    return dataX[i];
  }));

  scaleY.domain([0, maxY]);

  svgGroup.append('g')
    .attr({
      'class': 'u-graph__axis',
      'transform': `translate(0, ${height})`
    })
    .call(svgAxisX);

  svgGroup.append('g')
    .attr({
      'class': 'u-graph__axis',
      'transform': `translate(0, 0)`
    })
    .call(svgAxisY);

  resetData(true); // 初期表示はdelayさせる
}

// init();

function resetData(delay) {
  const newData = createRandomArray(dataNum);
  const beforeData = data;
  data = newData;

  svgBars
    .data(newData)
    .transition()
    .delay(function(d, i) {
      if (!delay) {
        return 0;
      }
      return i * 200;
    })
    .attr({
      x(d, i) {
        return i * 52;
      },
      y(d) {
        return scaleY(d[0]);
      },
      fill(d, i) {
        return fill(i);
      },
      'fill-opacity': 1,
      'width': 30,
      height(d) {
        return height - scaleY(d[0]);
      }
    });

  // 初期表示時はtext要素は存在しないため
  if (d3.select('.u-graph__text')[0][0]) {
    svgTexts.remove();
  }
  svgTexts = svgGroup
    .append('text')
    .attr({
      x(d, i) {
        return i * 52;
      },
      'class': 'u-graph__text',
      'transform': `translate(32, ${graphTextTop})`
    })
    .data(newData)
    .each(function() {
      svgGroup.selectAll('.u-graph__text')
        .transition()
        .tween('text', tweenText(beforeData));
    });
}

function tweenText(beforeData) {
  return function(d, i) {
    const interpolate = d3.interpolateRound(beforeData[i][0], d[0]);
    return function(t) {
      this.textContent = interpolate(t);
    };
  };
}
