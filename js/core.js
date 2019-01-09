/**
 *
 * @source: https://github.com/fightforthefuture/eunetneutrality
 *
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) Fight for the Future
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

/**
 *  util : random grab bag functions
 */

var $c  = document.createElement.bind(document);
var $el = document.getElementById.bind(document);

if (!util) var util = {};

util.getReferrerTag = function() {
  var ref = document.referrer;
  if (ref.indexOf('facebook.com') !== -1)
    return 'from-facebook';
  else if (ref.indexOf('twitter.com') !== -1 || ref.indexOf('t.co') !== -1)
    return 'from-twitter';
  else if (ref.indexOf('reddit.com') !== -1)
    return 'from-reddit';
  else if (window.location.href.indexOf('_src=ga') !== -1)
    return 'from-google-adwords';
  else if (ref.indexOf('google.com') !== -1)
    return 'from-google';
};

util.parseQueryString = function () {
  var
    i,
    pairs,
    queryObject = {},
    queryString = window.location.search;

  if (queryString[0] === '?') {
    queryString = queryString.substr(1);
  }

  pairs = queryString.split('&');
  i = pairs.length;

  while (i--) {
    queryObject[pairs[i].split('=')[0]] = pairs[i].split('=')[1];
  }

  // Remove extra key
  delete queryObject[''];

  return queryObject;
};


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
      isInTest      = ('isInTest' in queryString) || (document.location.pathname.indexOf('test') > -1),
      isInMyPage    = ('isInMyPage' in queryString),
      isInStudio    = ('isInStudio' in queryString),
      isInCustom    = document.body.classList.contains('my'),
      isInSafeMode  = isInStudio || isInCustom,
      hueShift      = false,
      brightness    = false;


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
      doHueShift(message, hueShift, brightness);

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
      doHueShift(dots, hueShift, brightness);

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
    if (isInTest) {
      // get conversation type from querystring
      data['chain'] = queryString.conv || 'vote_1';
      submission.open('POST', 'https://votebot-api-staging.herokuapp.com/conversations/', true);
    } else {
      submission.open('POST', 'https://votebot-api.herokuapp.com/conversations/', true);
    }
    submission.setRequestHeader("Content-Type", "application/json");
    submission.send(JSON.stringify(data));
    if (_paq) { _paq.push(['trackGoal', 1]); }

    setTimeout(function() {
      bubble('bot', l10n['CHECK_YOUR_PHONE']);
      showShareForm();
    }, 4000);

    setTimeout(function() {
      if (modal) modal.show('overlay1');
    }, 4000);
  }

  var showShareForm = function() {
    form.classList.add('hidden');

    share.style.display = 'block';
    void share.offsetWidth; // Layout
    share.style.opacity = 1;

    if (isInMyPage) {
      top.postMessage('show-share-form', 'https://my.hello.vote');
    }
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
        'I can help you register to vote, remember to vote, and remind your friends to vote too.',
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
      if (window.partner.extra_disclosure) {
        overlay.querySelector('.disclosure em').innerHTML += window.partner.extra_disclosure;
      }
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

  var doHueShift = function(elem, degree, brightness) {
    elem.style["filter"] = 'hue-rotate(' + degree + 'deg) brightness('+brightness+'%)';
    elem.style["-webkit-filter"] = 'hue-rotate(' + degree + 'deg) brightness('+brightness+'%)';
    elem.style["-moz-filter"] = 'hue-rotate(' + degree + 'deg) brightness('+brightness+'%)';
    elem.style["-ie-filter"] = 'hue-rotate(' + degree + 'deg) brightness('+brightness+'%)';
    elem.style["-o-filter"] = 'hue-rotate(' + degree + 'deg) brightness('+brightness+'%)';
  }

  var determinePartner = function() {
    var metaTag = doc.querySelector('meta[name="hellovote:partner"]')

    if (queryString.partner)
      return partner = queryString.partner;

    if (metaTag && metaTag.content)
      return partner = metaTag.content;
  }

  var prefillPhone = function() {
    if (queryString.phone) {
      overlay.querySelector('input').value = queryString.phone;
    }
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

    if (isInMyPage) {
      doc.body.classList.add('my-page');
    } else {
      customizeColors();
    }
  }



  var parseColor = function(str) {
    if (str.match('rgb') || str.match('#')) {
      return unescape(str);
    } else {
      return '#' + unescape(str);
    }
  }

  var customizeColors = function(newHueShift, newBrightness, newDisclosureColor, newTextColor) {
    if (newHueShift || queryString.hueShift) {
      hueShift = newHueShift || queryString.hueShift;
      brightness = 100;
      if (newBrightness || queryString.brightness) {
        brightness = newBrightness || queryString.brightness
      }
      doHueShift(form, hueShift, brightness);

      var dots = doc.querySelector('.dots');
      if (dots) {
        doHueShift(dots, hueShift, brightness);
      }

      var disclosureLinks = overlay.querySelectorAll('.disclosure a, .disclosure img');
      for (var i=0; i<disclosureLinks.length; i++) {
        doHueShift(disclosureLinks[i], hueShift, brightness);
      }

      var logo = document.querySelector('.logo');
      doHueShift(logo, hueShift, brightness);
    }

    if (newTextColor || queryString.textColor) {
      var color = parseColor(newTextColor || queryString.textColor);
      overlay.querySelector('.message').style.color = color;
      overlay.querySelector('button[type="submit"]').style.color = color;
    }

    if (newDisclosureColor || queryString.disclosureColor) {
      var color = parseColor(newDisclosureColor || queryString.disclosureColor);
      overlay.querySelector('.disclosure').style.color = color;
    }
  }

  localize();
  determinePartner();
  prefillPhone();
  iframeHandler();
  if (isInSafeMode) {
    // Allow for live updates
    window.initialAnimations = initialAnimations;
    window.customizeColors = customizeColors;
  } else {
    initialAnimations();
  }

};

window.components = window.components || {};
window.components.petitions = function (doc, win) {
  /**
   * Retrieves petition data from Action Network API, then submits signature
   * @param {object} doc - Document object
   * @param {object} win - Window object
   * */
  "use strict";

  var
    body = doc.getElementsByTagName('body')[0],
    petitionSignatureForm = doc.getElementById('petition-form'),
    apiHost = petitionSignatureForm.dataset.host,
    objectIdentifier = petitionSignatureForm.dataset.petitionId,
    submitButton = body.querySelector('[type="submit"]'),
    countryInput = doc.getElementById('hidden-country'),
    countrySelect = doc.getElementById('select-country'),
    countryLabel = doc.querySelector('[for="select-country"]'),
    queryString = win.util.parseQueryString();

  function numberCommafier(number) {
    /**
     * Returns a string representing a number with commas
     * @param {int} number - the number to transform
     * */

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function progressBar(targetValue, targetGoal) {
    /**
     * Animates the value of a progress bar
     * @param {int} targetValue - the target value attribute of the progress bar
     * @param {int} targetGoal - the target max attribute of the progress bar
     * */

    var
      guardedTargetVal = targetValue.isNaN ? 0 : targetValue,
      animate,
      value = 0,
      progressbar = doc.getElementById('signatures-progress-bar'),
      max = parseInt(targetGoal),
      step = (guardedTargetVal / 1500) * 30; // 1500 ms total, 30ms minimum
                                             // interval

    if (!progressbar)
      return false;

    function loading() {
      value += step;
      value = Math.ceil(value);
      if (value >= guardedTargetVal || value >= max) {
        value = guardedTargetVal;
        clearInterval(animate);
      }

      var
        commafiedNumber = numberCommafier(value);

      progressbar.setAttribute('max', max.toString(10));
      progressbar.setAttribute('value', value.toString(10));
      progressbar.setAttribute('title', commafiedNumber + ' signatures');
      doc.getElementById('total-sigs').textContent = commafiedNumber;
      doc.getElementById('sigs-to-go').textContent = numberCommafier(targetGoal - value) + ' needed to reach ' + numberCommafier(targetGoal);
      progressbar.textContent = commafiedNumber + ' signatures';
    }

    animate = setInterval(function () {
      loading();
    }, 30);
  }

  function handleProgressBarError() {
    /**
     * Sets values for the progress bar even if there's a server or XHR error
     * */
    progressBar(1519, 2500);
  }

  function requestAPIInfo() {
    /**
     * Builds and sends request to API server
     * */
    var
      apiData,
      anRequest = new XMLHttpRequest();

    anRequest.open('GET', apiHost + '/petition?identifier=' + objectIdentifier, true);
    anRequest.addEventListener('load', function () {
      if (anRequest.status >= 200 && anRequest.status < 400) {

          apiData = JSON.parse(anRequest.responseText);

        progressBar(apiData.signatures, apiData.goal);

        // remove this after save-chelsea has > 1000 signatures
        if (win.location.hostname === 'www.freechelsea.com' && apiData.signatures < 1000) {
          doc.querySelector('.signatures').style.display = 'none';
        }

      } else {
        handleProgressBarError();
      }
    });
    anRequest.addEventListener('error', handleProgressBarError);
    anRequest.send();
  }

  function updateZIPPlaceholder() {
    /**
     * Updates placeholder on ZIP/Post Code field to be appropriate for country
     * selected
     * */
    var
      ZIPLabel = doc.getElementById('form-zip_code');

    if (countrySelect.value !== 'US') {
      ZIPLabel.setAttribute('placeholder', 'Post Code');
    } else {
      ZIPLabel.setAttribute('placeholder', 'ZIP');
    }
  }

  function toggleCountryField() {
    /**
     * Hides the label and shows the select when someone changes their signature
     * country.
     * */

    countryInput.parentNode.removeChild(countryInput);
    countrySelect.setAttribute('name', 'signature[country]');
    countrySelect.classList.add('visible');
    countryLabel.classList.add('hidden');
  }

  function submitForm(event) {
    /**
     * Submits the form to ActionNetwork. If the script doesn’t, by now, know
     * the action_network identifier, default isn’t prevented on the event and
     * form submission proceeds as normal.
     * @param {event} event - Form submission event
     * */

    if (objectIdentifier) {
      event.preventDefault();
    }

    var
      signatureSubmission = new XMLHttpRequest();

    win.callbacks.petitions.preSubmit();

    function compilePayload() {
      /**
       * Compiles the form data into a JSON payload for Ajax submission
       * @return {object} petitionFormData - just the info the API needs
       * */
      var tags = JSON.parse(doc.querySelector('[name="subscription[tag_list]"]').value);
      if (util.getReferrerTag())
        tags.push(util.getReferrerTag());

      var formData = new FormData();
      formData.append('guard', '');
      formData.append('hp_enabled', true);
      formData.append('org', window.org ? window.org : 'fftf');
      formData.append('an_tags', JSON.stringify(tags));
      formData.append('an_url', win.location.href);
      formData.append('an_petition', petitionSignatureForm.action.replace('/signatures', ''));
      formData.append('member[first_name]', doc.getElementById('form-first_name').value);
      formData.append('member[email]', doc.getElementById('form-email').value);
      formData.append('member[postcode]', doc.getElementById('form-zip_code').value);
      formData.append('member[country]', countrySelect.value);

      if (doc.getElementById('opt-in') && doc.getElementById('opt-in').getAttribute('type') === 'checkbox' && doc.getElementById('opt-in').checked === false) {
        formData.append('opt_out', true);
      }

      if (doc.getElementById('form-street_address')) {
        formData.append('member[street_address]', doc.getElementById('form-street_address').value);
      }

      if (doc.getElementById('form-phone_number')) {
        formData.append('member[phone_number]', doc.getElementById('form-phone_number').value);
      }

      if (doc.getElementById('form-comments')) {
        formData.append('action_comment', doc.getElementById('form-comments').value);
      }

      if (queryString.source) {
        formData.append('subscription[source]', queryString.source);
      }

      var autoresponderHours = doc.querySelector('meta[name="autoresponder_hours"]'),
          autoresponderActive = doc.querySelector('meta[name="autoresponder_active"]');
      formData.append('autoresponder_hours', autoresponderHours ? autoresponderHours.content : 72);

      if (autoresponderActive)
        formData.append('autoresponder_active', 1);

      var mothershipTag = document.querySelector('input[name="_mothership_tag"]');
      if (mothershipTag && mothershipTag.value)
        formData.append('tag', mothershipTag.value);
      else
        formData.append('tag', window.location.pathname);

      return formData;
    }

    signatureSubmission.open('POST', 'https://queue.fightforthefuture.org/action', true);
    // signatureSubmission.open('POST', 'http://localhost:9001/action', true); // JL DEBUG ~
    signatureSubmission.addEventListener('error', win.callbacks.petitions.handleSigningError);
    signatureSubmission.addEventListener('load',  win.callbacks.petitions.loadSignatureResponse);
    signatureSubmission.send(compilePayload());

    if (typeof FreeProgress !== "undefined")
      FreeProgress.convert();
  }

  function addEventListeners() {
    /**
     * Attaches all the listeners all the places
     * */
    countryLabel.addEventListener('click', toggleCountryField);
    countrySelect.addEventListener('change', updateZIPPlaceholder);
    petitionSignatureForm.addEventListener('submit', submitForm);
  }

  function init() {
    requestAPIInfo();
    addEventListeners();
  }

  init();
};

(function (doc, win) {
  "use strict";

  win.callbacks = win.callbacks || {};
  win.callbacks.petitions = {
     preSubmit: function() {
      /**
       * Fires up the loading modal and disables the form
       * @return {object} - modal with spinner
       * */
      doc.querySelector('[type="submit"]').setAttribute('disabled', true); // JL DEBUG ~ disable for testing
    },

    loadSignatureResponse: function(e) {
      /**
       * Does the thing after we get a response from the API server
       * */

      var xhr = e.target;

      if (xhr.status >= 200 && xhr.status < 400) {

        hideForm()

      } else {
        win.callbacks.petitions.handleSigningError(xhr);
      }
    },

    handleSigningError: function(e) {
      /**
       * Figures out what to say at just the right moment
       * @param {event|XMLHttpRequest} e - Might be an event, might be a response
       * from an XMLHttpRequest
       * */


      doc.querySelector('[type="submit"]').removeAttribute('disabled');

      alert('AN ERROR OCCURRED DURING SUBMISSION :(\n\nPlease contact team@fightforthefuture.org');
    }
  }

})(document, window);

(function (doc, win) {
  "use strict";

  var triggerComponents = function() {
    win.components = win.components || {};
    var
      i = 0,
      components = doc.querySelector('body').getAttribute('data-components');

    if (components !== undefined) {
      components = components.split(' ');
      i = components.length;

      while (i--) {
        if (components[i] !== '' && win.components[components[i]] !== undefined) {
          win.components[components[i]](doc, win);
        }
      }
    }
  }

  triggerComponents(); // JL NOTE ~ disabled for "beta"

  var showChat = function() {
    doc.querySelector('.chat').classList.remove('hidden');
    setTimeout(function() {
      doc.querySelector('.chat').classList.remove('transparent');
      doc.body.classList.remove('scrolling');
    }, 10);
  }

  var hideChat = function() {
    doc.querySelector('.chat').classList.add('transparent');
    setTimeout(function() {
      doc.querySelector('.chat').classList.add('hidden');
      doc.body.classList.add('scrolling');
    }, 500);
  }

  var handleGetStarted = function(e) {
    if (getComputedStyle(document.querySelector('.chat')).position == 'fixed') {
      showChat();
    } else {
      smoothScroll(0);
    }
  }

  var onDomContentLoaded =function() {

    var learnMore = doc.querySelector('a.learn-more');
    if (learnMore && doc.body.className.indexOf('iframe') === -1) {
      learnMore.addEventListener('click', function(e) {

        if (getComputedStyle(document.querySelector('.chat')).position == 'fixed') {
          hideChat();
        } else {
          smoothScroll(doc.querySelector('h1'));
        }
      });
    }

    window.onhashchange = function (e) {
      if (e.newURL.slice(-1) == '#') {
        handleGetStarted();
      }
    }

    initModal();

    // JL NOTE ~ strip all this junk out when the "beta" is over ---------------
    // -------------------------------------------------------------------------
    // var showMainPage = function(immediately) {
    //   var triggered = function() {
    //     doc.getElementById('beta').style.display = 'none';
    //     triggerComponents();
    //   }
    //   if (!immediately) {
    //     doc.getElementById('beta').style.opacity = 0;
    //     setTimeout(function() {
    //       triggered()
    //     }, 500);
    //   } else {
    //     triggered()
    //   }
    // }

    // var beta = doc.getElementById('beta');
    // if (beta) {
    //   doc.getElementById('beta-form').addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     if (doc.getElementById('beta-code').value.toLowerCase() != 'porunga') {
    //       doc.getElementById('beta-explanation').innerHTML = 'Sorry, that beta key didn\'t work. Contact <a href="mailto:team@fightforthefuture.org">team@fightforthefuture.org</a> if you need assistance.';
    //       doc.getElementById('beta-explanation').className = 'error';
    //       doc.getElementById('beta-form').className = 'error';
    //     } else {
    //       doc.getElementById('beta-form').style.display = 'none';
    //       doc.getElementById('beta').querySelector('h2').style.display = 'block';
    //       document.cookie = "beta=true; expires=Thu, 01 Dec 2016 12:00:00 UTC";
    //       setTimeout(function() { showMainPage(); }, 1500);
    //     }
    //   });
    // }
    // if (document.cookie.indexOf('beta=true') !== -1)
    //   showMainPage(true);
    // -------------------------------------------------------------------------

  };

  var initModal = function() {
    var overlay = doc.getElementById('overlay1');

    if (!overlay)
      return;

    overlay.style.position = 'fixed';
    overlay.style.left = '0px';
    overlay.style.top = '0px';
    overlay.style.display = 'none';
    overlay.classList.add('hidden');

    overlay.addEventListener('click', function(e) {
      if (e.target == overlay)
        modal.hide('overlay1');
    });

    overlay.querySelector('.x').addEventListener('click', function(e) {
      e.preventDefault();
      modal.hide('overlay1');
    });
  }

  var isReady = document.readyState;

  if (isReady == "complete" || isReady == "loaded" || isReady == "interactive")
    onDomContentLoaded();
  else if (document.addEventListener)
    document.addEventListener('DOMContentLoaded', onDomContentLoaded, false);


})(document, window);

var modal = {
  show: function(id) {
    var overlay = document.getElementById(id);

    if (!overlay)
      return;

    overlay.style.display = 'block';

    setTimeout(function() {
      overlay.classList.remove('hidden');
    }, 25);

  },
  hide: function(id) {
    var overlay = document.getElementById(id);

    if (!overlay)
      return;

    overlay.classList.add('hidden');
    setTimeout(function() {
      overlay.style.display = 'none';
    }, 350);

  }
};
