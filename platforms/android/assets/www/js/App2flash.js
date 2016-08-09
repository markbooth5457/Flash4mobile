var thisPage;

App.controller('home', function(page){
  $(page).find("#settingsBtn").on('click',function(e){
    showSettings('home');
  });
  $(page).find("#helpBtn").on('click',function(e){
    App.load('helppage');
  }, false);

  setup();
});

App.controller('settings', function(page){
  thisPage = page; //like self/this
  if(typeof deck.flagger == 'boolean'){
    $(thisPage).find("#taggedonly").checked = deck.flagger;
  }

  $(page).on('appBeforeBack', function(){
    deck.flagger = $(thisPage).find("#taggedonly").checked ? 1 : 0;
    both = $(thisPage).find("#bothsides").checked;
    deck.first = 0;
    delay = parseFloat($(thisPage).find("#delay").value)
    delay = (delay >= 1 && delay < 10) ? delay : 2;
    autoflip = $(thisPage).find("#automate").checked;
  console.log(deck.flagger+both+deck.first+delay+autoflip);

  } )
});

App.controller('filepage', function (page, topic) {
  $(page).find("#fileHelpBtn").on('click',function(e){
    App.load('helppage');
  });
  var fileList = $(page).find("#fileList");
  clearList(fileList);
  $.each(topicItems[topic.topic], function(name){
    appendToList(fileList, name, liFileSelected );
  });

});

App.controller('cardpage', function (page) {
  $(page).find('.decktitle').html(topicName);
  $(page).find('.card').on('click', flip);
  //TODO check this
    if(autoflip)//$("#automate").checked)
    {
      timedFlip();
    }
    else
    {
  //    console.log("automate not checked");
      stopAuto();
      deck.displayCard = flashShowFunction;

      deck.displayCard();
    }
});

function showSettings(thisPage)
{
  stopAuto();
  App.load('settings');
}
