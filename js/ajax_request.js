$(function() {
    function worldDataAJAX() {
        var yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
        $.ajax({
            url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson',
            type: 'GET',
            dataType: 'json',
            data: {
                'starttime': yesterday
            },
            success: function(response) {
                $.each(response.features, function(index, val) {
                    ggmap.addMarker(val);
                });
            }
        })
    }

    function addMarkers(data) {
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
                 map.setCenter(new google.maps.LatLng(userCoord.latitude, userCoord.longitude));
                var yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
                var requestParam = {
                    'starttime': yesterday,
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
                    ggmap.addMarker(val);
                });
            }
        })


    }

    function getForm() {
        $('#radius-box').slideToggle('slow', function() {
            $('#submit').click(function(e) {
                e.preventDefault();
                $('#radius-box').slideUp('slow');
                ggmap.removeMarkers();
                var radius = $('#search-radius').val();
                if (radius === "") {
                    getUserCoord('160');
                } else {
                    radius = (parseInt(radius) * 0.621371).toString();
                    getUserCoord(radius);
                }
                $('#search-radius').val('');
            });
        });
    }

    function listener() {
        $('#allEQ').click(function() {
            ggmap.removeMarkers();
            worldDataAJAX();
        });
        $('#xsEQ').click(function() {
        	var icon = $('#xsEQ').children()[0].currentSrc;
        	ggmap.filterMap(icon);
        });
        $('#sEQ').click(function() {
        	var icon = $('#sEQ').children()[0].currentSrc;
        	ggmap.filterMap(icon);
        });
        $('#mEQ').click(function() {
        	var icon = $('#mEQ').children()[0].currentSrc;
        	ggmap.filterMap(icon);
        });
        $('#lEQ').click(function() {
        	var icon = $('#lEQ').children()[0].currentSrc;
        	ggmap.filterMap(icon);
        });
        $('#xlEQ').click(function() {
        	var icon = $('#xlEQ').children()[0].currentSrc;
        	ggmap.filterMap(icon);
        });
        $('#cancel-filter').click(function() {
            var icon = $('#cancel-filter').children()[0].currentSrc;
            ggmap.filterMap(icon);
        });

        $('#myEQ').click(getForm);
        $('#filterEQ').click(function() {
            $('#filter-buttons').slideToggle('slow', function() {

            });
        });
    }
    var map = ggmap.mapInit();
    listener();

});
