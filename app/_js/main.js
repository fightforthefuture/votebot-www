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
}

// Show archived site modal on page load
document.addEventListener("DOMContentLoaded", function() {
  var body = document.querySelector('body');
  body.classList.add('modal-open');
  var html = "<div class='overlay js-archive-modal js-close'>"+
      "<div class='modal'>"+
        "<img src='/images/fftf-logo-dark.svg' alt='Fight for the Future logo'>"+
        "<p class='push-top'>"+
          "Please note that HelloVote's functionality has been disabled. You "+
          "can see the results from our experiment in civic engagement via "+
          "mobile voter registration "+
          "<a href='https://www.hello.vote/stats/'>here</a>. If you are a "+
          "developer, the source code for HelloVote is "+
          "<a href='https://github.com/fightforthefuture/votebot-www'>here</a>. "+
          "Stay tuned..."+
        "</p>"+
        "<p>"+
          "To see what Fight for the Future is up to, "+
          "<a href='https://www.fightforthefuture.org/'>please visit our homepage</a>."+
        "</p>"+
        "<a class='x js-close'>×</a>"+
      "</div>"+
    "</div>";
  var injector = document.createElement('div');
  injector.innerHTML = html;
  body.appendChild(injector);

  document.addEventListener('click', function(ev) {
    if (ev.target.classList.contains('js-close')) {
      ev.preventDefault();
      var modalEl = document.querySelectorAll('.js-archive-modal');
      modalEl[0].classList.add('hidden');
      body.classList.remove('modal-open');
    }
  }, false);
});
