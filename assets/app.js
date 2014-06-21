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
	
	$(".toggle").on("click", function(e){
		e.preventDefault();
		var $t;
		if($(this).attr("data-toggle") !== "undefined"){
			$t = $(this).attr("data-toggle");
			$(this).attr("data-toggle", $(this).text());
			$(this).text($t);
		}
		if($(this).attr("data-target") !== "undefined"){
			$t = $($(this).attr("data-target"));
		} else {
			$t = $(this);
		}
		$($t).stop().slideToggle();
	});
	
	canvas.construct();
	
})(jQuery);

$("#settings input[type=range]").bindVal();


$("#gtype").change(flipType);

$(window).safe_resize(function(){
	set_size();
	canvas.rebuild();
}, 1500);


