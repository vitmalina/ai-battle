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


	next	: function (field, moves) {
		var moveStats = [];
		var chosen = 0;

		for (var i = 0; i < moves.length; i++) {
			var fieldInstance = pretendMove(field, moves[i]);
			var num = getMoves(fieldInstance, "b").length;
			moveStats.push({
				moveNum : num,
				move    : moves[i]
			});
		}

		
		chosen = ai.totalPoints(moveStats);

		return chosen;
	},


	totalPoints : function(moves) {
		var chosen  = 0;
		var biggest = 0;

		for (var i = 0; i < moves.length; i++) {
			if (moves[i].moveNum > biggest) {
				biggest = moves[i].moveNum;
				chosen = moves[i].move;
			}
		}

		return chosen;
	},
}


