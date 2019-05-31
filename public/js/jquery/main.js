$(function(){

	getNotifications();

	$(".bell").click(function(e){
		e.preventDefault();
		$(".bell  ul").toggleClass("visible");
	});

	setInterval(getNotifications, 10000)

	function getNotifications(){

		$.ajax({
			url: "/notifications",
			method: "GET",
			dataType: "json",
			success: function(data)
			{
				var count = parseInt($("#notificationsCount").text());

				if(data.length && count!= data.length)
				{
					$("#notificationsCount").text(data.length)
					$(".bell ul li").remove();
					$.each(data, function(key, value){
						$(".bell ul").append('<li> <a href="'+value.link+'">'+value.message+'</a></li>')
					});
				}
			},
			error: function(err)
			{
				console.log(err);
			}
		});
	};

	$(".star i").click(function(e){
		var url = window.location.href.split("/");
		var userId = url[url.length - 1];

		$.ajax({
			url: "/likes",
			method: "POST",
			data: {userId: userId},
			dataType: "json",
			success: function(data)
			{
				console.log(data.return);
				if (data.return)
					$(".star i").removeClass("far fa-star").addClass("fas fa-star");
				else
					$(".star i").removeClass("fas fa-star").addClass("far fa-star");
			},
			error: function(err)
			{
				console.log(err);
			}
		});
	});

});
