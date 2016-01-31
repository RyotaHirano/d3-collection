import d3 from 'd3';

export default function barChart() {
  const stage = '#stage-BarChart';

  const dataNum = 10;

  const padding = 20;
  const width = 840;
  const height = 380;
  const fill = d3.scale.category20();
  const interval = [padding, width - padding];
  let svgGroup;
  let svgBars;
  let svgTexts;
  let data = createRandomArray(dataNum);

  const scaleX = d3.scale.linear()
    .domain([0, 100])
    .range(interval);

  createGraph();

  d3.select('.js-reset')
    .on('click', () => {
      resetData();
    });

  function createGraph() {
    const svg = d3.select(stage).append('svg')
      .attr({
        width,
        height
      });
    svgGroup = svg.selectAll('g')
      .append('g')
      .data(data)
      .enter()
      .append('g');
    svgBars = svgGroup.append('rect')
      .attr({
        x: padding,
        y(d, i) {
          return i * 35;
        },
        width(d) {
          return scaleX(d[0]) - padding;
        },
        height: 30,
        fill(d, i) {
          return fill(i);
        }
      });
    svgTexts = svgGroup.append('text')
      .text(d =>
        d[0]
      )
      .attr({
        'x': padding,
        y(d, i) {
          return i * 35;
        },
        'class': 'graph-value',
        'transform': 'translate(0, 20)'
      });
    const svgAxis = d3.svg.axis()
      .scale(scaleX)
      .orient('bottom');
    svg.append('g')
      .attr({
        'class': 'axis-x',
        'transform': 'translate(0, 140)'
      })
      .call(svgAxis);
  }

  function resetData() {
    const newData = createRandomArray(dataNum);
    const beforeData = data;
    data = newData;

    svgBars
      .data(newData)
      .transition()
      .duration(400)
      .attr({
        width(d) {
          return scaleX(d[0]) - padding;
        }
      });

    svgTexts.remove();
    svgTexts = svgGroup
      .append('text')
      .attr({
        'x': padding,
        y(d, i) {
          return i * 35;
        },
        'class': 'graph-value',
        'transform': 'translate(0, 20)'
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
