var ggmap = (function() {
    var map = null;
    var allMarkers = [];

    function addInfo(data) {
        var content = "";
        content += "Location: " + data.properties.place + "<br>";
        content += "Magnitude: " + data.properties.mag + "<br>";
        content += "Time: " + new Date(data.properties.time);
        return content;
    }

    function chooseMarker(magnitude) {
        marker = "";
        if (magnitude < 2.5) {
            marker = 'http://labs.google.com/ridefinder/images/mm_20_white.png';
        } else if (magnitude >= 2.5 && magnitude < 5.5) {
            marker = 'http://labs.google.com/ridefinder/images/mm_20_blue.png';
        } else if (magnitude >= 5.5 && magnitude < 6.1) {
            marker = 'http://labs.google.com/ridefinder/images/mm_20_green.png';
        } else if (magnitude >= 6.1 && magnitude < 6.9) {
            marker = 'http://labs.google.com/ridefinder/images/mm_20_orange.png';
        } else {
            marker = 'http://labs.google.com/ridefinder/images/mm_20_red.png';
        }
        return marker;
    }

    function clearMarkers() {
        for (i = 0; i < allMarkers.length; i++) {
            allMarkers[i].setMap(null);
        }
    }

    return {
        mapInit: function() {
            var mapOptions = {
                zoom: 5,
                minZoom: 2,
                center: new google.maps.LatLng(32.09024, -100, 712991),
                panControl: false,
                panControlOptions: {
                    position: google.maps.ControlPosition.BOTTOM_LEFT
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                scaleControl: false
            };

            infoWindow = new google.maps.InfoWindow({
                content: ""
            });
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            google.maps.event.addListener(map, 'click', function() {
                infoWindow.close();
            });
            return map;
        },
        addMarker: function(data) {
            var lng = data.geometry.coordinates[0];
            var lat = data.geometry.coordinates[1];
            var latlng = lat + "," + lng;
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                animation: google.maps.Animation.DROP,
                icon: chooseMarker(data.properties.mag),
                map: map
            });
            var content = addInfo(data);
            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                }
            })(marker));
            allMarkers.push(marker);
            return marker;
        },

        removeMarkers: function() {
            for (i = 0; i < allMarkers.length; i++) {
                allMarkers[i].setMap(null);
            }
            allMarkers = [];
        },

        filterMap: function(icon) {
            clearMarkers();
            for (var i = 0; i < allMarkers.length; i++) {
                if (icon == "http://labs.google.com/ridefinder/images/mm_20_black.png") {
                    allMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
                    allMarkers[i].setMap(map);
                } else {
                    if (allMarkers[i].icon === icon) {
                        allMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
                        allMarkers[i].setMap(map);
                    }
                }
            }
        }
    };
})();
