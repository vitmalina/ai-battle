var engine = (function () {

	var field;
	var places  = 'abcdefgh';
	var taken   = [];
	var history = [];
	var ais	 	= {
		randy	: 'randy.js',
		lucy	: 'lucy.js',
		andi	: 'Andi/andi.js',
		jack    : 'jack.js'
	};
	var gameOver = false;
	var pretend = {
		field   : {},
		move	: pretendMove,
		show	: pretendShow,
		reset	: pretendReset,
		isCheck	: isCheck
	};
	var inHistory = 0;

	return {
		turn		: '',		// whose turn it is
		player1		: null,		// white, null is human, otherwise ai name
		player2		: null,		// black
		init 		: init,
		reset		: reset,
		start 		: start,
		move		: move,
		getMoves	: getMoves,
		pretend		: pretendMove,
		isCheck		: isCheck,
		historyPoint: historyPoint,
		gameOver    : gameOver,
		inHistory   : inHistory,
	}

	function init() {
		for (var a in ais) {
			$.ajax({
					url   : 'ai/'+ ais[a],
					async : false,
					method: 'get',
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
					console.log('ERROR: cannot load '+ a);
				});
		}
		// this function is here for sand boxing
		function _register(name, ai) {
			ais[name] = ai;
			$("#player_one_options, #player_two_options").append("<option value=\"" + name +"\">" + ais[name].name + "</option>");
		}
		reset();
		var config = localStorage.getItem('ai-battle');
		if (config) {
			config = JSON.parse(config);
			$("#player_one_options").val(config.player1 || 'Human');
			$("#player_two_options").val(config.player2 || 'Human');
		} 
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
<<<<<<< HEAD
		// tests
=======
>>>>>>> origin/master
		// field = {
		// 	a: ["wr", "wp", "", "", "", "bp", "", "br"],
		// 	b: ["", "wp", "", "", "wh", "", "bp", "bh"],
		// 	c: ["wb", "wp", "", "", "", "", "bp", "bb"],
		// 	d: ["wq", "wp", "", "", "", "", "bp", "bq"],
		// 	e: ["wk", "", "", "wp", "bp", "", "", "bk"],
		// 	f: ["wb", "wp", "", "", "", "", "bp", "bb"],
		// 	g: ["wh", "wp", "", "", "", "", "bp", "bh"],
		// 	h: ["wr", "wp", "", "", "", "", "bp", "br"]
		// };
		history = [];
		taken 	= [];
		board.render(cloneField(field));
		board.notation();
		// start();
	}

	function start(player1, player2) { // if null, then it is human
		if (player1 == "Human") player1 = null;
		if (player2 == "Human") player2 = null;
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
		// save last oponents
		localStorage.setItem('ai-battle', JSON.stringify({ player1: player1, player2: player2 }));
		reset();
		engine.turn  = 'w';
		$(".popup-holder").hide();
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
		if (player1 != null) next(player1);
	}

	function next(player) {
		var moves = getMoves(field, engine.turn);
		var mv = ais[player].next({
			me		: engine.turn,
			op		: (engine.turn == 'w' ? 'b' : 'w'),
<<<<<<< HEAD
			field	: cloneField(field), 
=======
			field	: $.extend(true, {}, field), 
>>>>>>> origin/master
			moves	: moves.slice(0)
		});
		if (moves.indexOf(mv) == -1) {
			alert("ERROR: Invliad move "+ mv +" by "+ ais[player].name);
			return;
		}
		move(mv);
	}

	function move(action) {
		if (engine.turn == '') return; // no game in progress
<<<<<<< HEAD
		board.refresh(cloneField(field), action);
=======
		board.refresh($.extend(true, {}, field), action);
>>>>>>> origin/master
		history.push(action);
		if (history.length >= 300) {
			engine.turn = '';
			$('#player1_turn').html('Draw').show();
			$('#player2_turn').html('Draw').show();
			$('#player1_move').html("Reached 300 moves");
			$('#player2_move').html("Reached 300 moves");
			engine.gameOver = true;
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
				board.refresh(field, "h1:f1");
			}
			if (action == 'e1:c1') {
				field['d'][0] = 'wr';
				field['a'][0] = '';
				board.refresh(field, "a1:d1");
			}
		}
		// casteling (black)
		if (engine.turn == 'b') {
			if (action == 'e8:g8') {
				field['f'][7] = 'br';
				field['h'][7] = '';
				board.refresh(field, "h8:f8");
			}
			if (action == 'e8:c8') {
				field['d'][7] = 'br';
				field['a'][7] = '';
				board.refresh(field, "a8:d8");
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
				$("img").removeClass("rotate");
			}
		} else {
			$('#player1_turn').hide();
			$('#player2_turn').show();			
			$("#player2_move").html(moveCount > 0 ? moveCount + " possible moves" : '');
			$("#player1_move").html("");
			if (engine.player1 == null && engine.player2 == null) {
				$("#game_holder, .player1, .player2").css("transform", "rotate(180deg)");
				$("img").addClass("rotate");
			}
		}
		if (moveCount == 0) {
			// stale mate
			if (!isCheck(null, engine.turn)) {
				$('#player1_turn').html('Draw').show();
				$('#player2_turn').html('Draw').show();
				$('.endgame').html('Stale Mate');
				engine.gameOver = true
			} else {
				if (engine.turn == 'w') { // black wins (player 2)
					$('#player1_turn').hide();
					$('#player2_turn').html('Winner').show();
					if (engine.player1 == null) {
						$('.endgame').html('Black has won!');
					} else {
						if (engine.player2 == null) {
							$('.endgame').html('Human (black) has won!');
						} else {
							$('.endgame').html(ais[engine.player2].name + ' (black) has won!');
						}
						
						engine.gameOver = true;
					}
		
				} else { // white wins (player 1)
					$('#player1_turn').html('Winner').show();
					if (engine.player1 == null && engine.player2 == null) $('.endgame-holder').css("transform", "rotate(180deg)");
					if (engine.player1 == null) {
						$('.endgame').html('White has won!');
					} else {
						$('.endgame').html(ais[engine.player1].name + ' (white) has won!');
						engine.gameOver = true
					}
				}
			}
			$('.endgame-holder').show();
			return;
		}
		var html = "";
		for (var i = 0; i < history.length; i++) {
			if (i/2 == Math.floor(i/2)) {
				html +=   "<div class='block' style='width: 75px; height: 20px; left: 0px; top: " + (Math.floor(i/2)*25) + "px; border-right: 1px solid black; text-align: center; border-bottom: 1px solid gray' onclick='engine.historyPoint(" + i + ")'>"
						+ history[i]
						+ "</div>";
			} else {
				html +=   "<div class='block' style='width: 73px; height: 20px; right: 0px; top: " + (Math.floor(i/2)*25) + "px; text-align: center; border-bottom: 1px solid gray' onclick='engine.historyPoint(" + i + ")'>"
						+ history[i]
						+ "</div>";
			}
		}
		$("#history").html(html);
		// check if it is ai, then get next move
		setTimeout(function () {
			if (engine.turn == 'w' && engine.player1 != null) {
				next(engine.player1);
			} else if (engine.turn == 'b' && engine.player2 != null) {
				next(engine.player2);
			}
		}, 1);
	}

	function getMoves(fld, color, noVCheck) {
		if (engine.turn == '') return []; // no game in progress
		if (fld == null) fld = field;
		var pl1 = (color ? color : engine.turn);
		var pl2 = (pl1 == 'w' ? 'b' : 'w');
		var moves  = [];
		var vCheck = (arguments.length == 0 || noVCheck !== true ? true : false);
		vcheck = true;
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
						// check if king or rook was moved before
						for (var n = 0; n < history.length; n++) {
							var parts = history[n].split(":");
							if (rooks[1] == parts[0] || rooks[1] == parts[1]) {
								castleLeft = false;
							}
							if (rooks[0] == parts[0] || rooks[0] == parts[1]) {
								castleRight = false;
							}
							if (king == parts[0] || king == parts[1]) {
								castleRight = false;
								castleLeft = false;
							}
						}
						var rookPos = parseInt(rooks[0].substr(1, 1))-1;
						
						if (vCheck === true) {
							var newField = pretendMove(cloneField(fld), 'e' + (rookPos+1) + ':f' + (rookPos+1));
							if (isCheck(newField, engine.turn)) castleLeft = false;
							var newField = pretendMove(cloneField(fld), 'e' + (rookPos+1) + ':d' + (rookPos+1));
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
				var newField = pretendMove(cloneField(fld), mv);
				if (!isCheck(newField, piece[0])) {
					moves.push(mv);
				}
			} else {
				moves.push(mv);
			}
			return beat;
		}
	}

	function isCheck(fld, pl1) {
		if (arguments.length != 2) {
			mv  = fld;
			fld = this.field;
		}
		if (fld == null) fld = field;
		var pl2 = (pl1 == 'w' ? 'b' : 'w');
		var res = false;
		var mv  =  getMoves(fld, pl2, true);
		for (var i = 0; i < mv.length; i++) {
			var tmp = mv[i].split(':');
			if (tmp.length == 3 && tmp[2] == pl1+'k') res = true;
		}
		return res;
	}

	function pretendMove(fld, mv) {
		if (arguments.length != 2) {
			mv  = fld;
			fld = null;
		}
		if (fld == null) fld = cloneField(field);
		var tmp = mv.split(':');
		var f1  = tmp[0][0];
		var i1  = parseInt(tmp[0][1]) - 1;
		var f2  = tmp[1][0];
		var i2  = parseInt(tmp[1][1]) - 1;
		fld[f2][i2] = fld[f1][i1];
		fld[f1][i1] = '';
		// white pawn promotion
		if (f1 == 'w' && i2 == 7 && field[f2][i2] == 'wp') {
			field[f2][i2] = 'wq';
		}
		// black pawn promotion
		if (f1 == 'b' && i2 == 0 && field[f2][i2] == 'bp') {
			field[f2][i2] = 'bq';
		}
		// casteling (white)
		if (f1 == 'w') {
			if (mv == 'e1:g1') {
				field['f'][0] = 'wr';
				field['h'][0] = '';
			}
			if (mv == 'e1:c1') {
				field['d'][0] = 'wr';
				field['a'][0] = '';
			}
		}
		// casteling (black)
		if (f1 == 'b') {
			if (mv == 'e8:g8') {
				field['f'][7] = 'br';
				field['h'][7] = '';
			}
			if (mv == 'e8:c8') {
				field['d'][7] = 'br';
				field['a'][7] = '';
			}
		}
		// save pretend field
		if (arguments.length != 2) this.field = fld;
		return fld;
	}

	function pretendShow(fld) {
		if (fld == null) fld = this.field;
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

	function pretendReset(fld) {
		if (fld == null) {
			consoel.log('ERROR: please send field to reset to.');
			return;
		}
		this.field = fld;
	}

	function historyPoint(place) {
		if (engine.gameOver && place >= 0 && place < history.length) {
			engine.inHistory = place;
			var initField = {
				a: ["wr", "wp", "", "", "", "", "bp", "br"],
				b: ["wh", "wp", "", "", "", "", "bp", "bh"],
				c: ["wb", "wp", "", "", "", "", "bp", "bb"],
				d: ["wq", "wp", "", "", "", "", "bp", "bq"],
				e: ["wk", "wp", "", "", "", "", "bp", "bk"],
				f: ["wb", "wp", "", "", "", "", "bp", "bb"],
				g: ["wh", "wp", "", "", "", "", "bp", "bh"],
				h: ["wr", "wp", "", "", "", "", "bp", "br"]
			};
			var historyLoc = -1;
			for (var i = 0; i <= place; i++) {
				var parts = history[i].split(":");
				pretendMove(initField, (parts[0] + ":" + parts[1]));
				historyLoc++;
			}
			board.render(cloneField(initField), [], false, taken);
			var html = "";
			for (var i = 0; i < history.length; i++) {
				var color = "";
				if (i <= historyLoc) {
					color = "background-color: blue; color: white";
				}
				if (i/2 == Math.floor(i/2)) {
					html +=   "<div class='block' style='width: 75px; height: 20px; left: 0px; top: " + (Math.floor(i/2)*25) + "px; border-right: 1px solid black; text-align: center; border-bottom: 1px solid gray; " + color + "' onclick='engine.historyPoint(" + i + ")'>"
							+ history[i]
							+ "</div>";
				} else {
					html +=   "<div class='block' style='width: 75px; height: 20px; right: 0px; top: " + (Math.floor(i/2)*25) + "px; text-align: center; border-bottom: 1px solid gray; " + color + "' onclick='engine.historyPoint(" + i + ")'>"
							+ history[i]
							+ "</div>";
				}
			}
			$("#history").html(html);
		}
	}

	function cloneField(field) {
		var newField = {};
		for (var file in field) {

			var row = field[file];
			var r = [];
			for (var i = 0; i < 8; i++) {
				r[i] = row[i];
			}
				newField[file] = r;
		}
	return newField;

}

}());