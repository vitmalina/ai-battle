var engine = (function () {

	var field = {
		a: [],
		b: [],
		c: [],
		d: [],
		e: [],
		f: [],
		g: [],
		h: []
	};
	var turn  = 'w'; // whose turn it is

	return {
		reset	: reset,
		render	: render,
		move	: move
	}

	function reset() {
		field = {
			a: ["br", "bp", "", "", "", "", "wp", "wr.png"],
			b: ["bk", "bp", "", "", "", "", "wp", "wk.png"],
			c: ["bb", "bp", "", "", "", "", "wp", "wb.png"],
			d: ["bq", "bp", "", "", "", "", "wp", "wq.png"],
			e: ["bi", "bp", "", "", "", "", "wp", "wi.png"],
			f: ["bb", "bp", "", "", "", "", "wp", "wb.png"],
			g: ["bk", "bp", "", "", "", "", "wp", "wk.png"],
			h: ["br", "bp", "", "", "", "", "wp", "wr.png"]
		};
	}

	function render() {

	}

	function move() {

	}

}());

