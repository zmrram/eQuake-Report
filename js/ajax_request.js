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

    function collectInput() {
        if ($('#address').val() != "") {
            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?',
                type: 'GET',
                dataType: 'json',
                data: {
                    'address': $('#address').val(),
                    'key': 'AIzaSyDvwaz-AlpoWn3GEa2xPDhdnmZ5eZaq--g'
                },
                success: function(response) {
                    var range = "";
                    if (response.status !== "ZERO_RESULTS") {
                        if (response.results[0].types.includes('premise') ||
                            response.results[0].types.includes('route') ||
                            response.results[0].types.includes('street address') ||
                            response.results[0].types.includes('postal_code')) {
                            if ($('#range').val() == '') {
                                $('#range-box').slideDown('slow');
                            } else {
                                var location = response.results[0].geometry.location;
                                var query = {
                                'starttime' : $('#starttime').val(),
                                'endtime': $('#endtime').val(),
                                'latitude': location.lat,
                                'longitude': location.lng,
                                'maxradiuskm': $('#range').val()
                                };
                                selectedDataAJAX(query);
                            }
                        }
                        else{
                            var bounds = response.results[0].geometry.bounds;
                            var minlatitude = bounds.southwest.lat;
                            var minlongitude = bounds.southwest.lng;
                            var maxlatitude = bounds.northeast.lat;
                            var maxlongitude = bounds.northeast.lng;
                            if (parseFloat(minlatitude) > parseFloat(maxlatitude)){
                                minlatitude = (parseFloat(minlatitude) * -1).toString();
                                maxlatitude = (parseFloat(maxlatitude) * -1).toString();
                            }
                            if (parseFloat(minlongitude) > parseFloat(maxlongitude)){
                                minlongitude = (parseFloat(minlongitude) * -1).toString();
                                maxlongitude = (parseFloat(maxlongitude) * -1).toString();
                            }

                            var query = {
                                'starttime' : $('#starttime').val(),
                                'endtime': $('#endtime').val(),
                                'minlatitude' : minlatitude,
                                'minlongitude' : minlongitude,
                                'maxlatitude' : maxlatitude,
                                'maxlongitude' : maxlongitude
                            };
                            selectedDataAJAX(query);
                        }
                    }
                }
            })
        } else {
            alert("Empty Address");
        }
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

        $('#searchEQ').click(function(event) {
            event.preventDefault();
            $('#range-box').slideUp('slow');
            collectInput();
        });
        $('#myEQ').click(getForm);


    }
    var map = ggmap.mapInit();
    listener();

});
