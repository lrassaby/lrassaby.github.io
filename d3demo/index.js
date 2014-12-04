function draw() {
  var width = 400, height = 300;
  var curr = 0;
  var options = [
    {
      "color": "green",
      "x": width/4,
      "y": height/4,
      "width": width/2,
      "height": height/2,
      "text": "Don't click me!",
      "cx": width/2,
      "cy": height/2
    },
    {
      "color": "blue",
      "x": width/3,
      "y": height/3,
      "width": width/3,
      "height": height/3,
      "text": "Go away!",
      "cx": width/2,
      "cy": height/2
    },
    {
      "color": "purple",
      "x": 3 * width/8,
      "y": 3 * height/8,
      "width": width/4,
      "height": height/4,
      "text": "Nooo!",
      "cx": width/2,
      "cy": height/2
    }
  ];

  var svg = d3.select("#vis").append("svg")
                             .attr("width", width)
                             .attr("height", height);

  var rect = svg.append("rect")
                .attr("x", options[curr].x)
                .attr("y", options[curr].y)
                .attr("width", options[curr].width)
                .attr("height", options[curr].height)
                .attr("fill", options[curr].color)
                .on('click', function(){
                  curr = (curr + 1) % options.length;
                  d3.select(this).transition()
                                 .attr("x", options[curr].x)
                                 .attr("y", options[curr].y)
                                 .attr("width", options[curr].width)
                                 .attr("height", options[curr].height)
                                 .attr("fill", options[curr].color);
                  d3.select("#button_text").transition()
                                 .text(options[curr].text);
                });

  var text = svg.append("text")
                .attr("id", "button_text")
                .attr("x", options[curr].cx)
                .attr("y", options[curr].cy)
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .attr("font-family", "Helvetica")
                .text(options[curr].text);
}

$(document).ready(function() {
  draw();
});
