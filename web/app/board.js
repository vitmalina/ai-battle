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
 					$("#" + i + "-" + j).html("<img src='img/" + piece + ".png' width='64px' height='64px'>");
				} 
				
			}
		}
	}

	function select() {
		var tmp = this.id.split("-");
		var i = tmp[0];
		var j = tmp[1];
		j = parseInt(j);
		var moves = engine.getMoves();
		$("#" + i + "-" + j).each(function() {
			$("div.poss").remove();
			if ($(this).hasClass("possibleMove")) {
				$("#board div").removeClass("selected");
				var tmp = selected[1]+(parseInt(selected[3])+1)+":"+ $(this).closest("div").attr("id")[0]+(parseInt($(this).closest("div").attr("id")[2])+1);
				engine.move(tmp);
				$("#board div").removeClass("possibleMove");
			} else if ($(this).find('img').length && moves.length && $(this).find('img').attr("src").substr(4,1) == engine.turn) {
				$("#board div").removeClass("possibleMove");
				if (selected == null) {
					selected = "#" + i + "-" + j;
				} else {
					$(selected).removeClass( "selected" );
					selected = "#" + i + "-" + j;
				}
				$(selected).addClass( "selected" );
				for (var n = 0; n < moves.length; n++) {
					var temp = moves[n].split(":");
					var id = temp[1].substr(0,1)+"-"+(parseInt(temp[1].substr(1,1))-1);
					if (temp[0].substr(0,1)+(parseInt(temp[0].substr(1,1))-1) == (i+j)) {
						$("#"+id).append("<div class='poss'></div>");
						$("#"+id).addClass("possibleMove");
					}
				}
			} else {
				$("#board div").removeClass("possibleMove");
				selected = null;
		    	$("#board div").removeClass("selected");
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