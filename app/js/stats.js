(function(d3) {
  'use strict';

  var purples = ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'];
  // colors from http://colorbrewer2.org/#type=sequential&scheme=Purples&n=5

  var width = 250;
  var height = 250;

  d3.csv('/data/states.csv', function(error, data) {
    var width = 400; // this one is extra wide

    var values_list = [];
    data.forEach(function(d) {
      d.value = +d.started;
      values_list.push(d.value);
    });

    var colors = d3.scaleQuantile()
                  .domain(jenks_breaks(values_list, 5))
                  .range(purples);

    var projection = d3.geoAlbersUsa()
                 .translate([width/2, height/2])
                 .scale([400]);
    var path = d3.geoPath()
               .projection(projection);

    var svg = d3.select(".d3#states")
              .append("svg")
              .attr("width", width)
              .attr("height", height);
    d3.json("/data/us-states.json", function(json) {
      for (var i = 0; i < data.length; i++) {
        var dataState = data[i].state;
        var dataValue = parseFloat(data[i].value);
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.name;
          if (dataState == jsonState) {
            json.features[j].properties.value = dataValue;
            break;
          }
        }
      }

      svg.selectAll("path")
         .data(json.features)
         .enter()
         .append("path")
         .attr("d", path)
         .style("fill", function(d) {
            var value = d.properties.value;
            if (value) {
              return colors(value);
            } else {
              return "#ccc";
            }
       });
    })
  });

  d3.csv('/data/ages.csv', function(error, data) {
    var width = 175; // this one is not as wide
    var height = 200;

    var values_list = [];
    data.forEach(function(d) {
      d.label = d.range;
      d.value = +d.count;
      values_list.push(d.value);
    });

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);
    var colors = d3.scaleQuantile()
        .range(purples);
    var max = d3.max(data, function(d) { return d.value; });

    x.domain(data.map(function(d) { return d.label; }));
    y.domain([0, max]);
    colors.domain(jenks_breaks(values_list, 4));

    var svg = d3.select(".d3#ages")
                .append("svg")
                .attr('width', width+20)
                .attr('height', height+20);
    var g = svg.append("g");

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .attr('fill', '#fff')
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y no-text")
        .call(d3.axisLeft(y).ticks(10));

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.label); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr('fill', function(d) {
          return colors(d.value);
      });
  });

  d3.csv('/data/daily.csv', function(error, data) {
    var width = 500; // this one is full width
    var height = 200;

    var user_count = 0;
    data.forEach(function(d) {
        d.date = d3.isoParse(d.date);
        d.new_users = +d.users;
        d.user_count = user_count + d.new_users;
        user_count = d.user_count; // maintain sum
        d.messages = +d.messages;
    });

    var x = d3.scaleTime().range([0, width]);
    var y0 = d3.scaleLinear().range([0, height]);
    var y1 = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxisLeft = d3.axisLeft()
        .scale(y0);

    var yAxisRight = d3.axisRight()
        .scale(y1);

    var line_users = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y0(d.user_count); });

    var line_msgs = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y1(d.messages); });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y0.domain([0, d3.max(data, function(d) { return Math.max(d.user_count); })]);
    y1.domain([0, d3.max(data, function(d) { return Math.max(d.messages); })]);

    var svg = d3.select(".d3#daily")
                .append("svg")
                .attr('width', width+90)
                .attr('height', height+40)
                .append("g")
                .attr("transform",
                  "translate(0,20)");

    svg.append("path")
        .attr("class", "line")
        .style("stroke", purples[0])
        .attr("d", line_users(data));

    svg.append("path")
        .attr("class", "line")
        .style("stroke", purples[2])
        .attr("d", line_msgs(data));

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
/*
    svg.append("g")
        .attr("class", "axis axis--y no-text")
        .call(yAxisLeft);

    svg.append("g")
        .attr("class", "axis axis--y no-text")
        .call(yAxisRight);
*/

    svg.append("text")
        .attr("transform", "translate(" + (width+10) + "," + y0(data[0].users) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", purples[0])
        .text("Users");

    svg.append("text")
        .attr("transform", "translate(" + (width+10) + "," + y1(data[0].messages) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", purples[2])
        .text("Messages");
  });

  var emoji_pie = function(data, selector) {
    data.forEach(function(d) {
      d.count = +d.count;
      d.label = d.emoji;
    });

    var total = d3.sum(data.map(function(d) {
      return d.count;
    }));

    var radius = Math.min(width, height) / 2;
    var colors = d3.scaleOrdinal()
      .range(purples);

    var svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    var arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    var pie = d3.pie()
      .value(function(d) { return d.count / total })
      .sort(function(a, b) { return b.value - a.value; });

    var pieces = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append("g")
        .attr("class", "slice");

    pieces.append('path')
      .attr('d', arc)
      .attr('fill', function(d) {
        return colors(d.data.count / total);
      });

    var factor = 1.4; //offset from center by x
    pieces.append('text')
        .attr("transform", function(d) {
          d.innerRadius = 0;
          d.outerRadius = radius;
          var c = arc.centroid(d);
          return "translate(" + c[0]*factor +"," + c[1]*factor + ")";
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "2em")
      .text(function(d, i) { return d.data.label; });
  }

  d3.csv('/data/weather.csv', function(error, data) {
    return emoji_pie(data, '.d3#weather');
  });

  d3.csv('/data/polling_places.csv', function(error, data) {
    return emoji_pie(data, '.d3#polling_places');
  });
})(window.d3);