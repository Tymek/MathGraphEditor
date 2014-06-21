var properities = {
	isSimple: function(){
		for(var i = 0; i < graph.E.length; i++){
			if(graph.E[i].type != 0) return false;
		}
		return true;
	},
	rebuild: function(){
		var t = this;
		$("#properities span").text(function(){
			var text = t[$(this).attr("data-properity")]();
			return (text)?"tak":"nie";
		});
	}
}