// Error handler
function googleMapsError() {
    alert('An error occurred with Google Maps!');
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), model.neighborhood);

    ko.applyBindings(new ViewModel());
};
// display filter on click

// document.getElementById('search').addListener('change',function(){
    
// };


var ViewModel = function () {
    var self = this;
    this.markers = [];
    var defaulticon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    var hovericon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';

    //Creating InfoWindow

    var infowindow = new google.maps.InfoWindow();

    // Creating markers 
    for (let i = 0; i < model.locations.length; i++) {

        this.markerTitle = model.locations[i].title;
        this.markerLocation = model.locations[i].location;
        this.marker = new google.maps.Marker({
            map: map,
            title: this.markerTitle,
            position: this.markerLocation,
            animation: google.maps.Animation.DROP,
            icon: defaulticon
        });

        this.marker.addListener('mouseover', function () {
            this.setIcon(hovericon);
            this.setAnimation(google.maps.Animation.BOUNCE);
        });
        this.marker.addListener('mouseout', function () {
            this.setIcon(defaulticon);
            this.setAnimation();
        });
        this.markers.push(this.marker);
    };


    //creating listener so that when  a marker is clicked the info window is displayed.
    for (let i = 0; i < self.markers.length; i++) {
        this.markers[i].addListener('click', function () {
            populateInfoWindow(self.markers[i], infowindow);
        });
    };

    function populateInfoWindow(marker, infowindow) {
        //make sure info window is not already  opened in this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent(setInfoWindowContent(marker));
            infowindow.open(map, marker);
            // clear marker property when info window is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }

    }
    this.searchItem = ko.observable('');
    this.mapList = ko.observableArray([]);
    for (let i = 0; i < model.locations.length; i++) {
        var item = model.locations[i];
        self.mapList.push(item);
    };
    // Creating Location list filter
    this.locationList = ko.computed(function () {
        var searchFilter = self.searchItem().toLowerCase();
        if (searchFilter) {
            var result = [];
            for (let i = 0; i < self.mapList().length; i++) {
                let str = self.mapList()[i].title.toLowerCase();
                if (str.includes(searchFilter)) {
                    result.push(self.mapList()[i]);
                }
            }
            return result;
        }
        else {
            return self.mapList();
        };
    });


    //Displaying markers on the location list
    //1.create computed array on observable array
    this.showMarkers = ko.computed(function () {
        let list = self.locationList();
        let markerArray = self.markers;
        //clear map with all the markers
        for (let i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(null);
        };
        //for loop through list and show markers for the list
        for (let j = 0; j < markerArray.length; j++) {
            for (let k = 0; k < list.length; k++) {
                if (list[k].title === markerArray[j].title) {
                    markerArray[j].setMap(map);
                }
            }
        };
    }, self);

    // Functionality when an item in the left pane is clicked.
    this.listClick = function (location) {
        //Reset Animation for other markers
        // debugger;
        self.searchItem(this.title);
        for (let i = 0; i < self.markers.length; i++) {
            self.markers[i].setAnimation();
            self.markers[i].setIcon(defaulticon);
        }
        // loop through the list of markers to get the marker with current location    
        for (let i = 0; i < self.markers.length; i++) {
            if (self.markers[i].title === this.title) {
                self.markers[i].setAnimation(google.maps.Animation.BOUNCE);
                self.markers[i].setIcon(hovericon);
                populateInfoWindow(self.markers[i], infowindow);
            };
        };
    };
    
    // Four square api
    var list = self.locationList();
    // get API request
    function getData(title, lat, lng) {
        var url = `https://api.foursquare.com/v2/venues/explore?client_id=YLPNMFRSRFBCLBIROKVOMQQCQX5S530I53NQ3XHLFQYA4A4O&client_secret=PCZGIVTH1DCGO5LSX1KTS0ATIPHO425C4WKXDMAEXPQPMSHC&v=20180323&limit=1&ll=${lat},${lng}&query=${title}`;
        return $.getJSON(url);
    };
    //  looping through the response data to add to the location array
    for (let i = 0; i < list.length; i++) {
        getData(list[i].title, list[i].location.lat, list[i].location.lng).done(function (data) {
            var result = data.response.groups[0].items[0].venue.location.formattedAddress[0];
            //self.locationList()[i].formattedAddress=result;
            self.locationList()[i].Address=result;
        }).fail(function () {
            alert('An error occured with four square API');
        });
    };
    // Setting Infowindow's content to the response formatted address
    function setInfoWindowContent(marker){
        let list=self.locationList();
        for (var i=0;i<list.length;i++){
            if (list[i].title===marker.title){
                return `${marker.title}:  ${list[i].Address}`;
            }
        }

    }
};

