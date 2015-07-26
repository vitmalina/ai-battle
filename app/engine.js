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
	var taken = [];
	var turn  = 'w'; // whose turn it is

	return {
		reset		: reset,
		move		: move,
		getMoves	: getMoves
	}

	function reset() {
		taken = [];
		turn  = 'w';
		$('#player1_turn').show();
		$('#player2_turn').hide();
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
		board.render($.extend(true, {}, field), [], false, taken);
		board.notation();
	}

	function move(action) {
		var tmp = action.split(':');
		var f1  = tmp[0][0];
		var i1  = parseInt(tmp[0][1]) - 1;
		var f2  = tmp[1][0];
		var i2  = parseInt(tmp[1][1]) - 1;
		if (field[f2][i2] != '') {
			taken.push(field[f2][i2]);
		}
		field[f2][i2] = field[f1][i1];
		field[f1][i1] = '';
		turn = (turn == 'w' ? 'b' : 'w');
		if (turn == 'w') {
			$('#player1_turn').show();
			$('#player2_turn').hide();
		} else {
			$('#player1_turn').hide();
			$('#player2_turn').show();			
		}
		board.render($.extend(true, {}, field), [], false, taken);
	}

	function getMoves() {
		var pl1 = turn;
		var pl2 = (pl1 == 'w' ? 'b' : 'w');
		var moves = [];
		for (var f in field) {
			for (var i = 0; i < 8; i++) {
				var piece = field[f][i];
				if (piece[0] == pl1) {
					var num = places.indexOf(f);
					// pawn
					if (piece[1] == 'p') {
						// TODO: el pesan, pawn promotion
						if (pl1 == 'w') {
							if (i + 1 < 8 && field[f][i+1] == '') moves.push(f+(i+1)+':'+f+(i+2)); // one forward
							if (i == 1 && field[f][i+1] == '' && field[f][i+2] == '') moves.push(f+(i+1)+':'+f+(i+3)); // two forward (if initial)
							if (num > 0 && i < 8) {
								var beat = field[places[num-1]][i+1];
								if (beat != '' && beat[0] == pl2) moves.push(f+(i+1)+':'+places[num-1]+(i+2)+':'+beat);
							}
							if (num < 7 && i < 8) {
								var beat = field[places[num+1]][i+1];
								if (beat != '' && beat[0] == pl2) moves.push(f+(i+1)+':'+places[num+1]+(i+2)+':'+beat);
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
					// rook
					if (piece[1] == 'r') {
						// straight
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num, i + k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num, i - k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num + k, i);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num - k, i);
							if (beat === false || beat !== '') break;
						}
					}
					// horse (aka knight)
					if (piece[1] == 'h') {
						addIfValid(piece, f, i, num + 1, i + 2);
						addIfValid(piece, f, i, num + 1, i - 2);
						addIfValid(piece, f, i, num - 1, i + 2);
						addIfValid(piece, f, i, num - 1, i - 2);
						addIfValid(piece, f, i, num + 2, i + 1);
						addIfValid(piece, f, i, num + 2, i - 1);
						addIfValid(piece, f, i, num - 2, i + 1);
						addIfValid(piece, f, i, num - 2, i - 1);
					}
					// bishop
					if (piece[1] == 'b') {
						// dioganal
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num + k, i + k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num + k, i - k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num - k, i + k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num - k, i - k);
							if (beat === false || beat !== '') break;
						}
					}
					// queen
					if (piece[1] == 'q') {
						// dioganal
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num + k, i + k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num + k, i - k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num - k, i + k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num - k, i - k);
							if (beat === false || beat !== '') break;
						}
						// straight
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num, i + k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num, i - k);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num + k, i);
							if (beat === false || beat !== '') break;
						}
						for (var k=1; k<8; k++) {
							var beat = addIfValid(piece, f, i, num - k, i);
							if (beat === false || beat !== '') break;
						}						
					}
					// king
					if (piece[1] == 'k') {
						addIfValid(piece, f, i, num + 1, i + 1);
						addIfValid(piece, f, i, num + 1, i - 1);
						addIfValid(piece, f, i, num + 1, i);
						addIfValid(piece, f, i, num - 1, i + 1);
						addIfValid(piece, f, i, num - 1, i - 1);
						addIfValid(piece, f, i, num - 1, i);
						addIfValid(piece, f, i, num, i + 1);
						addIfValid(piece, f, i, num, i - 1);
					}

				}
			}
		}
		return moves;

		function addIfValid(piece, f, i, f1, i1) {
			// out of the board
			if (f1 < 0 || f1 > 7 || i1 < 0 || i1 > 7) {
				return false;
			}
			// taken by same color piece
			var beat = field[places[f1]][i1];
			if (beat && beat[0] == pl1) {
				return false;
			}
			moves.push(f+(i+1)+':'+places[f1]+(i1+1)+(beat ? ':' + beat : ''));
			return beat;
		}
	}

}());