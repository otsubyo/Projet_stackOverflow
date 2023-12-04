
// Fonction qui recupere dans les données JSON le pays en fonction du continent et qui renvoie un tableau de pays
async function getDistinctMetier(continent){
    

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
    const paysDistincts = new Set(documentJson.map(item => item.DevType));
    
    return Array.from(paysDistincts);   
}
function mettreAJourMetier() {
    // On recupere la valeur du continent selectionné
    const continent = document.getElementById("continent").value;
    // On recupere le tableau de pays en fonction du continent
    const pays = getDistinctMetier(continent);
    // On recupere l'element HTML select
    const selectPays = document.getElementById("devType");
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

async function getTop5techparMetier(metier, continent, nb_top){
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
}


document.getElementById("continent").addEventListener("change", async () => {
    mettreAJourMetier();
    // const moyenneRevenu = await getMoyenneRevenu(
    //     document.getElementById("continent").value,
    //     document.getElementById("pays").value,
    //     document.getElementById("experience").value,
    //     document.getElementById("groupBy").value
    // );
    // console.log("Valeur experience:", typeof(document.getElementById("experience").value));
    // console.log("Moyenne Revenu par Plateforme:", moyenneRevenu);
});



// Données pour le diagramme
// var data = {
//     labels: ['Groupe 1', 'Groupe 2', 'Groupe 3'],
//     datasets: [
//         {
//             label: 'Série A',
//             backgroundColor: 'rgba(75, 192, 192, 0.5)',
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 1,
//             data: [12, 19, 3]
//         },
//         {
//             label: 'Série B',
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//             borderColor: 'rgba(255, 99, 132, 1)',
//             borderWidth: 1,
//             data: [5, 15, 10]
//         }
//     ]
// };

// // Configuration du diagramme
// var options = {
//     scales: {
//         x: {
//             stacked: true
//         },
//         y: {
//             stacked: true
//         }
//     }
// };

// // Obtenez le contexte du canevas
// var ctx = document.getElementById('barChart').getContext('2d');

// // Créer le diagramme à barres groupées
// var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: data,
//     options: options
// });