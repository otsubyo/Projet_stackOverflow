<!--
1 2 5 Carl
3 4 6 Clément
-->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>revenu moyen d’un professionnel en fonction de son nombre d’années d’expérience</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="./moneyconverted.js"></script>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php
        // prendre le groupBy dans l'url
        $groupBy = $_GET['groupBy'];
    ?>
    <?php
    // prendre le groupBy dans l'url s'il est défini, sinon, utilisez une valeur par défaut
    $groupBy = isset($_GET['groupBy']) ? $_GET['groupBy'] : 'PlatformHaveWorkedWith';
    ?>

    <header>
        <ul id="menu">
            <li><a href="../index.php">Accueil</a></li>
            <li><a href="./index.php?groupBy=PlatformHaveWorkedWith">Expérience profesionnelle</a></li>
        </ul>
    </header>
    </header>
    <main>
        <div class="filtres">
            <!-- Filtres pour l'utilisateur -->
            <label for="experience">Entrez le nombre d'années d'expérience :</label>
            <input type="number" id="experience" min="0" max="100">
            <!-- <select id="experience">
                <option value="0">Moins d'1 an</option>
                <option value="1-2">1-2 ans</option>
                <option value="3-5">3-5 ans</option>
                <option value="6-10">6-10 ans</option>
                <option value="10+">Plus de 10 ans</option>
            </select> -->

            <label for="continent">Sélectionnez le continent :</label>
            <select id="continent">
                <option value="all">Veuillez choisir un continent</option>
                <option value="Europe">Europe</option>
                <option value="Etats-unis">North America</option>
                <!-- Ajoutez plus de continents au besoin -->
            </select>

            <label for="pays">Sélectionnez le pays :</label>
            <select id="pays">
                <option value="all">Tous pays confondus</option>
            </select>
            <input type="hidden" id="groupBy" value="<?php echo $groupBy; ?>">
        </div>

        <!-- Graphique -->
        <div id="graphique">
            <canvas id="myChart"></canvas>
        </div>

        <!-- Votre script pour créer le graphique -->
        <script src="script.js"></script>
    </main>
</body>
</html>