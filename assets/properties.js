var properities = {
	isSimple: function(){
		for(var i = 0; i < graph.E.length; i++){
			if(graph.E[i].type != 0) return "nie";
		}
		return "tak";
	},
	isConnected: function(){
		this.visited = new Array(graph.V.length);

		for(var i = 0; i < this.visited.length; ++i)
			this.visited[i] = 0;

		this.visit(0);

		for(var i = 0; i < this.visited.length; ++i)
			if (this.visited[i] == 0) return "nie";
		return "tak";
	},
	visit: function(){
		var id = arguments[0];
		this.visited[id] = 1;

		for(var k = 0; k < graph.E.length; ++k){
			if(graph.E[k].source.id == id && this.visited[graph.E[k].target.id] == 0)
				this.visit(graph.E[k].target.id);
			else if(graph.E[k].target.id == id && this.visited[graph.E[k].source.id] == 0)
				this.visit(graph.E[k].source.id);
		}
	},
	rebuild: function(){
		var t = this;
		$("#properities span").each(function(){
			//cl(typeof t[$(this).attr("data-properity")]);
			if(typeof t[$(this).attr("data-properity")] !== "function"){
				$(this).parent().hide();
				return;
			}
			var val = t[$(this).attr("data-properity")]();
			if(typeof val === "undefined" || val == "nie dotyczy"){
				$(this).parent().hide();
			} else {
				$(this).parent().show();
				$(this).text(val);
			}
			//return t[$(this).attr("data-properity")]();
		});
	}
}