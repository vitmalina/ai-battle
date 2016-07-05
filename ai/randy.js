/*
*  AI for AIBATTLE.net
*
*/

var ai = {
	name	: 'Randy',
	author	: 'Vitali Malinouski',
	desc    : 'Very simple. Makes a random move',
	next	: function (field, moves) {
		var index = Math.floor(Math.random() * moves.length);
		return moves[index];
	}
}