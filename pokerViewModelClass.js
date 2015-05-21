$(document).ready(pokerViewModel);

function pokerViewModel(){	
	var mainContainer = $("body")
		.append("<div id='main-container' class='main'>");
		
	var Body = $("#main-container")
		.append("<h1 id='title'></h1>");
		
	var right_container = $("<div id='right-container' class='btn-group' role='group'>").appendTo(Body);
	$("<button id='help' class='btn default-btn' role='button'>Pay outs</button>").appendTo(right_container);
	$("<button id='menu' class='btn default-btn' role='button'>Main Menu</button></div>").appendTo(right_container);
	
	$('#menu').click(function(){
		location.href='index.html';});
		
	$("<dl id='statusContainer'>").appendTo(Body);
	var card_div = $("<div id='card_div'></div>").appendTo(Body);
	$("<canvas id='cardContainer'></canvas>").appendTo(card_div);
	$("<div id='holdButtonContainer' class='btn-group'></div>").appendTo(Body);
	$("<div id='commandButtonContainer' class='btn-group-lg btn-group-justified' role='group'></div>").appendTo(Body);
	$("<p id='whoby'>Created by<br>Ryan Wilson</p>").appendTo(Body);
	
	
	var status = $("#statusContainer");
	
	status.append("<dt>Cash:</dt><dd id='cash' style='margin-right:50px;'>")
		.append("<dt>Bet:</dt><dd id='bet' style='margin-right:50px;'></dd>")
		.append("<dt>Status:</dt><dd id='winner' style='margin-right:100px;'></dd>");
	
	var title = $("#title");
	var Winner = $("#winner");
	var Canvas = $("#cardContainer");
	var cash = $("#cash");
	var bet = $("#bet");
	var holdbuttons = $("#holdButtonContainer");
	var commandButtons = $("#commandButtonContainer");
	
	var mouseDownCanvas = false;
	var cardImageLoaded = false;
	var _firstCardHold = false;
    var _secondCardHold = false;
    var _thirdCardHold = false;
    var _fourthCardHold = false;
    var _fifthCardHold = false;
	var cardImg = new Image(951,394);
	cardImg.src = "windows-playing-cards.png";
	cardImg.onload = function() {
		cardImageLoaded = true;
	}
	var cardsFliped = false;
	var poker = new PokerModel();
	var draw = 0;
	var holdCanvas =$("<canvas id='hold_area'></canvas>").appendTo(card_div);
	holdCanvas[0].width = $(document).width()*.5;
	holdCanvas[0].height = $(document).height()*.3;
	holdCanvas.css('z-index','5').on("click",canvasClickEvent);
    Canvas[0].width = $(document).width()*.5;
	Canvas[0].height = $(document).height()*.3;
	Canvas.css({'position':'absolute','z-index':'-1'});
	cash.html(poker._cash);
	title.attr("class","title").html("Video Poker Game");
	Winner.attr("class","winDisplay").html("This is Where a win is shown");
	$("#help").on("click",help);
	
	
	for(var i = 1;i <= 5; i++){
		$("<button id=\'holdbutton_"+i+"\'></button>").appendTo(holdbuttons);
		$("#holdbutton_"+i).attr("class","btn default-btn").css('display','none')
			.html("HOLD")
			.on("click", holdButtonHandle);
	}
	for(var i = 1;i <= 4; i++){
		$("<div class='btn-group' role='group'><button id=\'commandbutton_"+i+"\'></button></div>").appendTo(commandButtons);
		$("#commandbutton_"+i).attr("class","btn default-btn")
			.text((i==1) ? "Deal" : (i==2) ? "Max Bet" : (i==3) ? "Add 5" : (i==4) ? "Remove 5" : "")
			.on("click",commandButtonHandle)
			.on("mouseover",mouseEnter)
			.on("mouseleave",mouseLeave);
	}
	flipCards();
	/*
	 *	callback function for the hold buttons
	 */
	function holdButtonHandle(){
		if(draw ===1){
			ctx = holdCanvas[0].getContext("2d");
			ctx.font="70px Arial";
			ctx.fillStyle = 'black';
			var cardWidth = Canvas.width()/5;
			switch(this.id){
				case "holdbutton_1":
					if(_firstCardHold){
						_firstCardHold=false;
						ctx.clearRect(0,0,cardWidth,holdCanvas.height());
					}else{
						_firstCardHold = true;
						ctx.fillRect(0,holdCanvas.height()/2-80,cardWidth,100);
						ctx.fillStyle = 'white';
						ctx.fillText("Held",10,holdCanvas.height()/2);
					}
					break;
				case "holdbutton_2":
					if(_secondCardHold){
						_secondCardHold=false;
						ctx.clearRect(cardWidth,0,cardWidth,holdCanvas.height());
					}else{
						_secondCardHold = true;
						ctx.fillRect(cardWidth,holdCanvas.height()/2-80,cardWidth,100);
						ctx.fillStyle = 'white';
						ctx.fillText("Held",10+cardWidth,holdCanvas.height()/2);
					}
					break;
				case "holdbutton_3":
					if(_thirdCardHold){
						_thirdCardHold = false;
						ctx.clearRect(2*cardWidth,0,cardWidth,holdCanvas.height());
					}else{
						_thirdCardHold = true;
						ctx.fillRect(2*cardWidth,holdCanvas.height()/2-80,cardWidth,100);
						ctx.fillStyle = 'white';
						ctx.fillText("Held",10+2*cardWidth,holdCanvas.height()/2);
					}
					break;
				case "holdbutton_4":
					if(_fourthCardHold){
						_fourthCardHold = false;
						ctx.fillStyle = 'white';
						ctx.clearRect(3*cardWidth,0,cardWidth,holdCanvas.height());
					}else{
						_fourthCardHold = true;
						ctx.fillRect(3*cardWidth,holdCanvas.height()/2-80,cardWidth,100);
						ctx.fillStyle = 'white';
						ctx.fillText("Held",10+3*cardWidth,holdCanvas.height()/2);
					}
					break;
				case "holdbutton_5":
					if(_fifthCardHold){
						_fifthCardHold = false;
						ctx.clearRect(4*cardWidth,0,cardWidth,holdCanvas.height());
					}else{
						_fifthCardHold = true;
						ctx.fillRect(4*cardWidth,holdCanvas.height()/2-80,cardWidth,100);
						ctx.fillStyle = 'white';
						ctx.fillText("Held",10+4*cardWidth,holdCanvas.height()/2);
					}
					break;
			}
			if($(this).hasClass("held"))
				$(this).removeClass("held");
			else
				$(this).addClass("held");
		}
	}
	
	/*
	 *	callback function for the command buttons
	 */
	function commandButtonHandle(){
		switch(this.id){
			case "commandbutton_1":
				onDealCardsClicked();
				break;
			case "commandbutton_2":
				onMaxBetClicked();
				break;
			case "commandbutton_3":
				onAddFiveClicked();
				break;
			case "commandbutton_4":
				onRemoveFiveClicked();
				break;
		}
	}
	function mouseEnter(){
		$(this).addClass("hover");
	}
	function mouseLeave(){
		$(this).removeClass("hover");
	}
	
	/*
	 *	Displays the payouts
	 */
	function help() {
		alert("One Pair             = 1 X BET\nTwo Pair            = 2 X BET\nThree of a Kind = 3 X BET\nFull House        = 9 X BET\nFour of a Kind  = 25 X BET\
		\nFlush                 = 6 X BET\nStraight             = 4 X BET\nStraight Flush   = 50 X BET\nRoyal Flush       = 250 X BET");
	}
	
	/*
	 * callback function for the maximum bet
	 */
	function onMaxBetClicked(){
		if(draw !=0){
			alert("You already bet try hitting the deal button.");
			return;
		}
		if(!cardsFliped)
			flipCards();
		if(poker._bet < +50 && poker._cash >= +50){
			resetHeld();
			var temp = poker._bet;
			poker._bet = +50;
			poker._cash -= (50 - temp);
			
			//onDealCardsClicked();
		}else if(poker._bet < +50 && poker._cash < +50){
			var remanderBet = 50 - poker._bet;
			if (remanderBet < poker._cash){
				poker._bet = +50;
				poker._cash -= remanderBet;
			}else{
				poker._bet += poker._cash;
				poker._cash = 0;
			}
		}
		bet.html(poker._bet);
		cash.html(poker._cash);
	}

	/*
	 *	Callback function that checks if the card image is clicked and selects hold for the correct card
	 */
	function canvasClickEvent(e){
			var mouseX = $(this).offset().left, mouseY = $(this).offset().top;
			console.log("clicked the canvas");
			switch(Math.floor((e.pageX - mouseX)/(this.width/5)%5)){
			case 0:
				$("#holdbutton_1").trigger("click");
				break;
			case 1:
				$("#holdbutton_2").trigger("click");
				break;
			case 2:
				$("#holdbutton_3").trigger("click");
				break;
			case 3:
				$("#holdbutton_4").trigger("click");
				break;
			case 4:
				$("#holdbutton_5").trigger("click");
				break;
			default:
				console.log("error didn't detect where the click came from");
				break
			}
			return false;
	}

	/*
	 *  Call back function for the remove 5 to bet button
	 *	This removes 5 to the bet and adds 5 from cash
	 */
	function onRemoveFiveClicked(){
		if(poker._bet > 0 && draw == 0){
			if(!cardsFliped)
				flipCards();
			resetHeld();
			poker._bet -= +5;
			poker._cash += +5;
			
		}
		bet.html(poker._bet);
		cash.html(poker._cash);
	}
	/*
	 *  function to reset the held fields
	 */
	function resetHeld(){
		var heldCtx = holdCanvas[0].getContext("2d");
		_firstCardHold = _secondCardHold = _thirdCardHold = _fourthCardHold = _fifthCardHold = false;
		$(".held").removeClass("held");
		heldCtx.clearRect(0,0,holdCanvas.width(),holdCanvas.height());
	}
	/*
	 *  Call back function for the add 5 to bet button
	 *	This adds 5 to the bet and removes 5 from cash
	 */
	function onAddFiveClicked(){
		if (poker._bet < +50 && poker._cash >= +5){
			if(!cardsFliped)
				flipCards();
			resetHeld();
			poker._bet += +5;
			poker._cash -= +5;
		}
		bet.html(poker._bet);
		cash.html(poker._cash);
	}

	/*
	 *	shows the card back for the cards to show the hand is over
	 */
	function flipCards(){
		cardsFliped = true;
		var img = new Image(218,310);
		img.src = "animal-grab-back.jpg";
		ctx = Canvas[0].getContext("2d");
		var cardWidth = Canvas.width()/5;
		img.onload = function() {
			for(var i = 0; i < 5;i++){
				ctx.drawImage(img,0,0,img.width,img.height,i*cardWidth,0,cardWidth,Canvas.height());
			}
		}
	}
	
	/*
	 *	Checks if the game has ended
	 */
	function GameEnd(){
			if(poker._cash == 0 && poker._bet == 0)
				alert("Thanks for playing better luck next time.\nRefresh the browser to start a new game.");
	}
	
	/*
	 *	callback function when the deal cards button is clicked
	 */	
	function onDealCardsClicked(){
		if(poker._bet > 0){
			$("#commandbutton_2").off("click").addClass("disabled");
			$("#commandbutton_3").off("click").addClass("disabled");
			$("#commandbutton_4").off("click").addClass("disabled");
			cardsFliped = false;
			switch (draw){
				case 0:
					
					poker.cards.shuffle();
					resetHeld();
					firstCard = poker.cards.dealCard();
					secondCard = poker.cards.dealCard();
					thirdCard = poker.cards.dealCard();
					fourthCard = poker.cards.dealCard();
					fifthCard = poker.cards.dealCard();
					draw++;
					Winner.html("Draw " + draw);
					break;
				/*case 1:
					if(!_firstCardHold)
						firstCard = poker.cards.dealCard();
					if(!_secondCardHold)
						secondCard = poker.cards.dealCard();
					if(!_thirdCardHold)
						thirdCard = poker.cards.dealCard();
					if(!_fourthCardHold)
						fourthCard = poker.cards.dealCard();
					if(!_fifthCardHold)
						fifthCard = poker.cards.dealCard();
					draw++;
					Winner.html("Draw " + draw);
					break;*/
				case 1:
					cardsFliped = false;
					if(!_firstCardHold)
						firstCard = poker.cards.dealCard();
					if(!_secondCardHold)
						secondCard = poker.cards.dealCard();
					if(!_thirdCardHold)
						thirdCard = poker.cards.dealCard();
					if(!_fourthCardHold)
						fourthCard = poker.cards.dealCard();
					if(!_fifthCardHold)
						fifthCard = poker.cards.dealCard();
					draw = 0;
					resetHeld();
					break;
			}
			refresh();
		}else{
			alert("no bet");
		}
	}
	
	/*
	 *	quickly updates the colors of the text dom
	 */
	function flashText(dom){
		var colors  = [ 'red', 'green', 'blue', 'black', 'yellow', 'pink' ];
		var current = 0;
		var timer = 0;
		var myinterval = setInterval(function(){
			dom[0].style.color = colors[current];
			current = (current + 1) % colors.length;
			if(timer === 50){
				clearInterval(myinterval);
				dom[0].style.color='black';
			}
			timer++;
		}, 50);
	}

	/*
	 *	Refreshes the UI elements
	 */
	function refresh(){
		poker._firstCard = firstCard.number; 
		poker._secondCard = secondCard.number; 
		poker._thirdCard = thirdCard.number;  
		poker._fourthCard = fourthCard.number;  
		poker._fifthCard = fifthCard.number;  
		
		ctx = Canvas[0].getContext("2d");
		var canCardWidth = Canvas.width()/5;
		var cardImgWidth = cardImg.width/13;
		var cardImgHeight = cardImg.height/4;
		
		
		ctx.drawImage(cardImg,firstCard.x*cardImgWidth,firstCard.y*cardImgHeight,cardImgWidth,cardImgHeight,0*canCardWidth,0,canCardWidth,Canvas.height());
		ctx.drawImage(cardImg,secondCard.x*cardImgWidth,secondCard.y*cardImgHeight,cardImgWidth,cardImgHeight,1*canCardWidth,0,canCardWidth,Canvas.height());
		ctx.drawImage(cardImg,thirdCard.x*cardImgWidth,thirdCard.y*cardImgHeight,cardImgWidth,cardImgHeight,2*canCardWidth,0,canCardWidth,Canvas.height());
		ctx.drawImage(cardImg,fourthCard.x*cardImgWidth,fourthCard.y*cardImgHeight,cardImgWidth,cardImgHeight,3*canCardWidth,0,canCardWidth,Canvas.height());
		ctx.drawImage(cardImg,fifthCard.x*cardImgWidth,fifthCard.y*cardImgHeight,cardImgWidth,cardImgHeight,4*canCardWidth,0,canCardWidth,Canvas.height());
		if(draw == 0){
			isWinner();
			payout();
			flashText(Winner);
			$("#commandbutton_2").on("click",commandButtonHandle).removeClass("disabled");
			$("#commandbutton_3").on("click",commandButtonHandle).removeClass("disabled");
			$("#commandbutton_4").on("click",commandButtonHandle).removeClass("disabled");
		}
		
	}

	function payout(){
		poker._cash += poker._bet * _winMultiplier;
		poker._bet = +0;
		bet.html(poker._bet);
		cash.html(poker._cash);
		GameEnd();
		
	}
      
	function isWinner(){
		var result = poker.checkHand();
		var StringResults = "";
		if (result >= 0 && result <= 12){
			_winMultiplier = 0;
			StringResults = "Jacks or Better to Win, High card is ";
			switch(result){
			case 0:
				StringResults += "Ace";
				break;
			case 12:
				StringResults += "King";
				break;
			case 11:
				StringResults += "Queen";
				break;
			case 10:
				StringResults += "Jack";
				break;
			default:
				var temp = result + 1;
				StringResults += temp.toString();
				break;
			}
		}else{
			switch (result){
				
				case 13:
					StringResults = "Winner One Pair";
					_winMultiplier = 1;
					break;
				case 14:
					StringResults = "Winner Two Pair";
					_winMultiplier = 2;
					break;
				case 15:
					StringResults = "Winner Three of a Kind";
					_winMultiplier = 3;
					break;
				case 16:
					StringResults = "Winner Full House";
					_winMultiplier = 9;
					break;
				case 17:
					StringResults = "Winner Four of a Kind";
					_winMultiplier = 25;
					break;
				case 18:
					StringResults = "Winner Flush";
					_winMultiplier = 6;
					break;
				case 19:
					StringResults = "Winner Straight";
					_winMultiplier = 4;
					break;
				case 20:
					StringResults = "Winner Straight Flush";
					_winMultiplier = 50;
					break;
				case 21:
					StringResults = "Winner Royal Flush, good job";
					_winMultiplier = 250;
					break;
				default:
					StringResults = "Error With Checking Cards";
					_winMultiplier = 1;
					break;
			}
		}
		Winner.html(StringResults);
	}
}
