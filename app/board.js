var board = (function() { 

	var selected;
 	var field; 
	var taken; 
	var places = 'abcdefgh'; 

 	return { 
		render 		: render, 
		refresh     : refresh,
		notation    : notation 
	} 

 	function refresh(fld, move) {
 		var spl = move.split(":");
 		var piece = $("#" + spl[0][0] + "-" + (spl[0][1]-1)).html();
		$("#" + spl[0][0] + "-" + (spl[0][1]-1)).html("");
		$("#" + spl[1][0] + "-" + (spl[1][1]-1)).html(piece);
	}

	function render(fld) {
		console.log(fld);
		var html = "";
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				// color of square
				var color = "#F0D9B5"; 
				var block = -1; 
				if (j%2) { 
					block = 0; 
				} else { 
					block = 1; 
				} 
				if ((i+block)%2) { 
					color = "#B58863"; 
				} 
				html += "<div class='square' style='background-color: " + color + "; left: " + (i*64) + "px; bottom: " + (j*64) + "px' id='" + places[i] + "-" + j + "'></div>";	 
			}
		}
		$("#board").html(html);
		
		for (var i in fld) {
			for (var j = 0; j < 8; j++) {
 				var piece = fld[i][j]; 
 				// allowing the piece to be slected
 				$("#" + i + "-" + j).click(select);
 				if (piece) { 
 					$("#" + i + "-" + j).html("<img src='img/" + piece + "' width='64px' height='64px'>");
				} 
				
			}
		}
	}

	function select() {
		var tmp = this.id.split("-");
		var i = tmp[0];
		var j = tmp[1];
		$("#" + i + "-" + j).each(function() {
		    if ($(this).find('img').length) {
		    	if (!selected) {
					selected = "#" + i + "-" + j;
				} else {
					$(selected).removeClass( "selected" );
					selected = "#" + i + "-" + j;
				}
				$(selected).addClass( "selected" );
		    }
		});
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