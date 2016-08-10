
function CardDeck()
{
  this.cards = new Array();       // array of Card instances. i.e. the deck
  this.side = 0;            // 0=front, 1=back
  this.first = 0;           // display front/back first
  this.card = 0;            // which card is currently being displayed
  this.flagger = false;         // flagger mode where we only show flagged cards
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
    if (self.cards.length == 0) return true;
    else return false;
  }


  this.nextCard = function ()
  {
    count = 0; // avoid infinite loop if no cards flagged and flagger set
    do
    {
        count++;
        self.card = (self.card+1)%self.cards.length // modulo to wrap
    } while ((self.flagger  && !self.cards[self.card].flag) && count < self.cards.length);
  }

  this.flagToggle = function ()
  {
    self.cards[self.card].flag = !self.cards[self.card].flag;
  }

  // flip flagger: when on, only scan through cards that have been "flagged"
  this.setFlagger = function ()
  {
    self.flagger = !self.flagger;
  }

  this.forward = function ()
  {
    this.side=this.first;     // show preferred side
    self.nextCard();
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
      } while ((self.flagger && !self.cards[self.card].flag ) && count < self.cards.length)
  }

  this.backward = function ()
  {
    this.side=this.first;     // show preferred side
    self.prevCard();
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
  }

}

// Object: Card
function Card(f, b)
{
  this.frontText = f;
  this.backText = b;
  this.flag = false;
}
