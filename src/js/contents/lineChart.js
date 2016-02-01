import d3 from 'd3';

export default function lineChart() {
  const stage = '#stage-LineChart';

  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
  };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  const maxY = 100;
  let data;
  const fill = d3.scale.category20();
  let lineDrawing;
  let svg;
  let svgGroup;
  let axisX;
  let axisY;
  let scaleX;
  let scaleY;
  const gDuration = 4;

  function createRandomValue() {
    return Math.floor(Math.random() * maxY);
  }

  function parseDate() {
    const parse = d3.time.format('%Y/%m/%d').parse;
    data.forEach(function(d) {
      d.date = parse(d.date);
    });
  }

  function init() {
    scaleX = d3.time.scale()
      .range([0, width]);

    scaleY = d3.scale.linear()
      .range([height, 0]);

    axisX = d3.svg.axis()
      .scale(scaleX)
      .orient('bottom')
      .ticks(8)
      .tickFormat(d3.time.format('%y/%m/%d'));

    axisY = d3.svg.axis()
      .scale(scaleY)
      .orient('left');

    resetData(true);

    d3.select('.js-reset')
      .on('click', function() {
        resetData(true);
      });

    d3.select('.js-selectBox')
      .on('change', function() {
        resetData(false);
      });
  }

  function createGraph() {
    if (d3.select('.js-line')[0][0]) {
      svg.remove();
    }

    svg = d3.select(stage)
      .append('svg')
      .attr({
        width: width + margin.left + margin.right + 20, // 目盛りの値が隠れてしますので、20を追加
        height: height + margin.top + margin.bottom
      });

    svgGroup = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr({
        width,
        height
      });

    svgGroup.append('path')
      .attr({
        'd': lineDrawing(data),
        'fill': 'none',
        'stroke': fill(1),
        'stroke-dashoffset': 999999,
        'stroke-dasharray': '999999 999999',
        'stroke-width': 2,
        'transform': `translate(${margin.left}, ${margin.top})`,
        'class': 'js-line'
      });

    svgGroup.selectAll('.dots')
      .data(data)
      .enter()
      .append('circle')
      .attr({
        fill(d, i) {
          return fill(i);
        },
        stroke: 'none',
        transform: `translate(${margin.left}, ${margin.top})`,
        cx: lineDrawing.x(),
        cy: lineDrawing.y(),
        r: '8'
      });


    const axisXTop = height + margin.top;
    svg.append('g')
      .attr({
        'class': 'u-graph__axis',
        'transform': `translate(${margin.left}, ${axisXTop})`
      })
      .call(axisX);
    svg.append('g')
      .attr({
        'class': 'u-graph__axis axis-y',
        'transform': `translate(${margin.left}, ${margin.top})`
      })
      .call(axisY);

    // Y軸用 罫線の作成
    d3.select('.axis-y')
      .selectAll('line')
      .attr({
        'x1': '5',
        'x2': width,
        'stroke-width': '0.2',
        'stroke-opacity': '0.4'
      });
  }

  function resetData(reset) {
    if (reset) {
      data = [{
        date: '2016/01/01',
        value: createRandomValue()
      }, {
        date: '2016/01/02',
        value: createRandomValue()
      }, {
        date: '2016/01/03',
        value: createRandomValue()
      }, {
        date: '2016/01/04',
        value: createRandomValue()
      }, {
        date: '2016/01/05',
        value: createRandomValue()
      }, {
        date: '2016/01/06',
        value: createRandomValue()
      }, {
        date: '2016/01/07',
        value: createRandomValue()
      }, {
        date: '2016/01/08',
        value: createRandomValue()
      }];

      parseDate();
    }

    scaleX.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    scaleY.domain([0, maxY]);

    // 線描画用の関数を定義
    lineDrawing = d3.svg.line()
      .x(function(d) {
        return scaleX(d.date);
      })
      .y(function(d) {
        return scaleY(d.value);
      });
    const mode = document.chkModeForm.selectMode.value;
    lineDrawing.interpolate(`${mode}`);

    createGraph();

    const targetElem = document.querySelector('.js-line');
    const targetLength = targetElem.getTotalLength();
    strokeAnimation(targetElem, targetLength, gDuration, false);
  }

  function strokeAnimation(elem, length, duration, repeat) {
    elem.style.transition =
      elem.style.WebkitTransition =
      'none';
    elem.setAttribute('stroke-dasharray', `${length} ${length}`);
    if (repeat) {
      elem.setAttribute('stroke-dashoffset', '0');
    } else {
      elem.setAttribute('stroke-dashoffset', length); // 逆地点からのスタートにしたい時は、マイナスをつける
    }
    elem.getBoundingClientRect();
    elem.style.transition =
      elem.style.WebkitTransition =
      `stroke-dashoffset ${duration}s ease-in-out`;
    if (repeat) {
      elem.setAttribute('stroke-dashoffset', length);
    } else {
      elem.setAttribute('stroke-dashoffset', '0');
    }
  }

  init();
}
