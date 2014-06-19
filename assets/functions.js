function mousedown(){
	canvas.frame.classed('active', true);
	//cl();
}

function mousemove(){
	
}

function mouseup(){
	canvas.frame.classed('active', false);
	canvas.frame.classed('dragging', false);
	
}

function keydown(){
	var k = d3.event.keyCode;
	if(!(k >= 112 && k <= 123)) d3.event.preventDefault();
	if(canvas.frame.attr('data-key') != -1) return;
	cl("Key pressed ("+k+")");
	if(k !== 9) canvas.frame.attr('data-key', k);
	
	if(k == 17){
		canvas.V.call(canvas.force.drag);
		canvas.frame.classed('ctrl', true);
	}
	
}

function keyup(){
	//cl("Key released");
	if(d3.event.keyCode === 17) {
        canvas.V.on('mousedowcanvas.V.drag', null)
		 .on('touchstart.drag', null);
        canvas.frame.classed('ctrl', false);
        canvas.frame.classed('dragging', false);
    }
	
	canvas.frame.attr("data-key", -1);
}

function dblclick(){
	if(canvas.frame.classed("ctrl")) return;
	cl("Add vertex");
	var v = graph.makeVertex();
	var p = d3.mouse(this);
		v.x = p[0];
		v.y = p[1];
	graph.pushVertex(v);
	rebuild();
}

function resetEvent(){
	canvas.frame.classed('active', false);
}