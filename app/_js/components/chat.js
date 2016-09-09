window.components = window.components || {};
window.components.chat = function (doc, win) {
  /**
   * Retrieves petition data from Action Network API, then submits signature
   * @param {object} doc - Document object
   * @param {object} win - Window object
   * */
  "use strict";

  var overlay     = doc.querySelector('.chat'),
      chatbox     = doc.getElementById('messages'),
      form        = doc.querySelector('.chat form'),
      share       = doc.querySelector('.chat .share'),
      input       = form.querySelector('input'),
      phoneNumber = null,
      failures    = 0,
      partner     = 'fftf';



  var bubble = function(sender, html, events) {
    events || (events = []);

    var dots = chatbox.querySelectorAll('.dots');

    for (var i = 0; i < dots.length; i++)
      chatbox.removeChild(dots[i]);

    var message = $c('div'),
        clear = $c('div');

    clear.className = 'clear';

    message.className = 'message minimized '+sender;
    message.innerHTML = html;

    chatbox.appendChild(message);
    chatbox.appendChild(clear);

    var links = message.querySelectorAll('a');

    for (var i = 0; i < events.length; i++) {
      if (i > links.length - 1)
        break;

      links[i].addEventListener('click', events[i]);
    }

    scrollToBottom();

    setTimeout(function() {
      message.classList.remove('minimized');
    }, 20);

  }

  var scrollToBottom = function() {
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  var dots = function() {
    var dots = $c('div');

    for (var i = 0; i < 3; i++) {
      var dot = $c('div'),
          lol = $c('div');

      dot.appendChild(lol);
      dots.appendChild(dot);
    }

    dots.className = 'dots';

    chatbox.appendChild(dots);

    scrollToBottom();
  }

  var validatePhone = function(num) {

    num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
    num = num.replace("+", "").replace(/\-/g, '');

    if (num.charAt(0) == "1")
      num = num.substr(1);

    if (num.length != 10)
      return false;

    return num;
  }

  var sendPhoneNumber = function() {
    var data = {
      "type":"web",
      "recipients":[
        {"username": phoneNumber}
      ],
      "partner": partner
    };
    console.log('sending', data);

    var submission = new XMLHttpRequest();
    submission.open('POST', 'https://votebot-api.herokuapp.com/conversations/', true);
    submission.setRequestHeader("Content-Type", "application/json");
    submission.send(JSON.stringify(data));

    setTimeout(function() {
      bubble('bot', 'Check your phone! Didn\'t get a text message? <a href="https://docs.google.com/forms/d/e/1FAIpQLSd6dYLxLhnyv_bq734QmXP-TV4WQkMo2dX8mOhF4NJ5dMIXqw/viewform">Click here.</a>');
      showShareForm();
    }, 4000);
  }

  var showShareForm = function() {
    share.style.display = 'block';
    form.classList.add('hidden');

    setTimeout(function() {
      share.style.opacity = 1;
    }, 20);
  }

  var initialAnimations = function() {

    setTimeout(function() {
      bubble('bot', window.speechBubbles[0]);
    }, 1000);

    setTimeout(function() { dots(); }, 1100);

    setTimeout(function() {
      bubble('bot', window.speechBubbles[1])
    }, 2500);

    setTimeout(function() { dots(); }, 3000);

    setTimeout(function() {
      bubble('bot', window.speechBubbles[2])
    }, 3500);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!input.value)
      return input.focus();

    bubble('user', input.value);

    if (!phoneNumber) {
      var _tmpPhoneNumber = validatePhone(input.value)
      if (_tmpPhoneNumber) {
        phoneNumber = _tmpPhoneNumber;

        setTimeout(function() { dots() }, 500);

        sendPhoneNumber();

      } else {
        setTimeout(function() { dots() }, 500);
        setTimeout(function() {
          failures++;

          var msg = 'Sorry, I didn\'t recognize that phone number. Please try again!'

          if (failures > 1)
            msg = 'I\'m still having trouble. Make sure you enter a U.S. phone number.';

          bubble('bot', msg);

          input.focus();
        }, 1500);
      }
    }

    input.placeholder = '';
    input.value = '';
  });

  var localize = function() {
    overlay.querySelector('input').placeholder = l10n['ENTER_PHONE'];
    overlay.querySelector('button').textContent = l10n['TEXT_ME'];
    overlay.querySelector('.disclosure em').textContent = l10n['DISCLOSURE'];
    overlay.querySelector('.facebook').textContent = l10n['SHARE'];
    overlay.querySelector('.twitter').textContent = l10n['TWEET'];
    overlay.querySelector('.donate').textContent = l10n['DONATE'];

    // JL TODO ~ may need to customize on a per-page basis outside of l10n structure
    overlay.querySelector('.disclosure a').textContent = l10n['DISCLOSURE_LINK'];
  }

  var determinePartner = function() {
    var queryString = util.parseQueryString();
    var metaTag = doc.querySelector('meta[name="hellovote:partner"]')

    if (queryString.partner)
      return partner = queryString.partner;

    if (metaTag && metaTag.content)
      return partner = metaTag.content;
  }

  localize();
  determinePartner();
  initialAnimations();

};
