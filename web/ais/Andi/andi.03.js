/*
 *  AI for AIBATTLE.net
 *  CodeName: Andi
 *  Author: Vladimir Malinouski
 *
 */

 var ai = {

 	///// Manditory Info /////
	name	: 'Andi',
	author	: 'Vladimir Malinouski',


	color     : '',
	op        : '',
	lastMoves : [],
	field     : [],


	next	: function (field, moves) {
		
		var moveStats = [];
		var chosen = 0;

		var places = "abcdefgh";

		ai.field = field;

		if (!ai.color) {
			ai.color = field[moves[0].substr(0,1)][parseInt(moves[0].substr(1,1))-1].substr(0,1);
			ai.op    = (ai.color == 'w' ? 'b' : 'w');
			console.log("Our color is " + ai.color + ". Checked from " + moves[0].substr(0,1) + "" + parseInt(moves[0].substr(1,1)) + ". Our opponet is " + ai.op);
		}

		for (var i = 0; i < moves.length; i++) {

			/////  Available Moves /////
			var fieldInstance = pretendMove($.extend(true, {}, field), moves[i]);
			var availMoves = getMoves($.extend(true, {}, fieldInstance), ai.color).length;


			///// Takeable Piece /////
			var takeablePiece = "";
			var split = moves[i].split(":");
			if (split[2]) {
				takeablePiece = split[2].substr(1,1);
				//console.log(takeablePiece);
			} 
			var prot = false;
			var killingMoves = getMoves($.extend(true, {}, fieldInstance), ai.op);
			for (var j = 0; j < killingMoves.length; j++) {
				var spl = killingMoves[j].split(":");
				if (spl[1] == split[1]) {
					prot = true;
				}
			}

			///// Piece /////
			var piece = ai.piece(moves[i].split(":")[0]);
			//console.log(piece);

			///// Piece Threat /////
			var protWorth = 0;
			var protectable = false;
			var eThreat = false;
			var eThreatMoves = getMoves($.extend(true, {}, field), ai.op);
			for (var j = 0; j < eThreatMoves.length; j++) {
				var spl = eThreatMoves[j].split(":")
				if (split[0] == spl[1]) {
					eThreat = true;
				}
			}

			var mThreat = false;
			var mThreatMoves = getMoves($.extend(true, {}, fieldInstance), ai.op);
			for (var j = 0; j < mThreatMoves.length; j++) {
				var spl = mThreatMoves[j].split(":");
				if (spl[1] == split[1]) {
					mThreat = true;
				}
			}

			///// Check Mate ///// 	
			var chkMate = false;	
			var checkmateMoves = getMoves(fieldInstance, ai.op).length;
			if (checkmateMoves == 0 && isCheck(fieldInstance, ai.op)) {
				chkMate = true;
				console.log("Found a Check Mate move: " + moves[i]);
				//ai.showPretend(pretendMove($.extend(true, {}, field), moves[i]));
			} 

			///// Stale Mate Prevention ///
			var stlMate = false;
			if (checkmateMoves == 0 && !isCheck(fieldInstance, ai.op)) {
				stlMate = true;
			}

			///// Avoid Being Check Mated /////
			var chkMated = false;
			var checkmatedMoves = getMoves($.extend(true, {}, fieldInstance), ai.op);
			for (var j = 0; j < checkmatedMoves.length; j++) {
				var fieldInstance2 = pretendMove($.extend(true, {}, fieldInstance), checkmatedMoves[j]);
				var myMoves = getMoves($.extend(true, {}, fieldInstance2), ai.color).length;
				if (myMoves == 0 && isCheck(fieldInstance2, ai.color)) {
					chkMated = true;
				}
			}

			///// Fork Move /////
			var frkMv = false;



			moveStats.push({

				availMoves     : availMoves,
				take  : {
					piece : takeablePiece,	
					prot  : prot,
				},

				move     : moves[i],
				piece    : piece, // the piece that is being moved, used for getting point values
				eThreat  : { // existing threat
					threat 		: eThreat,
					protectable : protectable,
					protWorth   : protWorth,
				}, 
				mThreat  : mThreat, // threat if moved
				chkMate  : chkMate, // if checkmate
				stlMate  : stlMate, // will cause stale mate
				chkMated : chkMated, // if move will get you checkmated
				frkMv    : frkMv, // if the move will fork two pieces

				points : 0,

			});

		}

		
		chosen = ai.totalPoints(moveStats);

		//console.log(chosen);
		//console.log(moveStats);

		ai.lastMoves = moves;

		return chosen;
	},


	totalPoints : function(moves) {
		var chosen  = moves[0].move;
		var biggest = -100000;
		var p = {
			p : 3,
			h : 8,
			b : 9,
			r : 20,
			q : 31,
		};

		for (var i = 0; i < moves.length; i++) {

			if (moves[i].take.piece != "") {
				var gain =  p[moves[i].take.piece] - p[moves[i].piece];
				var gft = false;
				if (!moves[i].take.prot) {
					moves[i].points += p[moves[i].take.piece];
				} else {
					if (gain >= 0) {
						moves[i].points += gain;
						gft = true;
					} else {
						moves[i].points -= p[moves[i].piece];
					}
				}
				console.log(moves[i].take.piece + " VS. " + moves[i].piece + " Trade gain: " + gain + ". Go for trade: " + gft);
			}
			if (moves[i].availMoves > ai.lastMoves.length && moves[i].piece != "k") {
				moves[i].points += (moves[i].availMoves/50);
			}
			if (moves[i].eThreat.threat) {
				moves[i].points += p[moves[i].piece];
			}
			if (moves[i].mThreat) {
				moves[i].points -= p[moves[i].piece];
			}
			if (moves[i].chkMate) {
				moves[i].points += 100000;
			}
			if (moves[i].stlMate) {
				moves[i].points -= 1000;
			}
			if (moves[i].chkMated) {
				moves[i].points -= 10000;
			}
		}
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].points >= biggest) {
				biggest = moves[i].points;
				chosen = moves[i].move;
			}
		}

		return chosen;
	},

	showPretend : function(fld) {
		for (var i = 7; i >= 0; i--) {
			var tmp = '';
			for (var f in fld) {
				if (fld[f][i] == '') tmp += ' . '; else tmp += fld[f][i]+'-';
			}
			console.log(i, tmp);
		}
		console.log('   a  b  c  d  e  f  g  h');
		console.log('-------------------------');
	},

	piece : function(location) {
		return ai.field[location[0]][(parseInt(location[1])-1)].substr(1,1)
	}
}