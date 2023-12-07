let myChart;
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
async function getDistinctOS(continent){
    // OpSysProfessionaluse
    
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
    //  OpSysProfessionaluse est une chaine de caractères contenant plusieurs OS séparés par des ";" ou des ","
    // Il faut donc les séparer et les mettre dans un tableau sans redondance
    const osDistincts = new Set();
    documentJson.forEach(item => {
        if (item.OpSysProfessionaluse != null) {
            const osArray = item.OpSysProfessionaluse.split(';').map(os => os.trim());
            osArray.forEach(os => {
                if (os != ""){
                    osDistincts.add(os);
                }
            });
        }
    });

    return Array.from(osDistincts);
}


function mettreAJourMetier() {
    // On recupere la valeur du continent selectionné
    const continent = document.getElementById("continent").value;
    // On recupere le tableau de pays en fonction du continent
    const pays = getDistinctMetier(continent);
    // On recupere l'element HTML select
    const selectPays = document.getElementById("filter");
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

function mettreAJourOS() {
    // OpSysProfessionaluse

    // On recupere la valeur du continent selectionné
    const continent = document.getElementById("continent").value;
    // On recupere le tableau d'OS en fonction du continent
    const os = getDistinctOS(continent);
    // On recupere l'element HTML select
    const selectOS = document.getElementById("filter");
    // On supprime les options existantes sauf la premiere
    while (selectOS.options.length > 1) {
        selectOS.removeChild(selectOS.lastChild);
    }
    // On ajoute les options d'OS
    os.then(function(result){
        result.forEach(os => {
            const option = document.createElement("option");
            option.value = os;
            option.textContent = os;
            selectOS.appendChild(option);
        });
    });
}

async function getTopTechByFilter(filtre, continent, topCount) {
    let documentJson;

    // Etape1 : Récupérer les données en fonction du continent
    if (continent === "Europe") {
        const response = await fetch("../data/survey_results_WE.json");
        documentJson = await response.json();
    } else if (continent === "Etats-unis") {
        const response = await fetch("../data/survey_results_NA.json");
        documentJson = await response.json();
    } else {
        return false;
    }

    // Etape2 : Filtrer les données en fonction du filtre
    if (filtre !== "all") {
        if (document.getElementById("typeFilter").value === "devType") {
            documentJson = documentJson.filter(item => item.DevType.includes(filtre));
        } else if (document.getElementById("typeFilter").value === "os") {
            documentJson = documentJson.map(item => {
                if (item.OpSysProfessionaluse) {
                    const osArray = item.OpSysProfessionaluse.split(';').map(os => os.trim());
                    
                    // Vérifier si le filtre est dans la liste des systèmes d'exploitation
                    if (osArray.includes(filtre)) {
                        // Garder uniquement le système d'exploitation spécifié
                        item.OpSysProfessionaluse = filtre;
                        return item;
                    }
                }
                // Ne pas inclure les éléments qui ne correspondent pas au filtre
                return null;
            }).filter(Boolean); // Pour supprimer les éléments nuls résultants du map
        }
    }
    // Créer un dictionnaire pour compter l'utilisation de chaque technologie par métier
    let techCountByOccupation = {}; // { "Développeur web": { "JavaScript": 10, "HTML": 5 }, "Développeur mobile": { "Java": 10, "Kotlin": 5 } }
    let occupations; // Tableau de métiers ou d'OS

    documentJson.forEach(item => {
        if (item.OfficeStackSyncHaveWorkedWith != null) {
            const techArray = item.OfficeStackSyncHaveWorkedWith.split(';').map(tech => tech.trim());

            if(document.getElementById("typeFilter").value === "devType") {  
                if (item.DevType) {
                    occupations = item.DevType.split(';').map(occ => occ.trim());
                } else {
                    occupations = [filtre];
                }
            }
            else {
                if (item.OpSysProfessionaluse) {
                    occupations = item.OpSysProfessionaluse.split(';').map(occ => occ.trim());
                } else {
                    occupations = [filtre];
                }
            }
            occupations.forEach(occ => {
                if (!techCountByOccupation[occ]) {
                    techCountByOccupation[occ] = {};
                }

                techArray.forEach(tech => {
                    techCountByOccupation[occ][tech] = (techCountByOccupation[occ][tech] || 0) + 1;
                });
            });
        }
    });

    // Créer un dictionnaire de tops pour chaque métier ou os
    let topsByOccupation = {};

    // Pour chaque métier, trier le dictionnaire par ordre décroissant et obtenir le top
    Object.keys(techCountByOccupation).forEach(occ => {
        const techCount = techCountByOccupation[occ];
        const sortedTechCount = Object.entries(techCount).sort((a, b) => b[1] - a[1]);
        
        // Ajouter le métier correspondant à chaque top
        topsByOccupation[occ] = sortedTechCount.slice(0, topCount).map(([tech, count]) => ({ tech, count, metier: occ }));
    });
    affiche_graphe_barre_group(topsByOccupation);

    // Retourner le dictionnaire de tops pour chaque métier
    return topsByOccupation;
}

// Exemple de fonction affiche_graphe_barre_group mise à jour
function affiche_graphe_barre_group(topsByOccupation) {
    // Remplacez "myChart" par l'ID réel de votre conteneur de graphe
    var conteneurGraphe = document.getElementById("myChart");

    if (myChart) {
        myChart.destroy();
    }

    // Supprimez tous les enfants du conteneur pour réinitialiser le graphe
    while (conteneurGraphe.firstChild) {
        conteneurGraphe.removeChild(conteneurGraphe.firstChild);
    }

    // Construire une liste unique de toutes les technologies
    const allTechnologies = Array.from(
        new Set(
            Object.values(topsByOccupation)
                .flatMap(entries => entries.map(entry => entry.tech))
        )
    );

    const occupations = Object.keys(topsByOccupation);
    const datasets = [];

    // Construire les datasets pour chaque technologie
    allTechnologies.forEach((tech, index) => {
        const data = occupations.map(occ => {
            const entry = topsByOccupation[occ].find(e => e.tech === tech);
            return entry ? entry.count : 0;
        });

        const backgroundColor = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.2)`;
        const borderColor = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1)`;

        datasets.push({
            label: tech,
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1
        });
    });

    // Utilisez votre bibliothèque de graphiques pour afficher le graphique à barres groupées
    // Exemple avec Chart.js
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: occupations,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById("continent").addEventListener("change", async () => {
    if ( document.getElementById("typeFilter").value === "os") {
        mettreAJourOS();
    }
    else {
        mettreAJourMetier();
    }

    const top = await getTopTechByFilter(
        document.getElementById("filter").value,
        document.getElementById("continent").value,
        document.getElementById("top").value,
    );
    // console.log(top);
});
document.getElementById("filter").addEventListener("change", async () => {
    const top = await getTopTechByFilter(
        document.getElementById("filter").value,
        document.getElementById("continent").value,
        document.getElementById("top").value,
    );
    // console.log(top);
});
document.getElementById("top").addEventListener("change", async () => {
    if (document.getElementById("continent").value === "all") {
        alert("Veuillez selectionner un continent");
        return;
    }
    const top = await getTopTechByFilter(
        document.getElementById("filter").value,
        document.getElementById("continent").value,
        document.getElementById("top").value,
    );
    // console.log(top);
});

