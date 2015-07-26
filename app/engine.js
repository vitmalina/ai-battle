var engine = (function () {

	var field;
	var places  = 'abcdefgh';
	var taken   = [];
	var history = [];

	return {
		turn		: 'w',		// whose turn it is
		reset		: reset,
		move		: move,
		getMoves	: getMoves,
		pretend		: pretend,
		isCheck		: isCheck,
		show		: show
	}

	function init() {

	}

	function reset() {
		taken = [];
		engine.turn  = 'w';
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
		$("#player1_move").html(engine.getMoves().length+" possible moves");
		history = [];
	}

	function move(action) {
		history.push(action);
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
		engine.turn = (engine.turn == 'w' ? 'b' : 'w');
		var moveCount = engine.getMoves().length;
		if (engine.turn == 'w') {
			$('#player1_turn').show();
			$('#player2_turn').hide();
			$("#player1_move").html(moveCount > 0 ? moveCount + " possible moves" : '');
			$("#player2_move").html("");
			$("#game_holder").css("transform", "rotate(0deg)");
			$(".player1").css("transform", "rotate(0deg)");
			$(".player2").css("transform", "rotate(0deg)");
		} else {
			$('#player1_turn').hide();
			$('#player2_turn').show();			
			$("#player2_move").html(moveCount > 0 ? moveCount + " possible moves" : '');
			$("#player1_move").html("");
			$("#game_holder").css("transform", "rotate(180deg)");
			$(".player1").css("transform", "rotate(180deg)");
			$(".player2").css("transform", "rotate(180deg)");
		}
		board.render($.extend(true, {}, field), [], false, taken);
		if (moveCount == 0) {
			alert('Check & Mate! ' + (engine.turn == 'w' ? 'Player 2 WINS.' : 'Player 1 WINS.'));
			reset();
		}
		var html = "";
		for (var i = 0; i < history.length; i++) {
			if (i/2 == Math.floor(i/2)) {
				html +=   "<div class='block' style='width: 50px; height: 20px; left: 0px; top: " + (Math.floor(i/2)*25) + "px; border-right: 1px solid black; text-align: center; border-bottom: 1px solid gray'>"
						+ history[i]
						+ "</div>";
			} else {
				html +=   "<div class='block' style='width: 48px; height: 20px; right: 0px; top: " + (Math.floor(i/2)*25) + "px; text-align: center; border-bottom: 1px solid gray'>"
						+ history[i]
						+ "</div>";
			}
		}
		$("#history").html(html);

	}

	function getMoves(fld, player) {
		if (fld == null) fld = field;
		var pl1 = (player ? player : engine.turn);
		var pl2 = (pl1 == 'w' ? 'b' : 'w');
		var moves  = [];
		var vCheck = (arguments.length > 0 ? false : true);
		for (var f in fld) {
			for (var i = 0; i < 8; i++) {
				var piece = fld[f][i];
				if (piece[0] == pl1) {
					var num = places.indexOf(f);
					// pawn
					if (piece[1] == 'p') {
						// TODO: el pesan, pawn promotion
						if (pl1 == 'w') {
							if (i + 1 < 8 && fld[f][i+1] == '') addIfValid(piece, f, i, num, i+1); // one forward
							if (i == 1 && fld[f][i+1] == '' && fld[f][i+2] == '') addIfValid(piece, f, i, num, i+2); // two forward (if initial)
							if (num > 0 && i < 8) {
								var beat = fld[places[num-1]][i+1];
								if (beat != '' && beat[0] == pl2) addIfValid(piece, f, i, num-1, i+1);
							}
							if (num < 7 && i < 8) {
								var beat = fld[places[num+1]][i+1];
								if (beat != '' && beat[0] == pl2) addIfValid(piece, f, i, num+1, i+1);
							}
						}
						if (pl1 == 'b') {
							if (i - 1 >= 0 && fld[f][i-1] == '') addIfValid(piece, f, i, num, i-1); // one forward
							if (i == 6 && fld[f][i-1] == '' && fld[f][i-2] == '') addIfValid(piece, f, i, num, i-2); // two forward (if initial)
							if (num > 0 && i > 0) {
								var beat = fld[places[num-1]][i-1];
								if (beat != '' && beat[0] == pl2) addIfValid(piece, f, i, num-1, i-1);
							}
							if (num < 7 && i > 0) {
								var beat = fld[places[num+1]][i-1];
								if (beat != '' && beat[0] == pl2) addIfValid(piece, f, i, num+1, i-1);
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
			var beat = fld[places[f1]][i1];
			if (beat && beat[0] == pl1) {
				return false;
			}
			var mv = f+(i+1)+':'+places[f1]+(i1+1)+(beat ? ':' + beat : '');
			if (vCheck === true) {
				var newField = pretend($.extend(true, {}, fld), mv);
				if (!isCheck(newField, piece[0])) moves.push(mv);
			} else {
				moves.push(mv);
			}
			return beat;
		}
	}

	function pretend(fld, mv) {
		if (fld == null) fld = $.extend(true, {}, field);
		var tmp = mv.split(':');
		var f1  = tmp[0][0];
		var i1  = parseInt(tmp[0][1]) - 1;
		var f2  = tmp[1][0];
		var i2  = parseInt(tmp[1][1]) - 1;
		fld[f2][i2] = fld[f1][i1];
		fld[f1][i1] = '';
		return fld;
	}

	function isCheck(fld, pl1) {
		if (fld == null) fld = field;
		var pl2 = (pl1 == 'w' ? 'b' : 'w');
		var res = false;
		var mv  =  getMoves(fld, pl2);
		for (var i = 0; i < mv.length; i++) {
			var tmp = mv[i].split(':');
			if (tmp.length == 3 && tmp[2] == pl1+'k') res = true;
		}
		return res;
	}

	function show(fld) {
		if (fld == null) fld = field;
		for (var i = 7; i >= 0; i--) {
			var tmp = '';
			for (var f in fld) {
				if (fld[f][i] == '') tmp += ' . '; else tmp += fld[f][i]+'-';
			}
			console.log(i, tmp);
		}
		console.log('   a  b  c  d  e  f  g  h');
		console.log('-------------------------');
	}

}());