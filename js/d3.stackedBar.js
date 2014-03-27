var causesArray = ["Bankruptcy or Sudden change in Economic","Suspected/Illicit Relation","Cancellation/Non-Settlement of Marriage","Not having Children(Barrenness/Impotency","Illness (Aids/STD)","Cancer","Paralysis","Insanity/Mental Illness","Other Prolonged Illness","Death of Dear Person","Dowry Dispute","Divorce","Drug Abuse/Addiction","Failure in Examination","Fall in Social Reputation","Family Problems","Ideological Causes/Hero Worshipping","Illegitimate Pregnancy","Love Affairs","Physical Abuse (Rape/Incest Etc.)","Poverty","Professional/Career Problem","Property Dispute","Unemployment","Causes Not known","Other Causes (Please Specity)","Bankruptcy or Sudden change in Economic Status","Not having Children (Barrenness/Impotency","Not having Children (Barrenness/Impotency)","Other Causes (Please Specify)"];
var statesArray = {"ANDHRA PRADESH" : "AP","ARUNACHAL PRADESH" : "AR","ASSAM" : "AS","BIHAR" : "BR","CHHATTISGARH" : "CT","GOA" : "GA","GUJARAT" : "GJ","HARYANA" : "HR","HIMACHAL PRADESH" : "HP","JAMMU & KASHMIR" : "JK","JHARKHAND" : "JH","KARNATAKA" : "KA","KERALA" : "KL","MADHYA PRADESH" : "MP","MAHARASHTRA" : "MH","MANIPUR" : "MN","MEGHALAYA" : "ML","MIZORAM" : "MZ","NAGALAND" : "NL","ODISHA" : "OR","PUNJAB" : "PB","RAJASTHAN" : "RJ","SIKKIM" : "SK","TAMIL NADU" : "TN","TRIPURA" : "TR","UTTAR PRADESH" : "UP","UTTARAKHAND" : "UT","WEST BENGAL" : "WB","A & N ISLANDS" : "AN","CHANDIGARH" : "CH","D & N HAVELI" : "DN","DAMAN & DIU" : "DD","DELHI (UT)" : "DL","LAKSHADWEEP" : "LD","PUDUCHERRY" : "PY"};
var statesAbbrArray =  {"AP" : "ANDHRA PRADESH" , "AR" : "ARUNACHAL PRADESH" , "AS" : "ASSAM" , "BR" : "BIHAR" , "CT" : "CHHATTISGARH" , "GA" : "GOA" , "GJ" : "GUJARAT" , "HR" : "HARYANA" , "HP" : "HIMACHAL PRADESH" , "JK" : "JAMMU & KASHMIR" , "JH" : "JHARKHAND" , "KA" : "KARNATAKA" , "KL" : "KERALA" , "MP" : "MADHYA PRADESH" , "MH" : "MAHARASHTRA" , "MN" : "MANIPUR" , "ML" : "MEGHALAYA" , "MZ" : "MIZORAM" , "NL" : "NAGALAND" , "OR" : "ODISHA" , "PB" : "PUNJAB" , "RJ" : "RAJASTHAN" , "SK" : "SIKKIM" , "TN" : "TAMIL NADU" , "TR" : "TRIPURA" , "UP" : "UTTAR PRADESH" , "UT" : "UTTARAKHAND" , "WB" : "WEST BENGAL" , "AN" : "A & N ISLANDS" , "CH" : "CHANDIGARH" , "DN" : "D & N HAVELI" , "DD" : "DAMAN & DIU" , "DL" : "DELHI (UT)" , "LD" : "LAKSHADWEEP" , "PY" : "PUDUCHERRY"};
var pivotData = new Array();
var tmpData = [];
var prev = "ANDHRA PRADESH";
var causes,cause,rect,label2;

var w = 1030,
    h = 750,
    p = [20, 50, 50, 20],
    h_usable = h - p[0] - p[2],
    w_usable = w - p[1] - p[3],
    x = d3.scale.ordinal().rangeRoundBands([0, w_usable]),
    y = d3.scale.linear().range([h_usable,0]),
    z = d3.scale.category20c().domain(causesArray);

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).ticks(5).orient("right");

var svg = d3.select("div.svgHolder").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("transform", "translate(" + p[3] + ","+p[0]+")");
    
d3.csv("data/indian-suicide.csv", function(deaths) {

deaths.forEach(function(death){

   if(!prev.match("TOTAL"))
    if (prev == death.state){ 
      
        if(!tmpData[death.year]) tmpData[death.year] = [];
        tmpData[death.year][death.cause] = [];
        tmpData[death.year][death.cause]["M_T"] = death.M_T;
        tmpData[death.year][death.cause]["F_T"] = death.F_T;
        tmpData[death.year][death.cause]["G_T"] = death.G_T;
    }
    else {
        pivotData.push({"name": prev , "stateCode" : statesArray[prev], "data" : tmpData});
        prev = death.state;
        tmpData = [];
        tmpData[death.year] = [];
        tmpData[death.year][death.cause] = [];
        tmpData[death.year][death.cause]["M_T"] = death.M_T;
        tmpData[death.year][death.cause]["F_T"] = death.F_T;
        tmpData[death.year][death.cause]["G_T"] = death.G_T;
    }
  
});

pivotData.push({"name": prev ,"stateCode" : "GA", "data" : tmpData});

updateStackedBarChart("G_T","2012");
drawLegend();

});


function updateStackedBarChart(){
// arg1 = M/F/ALL arg2=year arg3 = Cause
var args = getArguments();
arg1 = args.gender;
arg2 = args.year;
arg3 = args.cause;

 if(!arg3) {
  causes = d3.layout.stack()(causesArray.map(function(cause) {
    return pivotData.map(function(d,i) {
      if(d.data[arg2] && d.data[arg2][cause])
        return {x: statesArray[d.name], y: +(d.data[arg2][cause][arg1]), causename : cause};
      else
        return {x: statesArray[d.name], y: 0, causename : cause};
    
    });
  }));
 }
 else
 { var filterCause = [arg3];
  
  causes = d3.layout.stack()(filterCause.map(function(cause) {
    return pivotData.map(function(d,i) {
      if(d.data[arg2] && d.data[arg2][cause])
        return {x: statesArray[d.name], y: +(d.data[arg2][cause][arg1]), causename : cause};
      else
        return {x: statesArray[d.name], y: 0, causename : cause};
    
    });
  }));
  }
  // Compute the x-domain (by State) and y-domain (by top).
  x.domain(causes[0].map(function(d) { return d.x; }));
  y.domain([0, d3.max(causes[causes.length - 1], function(d) { return d.y+d.y0; })]);

  // Add a group for each cause.
  cause = svg.selectAll("g.cause")
      .data(causes,function(d){return d[0].causename + d[0].y;});

  cause.enter().append("svg:g")
      .attr("class", "cause")
      .style("fill", function(d, i) { return z(d[0].causename); })
      .style("stroke", function(d, i) { return d3.rgb(z(d[0].causename)).darker(); });
  cause.exit().remove();
      

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>"+d.x+":</strong> <span style='color:aqua'>" + d.causename+" : "+d.y + "</span>";
  });
tip.direction('n');
svg.call(tip);

// Add a rect for each state and each cause.
cause.selectAll("rect").remove(); // Fixes the bug of stuck rectangles
rect = cause.selectAll("rect")
      .data(Object,function(d){return d.x;});

rect.enter().append("svg:rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return 0;/* return h_usable - y(d.y0); */ })
      .attr("height", 0)
      .attr("width", x.rangeBand())
      .on("mouseover",tip.show)
      .on('mouseout', tip.hide)
      .attr("transform",function(d){return "translate(0,"+eval(y(d.y0) - h_usable + y(d.y))+")"; })
      .transition()
      .delay(function(d, i) { return i * 10; })
      .duration(2000)
      .ease("elastic")
      .attr("height", function(d) { return h_usable - y(d.y); });

// Remove all old labels
svg.selectAll("text.totals").remove();
  // Add a label per state.
barLabels = svg.selectAll("text.totals")
      .data(pivotData);

barLabels.enter().append("svg:text")
        .attr("x",  function(d) { return x(d.stateCode) + x.rangeBand() / 2; })
        .attr("y", function(d){ var cause = (arg3) ? arg3 : "Total"; 
                                if(d.data[arg2]) return y(d.data[arg2][cause][arg1]) - 5;
                                 else return y(0);
                              })
        .attr("text-anchor", "middle")
        .attr("class","totals")
        .text(function(d){ var cause = (arg3) ? arg3 : "Total";
                                if(d.data[arg2]) return d.data[arg2][cause][arg1];
                                 else return 0;
                         });

barLabels.exit().remove();

svg.selectAll("g.x.axis").remove();
svg.selectAll("g.y.axis").remove();

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+h_usable+")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .attr("transform","translate("+eval(w - p[1] - p[3])+",0)")
    .call(yAxis);      

d3.selectAll(".x.axis text")
        .on("mouseover",function(){
          d3.selectAll(".x.axis text").style("opacity",0);
          var high = d3.select(this).style("opacity",1);
          d3.select(this).text(statesAbbrArray[high.text()]);
          high.classed({'active' : true});
          high.style("border","solid thin #ccc");
        })
        .on("mouseout",function(){
          d3.selectAll(".x.axis text").style("opacity",1);
          var high = d3.select(".x.axis text.active");
          high.attr("transform","scale(1)");
          high.text(statesArray[high.text()]);
          high.classed({'active' : false});
          
        });
}

function drawLegend(){
   d3.select("#tblLegend").selectAll("tr")
    .data(causesArray)
    .enter()
      .append("tr")
      .append("td")
      .text(function(d,i){ return d;})
      .style("border-left",function(d,i){ return "solid 5px "+z(d);})
      .style("padding-left", "5px")
      .style("height", "25px")
      .on("mouseover",function(d,i){
        if($("#tblLegend tr td.active").length == 0 ) {
          // Reduce opacity of other causes 
          var tmp = d3.selectAll("g.cause").attr("fill-opacity",0.2);
          // Highlight the hovered one
          d3.select(tmp[0][i]).attr("fill-opacity",1);
          d3.selectAll("#tblLegend tr td").style("opacity",0.2);
          d3.select(this).style("opacity",1);
        }
        
      })
      .on("mouseout",function(d,i){
        if($("#tblLegend tr td.active").length == 0 ) {
          d3.selectAll("g.cause").attr("fill-opacity",1);
          d3.selectAll("#tblLegend tr td").style("opacity",1);  
        }

        
      })
      .on("click", function(d,i){
        // If clicked on an active link, remove the filter
        if($(this).hasClass("active")) $(this).removeClass("active");
        else{
            // Reduce opacity of all others
          d3.selectAll("#tblLegend tr td").style("opacity",0.2);
          d3.select(this).style("opacity",1);

          if($("#tblLegend tr td.active").length == 0 ) $(this).addClass("active");
          else {
            $("#tblLegend tr td.active").each(function(){ $(this).removeClass("active")});
            $(this).addClass("active");
            }
        }
        
        updateStackedBarChart();

      })
      ;
  
}