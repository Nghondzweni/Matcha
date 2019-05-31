$(function()
{
	$("#search-panel a").click(function(e){
		e.preventDefault();
	});

	var url_string = window.location.href,
		url = new URL(url_string);

	var $distance = $( "#distance-range" ),
		$age		= $( "#age-range" ),
		$popularity = $( "#popularity-range" ),
		sex 		= $("[name=sex]");

	var distance = (url.searchParams.get("distance")) ? url.searchParams.get("distance") : 500;
	var popularity = (url.searchParams.get("popularity")) ? url.searchParams.get("popularity") : 1;
	var age = (url.searchParams.get("age") != null) ? url.searchParams.get("age").split("-") : [18, 50];
	var sex = (url.searchParams.get("sex") != null) ? url.searchParams.get("sex") : 1;

	var params = {
		age: {
			min: age[0],
			max: age[1]
		},
		distance: distance,
		popularity: popularity,
		sex: sex
	};
	
	/*
	* Values by default on the indicator 
	*/
	$(".age-min").text(params.age.min);
	$(".age-max").text(params.age.max);
	$(".distance").text(params.distance);
	$(".popularity").text(params.popularity);
	$("[name=sex]").eq(params.sex-1).attr("checked", true);

	/*
	* Slider configuration
	*/
	$distance.slider({
		value: params.distance,
		orientation: "horizontal",
		max: 1000,
		min: 1,
		range: "min",
		animate: true
	});

	$age.slider({
		range: true,
		min: 18,
		max: 150,
		values: [ params.age.min, params.age.max ],
		slide: function( event, ui ) {
		$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		}
	});

	$popularity.slider({
		value: params.popularity,
		orientation: "horizontal",
		max: 5,
		min: 0,
		range: "min",
		animate: true
	});
	
	/*
	* Handle Slider value
	*/
	$distance.on("slide", function(e, ui){
		var $indicator 		= $(this).parent().parent().find("a").children(".range");
		var value 			= ui.value;
		params.distance 	= value;

		$indicator.children("span").text(value+"km");
	});

	$age.on("slide", function(e, ui){
		var $indicator 	= $(this).parent().parent().find("a").children(".range");
		var min 		= ui.values[0],
			max 		= ui.values[1];
		params.age.min 	= min;
		params.age.max 	= max;

		$indicator.children("span").eq(0).text(min);
		$indicator.children("span").eq(1).text(max);
	});

	$popularity.on("slide", function(e, ui){
		var $indicator 		= $(this).parent().parent().find("a").children(".range");
		var value 			= ui.value;
		params.popularity 	= value;

		$indicator.children("span").text(value);
	});

	$("[name=sex]").on("change", function(){
		params.sex = $(this).val();
	});
	

	/*
	* Search
	*/
	$(".btn-search").click(function(e){
		var url = window.location.origin + "/home?";

		url = url+"age="+params.age.min+"-"+params.age.max+"&distance="+params.distance+"&popularity="+params.popularity+"&sex="+params.sex;
		window.location.href = url;
	});
	

});
