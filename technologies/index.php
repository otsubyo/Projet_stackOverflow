<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revenu moyen en fonction des plateformes de cloud</title>
    <!-- Inclure Chart.js depuis CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php
        // prendre le filtre
        $filter = $_GET['filtre'];
    ?>
    <header>
        <ul id="menu">
            <li><a href="../index.php">Accueil</a></li>
            <li><a href="../experience/index.php?groupBy=etudes">Revenu par annees d'etudes</a></li>
            <li><a href="../experience/index.php?groupBy=exp">Revenu par annees d'experience</a></li>
            <li><a href="../competences_tech/index.php?groupBy=PlatformHaveWorkedWith">Revenu par plateformes de cloud</a></li>
            <li><a href="../competences_tech/index.php?groupBy=WebframeHaveWorkedWith">Revenu par technologies</a></li>
            <li><a href="./index.php?filtre=devType">Top 5 des outils de com. par métiers</a></li>
            <li><a href="./index.php?filtre=os">Top 5 des outils de com. par OS</a></li>
            
        </ul>
    </header>
    </header>
    <main>
        <div class="filtres">
            <!-- Filtres pour l'utilisateur -->
            <label for="top">étendue du top</label>
            <input type="number" id="top" min="1" max="8" value="5">

            <label for="continent">Sélectionnez le continent :</label>
            <select id="continent">
                <option value="all">Veuillez choisir un continent</option>
                <option value="Europe">Europe</option>
                <option value="Etats-unis">North America</option>
                <!-- Ajoutez plus de continents au besoin -->
            </select>

            <label for="filter">Sélectionnez 
                <?php if( $filter == "devType" ) echo "le métier"; else echo "l'OS"; ?></label>
            <select id="filter">
                <option value="all">Tous</option>
            </select>
            <input type="hidden" id="typeFilter" value="<?php echo $filter; ?>">
        </div>

        <!-- Graphique -->
        <div id="graphique">
            <canvas id="myChart"></canvas>
        </div>

        <!-- Votre script pour créer le graphique -->
        <script src="script.js"></script>
    </main>
    <footer>
          <p> Projet réalisé par Clément Faux et Carl Premi </p>
          <p> IUT Paul Sabatier - Toulouse </p>
          <p> 2023-2024 </p>
     </footer>
</body>
</html>