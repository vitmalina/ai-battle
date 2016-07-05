/*
*  AI for AIBATTLE.net
*
*/

var ai = {
	name	: 'Randy',
	author	: 'Vitali Malinouski',
	desc    : 'Very simple. Makes a random move',
	next	: function (game) {
		var field = game.field;
		var moves = game.moves;
		var index = Math.floor(Math.random() * moves.length);
		return moves[index];
	}
}