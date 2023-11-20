// votre_script.js

// Fonction pour mettre à jour les options de pays en fonction de la sélection de continent
function mettreAJourPays() {
    // On recupere la valeur du continent selectionné
    const continent = document.getElementById("continent").value;
    // On recupere le tableau de pays en fonction du continent
    const pays = getDistinctPays(continent);
    // On recupere l'element HTML select
    const selectPays = document.getElementById("pays");
    // On supprime les options existantes sauf la premiere
    while (selectPays.options.length > 1) {
        selectPays.removeChild(selectPays.lastChild);
    }
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

async function getMoyenneRevenu(continent, pays, annees_experience) {
    let documentJson;

    if (continent === "Europe") {
        const response = await fetch("../data/survey_results_WE.json");
        documentJson = await response.json();
    } else if (continent === "Etats-unis") {
        const response = await fetch("../data/survey_results_NA.json");
        documentJson = await response.json();
    } else {
        return false;
    }

    // Filtrer les données en fonction des critères sélectionnés
    let filteredData = documentJson;

    if (pays !== "all") {
        filteredData = filteredData.filter(item => item.Country === pays);
    }

    if (annees_experience !== "null") {
        filteredData = filteredData.filter(item => item.YearsCodePro === annees_experience);
    }

    // Groupement par PlatformWantToWorkWith
    const groupedData = filteredData.reduce((acc, item) => {
        const platform = item.PlatformWantToWorkWith;
        acc[platform] = acc[platform] || [];
        acc[platform].push(item.CompTotal);
        return acc;
    }, {});

    // Calcul de la moyenne pour chaque plateforme
    const moyenneRevenuParPlateforme = {};

    for (const platform in groupedData) {
        const revenus = groupedData[platform];
        const moyenne = revenus.reduce((a, b) => a + b, 0) / revenus.length;
        moyenneRevenuParPlateforme[platform] = moyenne;
    }

    return moyenneRevenuParPlateforme;
}

// Exemple d'utilisation
const continentSelect = document.getElementById("continent");
const paysSelect = document.getElementById("pays");
const experienceSelect = document.getElementById("experience");

continentSelect.addEventListener("change", async () => {
    mettreAJourPays();
    const continent = continentSelect.value;
    const pays = paysSelect.value;
    const experience = experienceSelect.value;
    const moyenneRevenu = await getMoyenneRevenu(continent, pays, experience);
    console.log(moyenneRevenu);

});