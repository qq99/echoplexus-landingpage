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
    $('.firefox-webapp').css("display", "inline-block");
  }

  if (navigator.userAgent.toLowerCase().indexOf("android") > 0) {
    $('.android-apk').css("display", "inline-block");
  }

  // hacky buttons that are actually links
  $("button").on("click", function (ev) {
    var src = $(ev.target).attr("href");
    console.log(src);
    if (src) {
      window.location = src;
    }
  });

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
