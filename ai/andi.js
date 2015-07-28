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


	color : '',


	next	: function (field, moves) {
		var moveStats = [];
		var chosen = 0;

		var places = "abcdefgh";

		if (!ai.color) {
			ai.color = field[moves[0].substr(0,1)][parseInt(moves[0].substr(1,1))].substr(0,1);
			console.log(ai.color);
		}

		for (var i = 0; i < moves.length; i++) {

			/////  Available Moves /////
			var fieldInstance = pretendMove(field, moves[i]);
			var availMoves = getMoves(fieldInstance, ai.color).length;


			///// Takeable Piece /////
			var takeablePiece = "";
			var split = moves[i].split(":");
			if (split[2]) {
				takeablePiece = split[2];
			} 

			///// Piece /////
			var piece = field[moves[i].substr(0,1)][parseInt(moves[i].substr(1,1))];



			moveStats.push({

				availMoves     : availMoves,
				takeablePiece : takeablePiece,

				move   : moves[i],
				piece  : piece,

				points : 0,

			});

		}

		//console.log(moveStats);

		
		chosen = ai.totalPoints(moveStats);

		return chosen;
	},


	totalPoints : function(moves) {
		var chosen  = -1;
		var biggest = 0;

		for (var i = 0; i < moves.length; i++) {
			// if (moves[i].availMoves > biggest) {
			// 	biggest = moves[i].availMoves;
			// 	chosen = moves[i].move;
			// }
			if (moves[i].takeablePiece != "") {
				chosen = moves[i].move;
			}
		}
		if (chosen == -1) {
			for (var i = 0; i < moves.length; i++) {
				if (moves[i].availMoves > biggest) {
					biggest = moves[i].availMoves;
					chosen = moves[i].move;
				}
			}
		}

		return chosen;
	},
}


