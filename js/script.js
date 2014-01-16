$(".lblRdo").click(function(e){
	
	updateStackedBarChart($(e.currentTarget).find("input[name=rdoGender]").attr("value"));
});