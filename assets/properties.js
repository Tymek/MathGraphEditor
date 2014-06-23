var properities = {
	isSimple: function(){
		for(var i = 0; i < graph.E.length; i++){
			if(graph.E[i].type != 0) return "nie";
		}
		return "tak";
	},
	isConnected: function(){
		this.visited = new Array();
		
		for(var i = 0; i < graph.V.length; ++i)
			this.visited[graph.V[i].id] = 0;
		
		this.visit(graph.V[0].id);
		
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
	isPlanar: function(){
		if(this.isSimple() == "nie") return "nie dotyczy";
		if(this.isConnected() == "tak"){
			if(graph.E.length <= 3 * graph.V.length - 6)
			{
				var min = 0;
				for(var i = 1; i < graph.V.length; ++i)
				if(graph.V[i].weight < graph.V[min].weight)
				min = i;
				if(graph.V[min].weight <= 5)
				return "tak";
			}
		}
		return "nie";
	},
	isEulerian: function(){
		if(this.isConnected() == "tak"){
			var odd = 0;
			for(var i = 0; i < graph.V.length; ++i)
				if(graph.V[i].weight % 2 == 1)
					++odd;
			if(odd == 0) return "tak";
			if(odd == 2){
				if(graph.type == 0) return "tak";
				return "półeulerowski";
			}
		}
		return "nie";
	},
	isTree: function(){
		if(this.isSimple() == "tak" && this.isConnected() == "tak"
		&& graph.V.length == (graph.E.length+1))
			return "tak";
		return "nie";
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