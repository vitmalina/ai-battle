var engine = (function () {

	var places = 'abcdefgh';

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
			b: ["wh", "wp", "", "", "", "", "bp", "bh"],
			c: ["wb", "wp", "", "", "", "", "bp", "bb"],
			d: ["wq", "wp", "", "", "", "", "bp", "bq"],
			e: ["wk", "wp", "", "", "", "", "bp", "bk"],
			f: ["wb", "wp", "", "", "", "", "bp", "bb"],
			g: ["wh", "wp", "", "", "", "", "bp", "bh"],
			h: ["wr", "wp", "", "", "", "", "bp", "br"]
		};
	}

	function render() {
		var html = "";
		for (var i in field) {
			for (var j = 0; j < 8; j++) {

				var piece = field[i][j];

				var color = "white";
				var block = -1;
				if (j%2) {
					block = 1;
				} else {
					block = 0;
				}
				if ((places.indexOf(i)+block)%2) {
					color = "#C3C4C5";
				}

				

				if (piece) {

					var left = 0;
					var top = 0;

					if (piece.substr(1,2) == "p") {
						left = 11;
						top = 7;
					} else if (piece.substr(1,2) == "r") {
						left = 9;
						top = 7;
					}  else if (piece.substr(1,2) == "h") {
						left = 5;
						top = 7;
					} else if (piece.substr(1,2) == "b") {
						left = 3;
						top = 4;
					} else if (piece.substr(1,2) == "q") {
						left = 2;
						top = 5;
					} else if (piece.substr(1,2) == "k") {
						left = 5;
						top = 5;
					}

					html += "<div class='square' style='background-color: " + color + "; right: " + (places.indexOf(i)*64) + "px; bottom: " + (j*64) + "px'>"
						+ "<img src='img/" + piece + ".png' style='left : " + left + "px; top: " + top + "px'>"
						+ "</div>";	
				} else {
					html += "<div class='square' style='background-color: " + color + "; right: " + (places.indexOf(i)*64) + "px; bottom: " + (j*64) + "px'></div>";
				}
				
			}
		}
		$("#board").html(html);
	}

	function move() {

	}

}());

