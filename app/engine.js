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
			a: ["br", "bp", "", "", "", "", "wp", "wr"],
			b: ["bk", "bp", "", "", "", "", "wp", "wk"],
			c: ["bb", "bp", "", "", "", "", "wp", "wb"],
			d: ["bq", "bp", "", "", "", "", "wp", "wq"],
			e: ["bi", "bp", "", "", "", "", "wp", "wi"],
			f: ["bb", "bp", "", "", "", "", "wp", "wb"],
			g: ["bk", "bp", "", "", "", "", "wp", "wk"],
			h: ["br", "bp", "", "", "", "", "wp", "wr"]
		};
	}

	function render() {

	}

	function move() {

	}

}());

