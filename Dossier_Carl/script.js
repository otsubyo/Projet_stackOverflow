/*
1 2 5 Carl
3 4 6 Clément
*/

/*

ED level :  

"Primary/elementary school"
"Secondary school (e.g. American high school, German Realschule or Gymnasium, etc.)"
"Some college/university study without earning a degree"
"Associate degree (A.A., A.S., etc.)"
"Bachelor’s degree (B.A., B.S., B.Eng., etc.)"
"Master’s degree (M.A., M.S., M.Eng., MBA, etc.)"
"Professional degree (JD, MD, Ph.D, Ed.D, etc.)"
"Something else"

*/

let MyChart;

// Fonction pour mettre à jour les options de pays en fonction de la sélection de continent
function mettreAJourPays() {
    // On récupère la valeur du continent sélectionné
    const continent = document.getElementById("continent").value;
    // On récupère le tableau de pays en fonction du continent
    const pays = getDistinctPays(continent);
    // On récupère l'élément HTML select
    const selectPays = document.getElementById("pays");
    // On supprime les options existantes sauf la première
    while (selectPays.options.length > 1) {
        selectPays.removeChild(selectPays.lastChild);
    }
    // On ajoute les options de pays

    pays.then(function (result) {
        result.forEach(pays => {
            const option = document.createElement("option");
            option.value = pays;
            option.textContent = pays;
            selectPays.appendChild(option);
        });
    });
}

// Fonction qui récupère dans les données JSON le pays en fonction du continent et renvoie un tableau de pays
async function getDistinctPays(continent) {
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
    // On récupère les données du fichier JSON
    const paysDistincts = new Set(documentJson.map(item => item.Country));

    return Array.from(paysDistincts);
}

// Fonction qui récupère dans les données JSON le revenu moyen en fonction des critères sélectionnés
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
    } else if (pays !== "all") {
        filteredData = filteredData.filter(item => item.Country === pays);
        console.log("test2");
    } else if (annees_experience !== "") {
        filteredData = filteredData.filter(item => item.YearsCodePro === annees_experience);
        console.log("test3");
    } else {
        filteredData = filteredData;
        console.log("test4");
    }
    // Filtrer les données dont le revenu est NA
    filteredData = filteredData.filter(item => item.CompTotal !== "NA");

    const moyenneRevenu = filteredData.reduce((acc, item) => {
        // Convertir les revenus en EURO avec le fichier conversion_revenu.js
        // On teste si les 3 premiers caractères de item.currency sont différents de EUR, si oui, on convertit
        // Convertir en nombre les revenus
        item.CompTotal = parseInt(item.CompTotal);
        if (item.Currency.substring(0, 3) !== "EUR" && item.Currency !== "NaN") {
            item.CompTotal = convertirEnEur(item.CompTotal, item.Currency.substring(0, 3));
        }
        acc.push(item.CompTotal);
        return acc;
    }, []);

    return moyenneRevenu.length > 0 ? moyenneRevenu.reduce((a, b) => a + b, 0) / moyenneRevenu.length : 0;
}

// Générer le graphique en fonction des données de revenu moyen par expérience
document.getElementById("experience").addEventListener("change", async () => {
    const moyenneRevenu = await getMoyenneRevenu(
        document.getElementById("continent").value,
        document.getElementById("pays").value,
        document.getElementById("experience").value
    );

    // Mettez en œuvre ici la logique pour afficher le graphique en fonction des revenus moyens par expérience.
    // Vous pouvez utiliser la bibliothèque de graphiques Chart.js pour créer un diagramme en barres ou un diagramme linéaire.
    // Assurez-vous d'afficher les revenus moyens en euros en convertissant si nécessaire.

    // Exemple de logique avec Chart.js pour un diagramme en barres :
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Expérience'], // Ajoutez d'autres étiquettes si nécessaire
            datasets: [{
                label: 'Revenu moyen en euros',
                data: [moyenneRevenu],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    console.log("Moyenne Revenu par Expérience:", moyenneRevenu);
});

// ... (les autres écouteurs d'événements restent inchangés)

// Fonction pour convertir le revenu en euros si la devise est différente
function convertirEnEur(revenu, devise) {
    // Implémentez la logique de conversion en euros en fonction de la devise actuelle
    // Vous pouvez utiliser des taux de change réels ou une estimation.
    // Assurez-vous de renvoyer la valeur convertie.
    // Exemple simplifié (à remplacer par votre propre logique) :
    const tauxDeChangeEURtoUSD = 1.18;
    if (devise === "USD") {
        return revenu * tauxDeChangeEURtoUSD;
    } else {
        return revenu;
    }
}
