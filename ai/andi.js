/*
 *  AI for AIBATTLE.net
 *  CodeName: Andi
 *  Author: Vladimir Malinouski
 *
 */

 var ai = {
	name	: 'Andi',
	author	: 'Vladimir Malinouski',
	next	: function (field, moves) {
		var chosen;

		var totalMove = [];

		for (var i = 0; i < moves.length; i++) {
			var fieldInstance = pretendMove(field, moves[i]);
			var num = getMoves(fieldInstance, "b").length;
			totalMove.push({
				moveNum : num,
				move    : moves[i]
			});
		}
		//console.log(totalMove);

		var place = 0;
		var biggest = 0;

		for (var i = 0; i < totalMove.length; i++) {
			if (totalMove[i].moveNum > biggest) {
				biggest = totalMove[i].moveNum;
				place = totalMove[i].move;
			}
		}





		return place;
	}
}