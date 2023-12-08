let myChart;

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


// Fonction qui recupere dans les données JSON le pays en fonction du continent et qui renvoie un tableau de pays
async function getDistinctPays(continent){
    

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

// Fonction qui recupere dans les données JSON le pays en fonction du continent et qui renvoie un tableau de pays
async function getMoyenneRevenu(continent, pays, annees_experience,groupBy) {
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

    if (pays !== "all" && annees_experience !== "") {
        filteredData = filteredData.filter(item => item.Country === pays && item.YearsCodePro === annees_experience);
        console.log("test1");
    }
    else if (pays !== "all") {
        filteredData = filteredData.filter(item => item.Country === pays);
        console.log("test2");
    }
    else if (annees_experience !== "") {
        filteredData = filteredData.filter(item => item.YearsCodePro === annees_experience);
        console.log("test3");
    }
    else {
        filteredData = filteredData;
        console.log("test4");
    }
    // Filtrer les données dont le revenu est NA
    filteredData = filteredData.filter(item => item.CompTotal !== "NA");

    let platforms;

    // Groupement par PlatformHaveWorkedWith  ou par WebframeHaveWorkedWith
    const groupedData = filteredData.reduce((acc, item) => {
        if (groupBy === "PlatformHaveWorkedWith") {
            platforms = item.PlatformHaveWorkedWith.split(';');
        }
        else if (groupBy === "WebframeHaveWorkedWith") {
            platforms = item.WebframeHaveWorkedWith.split(';');
        }
        else {
            alert('erreur dans le groupement')  
        }

        platforms.forEach(platform => {
            acc[platform] = acc[platform] || [];
            // convertir les revenus en EURO avec le fichier conversion_revenu.js
            // on teste si les 3 premiers carcateres de item.currency sont différents de EUR si oui on convertit
            // convertir en nombre les revenus
            item.CompTotal = parseInt(item.CompTotal);
            if (item.Currency.substring(0,3) !== "EUR" && item.Currency !== "NaN") {
                // console.log("item.Currency:", item.Currency, item.Currency.substring(0,3));
                // console.log("item.CompTotal:", item.CompTotal);
                item.CompTotal = convertirEnEur(item.CompTotal, item.Currency.substring(0,3));
                // console.log("item.CompTotal:", item.CompTotal);
            }
            if (item.CompTotal < 500000) {
                acc[platform].push(item.CompTotal);
            }
        });

        return acc;
    }, {});

    const moyenneRevenuParPlateforme = {};

    for (const platform in groupedData) {
        const revenus = groupedData[platform];
        // console.log(`Revenus pour ${platform}:`, revenus);
    
        let moyenne = 0;
        //convertir les revenus en nombre
        // revenus.forEach((revenu, index) => {
        //     revenus[index] = parseInt(revenu);
        // });
    
        if (revenus.length > 0) {
            moyenne = revenus.reduce((a, b) => a + b, 0) / revenus.length;
        }
        else {
            moyenne = 0;
        }
    
        // La ligne ci-dessous doit être en dehors de la boucle if...else
        moyenneRevenuParPlateforme[platform] = moyenne;
    }

    if (groupBy === "PlatformHaveWorkedWith") {
        camembert(moyenneRevenuParPlateforme, pays, annees_experience);
    }
    else if (groupBy === "WebframeHaveWorkedWith") {
        nuage_de_points(moyenneRevenuParPlateforme, pays, annees_experience);
    }
    else {
        alert('erreur dans le groupement')  
    }
    return moyenneRevenuParPlateforme;
}


document.getElementById("continent").addEventListener("change", async () => {
    mettreAJourPays();
    const moyenneRevenu = await getMoyenneRevenu(
        document.getElementById("continent").value,
        document.getElementById("pays").value,
        document.getElementById("experience").value,
        document.getElementById("groupBy").value
    );
    console.log("Valeur experience:", typeof(document.getElementById("experience").value));
    console.log("Moyenne Revenu par Plateforme:", moyenneRevenu);
});

document.getElementById("experience").addEventListener("change", async () => {
    if (document.getElementById("continent").value === "all") {
        alert("Veuillez selectionner un continent");
        return;
    }
    const moyenneRevenu = await getMoyenneRevenu(
        document.getElementById("continent").value,
        document.getElementById("pays").value,
        document.getElementById("experience").value,
        document.getElementById("groupBy").value
    );
    console.log("Moyenne Revenu par Plateforme:", moyenneRevenu);
});

document.getElementById("pays").addEventListener("change", async () => {
    const moyenneRevenu = await getMoyenneRevenu(
        document.getElementById("continent").value,
        document.getElementById("pays").value,
        document.getElementById("experience").value,
        document.getElementById("groupBy").value
    );
    console.log("Moyenne Revenu par Plateforme:", moyenneRevenu);
});


function camembert(liste_moyenne_revenu, pays, annees_experience){
    // Remplacez "graph-container" par l'ID réel de votre conteneur de graphe
    var conteneurGraphe = document.getElementById("myChart");

    if (myChart) {
        myChart.destroy();
    }

    // Supprimez tous les enfants du conteneur pour réinitialiser le graphe
    while (conteneurGraphe.firstChild) {
        conteneurGraphe.removeChild(conteneurGraphe.firstChild);
    }

    // Creer un camembert avec les données de moyenne_revenu 
    // et l'afficher dans le div d'id "graphique" avec la librairie chart.js
    const ctx = document.getElementById('myChart').getContext('2d');

    let labels = [];
    let data = [];
    couleurs = [];

    for (const platform in liste_moyenne_revenu) {
        labels.push(platform);
        data.push(liste_moyenne_revenu[platform]);
        const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        couleurs.push(color);
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Moyenne des revenus',
                backgroundColor: couleurs,
                data: data
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'left',
                    align: 'start',
                    labels: {
                        boxWidth: 10,
                        padding: 10,
                        usePointStyle: true
                    }
                }
            },
            title: {
                display: true,
                text: `Moyenne des revenus par plateforme pour ${pays} avec ${annees_experience} années d'expérience`
            }
        }
    });
}

function nuage_de_points(liste_moyenne_revenu, pays, annees_experience){
    // fonction qui crée un nuage de points avec les données de moyenne_revenu en fonction de la technologie

    if (myChart) {
        myChart.destroy();
        while (myChart.firstChild) {
            myChart.removeChild(conteneurGraphe.firstChild);
        }
    }
    

    const ctx = document.getElementById('myChart').getContext('2d');

    let labels = [];
    let data = [];
    couleurs = [];

    for (const platform in liste_moyenne_revenu) {
        labels.push(platform);
        data.push(liste_moyenne_revenu[platform]);
        const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        couleurs.push(color);
    }

    myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [{
                label: 'Moyenne des revenus',
                backgroundColor: couleurs,
                data: data
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'left',
                    align: 'start',
                    labels: {
                        boxWidth: 10,
                        padding: 10,
                        usePointStyle: true
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    position: 'bottom'
                },
                y: {
                    type: 'linear',
                    position: 'left'
                }
            },
            title: {
                display: true,
                text: `Moyenne des revenus par plateforme pour ${pays} avec ${annees_experience} années d'expérience`
            }
        }
    });


}