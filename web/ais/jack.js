/*
 *  AI for AIBATTLE.net
 *  CodeName: Jack
 *  Author: Kirill Shpin
 *
 */

 var ai = {

 	///// Manditory Info /////
	name	: 'Jack',
	author	: 'Kirill Shpin',
	
	next	: function (game) {
		var field = game.field;
		var moves = game.moves;

		if (!ai.me) {
			ai.me = field[moves[0][0]][parseInt(moves[0][1])][0];
			ai.enemy = ai.me == "w" ? "b" : "w";
		}

		var myMove = null;
		var enemyMove = null;
		var modField = field;
		var modMoves = moves;
		// for (var i in moves) {
		// 	myMove = ai.think(
		// 		field,
		// 		moves
		// 	);
		// 	modField = pretendMove(
		// 		field,
		// 		myMove
		// 	);
		// 	modMoves = getMoves(
		// 		modField,
		// 		ai.enemy
		// 	);
			
		// 	enemyMove = ai.think(
		// 		modField,
		// 		modMoves
		// 	);
		// 	if (!enemyMove.split(":")[2]) break;
		// }

		// /*var myNextMove = pretendMove(
		// 	enemyMove,
		// 	ai.think(
		// 		enemyMove,
		// 		getMoves(
		// 			enemyMove,
		// 			ai.me
		// 		)
		// 	),
		// 	ai.me
		// );*/

		if (!myMove) myMove = ai.think(field, moves);

		return myMove;
	},

	think	: function (field, moves) {
		var chosen = null;
		for (var num in moves) {
			var tmp = moves[num].split(":");
			if (tmp[2]) {
				switch (tmp[2][1]) {
					case "p": chosen = num; break;
					case "h": chosen = num; break;
					case "b": chosen = num; break;
					case "r": chosen = num; break;
					case "q": chosen = num; break;
				}
			}
		}

		var most = 0;
		if (!chosen) {
			chosen = Math.floor(Math.random()*moves.length);
		}
		return moves[chosen];
	}
}