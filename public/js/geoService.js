angular.module('geoService', [])
    .factory('geoService', function($rootScope, $http){

        var googleMapService = {};

        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Array of locations
        var locations = [];

        var selectedLat = 30.50;
        var selectedLong = -90.50;

        
        // Getting the latitude logitude data and refersh it
        googleMapService.refresh = function(latitude, longitude){

            // Clear the arry
            locations = [];

            selectedLat = latitude;
            selectedLong = longitude;

            // Getting results from db
            $http.get('/flats').success(function(response){

                // Converting into Google Map Format
                locations = convertToMapPoints(response);
                initialize(latitude, longitude);
            }).error(function(){});
        };

        // Converting data into map pts.
        var convertToMapPoints = function(response){

            var locations = [];

            // Loop all JSON
            for(var i= 0; i < response.length; i++) {
                var flat = response[i];

                var  contentString =
                    '<p><b>Username</b>: ' + flat.username +
                    '<br><b>Address</b>: ' + flat.address +
                    '<br><b>Email</b>: ' + flat.email +
                    '</p>';

                // Converting into latitude, longitude format
                locations.push({
                    latlon: new google.maps.LatLng(flat.location[1], flat.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: flat.username,
                    address: flat.address,
                    email: flat.email
            });
        }
        return locations;
    };

// Initializes the map
var initialize = function(latitude, longitude) {

    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // If map has not been created already...
    if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

            // When clicked, open the selected marker's message
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    // Set initial location as a bouncing red marker
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;

    // Function for moving to a selected location
    map.panTo(new google.maps.LatLng(latitude, longitude));

    // Clicking on the Map moves the bouncing red marker
    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // When a new spot is selected, delete the old red bouncing marker
        if(lastMarker){
            lastMarker.setMap(null);
        }

        // Create a new red bouncing marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);

        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });

};

// Refresh the page when the window is loaded and set the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});
