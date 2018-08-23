function initMap () {
    map = new google.maps.Map(document.getElementById('map'), model.neighborhood);

    ko.applyBindings (new ViewModel());
};

var ViewModel = function (){
    
    var self=this;
    this.markers=[];
    
    //Displaying markers for the defined locations.
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
    // Creating Location list filter

    this.searchItem = ko.observable('');
    this.mapList = ko.observableArray([]);
    for (var i=0;i<model.locations.length;i++){
        var item=model.locations[i];
        self.mapList.push(item);
    };    
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
};
