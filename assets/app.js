//jQuery.noConflict();

(function($){

	cl("Application starting…");
	set_size();

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
	
	canvas.construct();
	
})(jQuery);

$("#settings input[type=range]").bindVal();

$("#gtype").change(flipType);

$(window).safe_resize(function(){
	set_size();
	canvas.rebuild();
}, 1500);


