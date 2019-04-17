(function(){
	// no head
  if (!document.head) { return; }
	// is preview mode
	if ((window.onerror||'').indexOf('return true') !== -1) { return; }
	// go
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.twitter-follow { transition:all .25s;position:fixed;right:-4px;bottom:1rem;opacity:0;transform:translateX(170px);z-index:99999; } .twitter-follow-reveal { opacity:1; transform:translateX(0); } .twitter-follow iframe { display:block; }';
	document.head.appendChild(style);

  var s = document.createElement('script');
  s.async = true
  s.onload = function() {
		
    var wrapper = document.createElement('div');
		wrapper.className = 'twitter-follow';
    document.body.appendChild(wrapper);
		twttr.widgets.createFollowButton('rikschennink', wrapper, { showCount:false, size:'large' });
		
    setTimeout(function() { wrapper.classList.add('twitter-follow-reveal'); }, 1000);
	
  };
  s.src = '//platform.twitter.com/widgets.js';
  document.head.appendChild(s);
	
}());