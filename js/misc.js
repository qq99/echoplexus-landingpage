$(document).ready(function () {

  window.installApplication = function () {
    var manifestLocation = "https://chat.echoplex.us/manifest.webapp";
    console.log("Attempting to install from", manifestLocation);

    var installApp = navigator.mozApps.install(manifestLocation);
    // Successful install
    installApp.onsuccess = function(data) {
        console.log("Success, app installed!");
    };
    // Install failed
    installApp.onerror = function() {
        console.log("Install failed\n\n:" + installApp.error.name);
    };
  };

  if (navigator.mozApps) {
    $('.firefox-webapp').show();
  }

  var $iframes = $("iframe");
  var srcs = [];
  $iframes.each(function (i, el) {
    var src = $(el).attr("eventual_src");
    srcs.push(src);
  });
  console.log(srcs);

  for (var i = 0; i < srcs.length; i++) {
    (function (i) {
      setTimeout(function() {
        console.log(i);
        $($iframes[i]).attr("src", srcs[i]);
      }, 1500*i)
    })(i);
  }

});
