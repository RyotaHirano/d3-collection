import d3 from 'd3';

export default function barChart() {
  const stage = '#stage-BarChart';

  const dataNum = 10;

  const padding = 20;
  const width = 840;
  const height = 420;
  const fill = d3.scale.category20();
  const interval = [padding, width - padding];
  const dataY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  let svgGroup;
  let svgBars;
  let svgTexts;
  let data = createRandomArray(dataNum);

  const scaleX = d3.scale.linear()
    .domain([0, 100])
    .range(interval);
  const scaleY = d3.scale.ordinal().rangeRoundBands([padding, height - padding], 0.01);

  createGraph();

  d3.select('.js-reset')
    .on('click', () => {
      resetData(false);
    });

  function createGraph() {
    const svg = d3.select(stage).append('svg')
      .attr({
        width,
        height
      });
    svgGroup = svg.append('g')
                  .attr({
                    transform: 'translate(0, 20)'
                  })
                  .selectAll('g')
                  .append('g')
                  .data(data)
                  .enter()
                  .append('g');
    svgBars = svgGroup.append('rect')
      .attr({
        'x': padding,
        y(d, i) {
          return i * 37;
        },
        'width': 0,
        'height': 30,
        'transform': 'translate(0, -7)',
        fill(d, i) {
          return fill(i);
        },
        'fill-opacity': 0
      });

    scaleY.domain(data.map(function(d, i) {
      return dataY[i];
    }));
    const svgAxisX = d3.svg.axis()
      .scale(scaleX)
      .orient('bottom');
    svg.append('g')
      .attr({
        'class': 'u-graph__axis',
        'transform': 'translate(0, 385)'
      })
      .call(svgAxisX);
    const svgAxisY = d3.svg.axis()
      .scale(scaleY)
      .orient('left');
    svg.append('g')
      .attr({
        'class': 'u-graph__axis',
        'transform': 'translate(20, -15)'
      })
      .call(svgAxisY);

    resetData(true);
  }

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
        'fill-opacity': 1,
        width(d) {
          return scaleX(d[0]) - padding;
        }
      });

    // 初期表示時はtext要素は存在しないため
    if (d3.select('.u-graph__text')[0][0]) {
      svgTexts.remove();
    }
    svgTexts = svgGroup
      .append('text')
      .attr({
        'x': padding,
        y(d, i) {
          return i * 37;
        },
        'class': 'u-graph__text',
        'transform': 'translate(10, 14)'
      })
      .data(newData)
      .each(
        function() {
          svgGroup.selectAll('text')
            .transition()
            .tween('text', tweenText(beforeData));
        }
      );
  }

  function tweenText(beforeData) {
    return function(d, i) {
      const interpolate = d3.interpolateRound(beforeData[i][0], d[0]);
      return function(t) {
        this.textContent = interpolate(t);
      };
    };
  }

  function createRandomArray(count) {
    const returnArray = [];
    for (let i = 0; i < count; i++) {
      returnArray.push([Math.floor(Math.random() * 100)]);
    }
    return returnArray;
  }
}
