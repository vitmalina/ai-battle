var board = (function() { 

 	var field; 
	var taken; 
	var places = 'abcdefgh'; 

 	return { 
		render 		: render, 
		selectPiece : selectPiece, 
		notation    : notation 
	} 

 	function render(fieldCopy, possible, clicked, takenCopy) { 
		if (fieldCopy) { 
			field = fieldCopy; 
		} 
		if (takenCopy) { 
			taken = takenCopy; 
		} 
		var html = ""; 
		for (var i in field) { 
			for (var j = 0; j < 8; j++) { 
				var poss = false; 
				for (var n = 0; n < possible.length; n++) { 
					if (possible[n].substr(3,2) == (i+(j+1))) { 
						poss = true; 
					} 
				} 
				var extra = ""; 
				if (clicked == (i+(j+1)) && possible.length > 0) { 
					extra = "background-color: rgba(61,106,242,1)"; 
				} 
				var snip = ""; 
				if (poss) { 
					snip = "<div class='block' style='height: 64px; width: 64px;' onclick='engine.move(\"" + clicked + ":" + (i+(j+1)) + "\")'><div class='poss'></div></div>"; 
				} 

 				var piece = field[i][j]; 

 				var color = "#F0D9B5"; 
				var block = -1; 
				if (j%2) { 
					block = 0; 
				} else { 
					
					block = 1; 
				} 
				if ((places.indexOf(i)+block)%2) { 
					color = "#B58863"; 
				} 

 				if (piece) { 
					var rotation = ""; 
					if (engine.turn == "b" && engine.player1 == null && engine.player2 == null) { 
						rotation = "transform: rotate(180deg)"; 
					} 

 					html += "<div class='square' style='background-color: " + color + ";" + extra + "; left: " + (places.indexOf(i)*64) + "px; bottom: " + (j*64) + "px' " 
						 + "		onclick='board.selectPiece(" + places.indexOf(i) + ", " + j + ")'>" 
						 + "	<img src='img/" + piece + ".png' style='" + rotation + "' class='piece' id='" + places.indexOf(i) + "-" + j + "'>"  
						 +		snip  
						 + "</div>";	 
				} else { 
					html += "<div class='square' style='background-color: " + color + "; left: " + (places.indexOf(i)*64) + "px; bottom: " + (j*64) + "px'>" + snip + "</div>"; 
				} 
				 
			} 
		} 
		$("#board").html(html); 
	} 

 	function selectPiece(i, j) {
		var i = places[i]; 
		var moves = engine.getMoves(); 
		var poss = []; 
		for (var n = 0; n < moves.length; n++) { 
			if (moves[n].substr(0,2) == (i+(j+1))) { 
				poss.push(moves[n]); 
			} 
		}  
		board.render(null, poss, (i+(j+1)), false); 
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