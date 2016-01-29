import d3 from 'd3';

const stage = '#stage-BarChart';

const dataNum = 10;

const padding = 20;
const width = 900;
const height = 200;
const fill = d3.scale.category20();
const interval = [padding, width - padding];
let rangePoints;
let rangeRoundPoints;
let rangeBands;
let rangeRoundBands;
let scaleX;
let svgGroup;
let svgBars;
let svgTexts;
let data;

export default function barChart() {
  data = createRandomArray(4);

  rangePoints = d3.scale.ordinal()
		.domain(data)
		.rangePoints(interval, .1);

  scaleX = d3.scale.linear()
		.domain([0, 100])
		.range(interval);

  createGraph();

  d3.select('.js-reset')
    .on('click', () => {
      resetData();
    });
}

function createGraph() {
  let svg = d3.select(stage).append('svg').attr({
		'width': width,
		'height': height
	});
	svgGroup = svg.selectAll('g')
		.append('g')
		.data(data)
		.enter()
		.append('g');
	svgBars = svgGroup.append('rect')
		.attr({
			x: padding,
			y: function(d, i) {
				return i * 35;
			},
			width: function(d) {
				return scaleX(d[0]) - padding;
			},
			height: 30,
			fill: function(d, i) {
				return fill(i);
			}
		});
	svgTexts = svgGroup.append('text')
		.text(function(d) {
			return d[0];
		})
		.attr({
			x: padding,
			y: function(d, i) {
				return i * 35;
			},
			class: 'graph-value',
			transform: 'translate(0, 20)'
		});
	var svgAxis = d3.svg.axis()
		.scale(scaleX)
		.orient('bottom');
	svg.append("g")
		.attr({
			class: 'axis-x',
			transform: 'translate(0, 140)'
		})
		.call(svgAxis);
}

function resetGraph() {
	var newData = createRandomArray(4);
	var beforeData = data;
	data = newData;

	svgBars
		.data(newData)
		.transition()
		.duration(400)
		.attr({
			width: function(d) {
				return scaleX(d[0]) - padding;
			}
		});

	svgTexts.remove();
	svgTexts = svgGroup
							.append('text')
							.attr({
								x: padding,
								y: function(d, i) {
									return i * 35;
								},
								class: 'graph-value',
								transform: 'translate(0, 20)'
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
		var interpolate = d3.interpolateRound(beforeData[i][0], d[0]);
		return function(t) {
			this.textContent = interpolate(t);
		}
	}
}

function createRandomArray(count) {
	var returnArray = [];
	for (var i = 0; i < count; i++) {
		returnArray.push([Math.floor(Math.random() * 100)]);
	}
	return returnArray;
}
