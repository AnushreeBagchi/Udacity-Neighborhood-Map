function initMap () {
    map = new google.maps.Map(document.getElementById('map'), model.neighborhood);

    ko.applyBindings (new ViewModel());
};

var ViewModel = function (){
    var self=this;
    this.markers=[];
    this.searchText=ko.observable();
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

    //Creating Initial Title list
    this.titleList=ko.observableArray([]);
    for (var i=0;i<model.locations.length;i++)
    {
        this.titleList.push(model.locations[i].title); 
    }
    document.getElementById('search').addEventListener('input',function (){
        this.searchText=document.getElementById('search').value;
        console.log( this.searchText);
    }); 
    
    
    
};






