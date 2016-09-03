(function (doc, win) {
  "use strict";

  var triggerComponents = function() {
    win.components = win.components || {};
    var
      i = 0,
      components = doc.getElementsByTagName('body')[0].dataset.components;

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
    if (learnMore) {
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

  var isReady = document.readyState;

  if (isReady == "complete" || isReady == "loaded" || isReady == "interactive")
    onDomContentLoaded();
  else if (document.addEventListener)
    document.addEventListener('DOMContentLoaded', onDomContentLoaded, false);



})(document, window);
