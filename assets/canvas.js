var canvas = {
	frame: d3.select("#main svg"),//.append("svg"),
//	V: null,
//	E: null,
	radius: 12,
	force: d3.layout.force(),
	step: null,
	line: null,
	defs: function(){
		
		this.frame.append('svg:defs').append('svg:marker')
			.attr('id', 'arrow')
			.attr('refX', 11)
			.attr('refY', 2.5)
			.attr('markerWidth', 5)
			.attr('markerHeight', 5)
			.attr('orient', 'auto')
			.append('svg:path')
			.attr('d', 'M0,0 L5,2.5 L0,5 Z')
			.attr("class", "arrow")
		;
		
		this.frame.append('svg:defs').append('svg:marker')
			.attr('id', 'fullarrow')
			.attr('refX', 3.5)
			.attr('refY', 2.5)
			.attr('markerWidth', 5)
			.attr('markerHeight', 5)
			.attr('orient', 'auto')
			.append('svg:path')
		.attr('d', 'M0,0 L5,2.5 L0,5 Z')
		.attr("class", "arrow")
		;
		
		this.line = this.frame.append('svg:path')
			.attr('class', 'link dragline hidden')
			.attr('d', 'M0,0L0,0')
			.style('marker-end', 'url(#fullarrow)')
		;
		
	},
	construct: function(){
		
		this.defs();
		
		this.E = this.frame.append('svg:g').selectAll('path');
		this.V = this.frame.append('svg:g').selectAll('g');
		
		var C = this;
		this.step = function(){
			C.V.attr("transform", function(d){
				var x = C.force.size()[0] - (C.radius + 1),
					y = C.force.size()[1] - (C.radius + 1);
				x = Math.max(C.radius, Math.min(x, d.x));
				y = Math.max(C.radius, Math.min(y, d.y));
				return "translate("+x+", "+y+")";
			});
			C.E.attr('d', function(d) {
				
				// TODO wykrywanie kolizji
				
				var pS = d.source.x + "," + d.source.y,
					pT = d.target.x + "," + d.target.y;
				if(d.type < 0){ // Pętla
					pT = (d.source.x-1) + "," + (d.source.y-1);
					$(this).attr("style", "");
					var deg = [25,20,30,15,35,45,50,55,60,65];
					deg = deg[((d.type*(-1))-1) % deg.length];
					deg = deg + "," + deg;
					return "M"+pS+" A" + deg + " 0 1,1 " + pT;
				} else if(!d.type){
					return "M" + pS + "L" + pT;
				} else {
					var deg = [180, 105, 83, 76, 50, 320, 128, 92, 78.5, 75];
					deg = deg[(Math.ceil(d.type/2)-1) % deg.length];
					deg = deg + "," + deg;
					return "M"+pS+" A" + deg + " 0 0," + (d.type%2) + " "+pT;
				}
			}).attr("data-type", function(d){return d.type});
		}
		
		this.frame.attr("data-key", -1);
		
		this.force.nodes(graph.V).links(graph.E).on("tick", C.step);

		
		canvas.frame.on('mousedown', mousedown)
			.on('mousemove', mousemove)
			.on('mouseup', mouseup)
			.on('dblclick', dblclick);
		d3.select(window).on('keydown', keydown)
			.on('keyup', keyup).on("mouseup", resetEvent);
		
		
		this.rebuild();
	},
	rebuild: function(){
		
		this.frame.classed("directed", graph.getType(true));
		
		var C = this;
		
		// ID wierzchołków
		this.V = this.V.data(graph.V, function(d){return d.id;});
		
		// Aktualizacja istniejących wierzchołków
		this.V.selectAll('circle')
			// TODO mixed
			//.classed('mixed', function(d) { return d.undirected; })
			.style('fill', function(d){
				//return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); 
				return C.colors(d.id);
			})
		;
		
		// Dodawanie nowych wierzchołków
		var nowy = this.V.enter().append('svg:g');
		
		nowy.append('svg:circle')
			.attr("class", "vertex")
			.attr("r", this.radius)
			.style('fill', function(d){return C.colors(d.id)})
			
			.on("mousedown", function(v){
				if(C.frame.classed("ctrl")){
					C.frame.classed('dragging', true);
				} else {
					d3.event.stopPropagation();
					cl("Vertex "+v.id+" selected");
					canvas.activeVertex = v;
					canvas.line.classed("hidden", false);
					canvas.frame.classed("draw", true);
					//mousemove();
				}
			})
			.on("dblclick", function(v){
				d3.event.stopPropagation();
				if(C.frame.classed("ctrl")){
					graph.removeVertex(v);
					canvas.rebuild();
				}
			})
			.on("mouseup", function(v){
				if(!canvas.frame.classed("ctrl")
				&& canvas.activeVertex){
					if(canvas.activeVertex.id !== v.id){
						cl("Edge to "+v.id);
						graph.addEdge(canvas.activeVertex.id, v.id);
						canvas.rebuild();
					} else if(canvas.frame.classed("offdrag")){
						cl("Loop in "+v.id);
						graph.addEdge(v.id, v.id);
						canvas.rebuild();
					}
				}
			})
			.on("mousemove", function(v){
				if(canvas.activeVertex 
				&& canvas.activeVertex.id === v.id) d3.event.stopPropagation();
				if(canvas.frame.classed("offdrag")){
					//var p = d3.mouse(canvas.frame[0][0]);
					/*p = 'M' + canvas.activeVertex.x+','+canvas.activeVertex.y
					 + 'L' + p[0] + ',' + p[1];*/
					p = "M" + canvas.activeVertex.x+','+canvas.activeVertex.y
					p+= " A"+"22.5,22.5 0 1,1 ";
					if(d3.event.x == canvas.activeVertex.x){
						p+= d3.event.x+1+","+d3.event.y;
					} else {
						p+= d3.event.x+","+d3.event.y;
					}
					canvas.line.attr('d', p);			
				}
			})
		;
		
		nowy.append('svg:text')
			.attr('x', 0)
			.attr('y', 4)
			.attr("class", "label")
			.text(function(d){return d.label})
		;
		
		// Usuwanie wierzchołków
		this.V.exit().remove();
		
		
		// Krawędzie
		this.E = canvas.E.data(graph.E);
		
		var nowa = this.E.enter().append("svg:path")
			.attr("class", "path link")
			.style('marker-end', 'url(#arrow)')
			//.attr("data-type", function(d){return d.type})
		
			.on("click", function(v){
				d3.event.stopPropagation();
				if(C.frame.classed("ctrl")){
					graph.removeEdge(v);
					canvas.rebuild();
				}
			})
		;
		
		this.E.exit().remove();
		
		this.force.start();
		
		properities.rebuild();
		
		cl("Canvas reloaded");
	},
	updateForce: function(p, v){
		this.force.stop();
		if(typeof p === "undefined"){
			this.force.start();
			return;
		}
		if(p === "distance") p = "linkDistance";
		if(typeof v === "undefined") return this.force[p]();
		this.force[p](v);
		this.force.start();
	},
	colors: d3.scale.category10(),
	activeVertex: null,
	activeEdge: null
}