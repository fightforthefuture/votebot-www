if (!util) var util = {};
/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
util.getMobileOperatingSystem = function() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    return undefined;
};

util.openNativeAppLink = function(app_link, web_fallback) {
    if (!util.getMobileOperatingSystem()) {
        document.location = web_fallback;
        return;   
    }

    // try native app link
    document.location = app_link;

    // handle case where app is not installed
    // from http://aawaara.com/post/74543339755/smallest-piece-of-code-thats-going-to-change-the
    var timer;
    var heartbeat;
    var lastInterval;

    function clearTimers() {
        clearTimeout(timer);
        clearTimeout(heartbeat);
    }

    window.addEventListener("pageshow", function(evt){
        clearTimers();
    }, false);

    window.addEventListener("pagehide", function(evt){
        clearTimers();
    }, false);

    // For all other browsers except Safari (which do not support pageshow and pagehide properly)
    function intervalHeartbeat() {
        var now = getTime();
        var diff = now - lastInterval - 200;
        lastInterval = now;
        if(diff > 1000) { // don't trigger on small stutters less than 1000ms
            clearTimers();
        }
    }

    lastInterval = (new Date()).getTime();
    heartbeat = setInterval(intervalHeartbeat, 200);
    timer = setTimeout(function () {
        document.location = web_fallback;
    }, 2000);
};
