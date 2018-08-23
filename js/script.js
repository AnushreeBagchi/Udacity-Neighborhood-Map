function initMap () {
    map = new google.maps.Map(document.getElementById('map'), model.neighborhood);

    ko.applyBindings (new ViewModel());
};

var ViewModel = function (){
    
    var self=this;
    this.markers=[];
    // Creating markers 
        for  (var i=0;i<model.locations.length;i++)
        {
            
            this.markerTitle=model.locations[i].title;
            this.markerLocation=model.locations[i].location;
            this.marker= new google.maps.Marker({
                                map: map,
                                title: this.markerTitle,
                                position:this.markerLocation,
                                animation: google.maps.Animation.DROP
            });
            this.markers.push(this.marker);              
        };

    

    this.searchItem = ko.observable('');
    this.mapList = ko.observableArray([]);
    for (var i=0;i<model.locations.length;i++){
        var item=model.locations[i];
        self.mapList.push(item);
    };  
    // Creating Location list filter
    this.locationList = ko.computed(function() {
        var searchFilter = self.searchItem().toLowerCase();
        if (searchFilter) {            
                var result=[];
                for (var i =0;i<self.mapList().length;i++)
                {
                    var str = self.mapList()[i].title.toLowerCase();
                    if (str.includes(searchFilter)){
                        result.push(self.mapList()[i]);
                    }
                }               
                return result;
            }
            else{
                return self.mapList();
            };
    });
    console.log(this.markers);
    
    //Displaying markers on the location list
    //1.create computed array on observable array
    this.showMarkers= ko.computed(function(){
        var list= self.locationList();
        var markerArray=self.markers;
        //clear map with all the markers
        for (var i=0;i<markerArray.length;i++){
            markerArray[i].setMap(null);            
        };
        //for loop through list and show markers for the list
        for (var j=0;j<markerArray.length;j++){
            for (var k=0;k<list.length;k++){
                if (list[k].title===markerArray[j].title){
                    markerArray[j].setMap(map);
                }
            }           
        };
    }, self);
    
    
};
