//<![CDATA[

    var linz;
    var tokyo;
    var panorama;
    // 初期化。bodyのonloadでinit()を指定することで呼び出してます
    function init() {

      // liniz
      var latlng = new google.maps.LatLng(48.309292, 14.284233);
      var opts = {
        zoom: 16,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latlng
      };
      linz = new google.maps.Map(document.getElementById("linz"), opts);
      
      // tokyo
      var latlng = new google.maps.LatLng(35.663411, 139.70502);
      var opts = {
        zoom: 16,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latlng
      };
      tokyo = new google.maps.Map(document.getElementById("tokyo"), opts);

      var panoramaOptions = {
        position: latlng,
        pov: {
          heading: 300,
          pitch: 0,
          zoom: 1
        }
      };
      panorama = new google.maps.StreetViewPanorama(document.getElementById("streetview"), panoramaOptions);
      tokyo.setStreetView(panorama);
      heading();
      move();
      location();
    }
    var count = 0;
    var timerId;
    function heading() {
        var heading = ++count * 5;
        panorama.setPov(
          {
            heading: heading,//Math.random() * 360,
            pitch: 1, //Math.random() * 10,
            zoom: 1
          }
        );
        timerId=setTimeout("heading()", 50);
    }
    
    function move() {
        var latlng = new google.maps.LatLng(35.663411 + Math.random() * 0.001, 139.70502 + Math.random() * 0.001);
        panorama.setPosition(
          latlng
        );
        timerId=setTimeout("move()", 2000);
    }
    
    /*function location() {    
	    var latlng = new google.maps.LatLng(35.663411, 139.70502);
	    var myOptions = {
	      zoom: 16,
	      center: latlng,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    var map = new google.maps.Map(document.getElementById("map"), myOptions);
	}*/
    
//]]>