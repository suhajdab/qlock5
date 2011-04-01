var qlock5 = ( function ( doc ) {
  var time;
  
  function init () {
    var d = new Date(),
    toFullMin = 1000 - d.getMilliseconds() + ( 60 - d.getSeconds() ) * 1000;
    setTimeout( function () {
      refresh();
      setInterval( refresh, 1000 * 60 );
    }, toFullMin );
    
    refresh();
  }
  
  function refresh () {
    var d = new Date(),
      m = d.getMinutes(),
      r = m % 5,
      h = d.getHours();
    
    allOff();
    
    if ( isEarthHour( d ) ) return;
    
    if ( m < 5 ) show( 'oclock' );
    else if ( m < 10 || m > 54 ) show( 'm5' );
    else if ( m < 15 || m > 49 ) show( 'm10' );
    else if ( m < 20 || m > 44 ) show( 'm15 a' );
    else if ( m < 25 || m > 39 ) show( 'm20' );
    else if ( m < 30 || m > 34 ) show( 'm20 m5' );
    else show( 'm30' );
    
    if ( r >= 1 ) show( 'm1' );
    if ( r >= 2 ) show( 'm2' );
    if ( r >= 3 ) show( 'm3' );
    if ( r >= 4 ) show( 'm4' );
    
    if ( m > 4 ) {
      if ( m < 35 ) show( 'past' );
      else show( 'to' );
    }
    
    //  
    doc.getElementById( 'qlock5' ).className = 'h' + h;
    if ( m > 34 ) h ++;

    
    h = h > 12 ? h - 12 : ( h || 12 );
    show( 'it is h' + h );
    doc.getElementById( 'qlock5' ).className = 'h' + h;
  }
  
  function show ( ids ) {
    ids.split( ' ' ).forEach( function ( el ) {
      doc.getElementById( el ).className = 'on';
    });
  }
  
  function allOff () {
    var els = doc.querySelectorAll( '.on' );
    for ( var i = 0, l = els.length; i < l; i++ ) {
      els[ i ].className = '';
    }
  }
  
  function isEarthHour ( d ) {
    var start = new Date('Sat Mar 26 2011 20:30:00'),
      end = new Date('Sat Mar 26 2011 21:30:00');
      
    if ( d > start && d < end ) {
      document.title = 'off for Earth Hour';
      return true;
    }
    return false;
  }
  
  init();
  
})( document );