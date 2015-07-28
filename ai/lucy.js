/*
*  AI for AIBATTLE.net
*
*/

var ai = {
	name	: 'Lucy',
	author	: 'Vitali Malinouski',
	next	: function (field, moves) {
		var tmp = moves[0].split(':')[0];
		var my  = field[tmp[0]][parseInt(tmp[1])-1][0]; // my color
		var op  = (my == 'w' ? 'b' : 'w');			    // oponent color
		// get random move
		var index = Math.floor(Math.random() * moves.length);
		// score moves
		for (var i = 0; i < moves.length; i++) {
			var move = moves[i].split(':');
			if (move.length == 3) {
				index = i;
				break;
			}
		}
		return moves[index];
	}
}