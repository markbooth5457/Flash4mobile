/*
 
adopted from Apple sample script 'browser.js'

 */
// some metrics constants
const BUTTON_MARGIN_LEFT = 5;
const BUTTON_MARGIN_RIGHT = 10;

// boolean for when we are initialized
var initialized = false;

// object that will hold points to DOM element in the document
var elements;

// holds the computed width of the button currently on-screen or about to enter the screen
var current_button_width = 0;

// holds the computed x position of the title currently on-screen or about to enter the screen
var current_title_x = 0;

// flag to identify screen orientation
var is_portrait = false;

// current width of the screen
var screen_width;

//holds the options pane set up by caller
var options_pane = null;

// decide if showing a card or the options pane
var has_back_button = false;

// this function is called when the document has finished loading,

function browser_init (optionsPane) {

	options_pane = optionsPane;
  // listen to screen orientation changes
  window.addEventListener('orientationchange', orientation_changed, false);

	// now let's hold onto the pieces of markup that will be dynamically updated with content
	// as the user interacts with the browser
	elements = {
	buttons : [document.getElementById('first_button'), document.getElementById('second_button')],
	titles : [document.getElementById('first_title'), document.getElementById('second_title')],
	pages : [document.getElementById('first_page'), document.getElementById('second_page')]
	};
  // set up vars based on orientation
  orientation_changed();

	// make all back buttons appear off screen
	elements.buttons[0].style.webkitTransform = get_header_transform_for_x(screen_width);
	elements.buttons[1].style.webkitTransform = get_header_transform_for_x(screen_width);

	// send the other page off screen
	elements.pages[1].style.webkitTransform = get_page_transform_for_x(screen_width);

	// setup back interactions by adding UI events to buttons
	elements.buttons[0].addEventListener('touchend', go_back, false);
	elements.buttons[1].addEventListener('touchend', go_back, false);

	// pre-load touched images to avoid delay on first touch
	//(new Image()).src = 'images/chevron_touched.png';
	//(new Image()).src = 'images/item_background_touched.png';
	(new Image()).src = 'images/back_button_touched.png';
	
	//set title for options screen, which has no button
	set_title_and_get_x (0, "Flashcards", 0);
	
	// add an event listener to be notified of the end of transitions on one of the pages
	// so that we can perform post-flight operations
	elements.pages[0].addEventListener('webkitTransitionEnd', transition_ended, false);

	// all transitions will be using the same duration
	Transitions.DEFAULTS.duration = 0.35;

	// set the contents of the first page to be the options pane
	elements.pages[0].appendChild(optionsPane);
	initialized = true;
	// hide the address bar
	setTimeout(hide_address_bar, 500);
};

// sets a button element the contents of the label
// and returns the new width of the button
function set_button_label_and_get_width (button_index, label) {
  var button = elements.buttons[button_index];
  button.textContent = label;
  return button.offsetWidth;
};


// sets a title element the contents of a screen title and
// returns the x position for this element
function set_title_and_get_x (title_index, label, button_width) {
  // first get a pointer to the title element
  var title = elements.titles[title_index];
  // set the max width based on the space left on screen by the button
  var max_width = screen_width - BUTTON_MARGIN_LEFT - button_width - (BUTTON_MARGIN_RIGHT * 2);
  title.style.maxWidth = to_px(max_width);
  // now set the title text content and get the resulting width
  title.textContent = label;
  var width = title.offsetWidth;
  // titles have to be laid out at a minimum to the right of the button with a margin
  var min_x = BUTTON_MARGIN_LEFT + button_width + BUTTON_MARGIN_RIGHT;
  // by default titles are centered
  var x = (screen_width - width) / 2;
  // but in case there is cropping involved, or text would display in front of the button,
  // we position the title to the right of the button,
  if (width > max_width || x < min_x) {
    x = min_x;
  }
  // hand back the resulting position of the title
  return x;
};

/* ============================== TRANSITIONS ============================== */

// index of the page currently on display
var active_index = 0;

// currently active element in the data source
var active_element = null;

// is there an animation in progress?
var transitions_in_progress = false;

var has_back_button = false;
// performs the required animation to transition to the next page,
// new_element is the data source
// and the event is required to cancel default behavior and detect demo mode
function transition_to_new_element (new_element, event) {

  // ensure we prevent default interaction in case we act on a tap
 // if(event) event.preventDefault();

  // mark that a transition is now in progress
  transitions_in_progress = true;

  //add  listeners to div
	new_element.addEventListener('touchstart', touch_started, false);
	new_element.addEventListener('touchmove', touch_moved, false);
	new_element.addEventListener('touchend', touch_ended, false);
	new_element.addEventListener('click', clicked, false);
 
  // first, let's figure which page in the DOM is the from-page and which is the to-page
  var from_index = active_index;
  var to_index = (active_index == 1) ? 0 : 1;

  // we will be animating both opacity and transforms for the header transitions
  Transitions.DEFAULTS.properties = ['opacity', '-webkit-transform'];

  //  populate the to-page
  elements.pages[to_index].removeChild(elements.pages[to_index].firstChild);
  elements.pages[to_index].appendChild(new_element);
  
  // figure out if we have or will have back buttons on screen
 // (elements.pages[to_index].childNodes[0] != options_pane);
  var will_have_back_button = (options_pane!=new_element);

  // figure out the metrics of the back button and title of the to-page
  var next_button_label = "Back";
  next_button_width = set_button_label_and_get_width(to_index, next_button_label);
  next_title_x = set_title_and_get_x(to_index, "Flashcards", (will_have_back_button) ? next_button_width : 0);

  // create an empty transition set
  var transitions = new Transitions();
  
  // add transition for the button entering the screen: the new button will fade in and slide
  // from the current position of the title or the left of the screen if going backwards
  var to_button_start_x = (from_index==0) ? current_title_x : (-next_button_width - BUTTON_MARGIN_LEFT);
  if (will_have_back_button) {
    transitions.add({
      element : elements.buttons[to_index],
      from : [0, get_header_transform_for_x(to_button_start_x)],
      to : [1, get_header_transform_for_x(BUTTON_MARGIN_LEFT)]
    });
  }

  // add transition for the button leaving the screen: the old button will fade out
  // and slide to the left of the screen or to where the new title is if going backwards
  var from_buttom_end_x = (from_index==0) ? (-current_button_width - BUTTON_MARGIN_LEFT) : next_title_x;
  if (has_back_button) {
    transitions.add({
      element : elements.buttons[from_index],
      to : [0, get_header_transform_for_x(from_buttom_end_x)]
    });
  }

  // add transition for the title entering the screen: the new title will fade in and slide
  // from the right of the screen or where the previous button was located if going backwards
  var to_title_start_x = (from_index==0) ? screen_width : BUTTON_MARGIN_LEFT;
  transitions.add({
    element : elements.titles[to_index],
    from : [0, get_header_transform_for_x(to_title_start_x)],
    to : [1, get_header_transform_for_x(next_title_x)]
  });

  // add transition for the title leaving the screen: the old title will fade out and slide
  // to where the next button is located or to the right of the screen if going backwards
  var from_title_end_x = (from_index==0) ? BUTTON_MARGIN_LEFT : screen_width;
  transitions.add({
    element : elements.titles[from_index],
    to : [0, get_header_transform_for_x(from_title_end_x)]
  });

  // add transition for the content pages leaving and entering the screen
  var from_page_start_x = 0;
  var from_page_end_x = (from_index==0) ? -screen_width : screen_width;
  var to_page_start_x = (from_index==0) ? screen_width : -screen_width;
  var to_page_end_x = 0;

  // we only change the transform for the page transitions
  Transitions.DEFAULTS.properties = ['-webkit-transform'];

  transitions.add({
    element : elements.pages[from_index],
    from : [get_page_transform_for_x(from_page_start_x)],
    to : [get_page_transform_for_x(from_page_end_x)]
  });
  transitions.add({
    element : elements.pages[to_index],
    from : [get_page_transform_for_x(to_page_start_x)],
    to : [get_page_transform_for_x(to_page_end_x)]
  });


  // make new metrics the current metrics, ready to be used in the next transition
  current_button_width = next_button_width;
  current_title_x = next_title_x;

  // track what page and data source is active
  active_index = to_index;
  active_element = new_element;

  // finally, run the transitions and animations
  transitions.apply();
};

//respond to a left swipe by putting current page in page 0, new_element in page 1 and doing a transition

function slide_left (new_element) {

	// ensure we prevent default interaction in case we act on a tap
	// if(event) event.preventDefault();
has_back_button = (elements.pages[active_index].firstChild != options_pane)? true : false;
	// mark that a transition is now in progress
	transitions_in_progress = true;
	// first, let's figure out where the pages are
	var out_page = elements.pages[active_index]; // page to move off-screen
	var in_page = elements.pages[(1-active_index)]; // page to bring in

	// we only change the transform for the page transitions
	Transitions.DEFAULTS.properties = ['-webkit-transform'];
	// create an empty transition set
	var transitions = new Transitions();

	//  populate page to bring in
	in_page.removeChild(in_page.firstChild);
	in_page.appendChild(new_element);

	//and transition to it
	
	transitions.add({
	element : out_page,
	from : [get_page_transform_for_x(0)],
	to : [get_page_transform_for_x(-screen_width)]
	});
	transitions.add({
	element : in_page,
	from : [get_page_transform_for_x(screen_width)],
	to : [get_page_transform_for_x(0)]
	});

	active_index = 1-active_index;

	// finally, run the transitions and animations
	transitions.apply();
};
// called upon end of a transition
function transition_ended (event) {
  // track that no animations are currently in progress
  transitions_in_progress = false;
};

/* ============================== NAVIGATION ============================== */

// called when a back button is activated
function go_back () {
  // do nothing if an animation is already running
  if (transitions_in_progress) {
    return;
  }
  // goes straight back to the options page
	elements.pages[0].removeChild(elements.pages[0].firstChild);
	elements.pages[0].appendChild(options_pane);
	elements.buttons[0].style.left = screen_width;
	elements.buttons[1].style.left = screen_width;
//	elements.buttons[0].style.webkitTransform = get_header_transform_for_x(screen_width);
//	elements.buttons[1].style.webkitTransform = get_header_transform_for_x(screen_width);
};
/* ============================== TOUCH TRACKING ============================== */

// track if we moved following a touchstart
var moved_after_touch = false;
var startX;
// called for touch move events 
function touch_started (event) {
  moved_after_touch = false;
  startX = event.changedTouches[0].clientX;
};

// called for touch move events 
function touch_moved (event) {
 // event.preventDefault();
  moved_after_touch = true;
};

// called for touch move events 
function touch_ended (event) {
  var direction = event.changedTouches[0].clientX - startX;
  if(moved_after_touch) {
  window.alert(direction);
	if(direction < 0){
		NextButton_onclick();
	}
	else{
		PrevButton_onclick();
	}
  }
  else{
	cardFlip(event);
  }
  moved_after_touch = false;
  
};

function clicked(event) {
 cardFlip(event);
}
/* ============================== SCREEN ORIENTIATION ============================== */

// called when orientation changes
function orientation_changed () {
	// update the global variable for tracking current orientation
	is_portrait = (window.orientation == 0 || window.orientation == null);
	// update the styles
	document.body.className = is_portrait ? 'portrait' : 'landscape';
	// update the screen width
	screen_width = is_portrait ? 320 : 480;
	// now update positions of elements 

	// figure out the inactive index
	var inactive_index = (active_index == 0) ? 1 : 0;
	
	// update position of the "active" button if we are displaying the root
	// and that button actually should be invisible
	if (!has_back_button) {
	  elements.buttons[active_index].style.webkitTransitionProperty = 'none';
	  elements.buttons[active_index].style.webkitTransform = get_header_transform_for_x(screen_width);
	}
	// otherwise update the size of the back button on display
	else {
	  current_button_width = elements.buttons[active_index].offsetWidth;
	}
	// update position of inactive button so that it's offscreen
	elements.buttons[inactive_index].style.webkitTransitionProperty = 'none';
	elements.buttons[inactive_index].style.webkitTransform = get_header_transform_for_x(screen_width);
	// update position of active title so that it's laid out accurately
	current_title_x = set_title_and_get_x(active_index, elements.titles[active_index].textContent, current_button_width);
	elements.titles[active_index].style.webkitTransitionProperty = 'none';
	elements.titles[active_index].style.webkitTransform = get_header_transform_for_x(current_title_x);
	// update position of inactive page so that it's offscreen
	elements.pages[inactive_index].style.webkitTransitionProperty = 'none';
	elements.pages[inactive_index].style.webkitTransform = get_page_transform_for_x(screen_width);
	
  // ensure the canvas is positioned at top-left
  window.setTimeout(function() { window.scrollTo(0, 1); }, 0);
};

/* ============================== UTILS ============================== */

function hide_address_bar () {
  window.scrollTo(0, 1);
  setTimeout(function () {
    window.scrollTo(0, 0);
  }, 0);
};

function get_header_transform_for_x (x) {
  return 'translate(' + x + 'px, 5px)';
};

function get_page_transform_for_x (x) {
  return 'translateX(' + x + 'px)';
};

function to_px (value) {
  return value + 'px';
};

/* ============================== INIT ============================== */

// call init method once document is loaded
//window.addEventListener('load', init, false);
