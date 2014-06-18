//jQuery.noConflict();
/*
var restart;
(function($){*/
cl("Application starting…");

var width,
	height,
	radius;

width = $("body").width() - $("#panel").outerWidth();
height = $("body").height();
radius = 12;
cl("Canvas size: "+width+"x"+height);

$("#main").width(width).height(height)
	.bind("contextmenu",function(e){e.preventDefault();});
$("#panel").height(height-40);

graph.canvas.attr('width', width)
			.attr('height', height)
			.attr("data-key", -1);

graph.force = d3.layout.force() // Fizyka
	.nodes(graph.V)
	.links(graph.E)
	.size([width,height])
	.linkDistance(150) // TODO wczytanie poprzednich ust.
	.charge(-500)
	.on('tick', step);
graph.colors = d3.scale.category10();

// Styl strzałek
graph.canvas.append('svg:defs').append('svg:marker')
	.attr('id', 'arrow')
	.attr('viewBox', '0 -5 10 10')
	.attr('refX', 21)
	.attr('markerWidth', 5)
	.attr('markerHeight', 5)
	.attr('orient', 'auto')
.append('svg:path')
	.attr('d', 'M0,-5L10,0L0,5')
	.attr("class", "arrow");
/*
svg.append('svg:defs').append('svg:marker')
	.attr('id', 'start-arrow')
	.attr('viewBox', '0 -5 10 10')
	.attr('refX', 4)
	.attr('markerWidth', 3)
	.attr('markerHeight', 3)
	.attr('orient', 'auto')
.append('svg:path')
	.attr('d', 'M10,-5L0,0L10,5')
	.attr('fill', '#000');*/


/* TODO - wczytanie poprzedniego grafu */
if(!graph.V.length){ // Pusty graf na starcie. Wczytaj przykładowy
	for(var i = 0; i < 4; i++){
		graph.addVertex();
		//V.push({id: i, label: graph.generateID()});
	}
	graph.addEdge(0,1);
	graph.addEdge(0,2);
	graph.addEdge(1,2);
	graph.addEdge(2,0);
	graph.addEdge(0,3);
	graph.addEdge(3,0);
	graph.addEdge(3,1);
}


P = graph.canvas.append('svg:g').selectAll('path'), // krawędzie
N = graph.canvas.append('svg:g').selectAll('g'); // wierzchołki

function step(){
	N.attr("transform", function(d){
		d.x = Math.max(radius, Math.min(width-radius, d.x));
		d.y = Math.max(radius, Math.min(height-radius, d.y));
		return "translate("+d.x+", "+d.y+")";
	});
	
	P.attr('d', function(d) {
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

rebuild = function(){
	// ID wierzchołków
	N = N.data(graph.V, function(d){return d.id;});
	
	// Aktualizacja istniejących wierzchołków
	N.selectAll('circle')
		// TODO mixed
		//.classed('mixed', function(d) { return d.undirected; })
		.style('fill', function(d){
			//return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); 
			return graph.colors(d.id);
		})
	;
	
	// Dodawanie nowych wierzchołków
	var nowy = N.enter().append('svg:g');
	
		nowy.append('svg:circle')
			.attr("class", "vertex")
			.attr("r", radius)
			.style('fill', function(d){return graph.colors(d.id)})
			
			.on("mousedown", function(){
				if(graph.canvas.classed("ctrl")){
					graph.canvas.classed('dragging', true);
				}
			})
			.on("dblclick", function(v){
				d3.event.stopPropagation();
				if(graph.canvas.classed("ctrl")){
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
	
	// Usuwanie wierzchołków
	N.exit().remove();
	
	
	// Krawędzie
	P = P.data(graph.E); // (P)ath according to (E)dges array
	
	var nowa = P.enter().append("svg:path")
			.attr("class", "path link")
			.style('marker-end', 'url(#arrow)')
			.attr("data-type", function(d){return d.type})
	
			.on("dblclick", function(v){
				d3.event.stopPropagation();
				if(graph.canvas.classed("ctrl")){
					graph.removeEdge(v);
				}
			})
		;
	
	
	P.exit().remove();
	
	
	graph.force.start();
	cl("Canvas reloaded");
}

//restart = core();

graph.canvas.on('mousedown', mousedown)
			.on('mousemove', mousemove)
			.on('mouseup', mouseup)
			.on('dblclick', dblclick);
d3.select(window).on('keydown', keydown)
	.on('keyup', keyup).on("mouseup", resetEvent);
	
	
	
	
rebuild(); // START



/*
})(jQuery);*/