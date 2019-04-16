$('document').ready(() => {
    new fullpage('#fullpage', {
        //options here
        autoScrolling: true,
        scrollHorizontally: true,
        anchors: ['firstPage', 'secondPage', 'thirdPage', 'pendu'],
        sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'white'],
        menu: 'myMenu',
        navigation: true,

    });

//methods
    fullpage_api.setAllowScrolling(true);
    fullpage_api.setScrollingSpeed(1000)

    let wordToFind = []
    let reponse = ""
    let userTry
    let regex = /^[a-zA-Z]+$/
    let essais = 0
    let imgPendu = $('#pendu')
    $('.game').hide()
    imgPendu.hide()

    $('div.button').on('click', () => {
        fullpage_api.moveSectionDown()
    })

    $('#saisie').on('keypress', (e) => {
        if (e.which === 13) {
            fullpage_api.moveSectionDown()
            reponse = $('#saisie').val().toLowerCase()
            if (testReponse()) {
                $('.ask').fadeOut()
                $('.game').fadeIn()
                console.log(reponse)
            }
        }

    })

    $('#try').on('keypress', (e) => {
        if (e.which === 13) {
            userTry = $('#try').val()
            console.log(userTry)
            if (userTry === reponse) {
                console.log('VICTOIRE')
                $('#attempt').html('<p class="unknow">GG t\'as win, c\'était bien ' + reponse.toUpperCase() + '</p>')
            } else if (userTry.length > 1) {
                $('.alert').html('<p>Attention rentre qu\'un seul caractère</p>').fadeIn(1000)
                $('.alert').delay(2000).fadeOut(1000)
                essais++
                imgPendu.attr('src', 'PENDU/' + essais + '.png').fadeIn()
                fullpage_api.moveSectionDown()
                if (essais === 11) {
                    $('p').html('<p class="unknow">PENDU ! La réponse était ' + reponse.toUpperCase() + '</p>')
                }
            }
            if (userTry.length === 1) {
                testLetter()
            }

        }


    })

    function testLetter() {
        let letters = []
        let x = reponse.indexOf(userTry)
        console.log(userTry)
        if (essais < 11) {
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
            $('#attempt').html('<p class="unknow" id="word">' + wordToFind.join("").toUpperCase() + '</p>')
            if ($('#word').text() === reponse.toUpperCase()) {
                console.log('victoire')
                $('#attempt').html('<p class="unknow">Bien jouer ! La réponse était bien  ' + reponse.toUpperCase() + '</p>')
            }

        } else {
            $('#attempt').html('<p class="unknow">PENDU ! La réponse était ' + reponse.toUpperCase() + '</p>')
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
            return false
        }
    }
})