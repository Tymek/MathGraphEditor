var canvas = {
	frame: d3.select("#main").append("svg"),
//	V: null,
//	E: null,
	radius: 12,
	force: d3.layout.force(),
	step: null,
	defs: function(){
		
		this.frame.append('svg:defs').append('svg:marker')
			.attr('id', 'arrow')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', 21)
			.attr('markerWidth', 5)
			.attr('markerHeight', 5)
			.attr('orient', 'auto')
			.append('svg:path')
			.attr('d', 'M0,-5L10,0L0,5')
			.attr("class", "arrow")
		;
		
		/* Strza³ki koñcowe
		svg.append('svg:defs').append('svg:marker')
			.attr('id', 'start-arrow')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', 4)
			.attr('markerWidth', 3)
			.attr('markerHeight', 3)
			.attr('orient', 'auto')
			.append('svg:path')
			.attr('d', 'M10,-5L0,0L10,5')
			.attr('fill', '#000')
		;*/
		
	},
	construct: function(){
		
		this.E = this.frame.append('svg:g').selectAll('path');
		this.V = this.frame.append('svg:g').selectAll('g');
		
		var C = this;
		this.step = function(){
			C.V.attr("transform", function(d){
				var x = C.force.size()[0] - (C.radius + 1),
					y = C.force.size()[1] - (C.radius + 1);
				d.x = Math.max(C.radius, Math.min(x, d.x));
				d.y = Math.max(C.radius, Math.min(y, d.y));
				return "translate("+d.x+", "+d.y+")";
			});
			C.E.attr('d', function(d) {
				var dx = d.target.x - d.source.x,
				dy = d.target.y - d.source.y,
				dr = 180;
				switch(d.type){
					case 3:
					case 0:
					return "M" + d.source.x + "," + d.source.y 
					+ "L" + d.target.x + "," + d.target.y;
					case 2:
					case 1:
					return "M" + d.source.x + "," + d.source.y 
					+ "A" + dr + "," + dr + " 0 0,"+(d.type%2) + " " 
					+ d.target.x + "," + d.target.y;
					default:
					var deg = [100, 80, 74, 120, 88, 76];
					dr = (d.type-4<deg.length) ? deg[d.type-4] : 0;
					return "M" + d.source.x+","+d.source.y 
					+ "A" + dr+","+dr + " 0 0," + /*(d.type%2)*/1 + " " 
					+ d.target.x+","+d.target.y;
				}
			});
		}
		
		this.frame.attr("data-key", -1);
		this.defs();
		
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
		var C = this;
		
		// ID wierzcho³ków
		this.V = this.V.data(graph.V, function(d){return d.id;});
		
		// Aktualizacja istniej¹cych wierzcho³ków
		this.V.selectAll('circle')
			// TODO mixed
			//.classed('mixed', function(d) { return d.undirected; })
			.style('fill', function(d){
				//return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); 
				return C.colors(d.id);
			})
		;
		
		// Dodawanie nowych wierzcho³ków
		var nowy = this.V.enter().append('svg:g');
		
		nowy.append('svg:circle')
			.attr("class", "vertex")
			.attr("r", this.radius)
			.style('fill', function(d){return C.colors(d.id)})
			
			.on("mousedown", function(){
				if(C.frame.classed("ctrl")){
					C.frame.classed('dragging', true);
				}
			})
			.on("dblclick", function(v){
				d3.event.stopPropagation();
				if(C.frame.classed("ctrl")){
					graph.removeVertex(v);
				}
			})
		;
		
		nowy.append('svg:text')
			.attr('x', 0)
			.attr('y', 4)
			.attr("class", "label")
			.text(function(d){return d.label})
		;
		
		// Usuwanie wierzcho³ków
		this.V.exit().remove();
		
		
		// Krawêdzie
		this.E = canvas.E.data(graph.E);
		
		var nowa = this.E.enter().append("svg:path")
			.attr("class", "path link")
			.style('marker-end', 'url(#arrow)')
			.attr("data-type", function(d){return d.type})
		
			.on("dblclick", function(v){
				d3.event.stopPropagation();
				if(C.frame.classed("ctrl")){
					graph.removeEdge(v);
				}
			})
		;
		
		this.E.exit().remove();
		
		this.force.start();
		cl("Canvas reloaded");
	},
	updateForce: function(p, v){
		this.force.stop();
		if(p === undefined){
			this.force.start();
			return;
		}
		if(p === "distance") p = "linkDistance";
		if(v === undefined)	return this.force[p]();
		this.force[p](v);
		this.force.start();
	},
	colors: d3.scale.category10(),
	activeVertex: null,
	activeEdge: null
}