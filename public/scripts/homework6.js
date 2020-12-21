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

  // console.log("lineWidth:" + String(width));
  // console.log("lineHeight:" + String(height));


  svgColumn = d3.select("#marvel").append('g')
  .attr("transform","translate(" + ((600 - width)/2 - 40) + "," + (600 - height)/2 + ")");

  svgScatter = d3.select("#dc")
  .append('g')
  .attr("transform","translate(" + (600 - width)/2 + "," + (600 - height)/2 + ")");

    
  div = d3.select("body").append("div")
  .attr("class", "tooltip-map")
  .style("opacity", 0);


  d3.json('../data/db.json')
  .then(function (data) {
      console.log(data);

      drawScatter(data);
      drawOther(data);
  });

});


function formatTick(d) {
  const s = (d / 1e6);
  return  `$${s}M`;
}


function drawScatter(data) {

  var x = d3.scaleLinear()
  .domain([47000000, 356000000])
  .range([ 0, width ]);

  svgScatter.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).ticks(9.5).tickFormat(formatTick) );

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
    })
    .on('mouseover', function(d,i) {
      // console.log('mouseover on ' +yearData[d.properties.name]);
      d3.select(this).transition()
        .attr('class', 'countrymap_hover');
      div.transition()
        .duration(50)
        .style("opacity", 1);
      div.html(`Movie: ${d.movie}</br>IMDB rating: ${d.imdb}</br>Year: ${d.year}</br>Budget: ${d.budget}</br>`)
      .style("left", (d3.event.pageX) + 10 + "px")
      .style("top", (d3.event.pageY) + 10 + "px");
    })
    .on('mousemove',function(d,i) {
      // console.log('mousemove on ' + d.properties.name);
      div.html(`Movie: ${d.movie}</br>IMDB rating: ${d.imdb}</br>Year: ${d.year}</br>Budget: ${d.budget}</br>`)
      .style("left", (d3.event.pageX) + 10 + "px")
      .style("top", (d3.event.pageY) + 10 + "px");
    })
    .on('mouseout', function(d,i) {
      // console.log('mouseout on ' + d.properties.name);
      d3.select(this).transition()
               .attr('class', 'countrymap');
      div.transition()
               .duration(50)
               .style("opacity", 0);
    });

    svgScatter.append('line')
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0)
    .attr("transform", "translate(0," + 103 + ")");

    svgScatter.append('line')
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", width-10)
    .attr("transform", "translate("+ 170 + "," + 0 + ")");

    svgScatter.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -height/2)
        .attr("font-weight",700)
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .text("IMDB ratings")

    svgScatter.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.top + 27)
        .attr("font-weight",700)
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .text("Budget of the movies - Millions(M) in $");

    svgScatter.append("rect")
        .attr("x", width+5)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", 'red');

    svgScatter.append("text")
        .attr("x", width + 25)
        .attr("y", 10)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .text("Marvel Movies");

    svgScatter.append("rect")
        .attr("x", width +5)
        .attr("y", 25)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", 'blue' );

      svgScatter.append("text")
        .attr("x", width + 25)
        .attr("y", 35)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .text("DC Movies");
}



function drawOther(data){

  // X axis
  var x = d3.scaleBand()
  .range([ 0, width + 100 ])
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
  .call(d3.axisLeft(y).tickFormat(formatTick));

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
  })
  .on('mouseover', function(d,i) {
    // console.log('mouseover on ' +yearData[d.properties.name]);
    d3.select(this).transition()
      .attr('class', 'countrymap_hover');
    div.transition()
      .duration(50)
      .style("opacity", 1);
    div.html(`Movie: ${d.movie}</br>IMDB rating: ${d.imdb}</br>Year: ${d.year}</br>Gross revenue: ${d.gross}</br>Budget: ${d.budget}`)
    .style("left", (d3.event.pageX) + 10 + "px")
    .style("top", (d3.event.pageY) + 10 + "px");
  })
  .on('mousemove',function(d,i) {
    // console.log('mousemove on ' + d.properties.name);
    div.html(`Movie: ${d.movie}</br>IMDB rating: ${d.imdb}</br>Year: ${d.year}</br>Gross revenue: ${d.gross}</br>Budget: ${d.budget}`)
    .style("left", (d3.event.pageX) + 10 + "px")
    .style("top", (d3.event.pageY) + 10 + "px");
  })
  .on('mouseout', function(d,i) {
    // console.log('mouseout on ' + d.properties.name);
    d3.select(this).transition()
             .attr('class', 'countrymap');
    div.transition()
             .duration(50)
             .style("opacity", 0);
  });



  svgColumn.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+ 5)
        .attr("x", -height/2)
        .attr("font-weight",700)
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .text("Gross revenue across the globe - Millions(M) in $")

    svgColumn.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2 + 20)
        .attr("y", height + margin.top + 100)
        .attr("font-weight",700)
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .text("Names of the movies");

    svgColumn.append("rect")
        .attr("x", width+15)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", 'red');

    svgColumn.append("text")
        .attr("x", width + 35)
        .attr("y", 10)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .text("Marvel Movies");

    svgColumn.append("rect")
        .attr("x", width +15)
        .attr("y", 25)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", 'blue' );

      svgColumn.append("text")
        .attr("x", width + 35)
        .attr("y", 35)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .text("DC Movies");
}

