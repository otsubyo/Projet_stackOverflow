<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revenu moyen en fonction des plateformes de cloud</title>
    <!-- Inclure Chart.js depuis CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="../conversion_revenu.js"></script>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php
        // prendre le groupBy dans l'url
        $groupBy = $_GET['groupBy'];
    ?>
    <header>
        <ul id="menu">
            <li><a href="../index.php">Accueil</a></li>
            <li><a href="../experience/index.php?groupBy=etudes">Revenu par années d'etudes</a></li>
            <li><a href="../experience/index.php?groupBy=exp">Revenu par années d'experience</a></li>
            <li><a href="./index.php?groupBy=PlatformHaveWorkedWith">Revenu par plateformes de cloud</a></li>
            <li><a href="./index.php?groupBy=WebframeHaveWorkedWith">Revenu par technologies</a></li>
            <li><a href="../technologies/index.php?filtre=devType">Top 5 des outils de communication par métier</a></li>
            <li><a href="../technologies/index.php?filtre=os">Top 5 des systèmes d'exploitation par métier</a></li>
            
        </ul>
    </header>
    </header>
    <main>
    <?php
        if ($groupBy === 'PlatformHaveWorkedWith') {
            echo '<h1>Revenu moyen d’un professionnel en fonction des plateformes de cloud</h1>';
        } elseif ($groupBy === 'WebframeHaveWorkedWith') {
            echo '<h1>Revenu moyen d’un professionnel en fonction des frameworks de développement web</h1>';
        }
    ?>
        <div class="filtres">
            <!-- Filtres pour l'utilisateur -->
            <label for="experience">Entrez le nombre d'années d'expérience :</label>
            <input type="number" id="experience" min="1" max="100" >
            <!-- <select id="experience">
                <option value="0">Moins d'1 an</option>
                <option value="1-2">1-2 ans</option>
                <option value="3-5">3-5 ans</option>
                <option value="6-10">6-10 ans</option>
                <option value="10+">Plus de 10 ans</option>
            </select> -->

            <label for="continent">Sélectionnez le continent :</label>
            <select id="continent">
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
    <footer>
          <p> Projet réalisé par Clément Faux et Carl Premi </p>
          <p> IUT Paul Sabatier - Toulouse </p>
          <p> 2023-2024 </p>
     </footer>
</body>
</html>