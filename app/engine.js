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
			a: ["wr", "wp", "", "", "", "", "bp", "br"],
			b: ["wk", "wp", "", "", "", "", "bp", "bk"],
			c: ["wb", "wp", "", "", "", "", "bp", "bb"],
			d: ["wq", "wp", "", "", "", "", "bp", "bq"],
			e: ["wi", "wp", "", "", "", "", "bp", "bi"],
			f: ["wb", "wp", "", "", "", "", "bp", "bb"],
			g: ["wk", "wp", "", "", "", "", "bp", "bk"],
			h: ["wr", "wp", "", "", "", "", "bp", "br"]
		};
	}

	function render() {

	}

	function move() {

	}

}());

