var board = (function() {

	var places = 'abcdefgh';

	return {
		render 		: render,
		selectPeice : selectPeice
	}

	function render(field) {
		var html = "";
		for (var i in field) {
			for (var j = 0; j < 8; j++) {

				var piece = field[i][j];

				var color = "white";
				var block = -1;
				if (j%2) {
					block = 1;
				} else {
					block = 0;
				}
				if ((places.indexOf(i)+block)%2) {
					color = "#C3C4C5";
				}

				

				if (piece) {

					var left = 0;
					var top = 0;

					if (piece.substr(1,2) == "p") {
						left = 11;
						top = 7;
					} else if (piece.substr(1,2) == "r") {
						left = 9;
						top = 7;
					}  else if (piece.substr(1,2) == "h") {
						left = 5;
						top = 7;
					} else if (piece.substr(1,2) == "b") {
						left = 3;
						top = 4;
					} else if (piece.substr(1,2) == "q") {
						left = 2;
						top = 5;
					} else if (piece.substr(1,2) == "k") {
						left = 5;
						top = 5;
					}

					html += "<div class='square' style='background-color: " + color + "; right: " + (places.indexOf(i)*64) + "px; bottom: " + (j*64) + "px' onclick='board.selectPeice(" + i + ", " + j + ")'>"
						 + "	<img src='img/" + piece + ".png' style='left : " + left + "px; top: " + top + "px'>"
						 + "</div>";	
				} else {
					html += "<div class='square' style='background-color: " + color + "; right: " + (places.indexOf(i)*64) + "px; bottom: " + (j*64) + "px'></div>";
				}
				
			}
		}
		$("#board").html(html);
	}

	function selectPeice() {

	}
}());