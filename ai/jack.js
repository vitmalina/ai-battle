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


	next	: function (field, moves) {
		var myColor = "w";
		var oppColor = "b";
		var chosen = null;

		for (var num in moves) {
			var tmp = moves[num].split(":");
			if (tmp[2]) chosen = moves[num];
		}

		var most = 0;
		if (!chosen) {
			for (var num in moves) {
				var newField = pretendMove(moves[num]);
				var newFieldMoves = getMoves(newField, myColor).length;

				if (most < newFieldMoves) {
					most = newFieldMoves;
					chosen = moves[num];
				}
			}
		}

		console.log(moves);

		return chosen;
	},
}