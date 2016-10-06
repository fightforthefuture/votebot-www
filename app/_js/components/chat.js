window.components = window.components || {};
window.components.chat = function (doc, win) {
  /**
   * Retrieves petition data from Action Network API, then submits signature
   * @param {object} doc - Document object
   * @param {object} win - Window object
   * */
  "use strict";

  var overlay       = doc.querySelector('.chat'),
      chatbox       = doc.getElementById('messages'),
      form          = doc.querySelector('.chat form'),
      share         = doc.querySelector('.chat .share'),
      input         = form.querySelector('input'),
      phoneNumber   = null,
      failures      = 0,
      partner       = 'fftf',
      queryString   = util.parseQueryString(),
      isInStudio    = ('isInStudio' in queryString),
      isInCustom    = document.body.classList.contains('my'),
      isInSafeMode  = isInStudio || isInCustom,
      hueShift      = false;



  var bubble = function(sender, html, events, textOnly) {
    events || (events = []);

    var dots = chatbox.querySelectorAll('.dots');

    for (var i = 0; i < dots.length; i++)
      chatbox.removeChild(dots[i]);

    var message = $c('div'),
        clear = $c('div');

    clear.className = 'clear';

    message.className = 'message minimized '+sender;

    if (!textOnly)
      message.innerHTML = html;
    else
      message.textContent = html;

    if (hueShift)
      doHueShift(message, hueShift);

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

    if (hueShift)
      doHueShift(dots, hueShift);

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
      "options": {
        "locale": iso,
      },
      "partner": partner
    };
    console.log('sending', data);

    var submission = new XMLHttpRequest();
    submission.open('POST', 'https://votebot-api.herokuapp.com/conversations/', true);
    //submission.open('POST', 'http://ubuntu:3000/conversations/', true);
    submission.setRequestHeader("Content-Type", "application/json");
    submission.send(JSON.stringify(data));
    if (_paq) { _paq.push(['trackGoal', 1]); }

    setTimeout(function() {
      bubble('bot', l10n['CHECK_YOUR_PHONE']);
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

  var animationTimeouts = [];

  var cancelAnimations = function() {
    document.querySelector('#messages').textContent = '';
    animationTimeouts.forEach(clearTimeout);
  };

  var initialAnimations = function() {
    cancelAnimations();
    function text(message, textOnly) {
      return function() {
        bubble('bot', message, false, textOnly);
      };
    }

    dots();

    var messages = window.speechBubbles.slice();

    if (isInSafeMode) {
      messages = messages.concat([
        'I can help you register to vote, check your registration, and help your friends register.',
        'Try me out! Enter your phone number to start<span class="mobileOnly">, or <a href="https://m.me/hellovote">chat on Facebook Messenger</a></span>.',
      ]);
    }

    animationTimeouts.push(setTimeout(text(messages.shift(), isInSafeMode), 1000));
    animationTimeouts.push(setTimeout(dots, 1100));

    var delay = 2500;
    messages.forEach(function(message, i) {
      var isFinal = (i === messages.length - 1);
      var textOnly = isInSafeMode && !isFinal;
      animationTimeouts.push(setTimeout(text(message, textOnly), delay));
      delay += 500;

      // Show dots, if there are more messages
      if (isFinal) {
        return;
      }

      animationTimeouts.push(setTimeout(dots, delay));
      delay += 500;
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!input.value)
      return input.focus();

    bubble('user', input.value, [], true);

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

    if (window.partner && !window.partner.no_disclosure) {
      overlay.querySelector('.disclosure em').innerHTML = l10n['DISCLOSURE_PARTNER'];
      overlay.querySelector('.disclosure em a.partner').textContent = window.partner.name;
      overlay.querySelector('.disclosure em a.partner').href = window.partner.link;

    } else {
        overlay.querySelector('.disclosure em').innerHTML = l10n['DISCLOSURE'];
    }
    // update shortcode keyword
    if (document.querySelector('section span.sms-keyword') && window.partner && window.partner.keyword) {
      document.querySelector('section span.sms-keyword').textContent = window.partner.keyword.toUpperCase();
    }

    overlay.querySelector('.facebook').textContent = l10n['SHARE'];
    overlay.querySelector('.twitter').textContent = l10n['TWEET'];
    overlay.querySelector('.donate').textContent = l10n['DONATE'];

    // JL TODO ~ may need to customize on a per-page basis outside of l10n structure
    overlay.querySelector('.disclosure a.learn-more').textContent = l10n['LEARN_MORE'];

    var poweredBy = overlay.querySelector('.powered-by strong');
    if (poweredBy)
      poweredBy.textContent = l10n['POWERED_BY'];
  }

  var doHueShift = function(elem, degree) {
    elem.style["filter"] = 'hue-rotate(' + degree + 'deg)';
    elem.style["-webkit-filter"] = 'hue-rotate(' + degree + 'deg)';
    elem.style["-moz-filter"] = 'hue-rotate(' + degree + 'deg)';
    elem.style["-ie-filter"] = 'hue-rotate(' + degree + 'deg)';
    elem.style["-o-filter"] = 'hue-rotate(' + degree + 'deg)';
  }

  var determinePartner = function() {
    var metaTag = doc.querySelector('meta[name="hellovote:partner"]')

    if (queryString.partner)
      return partner = queryString.partner;

    if (metaTag && metaTag.content)
      return partner = metaTag.content;
  }

  var iframeHandler = function() {
    if (doc.body.className.indexOf('iframe') === -1)
      return;

    var learnMore = overlay.querySelector('.disclosure a.learn-more');
    if (window.partner) {
      learnMore.href = 'https://www.hello.vote/'+window.partner.slug.toLowerCase()+'/#what-is-hellovote';
    } else {
      learnMore.href = 'https://www.hello.vote#what-is-hellovote';
    }
    learnMore.target = '_blank';

    customizeColors();
  }



  var parseColor = function(str) {
    if (str.match('rgb') || str.match('#')) {
      return unescape(str);
    } else {
      return '#' + unescape(str);
    }
  }

  var customizeColors = function(newHueShift, newDisclosureColor) {
    if (newHueShift || queryString.hueShift) {
      hueShift = newHueShift || queryString.hueShift;
      doHueShift(form, hueShift);

      var dots = doc.querySelector('.dots');
      if (dots) {
        doHueShift(dots, hueShift);
      }

      var disclosureLinks = overlay.querySelectorAll('.disclosure a, .disclosure img');
      for (var i=0; i<disclosureLinks.length; i++) {
        doHueShift(disclosureLinks[i], hueShift);
      }

      var logo = document.querySelector('.logo');
      doHueShift(logo, hueShift);
    }

    if (newDisclosureColor || queryString.disclosureColor) {
      var color = parseColor(newDisclosureColor || queryString.disclosureColor);
      overlay.querySelector('.disclosure').style.color = color;
    }
  }

  localize();
  determinePartner();
  iframeHandler();
  if (isInSafeMode) {
    // Allow for live updates
    window.initialAnimations = initialAnimations;
    window.customizeColors = customizeColors;
  } else {
    initialAnimations();
  }

};
