var graph = {
	V: [],
	E: [],
	addVertex: function(label,id){
		this.pushVertex(this.makeVertex(label,id));
	},
	makeVertex: function(label, id){
		if(id === undefined){
			for(var j = 0; j < this.V.length+1; j++){
				for(var i = 0; i < this.V.length; i++){
					if(this.V[i].id == j) break;
				}
				if(i >= this.V.length) break;
			}
			id = j;
		}
		if(label === undefined) label = this.generateID();
		return {id:id, label: label};
	},
	pushVertex: function(v){
		this.V.push(v);
	},
	removeVertex: function(v){
		cl("Remove vertex");
		this.cutEdges(v);
		V = this.V;
		V.splice(V.indexOf(v), 1);
		rebuild();
	},
	addEdge: function(s, t){
		if(s==t) type = -1; // loop
		else { // okreœl ile jest krawêdzi "na tej samej trasie"
			var source = [];
			var target = [];
			var type = $.grep(this.E, function(n, i){
				if(n.source.id == s && n.target.id == t){
					source.push(i);
					return true;
				}
				if(n.source.id == t && n.target.id == s){
					target.push(i);
					return true;
				}
				return false;
			});
			if(type.length == 1){
				if(source.length == 1){
					this.E[source[0]].type = 2;
				} else {
					this.E[target[0]].type = 1;
				}
				type = 1;
				/*
				for(var i = 0; i<tmp.length; i++){
					this.E[tmp[i]].type = type.length;
				}*/
			} else if(type.length == 0){
				type = 0;
			} else {
				type = type.length + 1;
			}
		}
		this.E.push({source: this.V[s], target: this.V[t], type: type});
	},
	cutEdges: function(v){
		var E = this.E;
		var tmp = E.filter(function(e) {
			return (e.source === v || e.target === v);
		});
		tmp.map(function(e) {
			E.splice(E.indexOf(e), 1);
		});
		rebuild();
	},
	removeEdge: function(e){
		E = this.E;
		E.splice(E.indexOf(e), 1);
		rebuild();
		// TODO sprawdzanie struktury krawêdzi równoleg³ych
	},
	type: 0,
	types: ["undirected", "directed"/* TODO, "mixed"*/],
	getId: function(id, suffix){ // identyfikator wierzcho³ka (A,B,…,AA,…)
		if(suffix === undefined) var suffix = "";
		if(id <= 25){
			return String.fromCharCode(id+65) + suffix;
		} else {
			return this.getId(Math.floor(id/25)-1, String.fromCharCode((id%26)+65)) + suffix;
		}
	},
	generateID: function(i){
		if(i === undefined) var i = 0;
		for(var j = 0; j < this.V.length; j++){
			if(this.V[j].label == this.getId(i)) return this.generateID(i+1);
		}
		return this.getId(i);
	},
	setType: function(type){
		if(typeof type === 'number'){
			type = this.types[type];
			return;
		}
		switch(type){
			case "directed":
			this.type = 1;
				// TODO
			break;
			/*case "mixed":
				this.type = 2;
				
			break;*/
			default:
			this.type = 0;
		}
	},
	getType: function(id){
		if(id === undefined) id = false;
		return (id) ? this.type : this.types[this.type];
	}
}
