$(".lblRdo").click(function(e){
	
	updateStackedBarChart($(e.currentTarget).find("input[name=rdoGender]").attr("value"),"2012");
});

$("a.yearSelection").click(function(e){
	e.preventDefault();
	/* $(this).toggleClass("active"); */
	$("a.yearSelection.active").removeClass("active");
	$(this).addClass("active");
	
	updateStackedBarChart($("input[name=rdoGender]").attr("value"),$(this).attr("data-value"));
});
