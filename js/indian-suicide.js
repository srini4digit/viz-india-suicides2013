var causesArray = ["Bankruptcy or Sudden change in Economic","Suspected/Illicit Relation","Cancellation/Non-Settlement of Marriage","Not having Children(Barrenness/Impotency","Illness (Aids/STD)","Cancer","Paralysis","Insanity/Mental Illness","Other Prolonged Illness","Death of Dear Person","Dowry Dispute","Divorce","Drug Abuse/Addiction","Failure in Examination","Fall in Social Reputation","Family Problems","Ideological Causes/Hero Worshipping","Illegitimate Pregnancy","Love Affairs","Physical Abuse (Rape/Incest Etc.)","Poverty","Professional/Career Problem","Property Dispute","Unemployment","Causes Not known","Other Causes (Please Specity)","Bankruptcy or Sudden change in Economic Status","Not having Children (Barrenness/Impotency","Not having Children (Barrenness/Impotency)","Other Causes (Please Specify)"];
var pivotData = new Array();
var tmpData = [];
var prev = "ANDHRA PRADESH";


var w = 1030,
    h = 550,
    p = [10, 50, 50, 20],
    x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
    y = d3.scale.linear().range([0, h - p[0] - p[2]]),
    z = d3.scale.category20();
    
var svg = d3.select("div.svgHolder").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

d3.csv("data/indian-suicide.csv", function(deaths) {

deaths.forEach(function(death){
   if(!prev.match("TOTAL") && death.year == "2012")
    if (prev == death.state){ 
        tmpData[death.cause] = [];
        tmpData[death.cause]["M_T"] = death.M_T;
        tmpData[death.cause]["F_T"] = death.F_T;
        tmpData[death.cause]["G_T"] = death.G_T;
    }
    else {
        pivotData.push({"name": prev , "data" : tmpData});
        prev = death.state;
        tmpData = [];
        tmpData[death.cause] = [];
        tmpData[death.cause]["M_T"] = death.M_T;
        tmpData[death.cause]["F_T"] = death.F_T;
        tmpData[death.cause]["G_T"] = death.G_T;       
    }
    

});

//pivotData.push({"name": prev , "data" : tmpData});

var causes = d3.layout.stack()(causesArray.map(function(cause) {
    return pivotData.map(function(d,i) {
      if(d.data[cause])
        return {x: d.name, y: +d.data[cause]["G_T"], causename : cause};
      else
        return {x: d.name, y: 0, causename : cause};
    });
  }));
    
  // Compute the x-domain (by State) and y-domain (by top).
  x.domain(causes[0].map(function(d) { return d.x; }));
  y.domain([0, d3.max(causes[causes.length - 1], function(d) { return d.y0 + d.y; })]);

// Add a group for each cause.
  var cause = svg.selectAll("g.cause")
      .data(causes)
    .enter().append("svg:g")
      .attr("class", "cause")
      .style("fill", function(d, i) { return z(i); })
      .style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); })
      .on("mouseover",function(d,i){
        // Reduce opacity of other causes 
        d3.selectAll("g.cause").attr("fill-opacity",0.2);
        // Highlight the hovered one
        d3.select(this).attr("fill-opacity",1);
        d3.select(this).attr("cursor","hand");

      })
      .on("mouseout",function(d,i){
        // Opacity normal for all
        d3.selectAll("g.cause").attr("fill-opacity",1);
      });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>"+d.x+":</strong> <span style='color:red'>" + d.causename+" : "+d.y + "</span>";
  });
tip.direction('ne');
svg.call(tip);

// Add a rect for each state and each cause.
  var rect = cause.selectAll("rect")
      .data(Object)
    .enter().append("svg:rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return -y(d.y0) - y(d.y); })
      .attr("height", function(d) { return y(d.y); })
      .attr("width", x.rangeBand())
      /*.on("mouseover",function(d){
        $("#spnInfo").html(d.x + "\t "+d.causename+" : "+d.y);
      }) */
      .on("mouseover",tip.show)
      .on('mouseout', tip.hide);

  // Add a label per state.
  var label = svg.selectAll("text.names")
      .data(x.domain())
    .enter().append("svg:text")
      .attr("x", function(d) { return x(d) + x.rangeBand() / 2; })
      .attr("y", 6)
      .attr("text-anchor", "start")
      .attr("dy", ".71em")
      .text(function(d){return d;})
      .attr("transform", function(d) { var tr = eval(x(d) + x.rangeBand() / 2) ; return "translate("+tr+","+tr+")rotate(270)"; });

  // Add a label per state.
  var label2 = svg.selectAll("text.totals")
      .data(pivotData)
    .enter().append("svg:text")
      .attr("x",  function(d) { return x(d.name) + x.rangeBand() / 2; })
      .attr("y", function(d){ return 10;//return -y(d.data["Total"]["G_T"]) - 10;
      })
      .attr("text-anchor", "middle")
      .text(function(d){return d.data["Total"]["G_T"];
      });

// Add y-axis rules.
  var rule = svg.selectAll("g.rule")
      .data(y.ticks(5))
    .enter().append("svg:g")
      .attr("class", "rule")
      .attr("transform", function(d) { return "translate(0," + -y(d) + ")"; });

  /* rule.append("svg:line")
      .attr("x2", w - p[1] - p[3])
      .style("stroke", function(d) { return d ? "#fff" : "#000"; })
      .style("stroke-opacity", function(d) { return d ? .7 : null; });
  */
  rule.append("svg:text")
      .attr("x", w - p[1] - p[3] + 6)
      .attr("dy", ".35em")
      .text(d3.format(",d"));

});
