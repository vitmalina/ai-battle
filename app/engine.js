var engine = (function () {

	var field;
	var places  = 'abcdefgh';
	var taken   = [];
	var history = [];
	var ais	 	= {
		lucy	: 'lucy.js',
		andi	: 'andi.js'
	};

	return {
		turn		: '',		// whose turn it is
		player1		: null,		// white, null is human, otherwise ai name
		player2		: null,		// black
		init 		: init,
		reset		: reset,
		start 		: start,
		move		: move,
		getMoves	: getMoves,
		pretend		: pretend,
		isCheck		: isCheck,
		show		: show
	}

	function init() {
		for (var a in ais) {
			$.ajax({
					url   : 'ai/'+ ais[a],
					async : false
				})
				.done(function (text, status, xhr) {
					var engine, field, places, taken, history, ais;
					eval(text);
					if (ai.name == null || typeof ai.next != 'function') {
						console.log('ERROR: cannot load '+ a + '.ai. File needs to look like "var ai = { name: "name", next: function() {...} }');	
					}
					_register(ai.name.toLowerCase(), ai);
				})
				.fail(function () {
					console.log('ERROR: cannot load '+ ai);
				});
		}
		// this function is here for sand boxing
		function _register(name, ai) {
			ais[name] = ai;
			$("#player_one_options, #player_two_options").append("<option value=\"" + name +"\">" + ais[name].name + "</option>");
		}
		reset();
	}

	function reset() {
		engine.turn = '';
		engine.player1 = null;
		engine.player2 = null;
		$('#player1_name').html('');
		$('#player2_name').html('');
		$('#player1_turn').hide();
		$('#player2_turn').hide();
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
		history = [];
		taken 	= [];
		board.render($.extend(true, {}, field), [], false, taken);
		board.notation();
		// start();
	}

	function start(player1, player2) { // if null, then it is human
		console.log(player1, player2);
		if (player1 == "Human") {
			player1 = null;
		}
		if (player2 == "Human") {
			player2 = null;
		}
		if (engine.turn != '') {
			console.log('ERROR: game currently in progress. Use engine.reset();');
			return;
		}
		if (player1 != null && ais[player1] == null) {
			console.log('ERROR: unrecognize ai "'+ player1 + '"');
			return
		}
		if (player1 != null && ais[player1] == null) {
			console.log('ERROR: unrecognize ai "'+ player1 + '"');
			return
		}
		reset();
		engine.turn  = 'w';
		$('#player1_turn').show();
		$("#player1_move").html(engine.getMoves().length+" possible moves");
		// player names
		engine.player1 = player1;
		engine.player2 = player2;
		$("#player1_name").html(player1 ? ais[player1].name + ' (white)' : 'Human (white)');
		$("#player2_name").html(player2 ? ais[player2].name + ' (black)' : 'Human (black)');
		$('#player1_turn').html('Your Turn');
		$('#player2_turn').html('Your Turn');
		$('#player1_move').html('');
		$('#player2_move').html('');
		// if ai, make a move
		if (player1 != null) {
			move(ais[player1].next(engine.field, getMoves()));
		}
	}

	function move(action) {
		if (engine.turn == '') return; // no game in progress
		history.push(action);
		if (history.length >= 500) {
			engine.turn = '';
			$('#player1_turn').html('Draw').show();
			$('#player2_turn').html('Draw').show();
			$('#player1_move').html("Reached 500 moves");
			$('#player2_move').html("Reached 500 moves");
			return;
		}
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
		// white pawn promotion
		if (engine.turn == 'w' && i2 == 7 && field[f2][i2] == 'wp') {
			field[f2][i2] = 'wq';
		}
		// black pawn promotion
		if (engine.turn == 'b' && i2 == 0 && field[f2][i2] == 'bp') {
			field[f2][i2] = 'bq';
		}
		// casteling (white)
		if (engine.turn == 'w') {
			if (action == 'e1:g1') {
				field['f'][0] = 'wr';
				field['h'][0] = '';
			}
			if (action == 'e1:c1') {
				field['d'][0] = 'wr';
				field['a'][0] = '';
			}
		}
		// casteling (black)
		if (engine.turn == 'b') {
			if (action == 'e8:g8') {
				field['f'][7] = 'br';
				field['h'][7] = '';
			}
			if (action == 'e8:c8') {
				field['d'][7] = 'br';
				field['a'][7] = '';
			}
		}
		engine.turn = (engine.turn == 'w' ? 'b' : 'w');
		var moveCount = engine.getMoves().length;
		if (engine.turn == 'w') {
			$('#player1_turn').show();
			$('#player2_turn').hide();
			$("#player1_move").html(moveCount > 0 ? moveCount + " possible moves" : '');
			$("#player2_move").html("");
			if (engine.player1 == null && engine.player2 == null) {
				$("#game_holder, .player1, .player2").css("transform", "rotate(0deg)");
			}
		} else {
			$('#player1_turn').hide();
			$('#player2_turn').show();			
			$("#player2_move").html(moveCount > 0 ? moveCount + " possible moves" : '');
			$("#player1_move").html("");
			if (engine.player1 == null && engine.player2 == null) {
				$("#game_holder, .player1, .player2").css("transform", "rotate(180deg)");
			}
		}
		if (moveCount == 0) {
			if (engine.turn == 'w') { // black wins (player 2)
				$('#player1_turn').hide();
				$('#player2_turn').html('Winner').show();
				$('.endgame-holder').toggle();
				$('.endgame').html('Black has won!');
	
			} else { // white wins (player 1)
				$('#player1_turn').html('Winner').show();
				$('.endgame-holder').toggle();
				if (engine.player1 != null || engine.player2 != null) $('.endgame-holder').css("transform", "rotate(180deg)");
				$('.endgame').html('White has won!');

			}
			engine.turn = '';
			return;
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
		// check if it is ai, then get next move
		setTimeout(function () {
			if (engine.turn == 'w' && engine.player1 != null) {
				move(ais[engine.player1].next(engine.field, getMoves()));
			} else if (engine.turn == 'b' && engine.player2 != null) {
				move(ais[engine.player2].next(engine.field, getMoves()));
			}
		}, 1);
		board.render($.extend(true, {}, field), [], false, taken);
	}

	function getMoves(fld, player) {
		if (engine.turn == '') return []; // no game in progress
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
						// TODO: el pesan
						if (pl1 == 'w') {
							if (i + 1 < 8 && fld[f][i+1] == '') addIfValid(piece, f, i, num, i+1); // one forward
							if (i == 1 && fld[f][i+1] == '' && fld[f][i+2] == '') addIfValid(piece, f, i, num, i+2); // two forward (if initial)
							if (num > 0 && i < 7) {
								var beat = fld[places[num-1]][i+1];
								if (beat != '' && beat[0] == pl2) addIfValid(piece, f, i, num-1, i+1);
							}
							if (num < 7 && i < 7) {
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

						// castling
						var rooks, king;
						if (engine.turn == "w") {
							rooks = ["a1", "h1"];
							king  = "e1";
						} else if (engine.turn == "b") {
							rooks = ["a8", "h8"];
							king  = "e8";
						}
						var castleRight = true;
						var castleLeft = true;
						for (var n = 0; n < history.length; n++) {
							var parts = history[n].split(":");
							if (rooks[1] == parts[0] || rooks[1] == parts[1]) {
								castleLeft = false;
								console.log("can not castle left");
							}
							if (rooks[0] == parts[0] || rooks[0] == parts[1]) {
								castleRight = false;
								console.log("can not castle right");
							}
							if (king == parts[0] || king == parts[1]) {
								castleRight = false;
								castleLeft = false;
							}
						}
						var rookPos = parseInt(rooks[0].substr(1, 1))-1;
						
						if (vCheck === true) {
							console.log('dfdfd');
							var newField = pretend($.extend(true, {}, fld), 'e' + (rookPos+1) + ':f' + (rookPos+1));
							if (isCheck(newField, engine.turn)) castleLeft = false;
							var newField = pretend($.extend(true, {}, fld), 'e' + (rookPos+1) + ':d' + (rookPos+1));
							if (isCheck(newField, engine.turn)) castleRight = false;
						}

						if (castleRight && field.d[rookPos] == "" && field.c[rookPos] == "" && field.b[rookPos] == "") addIfValid(piece, f, i, num - 2, i); // right rook
						if (castleLeft && field.f[rookPos] == "" && field.g[rookPos] == "") addIfValid(piece, f, i, num + 2, i); // left rook
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