

let getDateArray = function(start, end) {
    let arr = [];
    let dt = new Date(start);
    while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}

let formatDate = function(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

let rimuoviDuplicatiPerData = ((arr) => {
    
    // Creiamo un oggetto vuoto che useremo come "mappa" per verificare se un determinato "time" è già stato incontrato
    const mappa = {};
  
    // Filtriamo l'array originale, mantenendo solo gli oggetti che hanno una proprietà "time" unica
    const risultato = arr.filter((elem) => {
      if (mappa[elem.time]) {
        // Se abbiamo già incontrato un oggetto con lo stesso "time", lo scartiamo e passiamo al prossimo
        return false;
      } else {
        // Altrimenti, aggiungiamo il "time" all'oggetto mappa e manteniamo l'oggetto nell'array risultato
        mappa[elem.time] = true;
        return true;
      }
    });
  
    // Restituiamo l'array risultato senza duplicati
    return risultato;
  })
  

export {getDateArray, formatDate, rimuoviDuplicatiPerData}

