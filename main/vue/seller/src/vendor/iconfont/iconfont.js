(function(window){var svgSprite="<svg>"+""+'<symbol id="icon-guanbi" viewBox="0 0 1024 1024">'+""+'<path d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zM720.714 669.002c14.286 14.286 14.286 37.429 0 51.714-7.143 7.143-16.5 10.714-25.857 10.714-9.357 0-18.714-3.571-25.857-10.714l-157-157-157 157c-7.143 7.143-16.5 10.714-25.857 10.714-9.357 0-18.714-3.571-25.857-10.714-14.286-14.286-14.286-37.429 0-51.714l157-157-157-157c-14.286-14.286-14.286-37.429 0-51.714 14.286-14.286 37.429-14.286 51.714 0l157 157 157-157c14.286-14.286 37.429-14.286 51.714 0 14.286 14.286 14.286 37.429 0 51.714l-157 157L720.714 669.002z"  ></path>'+""+"</symbol>"+""+'<symbol id="icon-paizhao" viewBox="0 0 1024 1024">'+""+'<path d="M923.090241 157.53901300000007L776.68787 157.53901300000007 700.282712 0 318.322417 0l-76.387761 157.540036L95.511819 157.540036c-31.830963 0-95.489818 39.380916-95.489818 116.92092l0 631.387088c0 65.227584 47.746444 118.150934 88.856747 118.150934l836.202846 0c41.778522 0 93.504604-55.383378 93.504604-116.92092L1018.5861990000001 275.69097C1018.5861990000001 236.30903 986.752166 157.53901300000007 923.090241 157.53901300000007L923.090241 157.53901300000007 923.090241 157.53901300000007zM954.922227 907.078057c0 15.540951-20.3597 37.271882-29.840631999999996 38.158065L89.06294300000002 945.236122c-7.368828-0.733711-25.382087-18.501376-25.382087-39.388079L63.680856000000006 274.460955c0-24.961508 27.091008-37.536918 31.830963-38.151925l182.462658 0 18.544355-38.267559L354.365308 78.770018l311.973314 0 56.8201 119.30727 17.501606 38.231742999999994 182.429913 0c22.446221 0 31.520901 36.268018 31.830963 39.381939L954.921203 907.078057 954.922227 907.078057 954.922227 907.078057z"  ></path>'+""+'<path d="M832.298422 325.75520200000005m-66.307172 0a64.797 64.797 0 1 0 132.614343 0 64.797 64.797 0 1 0-132.614343 0Z"  ></path>'+""+'<path d="M522.545682 364.18341999999996c-118.683053 0-214.894302 96.212272-214.894302 214.893278 0 118.68203 96.212272 214.894302 214.894302 214.894302 118.68203 0 214.894302-96.212272 214.894302-214.894302C737.439984 460.394668 641.227712 364.18341999999996 522.545682 364.18341999999996zM519.4307380000001 732.470297c-84.71645 0-153.391553-68.676126-153.391553-153.39257599999996 0-84.717474 68.676126-153.393599 153.391553-153.393599 84.71645 0 153.391553 68.676126 153.391553 153.393599C672.82229 663.794172 604.1471879999999 732.470297 519.4307380000001 732.470297z"  ></path>'+""+"</symbol>"+""+"</svg>";var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)
