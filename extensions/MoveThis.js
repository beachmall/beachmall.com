$(".stockImageContainer[data-navcat]").each(function(){
	$(this).attr('data-navcat')
	$(this).append(app.u.makeImage())
	})