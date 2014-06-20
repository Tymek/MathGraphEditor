var graph = {
	V: [],
	E: [],
	addVertex: function(label,id){
		this.pushVertex(this.makeVertex(label,id));
	},
	makeVertex: function(label, id){
		if(typeof id === "undefined"){
			for(var j = 0; j < this.V.length+1; j++){
				for(var i = 0; i < this.V.length; i++){
					if(this.V[i].id == j) break;
				}
				if(i >= this.V.length) break;
			}
			id = j;
		}
		if(typeof label === "undefined") label = this.generateID();
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
	},
	addEdge: function(s, t){
		if(s==t) type = -1;
		else type = 0;
		if(typeof s == "number") s = this.searchVertex(s);
		if(typeof t == "number") t = this.searchVertex(t); 
		this.E.push({
			source: s,
			target: t,
			type: type
		});
		this.rebuildEdges(s, t);
	},
	searchVertex: function(id, byLabel){
		if(typeof byLabel === "undefined") byLabel = false;
		for(var i = 0; i < this.V.length; i++){
			if(!byLabel) if(this.V[i].id == id) return this.V[i];
			else if(this.V[i].label == id) return this.V[i];
		}
		return null;
	},
	cutEdges: function(v){
		var E = this.E;
		var tmp = E.filter(function(e) {
			return (e.source === v || e.target === v);
		});
		tmp.map(function(e) {
			E.splice(E.indexOf(e), 1);
		});
	},
	removeEdge: function(e){
		E = this.E;
		E.splice(E.indexOf(e), 1);
		this.rebuildEdges(e.source, e.target);
	},
	rebuildEdges: function(s, t){
		// Coby nie wyświetlało jednej krawędzi na drugiej
		// Ważne zarówno przy dodawaniu nowej krawędzi jak i przy usuwaniu
		if(typeof s == "number") {
			s = this.searchVertex(s);
		}
		s = s.id;
		if(typeof t == "number"){
			t = this.searchVertex(t); 
		}
		t = t.id;
		var i,
			tmp = [];
		for(i = 0; i < this.E.length; i++){
			var e = {s: this.E[i].source.id, t: this.E[i].target.id};
			if(e.s==s && e.t==t) tmp.push([i,true]);
			else if(e.s==t && e.t==s) tmp.push([i,false]);
		}
		//cl(tmp);
		i = 0;
		if(tmp.length == 2) i++; // Utwórz dwie zaokrąglone
		
		for(var j = 0; j < tmp.length; j++){
			if(tmp[j][1] || i == 0){
				this.E[tmp[j][0]].type = i;
			} else {
				this.E[tmp[j][0]].type = (i%2)? i+1 : i-1 ;
			}
			i++;
		}
	},
	getId: function(id, suffix){ // identyfikator wierzchołka (A,B,…,AA,…)
		if(typeof suffix === "undefined") var suffix = "";
		if(id <= 25){
			return String.fromCharCode(id+65) + suffix;
		} else {
			return this.getId(Math.floor(id/25)-1, String.fromCharCode((id%26)+65)) + suffix;
		}
	},
	generateID: function(i){
		if(typeof i === "undefined") var i = 0;
		for(var j = 0; j < this.V.length; j++){
			if(this.V[j].label == this.getId(i)) return this.generateID(i+1);
		}
		return this.getId(i);
	},
	type: 1,
	types: ["undirected", "directed"/* TODO, "mixed"*/],
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
		if(typeof id === "undefined") id = false;
		return (id) ? this.type : this.types[this.type];
	}
}
