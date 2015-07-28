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
	lastMoves : [],


	next	: function (field, moves) {
		var moveStats = [];
		var chosen = 0;

		var places = "abcdefgh";

		if (!ai.color) {
			ai.color = field[moves[0].substr(0,1)][parseInt(moves[0].substr(1,1))-1].substr(0,1);
			ai.op    = (ai.color == 'w' ? 'b' : 'w');
			console.log(ai.color);
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
			var tmp = parseInt(moves[i].substr(1,1));
			tmp = tmp -1;
			var piece = field[moves[i].substr(0,1)][tmp].substr(1,1);
			console.log(piece);



			moveStats.push({

				availMoves     : availMoves,
				take  : {
					piece : takeablePiece,	
					prot  : prot,
				},

				move   : moves[i],
				piece  : piece,

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
		var biggest = 0;

		for (var i = 0; i < moves.length; i++) {
			if (moves[i].take.piece != "") {
				var p = {
					p : 3,
					h : 8,
					b : 9,
					r : 20,
					q : 31,
				};
				if (!moves[i].take.prot) {
					moves[i].points += p[moves[i].take.piece];
				} else {
					moves[i].points -= p[moves[i].piece];
				}
			}
			if (moves[i].availMoves > ai.lastMoves.length && moves[i].piece != "k") {
				moves[i].points += (moves[i].availMoves/50);
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
}


