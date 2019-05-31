$(function(){



	/*============================================
		- GET ALL MESSAGES FROM SPECIFIC CHAT
	============================================*/

	var tmp = {oldLength: 0, newLength: 0}

	function getChat(receiverId)
	{
		$.ajax({
			url: "/inbox/"+receiverId,
			method: "GET",
			success: function(res)
			{
				$.each(res, function(index, message){
					var _class = (message.sender == receiverId) ? "other" : "me";
					$(".messages").append('<div class="message clearfix '+_class+'"><p>'+message.message+'</p></div>');
				});
				console.log(res);
			},
			error: function(err){
				console.log(err);
			}
		});
	}

	var chatCount = {old:0, new: 0};




	/*====================================
		- GET ALL MESSAGES
	====================================*/
	getAllChats();
	setInterval(updateChatList, 1000);

	function getAllChats()
	{
		$.ajax({
			url: "/inbox?getAllMessages=true",
			method: "GET",
			success: function(res)
			{
				console.log(res);
				if (res.msj.length)
				{
					$.each(res.msj, function(key, chat){
						var id = chat[0],
							time = getDate(chat[1]);
						if (key == 0)
							getChat(id);

						$.each(res.users, function(key, user){
							if (id === user._id)
							{
								if (key == 0)
								{
									$("#chat-box").attr("data-receiver", user._id);
									$(".user-info img").attr("src", user.images[0]);
									$(".user-info strong").text(user.username);
								}

								$("#messages-list").append('<div class="message clearfix" data-userid="'+user._id+'">\
									<img src="'+user.images[0]+'" alt="">\
									<span class="name"><b>'+user.username+'</b></span>\
									<small class="last-msj"><i class="far fa-calendar-alt"></i> '+time.day+'/'+ time.month + '/' + time.year +' \
									<i class="far fa-clock"></i>'+time.hour+':'+ time.min + ':' + time.sec +'</small>\
								</div>');
								$(".message").click(openNewChat);
							}
						});

					})
				}
			},
			error: function(err){
				console.log(err);
			}
		});
	}

	function updateChatList()
	{
		$.ajax({
			url: "/inbox?getAllMessages=true",
			method: "GET",
			success: function(res)
			{
				var topChat = $(".message").first().attr("data-userid"),
					openedChat = $("#chat-box").attr("data-receiver");

				if (res.msj.length)
				{
					if (topChat != res.msj[0][0])
					{
						var id = res.msj[0][0],
							time = getDate(res.msj[0][1]);
						$.each(res.users, function(key, user){
							if (id === user._id)
							{
								$("#messages-list").prepend('<div class="message clearfix" data-userid="'+user._id+'">\
									<img src="'+user.images[0]+'" alt="">\
									<span class="name"><b>'+user.username+'</b></span>\
									<small class="last-msj"><i class="far fa-calendar-alt"></i> '+time.day+'/'+ time.month + '/' + time.year +' \
									<i class="far fa-clock"></i>'+time.hour+':'+ time.min + ':' + time.sec +'</small>\
								</div>');
								return;
							}
						});
					}
				}
			},
			error: function(err){
				console.log(err);
			}
		});
	}

	function openNewChat()
	{
		var userId = $(this).attr("data-userid"),
			img	= $(this).children("img").attr("src"),
			name = $(this).children("span.name").children("b").text();

		var userInfo = $(".user-info");


		userInfo.children("img").attr("src", img);
		userInfo.children("strong").text(name);
		$("#chat-box").attr("data-receiver", userId);
		$(".messages").html("");
		getChat(userId);
	}

	function getDate(date)
	{
		var d = new Date(date);
		var date = {
			day: d.getDate(),
			month: d.getMonth() + 1,
			year: d.getFullYear(),
			hour: d.getHours(),
			min: d.getMinutes() + 1,
			sec: d.getSeconds() + 1
		};

		return date;
	}


	$(".contact").click(openNewChat);
	/*====================================
		- SEND MESSAGES
	====================================*/
	$("#message").keyup(function (e)
	{
		var message = $(this).val().trim();
		var receiverId = $("#chat-box").attr("data-receiver");


		if (e.keyCode == 13)
		{
			$.ajax({
				url: "/inbox",
				method: "POST",
				data: {message: message, receiverId: receiverId},
				success: function(res)
				{
					$("#message").val("");
				},
				error: function(err){
					console.log(err);
				}
			});
		}

	});


	/*====================================
		- SEND MESSAGES
	====================================*/
	function instantMessage(){
		var receiverId = $("#chat-box").attr("data-receiver");
		$.ajax({
			url: "/inbox/"+receiverId,
			method: "GET",
			success: function(res)
			{
				chatCount.new = res.length;
				if (chatCount.new > chatCount.old)
				{
					var last = (chatCount.new - 1),
						msj = res[last].message,
						_class = (res[last].sender == receiverId) ? "other" : "me";

					$(".messages").append('<div class="message clearfix '+_class+'"><p>'+msj+'</p></div>');
					chatCount.old = chatCount.new;
				}
			},
			error: function(err){
				console.log(err);
			}
		});
	}

	setInterval(instantMessage, 1000);


})
