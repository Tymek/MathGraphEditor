var properities = {
	isSimple: function(){
		for(var i = 0; i < graph.E.length; i++){
			if(graph.E[i].type != 0) return "nie";
		}
		return "tak";
	},
	rebuild: function(){
		var t = this;
		$("#properities span").text(function(){
			return t[$(this).attr("data-properity")]();
		});
	}
}