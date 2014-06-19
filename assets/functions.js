function mousedown(){
	canvas.frame.classed('active', true);
	if(!canvas.activeVertex) return;

	canvas.line.attr('d', 'M' + canvas.activeVertex.x+','+canvas.activeVertex.y
					+'L' + d3.mouse(this)[0]+','+d3.mouse(this)[1]);

	canvas.rebuild();
}

function mousemove(){
	if(!canvas.activeVertex) return;
	var p = d3.mouse(this);
	p = 'M' + canvas.activeVertex.x+','+canvas.activeVertex.y
		+ 'L' + p[0] + ',' + p[1]
	
	canvas.line.attr('d', p);
	
	canvas.rebuild();
	
}

function mouseup(){
	canvas.frame.classed('active', false);
	canvas.frame.classed('dragging', false);
	if(canvas.activeVertex) {
		canvas.line.classed('hidden', true);
    }
	resetEvent();
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
        canvas.V.on('mousedown.drag', null)
			.on('touchstart.drag', null);
        canvas.frame.classed('ctrl', false);
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
	canvas.rebuild();
}

function resetEvent(){
	canvas.frame.classed('active', false);
	canvas.frame.classed('draw', false);
	canvas.activeVertex = null;
	canvas.activeEdge = null;
	canvas.line.attr('d', "M 0,0 L 0,0");
}

function flipType(e){
	if($(e.target).is(":checked")){
		graph.setType("directed");
	} else {
		graph.setType("undirected");
	}
	canvas.rebuild();
}