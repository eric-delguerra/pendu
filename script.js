$('document').ready(() => {

    if ($(window).width() < 640) {
        new fullpage('#fullpage', {
            autoScrolling: false,
            scrollHorizontally: true,
            anchors: ['firstPage', 'secondPage', 'thirdPage'],
            sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BaABE'],
            // gradientTransform: ['#f2f2f2', '#4BBFC3', '#7BAABE'],
            menu: 'menu',
            autofocus: false,
            autocomplete: false
        })
    } else {
        new fullpage('#fullpage', {
            autoScrolling: true,
            scrollHorizontally: true,
            anchors: ['firstPage', 'secondPage', 'thirdPage'],
            sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BaABE'],
            menu: 'menu',
        });
    }


    fullpage_api.setAllowScrolling(true);
    fullpage_api.setScrollingSpeed(1000)
    let lastTry = []
    let wordToFind = []
    let reponse = ""
    let userTry
    let regex = /^[a-zA-Z]+$/
    let essais = 0
    let imgPendu = $('#pendu')
    let langage = "fr"
    $('.game').hide()
    imgPendu.hide()
    $('#replay').hide()
    $('#playTogether').on('click', () => {
        fullpage_api.moveTo('secondPage', 'slide1')
    })
    console.log(langage)

    // Langue
    setTimeout(() => {
        $('#menu').hide()
    }, (30000))
    langueDeBase()
    $('#frFlag').on('click', () => {
        $('#menu').fadeOut(2000)
        langage = "fr"
    })
    $('#enFlag').on('click', () => {
        $('*.fr').hide()
        $('*.en').show()
        $('#menu').fadeOut(2000)
        langage = "en"
        $('#getRandom').html('Choose a word for me !')
        $('#playTogether').html('Put your own word and play with friends')
        $('#solo').html('Play alone')
    })

    //Type de jeux

    $('#solo').on('click', () => {
        fullpage_api.moveTo('secondPage', 'slide2')
    })
    $('#getRandom').on('click', () => {
        let random = Math.floor(Math.random() * wordList.length)
        reponse = wordList[random]
        fullpage_api.moveSectionDown()
        if (testReponse()) {
            $('.game').fadeIn()
            $('#getRandom').fadeOut()
            $('#saisie').fadeOut()
        }
    })

    $('#saisie').on('keypress', (e) => {
        if (e.which === 13) {
            fullpage_api.moveSectionDown()
            reponse = $('#saisie').val().toLowerCase()
            $('#saisie').val('')
            if (testReponse()) {
                $('#getRandom').fadeOut()
                $('.ask').fadeOut()
                $('.game').fadeIn()
            }
        }

    })

    // Essaie des touches

    $('#try').on('keypress', (e) => {
        if (e.which === 13) {
            userTry = $('#try').val().toLowerCase()
            $('#try').val('')

            if (userTry === reponse) {
                $('#attempt').html('<p class="unknow forPhone">GG t\'as win, c\'était bien "' + reponse.toUpperCase() + '"</p>')
                setTimeout(function () {
                    playAgain()
                }, (2000))
            } else if (userTry.length > 1) {
                $('.alert').html('<div><p class="carefull forPhone">Attention rentre qu\'un seul caractère</p></div>').fadeIn(1000)
                $('.alert').delay(2000).fadeOut(1000)
                essais++
                imgPendu.attr('src', 'PENDU/' + essais + '.png').fadeIn()
                fullpage_api.moveSectionDown()
                if (essais === 10) {
                    $('p').html('<p class="unknow forPhone">PENDU ! La réponse était "' + reponse.toUpperCase() + '"</p>')
                    essais++
                    setTimeout(function () {
                        playAgain()
                    }, (2000))
                }
            }
            if (userTry.length === 1) {
                lastTry.push(userTry)
                $('#lastTry').html('Already use : ' + lastTry.join(',').toUpperCase())
                testLetter()
            }

        }


    })

    // Fonction

    function langueDeBase() {
        $('*.en').hide()
        $('#getRandom').html('Choisie un mot pour moi !')
        langage = "fr"
    }

    function testLetter() {

        $('#lastTry').show()
        let letters = []
        let x = reponse.indexOf(userTry)
        if (essais < 10) {
            if (x === -1) {
                essais++
                imgPendu.attr('src', 'PENDU/' + essais + '.png').fadeIn()
            } else {
                while (x !== -1) {
                    letters.push(x)
                    x = reponse.indexOf(userTry, x + 1)
                }
            }
            for (let i = 0; i < letters.length; i++) {
                wordToFind.splice(letters[i], 1, userTry)
            }
            $('#attempt').html('<p class="unknow forPhone" id="word">' + wordToFind.join("").toUpperCase() + '</p>')
            if ($('#word').text() === reponse.toUpperCase()) {
                $('#attempt').html('<p class="unknow forPhone">Bien joué ! La réponse était bien "' + reponse.toUpperCase() + '"</p>')
                setTimeout(function () {
                    playAgain()
                }, (2000))
            }

        } else {
            essais++
            imgPendu.attr('src', 'PENDU/' + essais + '.png').fadeIn()
            $('#attempt').html('<p class="unknow forPhone">PENDU ! La réponse était "' + reponse.toUpperCase() + '"</p>')
            setTimeout(function () {
                playAgain()
            }, (2000))
        }
    }

    function testReponse() {


        if (regex.test(reponse)) {
            for (let i = 0; i < reponse.length; i++) {
                wordToFind.push(" _ ")
                $('p#attempt').html('<p class="unknow">' + wordToFind.join("").toUpperCase() + '</p>')
            }
            return true
        } else {
            $('p#attempt').html('<p class="unknow">Merci de ne pas utiliser de caractères speciaux ou chiffres</p>')
            $('#attempt').delay(3000).fadeOut()
            setTimeout(function () {
                fullpage_api.moveSectionUp()
                $('#attempt').delay(3000).fadeIn()
            }, 3000)
            return false
        }
    }

    function playAgain() {
        console.log(langage)
        $('.find').fadeOut()
        $('#lastTry').hide()
        lastTry = []
        wordToFind = []
        reponse = ""
        essais = 0
        imgPendu.attr('src', 'PENDU/' + essais + '.png').fadeOut()
        $('.ask').fadeIn()
        $('.game').fadeOut()
        $('#replay').fadeIn()
        $('#getRandom').fadeIn()
        $('#replay').on('click', () => {
            fullpage_api.moveTo('firstPage')
            $('#replay').fadeOut(2000)
            $('.unknow').fadeOut(2000)
            if (langage === "fr") {
                $('#findFr').fadeIn(2000)
            } else {
                $('#findEn').fadeIn(2000)
            }

        })
    }


    // Liste de mots
    let wordList = [
        "belouga",
        "chaud",
        "mot",
        "mais",
        "que",
        "certains",
        "dans",
        "nous",
        "dehors",
        "autre",
        "faire",
        "leur",
        "temps",
        "comment",
        "chaque",
        "dire",
        "ensemble",
        "trois",
        "vouloir",
        "air",
        "bien",
        "aussi",
        "jouer",
        "petit",
        "fin",
        "mettre",
        "maison",
        "lire",
        "main",
        "port",
        "grand",
        "ajouter",
        "terre",
        "ici",
        "il faut",
        "grand",
        "haut",
        "tel",
        "suivre",
        "acte",
        "pourquoi",
        "interroger",
        "hommes",
        "changement",
        "genre",
        "besoin",
        "maison",
        "image",
        "essayer",
        "nous",
        "encore",
        "animal",
        "point",
        "monde",
        "construire",
        "soi",
        "terre",
        "tout",
        "nouveau",
        "travail",
        "partie",
        "prendre",
        "obtenir",
        "lieu",
        "vivre",
        "peu",
        "seulement",
        "tour",
        "homme",
        "est venu",
        "montrer",
        "tous",
        "bon",
        "moi",
        "donner",
        "notre",
        "sous",
        "nom",
        "par",
        "juste",
        "forme",
        "phrase",
        "grand",
        "penser",
        "dire",
        "aider",
        "faible",
        "ligne",
        "tour",
        "la cause",
        "beaucoup",
        "signifier",
        "avant",
        "droit",
        "vieux",
        "trop",
        "elle",
        "tous",
        "quand",
        "utiliser",
        "votre",
        "sur",
        "beaucoup",
        "puis",
        "les",
        "voudrais",
        "comme",
        "ces",
        "son",
        "long",
        "faire",
        "chose",
        "voir",
        "lui",
        "deux",
        "regarder",
        "plus",
        "jour",
        "pourrait",
        "aller",
        "venir",
        "fait",
        "nombre",
        "son",
        "aucun",
        "plus",
        "personnes",
        "ma",
        "sur",
        "savoir",
        "eau",
        "que",
        "appel",
        "maintenant",
        "trouver",
        "supporter",
        "propre",
        "page",
        "devrait",
        "pays",
        "encore",
        "apprendre",
        "usine",
        "couvercle",
        "nourriture",
        "soleil",
        "quatre",
        "entre",
        "garder",
        "jamais",
        "dernier",
        "laisser",
        "ville",
        "arbre",
        "traverser",
        "ferme",
        "dur",
        "puissance",
        "histoire",
        "scie",
        "loin",
        "mer",
        "tirer",
        "gauche",
        "tard",
        "courir",
        "presse",
        "proche",
        "nuit",
        "vie",
        "peu",
        "nord",
        "livre",
        "porter",
        "science",
        "manger",
        "chambre",
        "ami",
        "poisson",
        "montagne",
        "une fois",
        "base",
        "entendre",
        "cheval",
        "coupe",
        "regarder",
        "couleur",
        "face",
        "bois",
        "principal",
        "ouvert",
        "ensemble",
        "suivant",
        "blanc",
        "enfants",
        "commencer",
        "marcher",
        "exemple",
        "papier",
        "groupe",
        "toujours",
        "musique",
        "ceux",
        "tous les deux",
        "marque",
        "souvent",
        "lettre",
        "mile",
        "voiture",
        "pieds",
        "soins",
        "assez",
        "plaine",
        "fille",
        "habituel",
        "jeune",
        "au-dessus",
        "jamais",
        "rouge",
        "liste",
        "sentir",
        "parler",
        "oiseau",
        "corps",
        "chien",
        "famille",
        "direct",
        "pose",
        "laisser",
        "chanson",
        "mesurer",
        "porte",
        "produit",
        "noir",
        "court",
        "chiffre",
        "classe",
        "vent",
        "question",
        "arriver",
        "navire",
        "zone",
        "rock",
        "ordre",
        "feu",
        "sud",
        "savait",
        "passer",
        "depuis",
        "haut",
        "ensemble",
        "roi",
        "rue",
        "pouce",
        "multiplier",
        "rien",
        "cours",
        "rester",
        "roue",
        "plein",
        "force",
        "bleu",
        "objet",
        "surface",
        "profond",
        "lune",
        "pied",
        "test",
        "record",
        "bateau",
        "commun",
        "or",
        "possible",
        "plan",
        "place",
        "sec",
        "demander",
        "rire",
        "mille",
        "jeu",
        "forme",
        "assimiler",
        "chaud",
        "manquer",
        "chaleur",
        "neige",
        "pneu",
        "apporter",
        "oui",
        "lointain",
        "remplir",
        "est",
        "peindre",
        "langue",
        "entre",
        "puissance",
        "ville",
        "fin",
        "certain",
        "voler",
        "tomber",
        "conduire",
        "cri",
        "sombre",
        "machine",
        "Note",
        "patienter",
        "plan",
        "figure",
        "nom",
        "domaine",
        "reste",
        "correct",
        "capable",
        "livre",
        "contenir",
        "avant",
        "enseigner",
        "semaine",
        "finale",
        "vert",
        "oh",
        "rapide",
        "chaud",
        "gratuit",
        "minute",
        "fort",
        "esprit",
        "clair",
        "queue",
        "produire",
        "fait",
        "espace",
        "entendu",
        "meilleur",
        "heure",
        "mieux",
        "VRAI",
        "pendant",
        "cent",
        "cinq",
        "rappeler",
        "tenir",
        "ouest",
        "sol",
        "atteindre",
        "rapide",
        "verbe",
        "chanter",
        "six",
        "table",
        "Voyage",
        "moins",
        "matin",
        "dix",
        "simple",
        "plusieurs",
        "voyelle",
        "vers",
        "guerre",
        "poser",
        "contre",
        "lent",
        "centre",
        "amour",
        "personne",
        "argent",
        "servir",
        "route",
        "carte",
        "pluie",
        "gouverner",
        "tirer",
        "froid",
        "avis",
        "voix",
        "chasse",
        "probable",
        "lit",
        "tour",
        "cellule",
        "croire",
        "choisir",
        "soudain",
        "compter",
        "raison",
        "longueur",
        "art",
        "sujet",
        "taille",
        "varier",
        "parler",
        "poids",
        "glace",
        "question",
        "cercle",
        "paire",
        "inclure",
        "fracture",
        "syllabe",
        "feutre",
        "grandiose",
        "balle",
        "encore",
        "vague",
        "tomber",
        "lourd",
        "danse",
        "moteur",
        "position",
        "bras",
        "large",
        "voile",
        "fraction",
        "course",
        "magasin",
        "train",
        "sommeil",
        "prouver",
        "seul",
        "jambe",
        "exercice",
        "mur",
        "capture",
        "monture",
        "souhaiter",
        "ciel",
        "conseil",
        "joie",
        "hiver",
        "sauvage",
        "instrument",
        "verre",
        "herbe",
        "vache",
        "emploi",
        "bord",
        "signe",
        "visite",
        "doux",
        "amusement",
        "clair",
        "gaz",
        "temps",
        "mois",
        "million",
        "porter",
        "finition",
        "heureux",
        "espoir",
        "fleur",
        "disparu",
        "commerce",
        "voyage",
        "bureau",
        "recevoir",
        "bouche",
        "exact",
        "symbole",
        "mourir",
        "moins",
        "cri",
        "sauf",
        "semence",
        "ton",
        "joindre",
        "propre",
        "pause",
        "dame",
        "cour",
        "augmenter",
        "mauvais",
        "coup",
        "huile",
        "sang",
        "toucher",
        "cent",
        "fil",
        "perdu",
        "brun",
        "porter",
        "jardin",
        "choisir",
        "juste",
        "banque",
        "recueillir",
        "sauver",
        "oreille",
        "autre",
        "cas",
        "milieu",
        "tuer",
        "fils",
        "lac",
        "moment",
        "fort",
        "printemps",
        "observer",
        "enfant",
        "droit",
        "consonne",
        "nation",
        "dictionnaire",
        "lait",
        "vitesse",
        "organe",
        "payer",
        "section",
        "robe",
        "nuage",
        "surprise",
        "calme",
        "pierre",
        "minuscule",
        "frais",
        "conception",
        "pauvres",
        "lot",
        "bas",
        "fer",
        "unique",
        "plat",
        "vingt",
        "peau",
        "sourire",
        "pli",
        "trou",
        "sauter",
        "huit",
        "village",
        "se rencontrent",
        "racine",
        "acheter",
        "augmenter",
        "pousser",
        "sept",
        "paragraphe",
        "doit",
        "en attente",
        "cheveux",
        "cuisinier",
        "chaque",
        "colline",
        "coffre-fort",
        "chat",
        "envisager",
        "type",
        "droit",
        "peu",
        "copie",
        "phrase",
        "silencieux",
        "haut",
        "sable",
        "sol",
        "rouleau",
        "doigt",
        "industrie",
        "valeur",
        "lutte",
        "mensonge",
        "battre",
        "exciter",
        "naturel",
        "vue",
        "sens",
        "capital",
        "chaise",
        "danger",
        "fruit",
        "riche",
        "soldat",
        "processus",
        "fonctionner",
        "pratique",
        "difficile",
        "midi",
        "moderne",
        "frapper",
        "coin",
        "partie",
        "alimentation",
        "dont",
        "localiser",
        "anneau",
        "insecte",
        "pris",
        "indiquer",
        "radio",
        "rayon",
        "atome",
        "humain",
        "histoire",
        "effet",
        "attendre",
        "os",
        "rail",
        "imaginer",
        "fournir",
        "ainsi",
        "doux",
        "femme",
        "capitaine",
        "deviner",
        "net",
        "aile",
        "voisin",
        "lavage",
        "chauve-souris",
        "foule",
        "comparer",
        "cloche",
        "viande",
        "tube",
        "dollar",
        "courant",
        "peur",
        "vue",
        "mince",
        "triangle",
        "chef",
        "colonie",
        "horloge",
        "mine",
        "lien",
        "entrer",
        "majeur",
        "frais",
        "recherche",
        "envoyer",
        "jaune",
        "pistolet",
        "permettre",
        "impression",
        "mort",
        "place",
        "costume",
        "courant",
        "ascenseur",
        "rose",
        "arriver",
        "piste",
        "rivage",
        "division",
        "feuille",
        "substance",
        "favoriser",
        "relier",
        "poste",
        "passer",
        "corde",
        "graisse",
        "heureux",
        "original",
        "part",
        "station",
        "papa",
        "pain",
        "charger",
        "propre",
        "bar",
        "proposition",
        "segment",
        "esclave",
        "canard",
        "instant",
        "peupler",
        "poussin",
        "cher",
        "ennemi",
        "boisson",
        "se produire",
        "support",
        "discours",
        "nature",
        "gamme",
        "vapeur",
        "mouvement",
        "chemin",
        "liquide",
        "enregistrer",
        "signifiait",
        "quotient",
        "dents",
        "coquille",
        "cou",
        "sucre",
        "assez",
        "femmes",
        "saison",
        "solution",
        "aimant",
        "argent",
        "merci",
        "branche",
        "rencontre",
        "suffixe",
        "figue",
        "peur",
        "acier",
        "discuter",
        "avant",
        "similaire",
        "guider",
        "score",
        "pomme",
        "manteau",
        "masse",
        "carte",
        "bande",
        "corde",
        "glissement",
        "gagner",
        "condition",
        "alimentation",
        "outil",
        "total",
        "de base",
        "odeur",
        "double",
        "continuer",
        "bloc",
        "graphique",
        "chapeau",
        "vendre",
        "entreprise",
        "soustraire",
        "particulier",
        "accord",
        "baignade",
        "terme",
        "femme",
        "chaussure",
        "propagation",
        "organiser",
        "camp",
        "inventer",
        "coton",
        "litre",
        "neuf",
        "camion",
        "bruit",
        "niveau",
        "chance",
        "recueillir",
        "boutique",
        "jeter",
        "colonne",
        "mal",
        "gris",
        "exiger",
        "large",
        "sel",
        "nez",
        "pluriel",
        "revendication",
    ]
})
