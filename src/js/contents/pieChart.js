import d3 from 'd3';

export default function pieChart() {
  const stage = '#stage-PieChart';
  const dataNum = 10;

  const width = 400;
  const height = 400;
  const outerR = 150;
  const innerR = 0;
  const fill = d3.scale.category20();
  let svg;
  let svgGroup;
  let gPie;
  let pie;
  let arc;

  const createRandomValue = count => {
    const returnArray = [];
    for (let i = 0; i < count; i++) {
      returnArray.push(Math.floor(Math.random() * 100));
    }
    return returnArray;
  };

  const resetOrderZ = () => {
    for (let i = 0; i < dataNum; i++) {
      const targetDOM = d3.select(`#g-${i}`)[0][0];
      const targetParent = d3.select('#parent-g')[0][0];
      targetParent.appendChild(targetDOM);
    }
  };

  const arcTweenFirst = function(a) {
    const start = {
      startAngle: 0,
      endAngle: 0
    };
    const i = d3.interpolate(start, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  };
  const arcTween = function(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  };

  const resetData = () => {
    const data = createRandomValue(dataNum);

    resetOrderZ(); // アニメーションが汚くなるので、svg要素の順番を戻す

    gPie = svgGroup.selectAll('g')
      .data(pie(data))
      .attr({
        transform: `translate(${width / 2}, ${height / 2})`,
        id(d, i) {
          return `g-${i}`;
        }
      });

    gPie.select('path')
      .attr({
        fill(d, i) {
          return fill(i);
        },
        id(d, i) {
          return `pie-${i}`;
        }
      })
      .transition()
      .duration(1000)
      .ease('elastic')
      .attrTween('d', arcTween);

    gPie.select('text')
      .attr({
        transform(d) {
          const c = arc.centroid(d);
          const textScale = 1.3; // 中心からの位置を調整
          return `translate(${c[0] * textScale}, ${c[1] * textScale})`;
        },
        id(d, i) {
          return `text-${i}`;
        }
      })
      .text(function(d) {
        return d.value;
      });
  };

  d3.select('.js-reset')
    .on('click', function() {
      resetData();
    });

  const arcOver = d3.svg.arc().outerRadius(outerR * 1.1).innerRadius(0);

  const drawPie = (data, cx, cy) => {
    gPie = svgGroup.selectAll('g')
      .data(pie(data))
      .enter()
      .append('g')
      .attr({
        transform: `translate(${cx}, ${cy})`,
        id(d, i) {
          return `g-${i}`;
        }
      })
      .on('mouseover', function() {
        const targetId = d3.select(this).attr('id').replace(/g-/, '');
        const targetPie = `#pie-${targetId}`;
        const targetText = `#text-${targetId}`;

        this.parentNode.appendChild(this); // svg要素にz-indexは効かないので、DOMの順序を下に持ってくる

        d3.select(targetPie)
          .transition()
          .duration(200)
          .attr({
            'd': arcOver,
            'fill-opacity': 0.9
          });
        d3.select(targetText)
          .transition()
          .duration(200)
          .attr({
            'fill-opacity': 1
          });

        d3.select(this)
          .sort(function() {
            return 1;
          });
      })
      .on('mouseout', function() {
        const targetId = d3.select(this).attr('id').replace(/g-/, '');
        const targetPie = `#pie-${targetId}`;
        const targetText = `#text-${targetId}`;

        d3.select(targetPie)
          .transition()
          .duration(200)
          .attr({
            'd': arc,
            'fill-opacity': 1
          });
        d3.select(targetText)
          .transition()
          .duration(200)
          .attr({
            'fill-opacity': 0
          });
      });
    gPie.append('path')
      .attr({
        fill(d, i) {
          return fill(i);
        },
        id(d, i) {
          return `pie-${i}`;
        }
      })
      .transition()
      .duration(600)
      .ease('linear')
      .attrTween('d', arcTweenFirst)
      .each(function(d) {
        this._current = d;
      });

    gPie.append('text')
      .attr({
        transform(d) {
          const c = arc.centroid(d);
          const textScale = 1.3; // 中心からの位置を調整
          return `translate(${c[0] * textScale}, ${c[1] * textScale})`;
        },
        'dy': '.35em',
        'text-anchor': 'middle',
        'font-size': '14px',
        'fill-opacity': 0,
        id(d, i) {
          return `text-${i}`;
        }
      })
      .text(function(d) {
        return d.value;
      });
  };

  const init = () => {
    const data = createRandomValue(dataNum);

    svg = d3.select(stage).append('svg')
      .attr({
        width,
        height
      });

    svgGroup = svg.append('g')
      .attr({
        width,
        height,
        id: 'parent-g'
      });

    pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d;
      });

    arc = d3.svg.arc().outerRadius(outerR).innerRadius(innerR); // innerRadiusを与えるとドーナツ型になる

    drawPie(data, width / 2, height / 2);
  };

  init();
}
