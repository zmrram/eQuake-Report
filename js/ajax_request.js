$(function() {
    function worldDataAJAX(mag) {
        var yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
        $.ajax({
            url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson',
            type: 'GET',
            dataType: 'json',
            data: {
                'starttime': yesterday
            },
            success: function(response) {
                if (mag) {
                    filterData(response, mag);
                } else {
                    $.each(response.features, function(index, val) {
                        addMarkers(val);
                    });
                }
            }
        })
    }

    function filterData(data, mag) {
        switch (mag) {
            case 1:
                $.each(data.features, function(index, val) {
                    if (val.properties.mag < 2.5) {
                        addMarkers(val);
                    }
                });
                break;
            case 2:
                $.each(data.features, function(index, val) {
                    if (val.properties.mag >= 2.5 && val.properties.mag < 5.5) {
                        addMarkers(val);
                    }
                });
                break;
            case 3:
                $.each(data.features, function(index, val) {
                    if (val.properties.mag >= 5.5 && val.properties.mag < 6.1) {
                        addMarkers(val);
                    }
                });
                break;
            case 4:
                $.each(data.features, function(index, val) {
                    if (val.properties.mag >= 6.1 && val.properties.mag < 7) {
                        addMarkers(val);
                    }
                });
                break;
            case 5:
                $.each(data.features, function(index, val) {
                    if (val.properties.mag >= 7) {
                        addMarkers(val);
                    }
                });
                break;
        }
    }

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

    function removeMarkers() {
        for (i = 0; i < allMarkers.length; i++) {
            allMarkers[i].setMap(null);
        }
    }

    function addMarkers(data) {
        var lng = data.geometry.coordinates[0];
        var lat = data.geometry.coordinates[1];
        var latlng = lat + "," + lng;
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            animation: google.maps.Animation.DROP,
            icon: chooseMarker(data.properties.mag),
            map: map
        });
        allMarkers.push(marker);
        var content = addInfo(data);
        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                infoWindow.setContent(content);
                infoWindow.open(map, marker);
            }
        })(marker));
        // $.ajax({
        //     url: 'https://maps.googleapis.com/maps/api/geocode/json?',
        //     type: 'GET',
        //     dataType: 'json',
        //     data: {
        //         'latlng': latlng,
        //         'key': 'AIzaSyDvwaz-AlpoWn3GEa2xPDhdnmZ5eZaq--g'
        //     },
        //     success: function(response) {
        //         if (response.results.length !== 0){
        //         	console.log(response.results[response.results.length - 1].formatted_address);
        //         }
        //         else{
        //         	console.log("Ocean");
        //         }
        //     }
        // })
    }

    function getUserCoord(radius) {
        var userCoord;
        if (navigator.geolocation) {
            function error(err) {
                console.warn('ERROR(' + err.code + '): ' + err.message);
            }

            function success(position) {
                userCoord = position.coords;
                var yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
                var requestParam = {
                	'starttime' : yesterday,
                    'latitude': userCoord.latitude,
                    'longitude': userCoord.longitude,
                    'maxradiuskm': radius
                };
                selectedDataAJAX(requestParam);
            }

            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert('Geolocation is not supported')
        }
    }

    function selectedDataAJAX(queryParam) {
        $.ajax({
            url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson',
            type: 'GET',
            dataType: 'json',
            data: queryParam,
            success: function(response) {
                $.each(response.features, function(index, val) {
                    addMarkers(val);
                });
            }
        })


    }

    function mapInit() {
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
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        google.maps.event.addListener(map, 'click', function() {
            infoWindow.close();
        });
        return map;
    }

    function getForm(){
    	$('#radius-box').slideToggle('slow', function() {
    		$('#submit').click(function(){
    			$('#radius-box').slideUp('slow');
    			removeMarkers();
    			var radius = $('#search-radius').val();
    			if (radius === ""){
    				getUserCoord('160');
    			}
    			else {
    				radius = (parseInt(radius) * 0.621371).toString();
    				getUserCoord(radius);
    			}
    		});
    	});
    }

    function listener() {
        $('#allEQ').click(function() {
            removeMarkers();
            worldDataAJAX();
        });
        $('#xsEQ').click(function() {
            removeMarkers();
            worldDataAJAX(1);
        });
        $('#sEQ').click(function() {
            removeMarkers();
            worldDataAJAX(2);
        });
        $('#mEQ').click(function() {
            removeMarkers();
            worldDataAJAX(3);
        });
        $('#lEQ').click(function() {
            removeMarkers();
            worldDataAJAX(4);
        });
        $('#xlEQ').click(function() {
            removeMarkers();
            worldDataAJAX(5);
        });
        $('#myEQ').click(getForm);
    }
    var allMarkers = [];
    var map = mapInit();
    listener();

});
