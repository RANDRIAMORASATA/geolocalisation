/****Returner les stations || fonction de recuperation des stations *********** */
var getStations = async() => {
    var response = await fetch(APP.API_STATION_FIREBASE)
    if(!response.ok){
        throw new Error('Error de récupération des données')
    }

    var stations = await response.json()
    //Enregistrement des sttaions dans firebase
    saveDAta(stations)
    return stations.slice(0,1000)
}



/*******Fontions qui initialise les marquers******** */
var initMarker = async() => {
    var stations = await getStations()
    
    stations = stations.filter((station) => {
        
        if(station.fields){
            if(station.fields.latlng){
                return true
            }
            
        }
        return false
    })
    //var marker = L.marker([51.5, -0.09]).addTo(map);
    stations.forEach(({fields}) => {
       // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    
        let popupMessage = APP.messagePopup(fields)
       var marker = L.marker(fields.latlng)
        .on('click', ()=> {
            APP.MYMAP.setView(fields.latlng, 10)
            APP.setDetails(fields)
        })
        .addTo(APP.MYMAP).bindPopup(popupMessage)
        APP.MARKER.push({
            _id:fields._id,
            marker : marker
        })
    });
    localStorage.setItem('stations' , JSON.stringify(stations))
    //Centrer suivant les coordonnées en 1er paramètre
    APP.MYMAP.setView(stations[15].fields.latlng, 9)

    //return stations
    
}


/******INITIALISATION DE CARTE ******* */
var initMap = ()=> {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(APP.MYMAP);  
initMarker()
.then (
    ()=> {
        console.log('initialisation des marqueurs')
    }
)
.catch(
    (error)=> {
        console.log('problème d\'initialisation des marquers', error)
    }
)

}

var saveDAta = async(data) => {
    var response = await fetch(APP.API_STATION_FIREBASE, 
        {
            method:'PUT',
            body:JSON.stringify(data)
    })
    if(!response.ok) {
        throw new Error ('Erreur de sauvegarde des données')
    }
    var result = await response.json()
    return result
}
