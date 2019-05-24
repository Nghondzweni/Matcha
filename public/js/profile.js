$( function() {


	if (navigator.geolocation)
	{
		navigatnor.geolocatnion.getCurrentPosition(function(position){
			console.log("Latitude: " +position.coords.latitude);
			console.log("Longitude: " + position.coords.longitude);
		});
	}
	else
		noGeolocation();
	

	var res = {
		result: null,
		position: null
	}

	var img = $("#demo").croppie({
		enableExif: true,
		viewport: {
			width: 300,
			height: 300,
			type: 'square'
		},
		boundary: {
			width: 400,
			height: 400
		}
	});

	$("#profile-img img").click(function(e) {
		var url = $(this).attr("src");
		var num = $(this).attr("data-number");
		res.position = $("#profile-img img").index(this);
		img.croppie("bind", {
			url: url
		}).then(function(){
			console.log("Uploaded");
		});

		$(".cover").fadeIn();
	});

	$(".upload_img").on("change", function(e)
	{

		var obj = new FileReader();
		obj.onload = function(data)
		{
			img.croppie("bind", {
				url: data.target.result
			}).then(function(){
				console.log("Uploaded");
			});
		}
		obj.readAsDataURL(this.files[0]);

	});

	$("#upload").click(function(){ $(".upload_img").click();});

	$("#crop").click(function(e){
		img.croppie("result", {
			type: 'canvas',
			size: 'viewport',
			format: "jpeg",
			quality: .5
		}).then(function(response){
			$("#img_preview").css({border: "none"});
			$("#img_preview").attr("src",response);
			res.result = response;
		});
	})

	$("#save").click(function(){
		console.log(res.position);
		$.ajax({
		  url: "/profile",
		  method: 'POST',
		  data: {action:"update-info", position: res.position, img: res.result},
		  success: function(res)
		  {
			  console.log(res);
		  }
	  });

	})



	$("#close").click(function(){ $(".cover").fadeOut();});




	/*========================
		- DISTANCE SLIDER
	========================*/
	var slider = $( "#master" );
	slider.slider({
		min: 18,
		value: $(".distance-km").attr("data-value"),
		max: 1000,
		range: true,
		range: "min"
	});
	slider.on("slide", function(e, ui)
	{
	  $(".distance-km span").html(ui.value+"km");
	  sendData();
	});


	/*========================
		- AGE RANGE SLIDER
	========================*/
	var range = $( "#slider-range" );
	range.slider({
		range: true,
		min: 18,
		max: 150,
		values: [$(".min").text(), $(".max").text()],
	});
	range.on("slide", function(e, ui){
		var min = ui.values[0];
		var max = ui.values[1];

		$(".min").text(min);
		$(".max").text(max);
		sendData();
	});

	$("input[name=sex]").change(sendData);
	$("input[name=interest]").change(sendData);

	/*========================
		- HELPER FUNCTIONS
	========================*/

	function getInterests(e)
	{
		var interests = [];
		var inter = $("input[name=interest]");
		$.each(inter, function(key, val){
			if (val.checked)
				interests.push(val.value);
		})
		return interests;
	};

	function sendData()
	{
		var preferences = {
	 	  gender: $("input[name=sex]:checked").val(),
	 	  distance: $(".distance-km span").text().split("km")[0],
	 	  visible: false,
	 	  interests: JSON.stringify(getInterests()),
	 	  ages: JSON.stringify([$(".min").text(), $(".max").text()]),
		  action: "update-preferences"
	   };
		$.ajax({
 		  url: "/profile",
 		  method: 'POST',
 		  data: preferences,
 		  success: function(res)
 		  {
 			  console.log(preferences);
 		  }
 	  });
	}


	$("table td input, h2 input, textarea").blur(function(e) {

		var field = $(this).attr("name");
		var value = $(this).val();
		var valid = 1;

		var data = {
			field: field,
			value: value,
			action: "update-info"
		};

		if (field == "confirm-password")
		{
			if (value.trim() != $("input[name=password]").val().trim())
				valid = 0;
		}
		if (field != "password" && valid == 1)
		{
			$.ajax({
				url: "/profile",
				method: 'POST',
				data: data,
				success: function(res)
				{
					console.log(res);
				}
			});
		}
	});

	$(".delete-account").click(function(e) {
		$.ajax({
			url: "/profile",
			method: 'POST',
			data: {action: "delete-account"},
			success: function(res)
			{
				if (res.success ==  1)
					window.location.href = "/";
			}
		});
	});



} );
