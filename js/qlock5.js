/**
	QLOCK5
			An html remake of the most awesome clock I've ever seen: qlocktwo
			Original design by Biegert & Funk
			Remake by @suhajdab	at onereason

	@author Balazs Suhajda @ onereason
*/

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
		container.dataset.state = 'ready';
	}

	/**
	 * insert clock html into DOM
	 */
	function build() {
		var panels = panelString.split( ' ' ),
			wrapper = document.createElement( 'div' );

		var content = panels.map( process ).join('');
		wrapper.innerHTML = content;
		container.appendChild( wrapper );
	}

	/**
	 * returns a single element, panel
	 * @param  {string} str texContent and optionally id of element to be created
	 * @return {string}     text or markup as clock building block
	 */
	function process( str ) {
		var arr = str.split(':');
		return arr[ 1 ] ? '<span id="' + arr[ 1 ] + '">' + arr[ 0 ] + '</span>' : arr[ 0 ];
	}

	/**
	 * sets classes based on location.hash to allow users to customize default behavior
	 */
	function onHashChange () {
		if ( location.hash ) {
			var hash = location.hash.replace( '#', '' ).replace( ',', ' ' );
			document.body.className = hash;
			_gaq && _gaq.push(['_trackEvent', 'Hash', hash]);  
		}
	}

	/**
	 * calulates time until full minute on device's clock to make sure it's in sync
	 * @return {number} ms milisec until full minute
	 */
	function msToFullMinute() {
		var d = new Date(),
			ms = 1000 - d.getMilliseconds() + ( 60 - d.getSeconds() ) * 1000;
		return ms;
	}

	/**
	 * set next refresh of clock to match device clock
	 */
	function waitTillFullMinute() {
		setTimeout( startTicking, msToFullMinute() );
	}

	/**
	 * start regular ticks
	 */
	function startTicking() {
		refresh();
		setInterval( refresh, 1000 * 60 );
	}
	
	/**
	 * refresh clock elements
	 */
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

	/**
	 * shows appropriate textual element(s) representing every 5th minute
	 * @param  {number} m minutes of current time
	 */
	function showTextMinutes( m ) {
		if ( m < 5 ) show( 'oclock' );
		else if ( m < 10 || m > 54 ) show( 'm5' );
		else if ( m < 15 || m > 49 ) show( 'm10' );
		else if ( m < 20 || m > 44 ) show( 'm15 a' );
		else if ( m < 25 || m > 39 ) show( 'm20' );
		else if ( m < 30 || m > 34 ) show( 'm20 m5' );
		else show( 'm30' );
	}

	/**
	 * shows dots representing 4 minutes between textual minute elements
	 * @param  {[type]} m inutes of current time
	 */
	function showDotMinutes( m ) {
		var r = m % 5;
		if ( r >= 1 ) show( 'm1' );
		if ( r >= 2 ) show( 'm2' );
		if ( r >= 3 ) show( 'm3' );
		if ( r >= 4 ) show( 'm4' );
	}

	/**
	 * shows text elements representing the relations between hours and minutes
	 * five past three / ten to twelve
	 * @param  {number} m inutes of current time
	 */
	function showPastTo( m ) {
			if ( m > 4 ) {
			if ( m < 35 ) show( 'past' );
			else show( 'to' );
		}
	}

	/**
	 * shows text element representing current hour
	 * @param  {number} h hours of current time
	 * @param  {number} m minutes of current time
	 */
	function showHours( h, m ) {
		container.dataset.hours = hours24to12( h );

		if ( m > 34 ) h ++;    
		h = hours24to12( h );
		show( 'h' + h );
	}
	
	/**
	 * convert 0 - 23:59 time to 12:00 - 11:59
	 * @param  {number} h hours
	 * @return {number}   hours
	 */
	function hours24to12 ( h ) {
		return h > 12 ? h - 12 : ( h || 12 );
	}

	/**
	 * sets .on class on elements to be shown
	 * @param  {string} ids id of elements to be shown
	 */
	function show ( ids ) {
		ids.split( ' ' ).forEach( function ( id ) {
			doc.getElementById( id ).className = 'on';
		});
	}
	
	/**
	 * clears clock by removing .on class from all elements
	 */
	function allOff () {
		var els = doc.querySelectorAll( '.on' );
		for ( var i = 0, l = els.length; i < l; i++ ) {
			els[ i ].className = '';
		}
	}
	
	/**
	 * Checks if it is Earth Hour
	 * @param  {date}  d current date
	 * @return {Boolean}   is it earth hour?
	 */
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