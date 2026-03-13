const express = require("express");
const router = express.Router();

router.get("/chatbot.js", (req, res) => {
  res.type("application/javascript");

  const frontendOrigin =
    process.env.CLIENT_APP_ORIGIN || "http://localhost:5173";

  const script = `
(function(){

  // 1. Grab the script reference IMMEDIATELY, before any other scripts load.
  // document.currentScript safely targets this exact script tag.
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

  // 2. Extract the ID immediately
  var widgetId = currentScript ? currentScript.getAttribute("data-widget-id") : null;

  function init(){
    if(!widgetId){
      console.error("Chatbot widget: widgetId missing. Make sure data-widget-id is set on the script tag.");
      return;
    }

    var iframe = document.createElement("iframe");

    iframe.src = "${frontendOrigin}/embed/widget/" + widgetId;

    iframe.style.position = "fixed";
    iframe.style.bottom = "16px";
    iframe.style.right = "16px";
    iframe.style.width = "360px";
    iframe.style.height = "520px";
    iframe.style.border = "none";
    iframe.style.zIndex = "999999";

    document.body.appendChild(iframe);
  }

  // 3. Delay the iframe injection until the body is ready
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
`;

  res.send(script);
});

module.exports = router;