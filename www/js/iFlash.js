// window.onorientationchange = function() { return false;}
window.addEventListener('orientationchange', function() {
  var orient = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
  var cl = document.body.className;
  cl = cl.replace(/portrait|landscape/, orient);
  document.body.className = cl;
}, false);
// global variables
var deck = new CardDeck(flashShowFunction);
var cardFolder = "Flash/";
var seeit = false;
var topicItems = {};
var topicName; // carries from one page to next for some reason?

var both; // = $("#bothsides").checked;
var autoflip = false;
var timer; // for automation
var delay = 2; // how many secs to delay automation


// displays current card object for Flash
function flashShowFunction()
{
  var curCard = this.getCard();	// get current card
  if(curCard.flag) tag = "---";
  else tag = "";
  this.first = ($("#backfirst").checked) ? 1 : 0;
  if(this.first == 0 && !both)
  {
    setFront("<p>"+curCard.frontText+"</p><p>"+tag+"</p>");
    setBack("<p>"+curCard.backText+"</p><p>"+tag+"</p>");
  }
  if (!this.first == 0 && !both)
  {
    setBack("<p>"+curCard.frontText+"</p><p>"+tag+"</p>");
    setFront("<p>"+curCard.backText+"</p><p>"+tag+"</p>");
  }
  if (this.first == 0 && both)
  {
    setFront("<p>"+curCard.frontText + "</p><p>" + curCard.backText+"</p><p>"+tag+"</p>");
  }
  if (!this.first == 0 && both)
  {
    setFront("<p>"+curCard.backText + "</p><p>" + curCard.frontText+"</p><p>"+tag+"</p>");
  }
}

function setBack(text)
{
  $("#back").html(text);

}

function setFront(text)
{
  $("#front").html(text);

}

function setup()
{
  /*if(!window.navigator.onLine) //TODO: change this to use localstorage
  {
    // try to set up from stored deck
    restore();
    return;
  }*/

  XMLReqObj(cardFolder+"topics.xml",buildTopicList);

  //setOrientation();
}

// fill Topics list with items from the XML topics document
// callback after setup()
function buildTopicList(httprequest) {
  var xml = httprequest;// .responseXML;
  var topicList = $("#topicList");
  var topics = xml.getElementsByTagName("topic");
  var file; var title;
  // loop through <topics> elements, adding them to the topicList element with entry the <topicname>
  // and add each nested <item> element to an array for later populating the items select element
  for (var i = 0; i < topics.length; i++) {
    // add the topic to the list
    topicName = getElementTextNS("", "topicname", topics[i], 0);
    appendToList(topicList, topicName, liTopicSelected );
    // within each topic, save the <item>s in an associative array on <topicname>
    topicItems[topicName] = {};
    var items = topics[i].getElementsByTagName("item");
    for (var j = 0; j < items.length; j++)
    {
      file = getElementTextNS("", "file", items[j], 0);
      title = getElementTextNS("", "title", items[j], 0);
      topicItems[topicName][title] = file;
    }
  }
}

//handle click on file list item
function liTopicSelected(event)
{
  topicName = $(event.target).html();
  loadFileList(topicName);
}

function loadFileList(topic)
{
  App.load('filepage', {topic: topic});
}

//handle click on topic list item
function liFileSelected(event)
{
  var selectedElement = $(event.target).html();
  var file = topicItems[topicName][selectedElement];
  stopAuto();
  XMLReqObj(cardFolder+file, buildDeckFromXML);
  //App.load('apppage');
}

// add cards with items from
// the current XML document
function buildDeckFromXML(xml)
{
  stopAuto();
  deck = new CardDeck(flashShowFunction); // assum Flash, but change later
  var items = xml.getElementsByTagName("c");
  var front;
  var back;
  localStorage.clear();
  // loop through <c> elements, and add a card to the deck and to localstorage
  // using the <f> and <b> elements
  for (var i = 0; i < items.length; i++)
  {
    front = getElementTextNS("", "f", items[i], 0);
    back = getElementTextNS("", "b", items[i], 0);
    deck.addCard(front,back);
    localStorage.setItem(i+"f", front);
    localStorage.setItem(i+"b", back);
  }
  App.load("cardpage");
}

function restore() // deck from local storage
{
  var front;
  var back;
  deck = new CardDeck(flashShowFunction);
  // loop through localstorage
  // and set front and back elements
  for (var i = 0; i < localStorage.length; i++)
  {
    front = localStorage.getItem(i+"f");
    back = localStorage.getItem(i+"b");
    deck.addCard(front,back);
  }
  containerDiv = $("#container");
  deck.displayCard();
}

// add item to list
function appendToList(list, content, method)
{
  $("<li>"+content+"</li>").on('click', method).addClass("app-list arrow").appendTo(list);
}

// empty select list content
function clearList(select)
{
  select.empty();
}

// flash cards code

function marked()
{
  deck.setFlagger();
}

function flip(event)
{
  stopAuto();
  var element = event.currentTarget;
  var x = Math.abs(event.offsetX);
  var y = Math.abs(event.offsetY);
  var w;// = 258 iPhone constants
  var h;// = 340
  w = element.clientWidth;
  h = element.clientHeight;
  var left = x < w/3;
  var right = x > 2*w/3;
  var middle = (!left && !right);
  var top = y < h/2;
  var bottom = !top;
  if (left && top)
  {
    deck.backward();
  }
  if (right && top)
  {
    deck.forward();
  }
  if (middle && top)
  {
    // if(element.className == 'card')
    // {
    //   element.className =  'card flipped';
    //   deck.side == 1;
    // }
    // else
    // {
    //   element.className =  'card';
    //   deck.side == 0;
    // }
    deck.side = 1 - deck.side;
    $(element).toggleClass("flipped");
  }
  if (middle && bottom)
  {
    deck.flag();
  }
  if(bottom && left)
  {
    if(element.className == 'card' && !both)
    {
      $(element).toggleClass("flipped");
      deck.side == 1;
      deck.backward();
    }
    else
    {
      $(element).toggleClass("flipped");
      deck.side == 0;
      if(both)
      {
        deck.backward();
      }
    }

  }
  if(bottom && right)
  {
    forwardFlip(element);
  }
}

function forwardFlip(element)
{
  if(element.className == 'card' && !both)
  {
    $(element).toggleClass("flipped");
    deck.side == 1;
  }
  else
  {
    $(element).toggleClass("flipped");
    deck.side == 0;
    deck.forward();
  }

}

function timedFlip()
{
  element=$('#card');
  forwardFlip(element);
  timer=setTimeout(timedFlip,delay*1000);
}
function stopAuto(){
  //auto = false;
  clearTimeout(timer);
}
