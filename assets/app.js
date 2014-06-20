//jQuery.noConflict();

(function($){
	cl("Application starting…");

	var width = $("body").width() - $("#panel").outerWidth(),
		height = $("body").height();
		
	cl("Canvas size: "+width+"x"+height);

	$("#main").width(width).height(height);

	var width = $("body").width() - $("#panel").outerWidth(),
		height = $("body").height();
	canvas.frame.attr('width', width)
				.attr('height', height);

	canvas.force.size([width,height])
		.linkDistance(150) // TODO wczytanie poprzednich ust.
		.charge(-500);

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

	
	
	$.fn.bindVal = function(){
		if(this.length){
			return this.each(function(){
				var $t = $(this),
					val;
				val = canvas.updateForce($t.attr("name"));
				$t.val(val);
				$t.prop("disabled", true);
				canvas.rebuild();
			});
		}
	}
	
	
	canvas.construct();
	
})(jQuery);

	$("#settings input[type=text]").bindVal();
	$("#gtype").change(flipType);


