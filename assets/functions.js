function mousedown(){
	graph.canvas.classed('active', true);
	//cl();
}

function mousemove(){
	
}

function mouseup(){
	graph.canvas.classed('active', false);
	
}

function keydown(){
	var k = d3.event.keyCode;
	if(!(k >= 112 && k <= 123)) d3.event.preventDefault();
	if(graph.canvas.attr('data-key') != -1) return;
	cl("Key pressed ("+k+")");
	if(k !== 9) graph.canvas.attr('data-key', k);
	
	if(k == 17){
		N.call(graph.force.drag);
		graph.canvas.classed('ctrl', true);
	}
	
}

function keyup(){
	//cl("Key released");
	if(d3.event.keyCode === 17) {
        N.on('mousedown.drag', null)
		 .on('touchstart.drag', null);
        graph.canvas.classed('ctrl', false);
    }
	
	graph.canvas.attr("data-key", -1);
}

