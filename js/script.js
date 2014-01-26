$("a.genderSelection").click(function(e){
	e.preventDefault();
	$("a.genderSelection.active").removeClass("active");
	$(this).addClass("active");
	
	updateStackedBarChart();
});

$("a.yearSelection").click(function(e){
	e.preventDefault();
	$("a.yearSelection.active").removeClass("active");
	$(this).addClass("active");
	
	updateStackedBarChart();
});



function getArguments(){
	var data = {};
	data["gender"] = $("a.genderSelection.active").attr("data-value");
	data["year"] = $("a.yearSelection.active").attr("data-value") || "2012";
	data["cause"] = $("#tblLegend tr td.active").html() || null;

	var filterInfo = { "G_T" : "Male and Female", "M_T" : "Only Males" , "F_T":"Only Females"};
	var innerText = '<span class="label label-info">' + "Population :" + filterInfo[data["gender"]] + '</span>';
	innerText = innerText +'<span class="label label-info">' + " Year : " + data["year"] + '</span>';
	if(data["cause"])
		innerText = innerText +'<span class="label label-info">' + " Cause : " + data["cause"] + '</span>';
	$("#spnInfo").html(innerText);

	return data;
}