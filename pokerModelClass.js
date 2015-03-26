function PokerModel()
{
	this._firstCard = -1;
	this._secondCard = -1;
	this._thirdCard = -1;
	this._fourthCard = -1;
	this._fifthCard = -1;
	this.cards = new CardDeckClass();
	this._cash = +500;
	this._bet = +0;
	this.cardNumbers = new Array();
    this.cardSuits = new Array();
}
		/*class PokerModel
    {
        var cards;
        var _firstCard { get; set; }
        var _secondCard { get; set; }
        var _thirdCard { get; set; }
        var _fourthCard { get; set; }
        var _fifthCard { get; set; }
        var _cash { get; set; }
        var _bet { get; set; }
        var _win { get; set; }
        */
      
PokerModel.prototype.GetHighCard = function()
{
	var resultsHighCard;
	this.cardNumbers.sort(function(a,b) {
    return a - b;
});
	if (this.cardNumbers[0] == 0)
			resultsHighCard = 0;
		else
			resultsHighCard = this.cardNumbers[4];
	return resultsHighCard;
};	  
PokerModel.prototype.checkHand = function()
{
	var exitInner = false;
	var jacks = false;
	var pair = false;
	var firstPair = false;
	var twoPair = false;
	var threeKind = false;
	var firstThreeKind = false;
	var fullHouse = false;
	var fourKind = false;
	var flush = true;
	var streight = true;
	var streightFlush = false;
	var royalFlush = false;
	this.cardNumbers = [];
	this.cardSuits = [];
	this.cardNumbers.push(this._firstCard % 13);
	this.cardNumbers.push(this._secondCard % 13);
	this.cardNumbers.push(this._thirdCard % 13);
	this.cardNumbers.push(this._fourthCard % 13);
	this.cardNumbers.push(this._fifthCard % 13);
	this.cardSuits.push(Math.floor(this._firstCard / 13));
	this.cardSuits.push(Math.floor(this._secondCard / 13));
	this.cardSuits.push(Math.floor(this._thirdCard / 13));
	this.cardSuits.push(Math.floor(this._fourthCard / 13));
	this.cardSuits.push(Math.floor(this._fifthCard / 13));
	var skipCards = new Array();
	var results;
	skipCards = [];
	for (i = 0; i < 5; i++)
	{
		exitInner = false;
		for(j = i+1; j<5; j++)
		{
			for (k = 0; k < skipCards.length; k++ )
			{
				if (i == skipCards[k])
				{
					exitInner = true;
					break;
				}
				else if (j == skipCards[k] && skipCards[k] < 4)
				{
					j++;
					break;
				}
			}
			if (exitInner)
				break;
				if (this.cardNumbers[i] == this.cardNumbers[j])
				{
					if (this.cardNumbers[i] > 9 || this.cardNumbers[i] == 0)
						jacks = true;
					flush = false;
					streight = false;
					if (fourKind)
					{
						break;
					}
					else if (threeKind)
					{
						fourKind = true;
						threeKind = false;
					}
					else if (pair)
					{
						if (firstPair)
						{
							fullHouse = true;
							firstPair = false;
						}
						else
						{
							threeKind = true;
							pair = false;
						}
					}
					else if (firstPair)
					{
						firstPair = false;
						twoPair = true;
					}
					else if(twoPair)
					{
						fullHouse = true;
						twoPair = false;
					}
					else
					{
						if (firstThreeKind)
						{
							fullHouse = true;
							firstThreeKind = false;
							
						}
						else
							pair = true;
					}
					skipCards.push(j);
				}
		}
		if(pair)
		{
			pair = false;
			firstPair = true;
		}
		else if(threeKind)
		{
			threeKind = false;
			firstThreeKind = true;
		}
	}
	if(flush)
		for (i = 0; i < 1; i++)
		{
			for(j = i + 1; j < 5; j++)
			{
				if(this.cardSuits[i] != this.cardSuits[j])
				{
					flush = false;
					break;
				}
			}
		}
	if (streight)
	{
		this.cardNumbers.sort(function(a,b) {
    return a - b;
});
		var streightCount = this.cardNumbers[4] - this.cardNumbers[0];
		var aceHigh = (this.cardNumbers[4] == 12 && this.cardNumbers[3] == 11 && this.cardNumbers[2] == 10 && this.cardNumbers[1] == 9 && this.cardNumbers[0] == 0);
		if (streightCount != 4)
			streight = false;
		if (aceHigh)
			streight = true;
	}
	if(flush && streight)
	{
		flush = false;
		streight = false;
		streightFlush = true;
	}
	if(streightFlush)
	{
		if(this.cardNumbers[4] == 12)
		{
			streightFlush = false;
			royalFlush = true;
		}
	}

	if(firstPair && !fullHouse)
	{
		if (jacks)
			results = 13;
		else
			results = this.GetHighCard();
	}
	else if(twoPair)
	{
		results = 14;
	}
	else if(firstThreeKind)
	{
		results = 15;
	}
	else if(fullHouse)
	{
		results = 16;
	}
	else if(fourKind)
	{
		results = 17;
	}
	else if (flush)
	{
		results = 18;
	}
	else if(streight)
	{
		results = 19;
	}
	else if (streightFlush)
	{
		results = 20;
	}
	else if (royalFlush)
	{
		results = 21;
	}
	else
	{

		results = this.GetHighCard();
	}

		return results;
};
        


  
    