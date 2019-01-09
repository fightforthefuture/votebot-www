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
          "<a href='/stats/'>here</a>. If you are a "+
          "developer, the source code for HelloVote is "+
          "<a href='https://github.com/fightforthefuture/votebot-api'>here</a>. "+
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
