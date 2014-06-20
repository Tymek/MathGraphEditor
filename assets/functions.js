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
	//if(!(k >= 112 && k <= 123)) d3.event.preventDefault();
	if(canvas.frame.attr('data-key') != -1) return;
	//cl("Key pressed ("+k+")");
	//if(k !== 9) canvas.frame.attr('data-key', k);
	
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


(function($) {
    $.fn.slideinput = function(opt) {

        opt = $.extend({handle:"",cursor:"col-resize"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);