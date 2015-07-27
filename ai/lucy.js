/*
 *  AI for AIBATTLE.net
 *  CodeName: Lucy
 *  Author: Vitali Malinouski
 *
 */

var ai = {
	name	: 'Lucy',
	author	: 'Vitali Malinouski',
	next	: function (field, moves) {
		// get random move
		var index = Math.floor(Math.random() * moves.length);
		return moves[index];
	}
}