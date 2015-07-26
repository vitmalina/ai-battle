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
		init		: init,
		reset		: reset,
		move		: move,
		getMoves	: getMoves
	}

	function init() {
		reset();
		board.render($.extend(true, {}, field));
		board.notation();
	}

	function reset() {
		field = {
			a: ["wr", "wp", "", "", "", "", "bp", "br"],
			b: ["wh", "wp", "", "", "", "", "bp", "bh"],
			c: ["wb", "wp", "", "", "", "", "bp", "bb"],
			d: ["wk", "wp", "", "", "", "", "bp", "bk"],
			e: ["wq", "wp", "", "", "", "", "bp", "bq"],
			f: ["wb", "wp", "", "", "", "", "bp", "bb"],
			g: ["wh", "wp", "", "", "", "", "bp", "bh"],
			h: ["wr", "wp", "", "", "", "", "bp", "br"]
		};
	}

	function move() {

	}

	function getMoves() {
		var pl1 = turn;
		var pl2 = (pl1 == 'w' ? 'b' : 'w');
		var moves = [];
		for (var f in field) {
			for (var i = 0; i < 8; i++) {
				var piece = field[f][i];
				if (piece[0] == pl1) {
					// pawn
					if (piece[1] == 'p') {
						// TODO: el pesan, pawn promotion
						var num = places.indexOf(f);
						if (pl1 == 'w') {
							if (i + 1 < 8 && field[f][i+1] == '') moves.push(f+(i+1)+':'+f+(i+2)); // one forward
							if (i == 1 && field[f][i+1] == '' && field[f][i+2] == '') moves.push(f+(i+1)+':'+f+(i+3)); // two forward (if initial)
							if (num > 0 && i < 8) {
								var beat = field[places[num-1]][i+1];
								if (beat != '' && beat[0] == pl2) moves.push(f+(i+1)+':'+places[num-1]+(i+1)+':'+beat);
							}
							if (num < 7 && i < 8) {
								var beat = field[places[num+1]][i+1];
								if (beat != '' && beat[0] == pl2) moves.push(f+(i+1)+':'+places[num+1]+(i+1)+':'+beat);
							}
						}
						if (pl1 == 'b') {
							if (i - 1 >= 0 && field[f][i-1] == '') moves.push(f+(i+1)+':'+f+(i-0)); // one forward
							if (i == 6 && field[f][i-1] == '' && field[f][i-2] == '') moves.push(f+(i+1)+':'+f+(i-1)); // two forward (if initial)
							if (num > 0 && i > 0) {
								var beat = field[places[num-1]][i-1];
								if (beat != '' && beat[0] == pl2) moves.push(f+(i+1)+':'+places[num-1]+(i)+':'+beat);
							}
							if (num < 7 && i > 0) {
								var beat = field[places[num+1]][i-1];
								if (beat != '' && beat[0] == pl2) moves.push(f+(i+1)+':'+places[num+1]+(i)+':'+beat);
							}
						}
					}
					// horse (aka knight)
					if (piece[1] == 'h') {

					}
				}
			}
		}
		return moves;
	}

}());