// votre_script.js

// Fonction pour mettre à jour les options de pays en fonction de la sélection de continent
function mettreAJourPays() {
    // On recupere la valeur du continent selectionné
    const continent = document.getElementById("continent").value;
    // On recupere le tableau de pays en fonction du continent
    const pays = getDistinctPays(continent);
    // On recupere l'element HTML select
    const selectPays = document.getElementById("pays");
    // On supprime les options existantes
    selectPays.innerHTML = "";
    // On ajoute les options de pays
    
    pays.then(function(result){
        result.forEach(pays => {
            const option = document.createElement("option");
            option.value = pays;
            option.textContent = pays;
            selectPays.appendChild(option);
        });
    });
}



async function getDistinctPays(continent){
    // Fonction qui recupere dans les données JSON le pays en fonction du continent
    // et qui renvoie un tableau de pays

    let documentJson;

    if (continent === "Europe") {
        // On récupère le fichier JSON data/survey_results_WE.json
        const response = await fetch("../data/survey_results_WE.json");
        documentJson = await response.json();
    } else if (continent === "Etats-unis") {
        // On récupère le fichier JSON data/survey_results_NA.json
        const response = await fetch("../data/survey_results_NA.json");
        documentJson = await response.json();
    } else {
        return false;
    }
    // On recupere les données du fichier JSON
    const paysDistincts = new Set(documentJson.map(item => item.Country));
    
    return Array.from(paysDistincts);   
}

document.getElementById("continent").addEventListener("change", mettreAJourPays);