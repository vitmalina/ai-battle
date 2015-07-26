var board = (function() {

	var places = 'abcdefgh';
	return {
		render 		: render,
		selectPeice : selectPeice,
		notation    : notation
	}

	function render(field) {
		var html = "";
		for (var i in field) {
			for (var j = 0; j < 8; j++) {

				var piece = field[i][j];

				var color = "#F0D9B5";
				var block = -1;
				if (j%2) {
					block = 1;
				} else {
					block = 0;
				}
				if ((places.indexOf(i)+block)%2) {
					color = "#B58863";
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

					html += "<div id='" + places.indexOf(i) + ", " + j + "' class='square' style='background-color: " + color + "; left: " + (places.indexOf(i)*64) + "px; bottom: " + (j*64) + "px' onclick='board.selectPeice(" + places.indexOf(i) + ", " + j + ")'>"
						 + "	<img src='img/" + piece + ".png' style='left : " + left + "px; top: " + top + "px'>"
						 + "</div>";	
				} else {
					html += "<div class='square' style='background-color: " + color + "; left: " + (places.indexOf(i)*64) + "px; bottom: " + (j*64) + "px'></div>";
				}
				
			}
		}
		$("#board").html(html);
	}

	function selectPeice(i, j) {
		console.log(places[i], j);
	}

	function notation() {
		for (var i = 0; i < 8; i++) {
			$(".board-holder").append("<div class='block notation' style='top: " + (512-((i+1)*64-32)) + "px; left: 2px'>" + (i+1) + "</div>");
		}
		for (var i = 0; i < 8; i++) {
			$(".board-holder").append("<div class='block notation' style='left: " + (i*64+44) + "px; bottom: -1px'>" + places[i] + "</div>");
		}
	}
}());