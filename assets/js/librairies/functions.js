var APP = {
  API_STATION: "./api/stations.json",
  API_STATION_FIREBASE: "https://stations-e30a4-default-rtdb.firebaseio.com/stations.json",
  MYMAP: L.map("map").setView([47.49163, 4.33834], 9),
  MARKER: [],
  toggleNav: (event) => {
    var nav = document.querySelector("nav#menu").classList.toggle("none");
  },
  setDetails: (fields) => {
    console.log("SetDetails :", fields);
    const { hdebut, hfin } = fields;
    let { carburants, services } = fields;
    var horaire;
    hdebut === hfin ? (horaire = "24h/24") : (horaire = hdebut + "à" + hfin);
    carburants = carburants
      ? "<li>" + carburants.split("|").join("</li><li>") + "</li>"
      : "";
    services = services
      ? "<li>" + services.split("|").join("</li><li>") + "</li>"
      : "";
    var template = `
        <div class="station-cover">
            <img
              src="${fields.imageURL}"
              alt="image de la station"
              width="100%"
            />
          </div>
          <div class="station-title"><h2>Bienvenue Sur Station Maps${fields.name}</h2></div>
          <div class="station-reviews flex gap-10 p-10 aic">
            <div class="review-note">4.3</div>
            <div class="reviews-star">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <div class="reviews-resume">${fields.countNotes}</div>
          </div>
          <div class="station-actions flex p-10">
            <div class="station-action-item flex column flex-1 aic">
              <i class="fas fa-road"></i>
              <span>Itinéraiires</span>
            </div>
            <div class="station-action-item flex column flex-1 aic">
              <i class="fas fa-save"></i>
              <span>Enregistrer</span>
            </div>
            <div class="station-action-item flex column flex-1 aic">
              <i class="fas fa-street-view"></i>
              <span>Proximité</span>
            </div>
            <div class="station-action-item flex column flex-1 aic">
              <i class="fas fa-mobile-alt"></i>
              <span>Phone</span>
            </div>
            <div class="station-action-item flex column flex-1 aic">
              <i class="fas fa-share-alt"></i>
              <span>Partager</span>
            </div>
          </div>
          <div class="station-description p-10">
          ${fields.description}
          </div>
          <div class="station-services p-10 ">
            <div class="station-service-item flex aic gap-10">
              <img
                src="assets/icons/adresse.svg"
                alt="adresse"
                
              />
              <strong>Adresse: </strong>
              <span class="flex-1">${fields.adresse} <strong>${fields.codepostal}</strong> ${fields.commune}</span>
            </div>
            <div class="station-service-item flex aic gap-10">
              <img
                src="assets/icons/phone.svg"
                alt="adresse"

              />
              <strong>Téléphone: </strong>
              <span class="flex-1">034528664</span>
            </div>
            <div class="station-service-item flex aic gap-10">
              <img
                src="assets/icons/horaire.svg"
                alt="adresse"
              />
              <strong>Horaire: </strong>
              <span class="flex-1">${horaire}</span>
            </div>
            <div class="station-service-item flex aic gap-10">
              <img 
                src="assets/icons/carburant.svg"
                alt="adresse"
              />
              <strong>Carburants: </strong>
              <ul class="flex column flex-1">
                ${carburants}
              </ul>
            </div>
            <div class="station-service-item flex aic gap-10">
              <img
                src="assets/icons/route.svg"
                alt="adresse"
              />
              <strong>Route: </strong>
              <span class="flex-1">A proximité d'autoroute</span>
            </div>
            <div class="station-service-item flex aic gap-10">
              <img
                src="assets/icons/horaire.svg"
                alt="adresse"
              />
              <strong>Service: </strong>
              <ul class="flex column flex-1">
                ${services}
              </ul>
            </div>
          </div>`;
    let nav = document.querySelector("nav");
    nav.classList.contains("none") ? nav.classList.toggle("none") : null;
    nav.innerHTML = template;
    nav.scrollTop = 0;
  },
  messagePopup: (fields) => {
    var div = document.createElement("div");
    var button = document.createElement("button");
    div.className = "station-popup";
    div.innerHTML = `
            <strong>Nom</strong>: ${fields.name}<br>
            <strong>Adress</strong>:${fields.adresse}<br>
            <strong>Code Postal</strong>:${fields.codepostal}${fields.commune}<br>
            `;
    button.innerHTML = "En savoir plus";
    button.className = "bt-about-station";
    button.onclick = () => {
      //
      APP.setDetails(fields);
    };
    div.appendChild(button);
    return div;
  },
  filterStations: (event) => {
    let tag = event.target.value.trim();

    //console.log(tag)
    let stations = JSON.parse(localStorage.getItem("stations"));
    if(!tag){
        APP.hideSuggestion
        return;
    }
    //console.log(stations)
      stations = stations.filter(({ fields }) => {
      tag = tag.toLowerCase();
      key_on = fields.name.toLowerCase();
      key_to = fields.adresse.toLowerCase();
      if (key_on.search(tag) > 0 || key_to.search(tag) > 0) {
        return true;
      }
      return false;
    });
    APP.autocomplete(stations)
    console.log(stations);
  },
  autocomplete :(stations) => {
    var suggest = document.querySelector(".search-bar-suggestion");
        suggest.innerHTML=" "
        //Affichage de la boite d autocompletion
        suggest.classList.contains('none') ? suggest.classList.toggle('none'): null
        
        if(!stations.length){
           suggest.innerHTML = `<div class="suggestion-item">
            Aucun résultat ne correspond à votre recherche
           </div>`
           return;
           
        }
         
        stations = stations.slice(0,10)

        stations.forEach(({fields} )=> {
          var div = document.createElement('div')
          let popupMessage = APP.messagePopup(fields)
          div.className="suggestion-item"
          div.innerHTML = `
                          ${fields.adresse} 
                          <strong> ${fields.codepostal}</strong>
                          ${fields.commune}`
          div.onclick=()=> {
            APP.setDetails(fields)
            APP.hideSuggestion
            let marker = APP.MARKER.filter(e => e._id ===fields._id)[0].marker
            marker.openPopup()
            
          }

          suggest.appendChild(div)
        });
  },
  hideSuggestion: ()=> {
        var suggest = document.querySelector(".search-bar-suggestion");
        if(!suggest.classList.contains('none')){
            suggest.classList.add('none')
            return;
        }
  },
  setDetailsSuggest: ()=> {
    console.log("details")
  }
};

var setupListeners = () => {
  var bars = document.getElementById("bars");
  bars.onclick = APP.toggleNav;
  document.querySelector("input").oninput = APP.filterStations;
  document.querySelector("input").onmouseover = APP.filterStations;
  document.querySelector(".search-bar-suggestion").onmouseleave = APP.hideSuggestion;
  
};
