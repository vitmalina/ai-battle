/*
*  AI for AIBATTLE.net
*
*/

var ai = {
	name	: 'Lucy',
	author	: 'Vitali Malinouski',
	next	: function (game) {
		//console.log(game);
		// console.time('move');
		// get random move
		var index = Math.floor(Math.random() * game.moves.length);
		// Kill if it can
		for (var i = 0; i < game.moves.length; i++) {
			var move = game.moves[i].split(':');
			if (move.length == 3) {
				index = i;
				break;
			}
		}
		// console.timeEnd('move');
		return game.moves[index];
	}
}