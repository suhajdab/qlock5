/*
	TODO: option classes should be set on clock
	TODO: ready state to allow transitions
*/

var qlock5 = ( function ( doc ) {
	'use strict'

	var time, container;

	var panelString = 'IT:it L IS:is ASTIME A:a C QUARTER:m15 DC TWENTY:m20 FIVE:m5 X HALF:m30 B TEN:m10 F TO:to PAST:past ERU NINE:h9 ONE:h1 SIX:h6 THREE:h3 FOUR:h4 FIVE:h5 TWO:h2 EIGHT:h8 ELEVEN:h11 SEVEN:h7 TWELVE:h12 TEN:h10 SE OCLOCK:oclock &bull;:m1 &bull;:m2 &bull;:m3 &bull;:m4';
	
	function init () {
		container = doc.getElementById( 'qlock5' ),
		
		build();
		waitTillFullMinute();
		refresh();
		onHashChange();
		window.addEventListener( 'hashchange', onHashChange, false );
		container.className =+ ' ready';
	}

	function build() {
		var panels = panelString.split( ' ' ),
			wrapper = document.createElement( 'div' );

		var content = panels.map( process ).join('');
		wrapper.innerHTML = content;
		container.appendChild( wrapper );
	}

	function process( str ) {
		var arr = str.split(':');
		return arr[ 1 ] ? '<span id="' + arr[ 1 ] + '">' + arr[ 0 ] + '</span>' : arr[ 0 ];
	}

	//  allow users to simply set classes for custom settings by changing #hashes
	function onHashChange () {
		if ( location.hash ) {
			var hash = location.hash.replace( '#', '' ).replace( ',', ' ' );
			document.body.className = hash;
			_gaq && _gaq.push(['_trackEvent', 'Hash', hash]);  
		}
	}

	function msToFullMinute() {
		var d = new Date(),
			ms = 1000 - d.getMilliseconds() + ( 60 - d.getSeconds() ) * 1000;
		return ms;
	}

	function waitTillFullMinute() {
		setTimeout( startTicking, msToFullMinute() );
	}

	function startTicking() {
		refresh();
		setInterval( refresh, 1000 * 60 );
	}
	
	function refresh () {
		var d = new Date(),
			m = d.getMinutes(),
			h = d.getHours();
		
		allOff();
		
		if ( isEarthHour( d ) ) return;
		
		showTextMinutes( m );
		showDotMinutes( m );    
		showPastTo( m );
		showHours( h, m );
	}

	function showTextMinutes( m ) {
		if ( m < 5 ) show( 'oclock' );
		else if ( m < 10 || m > 54 ) show( 'm5' );
		else if ( m < 15 || m > 49 ) show( 'm10' );
		else if ( m < 20 || m > 44 ) show( 'm15 a' );
		else if ( m < 25 || m > 39 ) show( 'm20' );
		else if ( m < 30 || m > 34 ) show( 'm20 m5' );
		else show( 'm30' );
	}

	function showDotMinutes( m ) {
		var r = m % 5;
		if ( r >= 1 ) show( 'm1' );
		if ( r >= 2 ) show( 'm2' );
		if ( r >= 3 ) show( 'm3' );
		if ( r >= 4 ) show( 'm4' );
	}

	function showPastTo( m ) {
			if ( m > 4 ) {
			if ( m < 35 ) show( 'past' );
			else show( 'to' );
		}
	}

	function showHours( h, m ) {
		if ( m > 34 ) h ++;    
		h = h > 12 ? h - 12 : ( h || 12 );
		show( 'h' + h );
		container.className = 'h' + h;
	}
	
	function show ( ids ) {
		ids.split( ' ' ).forEach( function ( id ) {
			doc.getElementById( id ).className = 'on';
		});
	}
	
	function allOff () {
		var els = doc.querySelectorAll( '.on' );
		for ( var i = 0, l = els.length; i < l; i++ ) {
			els[ i ].className = '';
		}
	}
	
	function isEarthHour ( d ) {
		var start = new Date('Sat Mar 30 2013 20:30:00'),
			end = new Date('Sat Mar 30 2013 21:30:00');
			
		if ( d > start && d < end ) {
			document.title = 'turned off for Earth Hour';
			return true;
		}
		return false;
	}
	
	init();
	
})( document );