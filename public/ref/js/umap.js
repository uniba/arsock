//<![CDATA[
    var map;
    function init() {
      var latlng = new google.maps.LatLng(35.663411, 139.70502);

      var options = {
      	zoom: 16,
        disableDefaultUI: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latlng
      }

      map = new google.maps.Map(document.getElementById("map"), options);
      var marker = new google.maps.Marker({
	      position: latlng, 
	      map: map,
	      title:"Uniba Inc."
	  });
    }
//]]>