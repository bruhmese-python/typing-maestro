var startTime;
var nextChar = 'a';
var chars = 0;
var typearea, statarea, timerElement;
var timerEnded = false;

const TYPING_TEXT = 0;
const STATS = 1;

var typing_text=`Lorem ipsum`;

function stripTextRandomly(n) {
  if (n >= typing_text.length) {
    return typing_text;
  } else {
    typing_text = typing_text.replace(/\n/g, '');
    const startIdx = Math.floor(Math.random() * (typing_text.length - n));
    const strippedText = typing_text.substring(startIdx, startIdx + n);
    return strippedText;
  }
}

function updateTypeArea(){
	for (let i = 0; i < typing_text.length; i++) {
		var spanElement = document.createElement('span');
		spanElement.textContent = typing_text[i];
		typearea.appendChild(spanElement);
	}
}

async function fetchAndExtractText() {
  try {
    //const response = await fetch('https://lipsum.com/feed/json');
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://lipsum.com/feed/json');

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();
    typing_text = data.feed.lipsum;
    typing_text = stripTextRandomly(500);
    updateTypeArea();

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchAndExtractText();

document.addEventListener('DOMContentLoaded', function() {
	typearea = document.getElementsByClassName('type-area')[TYPING_TEXT];
	statarea = document.getElementsByClassName('type-area')[STATS];
        timerElement = document.getElementById('timer-text');
});

function getWPM(){
	var a = chars / 5;
	return a.toString();
}

function endSession(){
	timerElement.innerHTML = "00:00";
	typearea.classList.add('anim-fade-out');

	let animated = document.querySelector('.anim-fade-out');
	animated.addEventListener('animationend', () => {
	  typearea.classList.add('hidden')
	  statarea.innerHTML = "You averaged a typing speed of <span class=\"fg-colored\">" + getWPM() + "</span>" + " wpm " + "<a class=\"fg_first\" onClick=\"window.location.reload();\" href=\"\">↻</a>";
	  statarea.classList.remove('hidden')
	  statarea.classList.add('anim-fade-in');
	});

}

var x = setInterval(function() {

  var now = new Date().getTime();
  var distance = startTime - now;
	console.log(distance);


  // Calculate minutes and seconds
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toLocaleString("en-US", {
									    minimumIntegerDigits: 2,
									    useGrouping: false });
  var seconds = Math.floor((distance % (1000 * 60)) / 1000).toLocaleString("en-US", {
								    minimumIntegerDigits: 2,
								    useGrouping: false });

  if(chars!=0) timerElement.innerHTML = minutes + ":" + seconds ;

  if (distance <= 0) {
	clearInterval(x);
	timerEnded = true;
	endSession();
  }
}, 1000);

function startTimer() {
    startTime = new Date().getTime() + 60 * 1000;
}

window.onkeydown = function(e) {
    return e.keyCode !== 32 && e.key !== " ";
}

document.addEventListener('keydown', function(event) {
	if (timerEnded != true){
		let chSpan = typearea.children[chars];
		if(chSpan !== undefined){
			let nextChar = chSpan.innerHTML;
			console.log('nextChar[',chars,']', nextChar);
			if (event.key !== undefined && event.key === nextChar) {
				if(chars==0){
					startTimer();
				}
				console.log('Correct key pressed:', event.key);
				chSpan.classList.add('fg-colored');
				chars+=1;
			} else {
				console.log('Incorrect key pressed:', event.key);
			}
		}else{
			timerEnded = true;
		}
	}
});
