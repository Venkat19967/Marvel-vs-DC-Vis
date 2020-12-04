var mapSvg;
var lineSvg;
var lineWidth;
var lineHeight;
var lineInnerHeight;
var lineInnerWidth;
var lineMargin = { top: 20, right: 60, bottom: 60, left: 100 };
var mapData;
var timeData;
var Country
var div;
var svgScatter;
var svgColumn;

var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  mapSvg = d3.select('#marvel');
  lineSvg = d3.select('#dc');
  lineWidth = +lineSvg.style('width').replace('px','');
  lineHeight = +lineSvg.style('height').replace('px','');
  lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
  lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;

  console.log("lineWidth:" + String(width));
  console.log("lineHeight:" + String(height));





  svgScatter = d3.select("#marvel").append('g')
    .attr("transform","translate(" + (600 - width)/2 + "," + (600 - height)/2 + ")");
  // .append("svg")
  //   .attr("width", width + margin.left + margin.right + 100)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .attr("transform",
  //         "translate(" +  + "," + 10 + ")");
  // .append("g")
  //   .attr("transform",
  //         "translate(" + margin.left + "," + 60 + ")");


  svgColumn = d3.select("#dc")
  .append('g')
    .attr("transform","translate(" + (600 - width)/2 + "," + (600 - height)/2 + ")");
  // .append("svg")
  //   .attr("width", width + margin.left + margin.right +100)
  //   .attr("height", height + margin.top + margin.bottom + 100)
  // .append("g")
  //   .attr("transform",
  //         "translate(" + margin.left + "," + margin.top + ")");

  d3.json('../data/db.json')
  .then(function (data) {
      console.log(data);

      drawScatter(data);
      drawOther(data);
  });

});

function drawScatter(data) {

  var x = d3.scaleLinear()
  .domain([47000000, 356000000])
  .range([ 0, width ]);

  svgScatter.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).ticks(9.5).tickFormat(d3.format(".2s")) );

// Add Y axis

  var y = d3.scaleLinear()
  .domain([3, 10])
  .range([ height, 0]);

  svgScatter.append("g")
  .call(d3.axisLeft(y));

// Add dots
  svgScatter.append('g')
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function (d) { return x(d.budget); } )
    .attr("cy", function (d) { return y(d.imdb); } )
    .attr("r", 5)
    .style("fill", function(d){
      if(d.company == 'Marvel'){
        return 'red';
      }
      else{
        return 'blue';
      }
    });
}


function drawOther(data){

  // X axis
  var x = d3.scaleBand()
  .range([ 0, width +70 ])
  .domain(data.map(function(d) { return d.movie; }))
  .padding(0.2);
  

  svgColumn.append("g")
  .attr("transform", "translate(0," + height  + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Add Y axis
  var y = d3.scaleLinear()
  .domain([10903312,2797800564])
  .range([ height, 0]);
  svgColumn.append("g")
  .call(d3.axisLeft(y).tickFormat(d3.format(".1s")));

// Bars
  svgColumn.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", function(d) { return x(d.movie); })
  .attr("y", function(d) { return y(d.gross); })
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return height - y(d.gross); })
  .attr( "fill", function(d){
    if(d.company == 'Marvel'){
      return 'red';
    }
    else{
      return 'blue';
    }
  });


}

