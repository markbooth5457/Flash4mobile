
function CardDeck()
{
  this.cards = new Array();       // array of Card instances. i.e. the deck
  this.side = 0;            // 0=front, 1=back
  this.first = 0;           // display front/back first
  this.card = 0;            // which card is currently being displayed
  this.flagger = 0;         // flagger mode where we only show flagged cards
 // this.displayCard = showFunc; // function provided by calling module to display card(s)
  var self = this;
  
  // adds card to the deck
  this.addCard = function (front, back)
  {
    var card = new Card(front, back);
    self.cards.push(card);
  }

  // returns current card object 
  this.getCard = function ()			
  {
    return self.cards[self.card];
  }

  this.isEmpty = function ()
  {
    if (self.cards.length == 0) return 1;
    else return 0;
  }


  this.nextCard = function ()
  {
    count = 0; // avoid infinite loop if no cards flagged and flagger set
    do
    {
        count++;
        self.card = (self.card+1)%self.cards.length // modulo to wrap
    } while ((self.flagger > 0 && self.cards[self.card].flag == 0) && count < self.cards.length);
  }

  this.flag = function ()
  {
    if (self.cards[self.card].flag == 1)  // card is flagged, we need to unflag it
    {
      self.cards[self.card].flag = 0;     // unflag the card
    }
    else
    {
      self.cards[self.card].flag = 1;     // flag
    }
//    self.displayCard();
  }
  
  // flip flagger: when on, only scan through cards that have been "flagged"
  this.setFlagger = function ()
  {
    if (self.flagger == 0)
    {
      self.flagger = 1;
      return "All cards";
    }
    else
    {
      self.flagger = 0; 
      return "Flagged cards only";      
    }
  }
  
  this.forward = function ()
  {
//    if (self.side == 0)        // looking at front, so show the back of the card
//    {
//      self.side = 1;
//    }
//    else                       // show next card - front
//    {
//      self.side = 0;
      this.side=this.first;     // show preferred side
      self.nextCard();
//    }
//    self.displayCard();
  }

  this.flip = function ()
  {
    if (self.side == 0)        // looking at front, so show the back of the card
    {
      self.side = 1;
    }
    else                       // show next card - front
    {
      self.side = 0;
    }
  //  self.displayCard();
  }
  
  this.prevCard = function ()
  {
      count = 0; // avoid infinite loop if no cards flagged and flagger set
      do
      {
        count++;
        // step back through array for the previous card
        if (self.card == 0) // at start of array?
        {
          self.card = (self.cards.length - 1);
        }
        else
        {
          self.card--;
        }
      } while ((self.flagger == 1 && self.cards[self.card].flag == 0) && count < self.cards.length)    
  }

  this.backward = function ()
  {
//    if (self.side == 1)  // at the back of the card? then show the front
//    {
//      self.side = 0;
//    }
//    else   // show previous card - back???
//    {
//      self.side = 1;
      this.side=this.first;     // show preferred side
      self.prevCard();  
//    } 
 //   self.displayCard();
  }

  this.shuffle = function ()
  {
    // go through deck and give each card a new location.
    var tmp = new Card();
    for (var index = self.cards.length - 1; index > 0; index--)
    {
      var r = Math.floor(Math.random()*index);
      tmp = self.cards[index];
      self.cards[index] = self.cards[r];
      self.cards[r] = tmp;
    }
//    self.displayCard();
  }

}

// Object: Card
function Card(f, b)
{
  this.frontText = f;    
  this.backText = b;     
  this.flag = 0;         
}
