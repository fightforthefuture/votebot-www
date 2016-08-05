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

  triggerComponents();

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

  var onDomContentLoaded =function() {

    var learnMore = doc.querySelector('a.learn-more');
    if (learnMore) {
      learnMore.addEventListener('click', function(e) {
        e.preventDefault();

        if (getComputedStyle(document.querySelector('.chat')).position == 'fixed') {
          hideChat();
        } else {
          smoothScroll(doc.querySelector('h1'));
        }
      });
    }

    var getStarted = doc.querySelector('a.get-started');
    if (getStarted) {
      getStarted.addEventListener('click', function(e) {
        e.preventDefault();

        if (getComputedStyle(document.querySelector('.chat')).position == 'fixed') {
          showChat();
        } else {
          smoothScroll(0);
        }
      });
    }

  };

  var isReady = document.readyState;

  if (isReady == "complete" || isReady == "loaded" || isReady == "interactive")
    onDomContentLoaded();
  else if (document.addEventListener)
    document.addEventListener('DOMContentLoaded', onDomContentLoaded, false);



})(document, window);
