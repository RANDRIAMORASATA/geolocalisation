window.onload =()=> {
    //mise en place des abonnements
    setupListeners()

    //initialisation de la carte
    initMap()

    //Recuperations des données stations
    getStations()
    .then(
        (response)=> {
            console.log(response)
        }
    )
    .catch(
        (error)=> {
            console.log(error)
        }
    )
}