$(function() {
    function worldDataAJAX() {
        $.ajax({
            url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                $.each(response.features, function(index, val) {
                    addMarkers(val);
                });
            }
        })
    }

    function addInfo(data){
    	var content = "";
    	content += "Location: " + data.properties.place + "<br>";
    	content += "Magnitude: " + data.properties.mag;
    	return content;
    }

    function addMarkers(data) {
        var lng = data.geometry.coordinates[0];
        var lat = data.geometry.coordinates[1];
        var latlng = lat + "," + lng;
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            map: map,
        });
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

    function selectedDataAJAX() {
        $.ajax({
            url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&',
            type: 'GET',
            dataType: 'json',
            data: {
                param1: 'value1'
            },
            sucess: function(response) {

            }
        })


    }

    function mapInit() {
        var mapOptions = {
            zoom: 5,
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

    $('#search').click(worldDataAJAX);

    var map = mapInit();

});
