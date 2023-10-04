
const JeuDeMemoire = (function () {
    'use strict'

    function initialiseLeJeu (param) {
        console.log('initialiseLeJeu')
        const cardsElements = param.getElementsByClassName('cards')
        creationDuDOMCards(cardsElements)
        const buttonNouvellePartie = param.querySelector('.option>input:first-child')

        const cardElements = param.querySelectorAll('div[class*="card-"]')

        const imgElements = param.querySelectorAll('.cards img')
        const paireTrouveIdElement = param.querySelector('.timer>div:nth-of-type(2)>span:last-of-type')

        buttonNouvellePartie.addEventListener('click', nouvellePartie)
        for (let index = 0; index < imgElements.length; index++) {
            const img = imgElements[index]
            img.addEventListener('click', afficherUneCarteChoisie)
        }

        affichageCarteAvantGame(imgElements)

        function nouvellePartie () {
            console.log('nouvellePartie')
            demarrer()
            if (buttonNouvellePartie.value === 'Arreter la partie') {
                cardsElements[0].style.display = 'none'
                buttonNouvellePartie.setAttribute('value', 'Nouvelle Partie')
                affichageCarteAvantGame(imgElements)
                arreter()
                reset()
            } else {
                buttonNouvellePartie.setAttribute('value', 'Arreter la partie')
                paireTrouveIdElement.textContent = 0
                cardsElements[0].style.display = 'grid'
                afficherCoverDesCartes(imgElements)
                initialisationDesCartesAleatoirement(cardElements)
            }
        }
    }

    function affichageCarteAvantGame (imgElements) {
        setTimeout(() => {
            removeCoverDesCartes(imgElements)
        }, 3000)
        setTimeout(() => {
            afficherCoverDesCartes(imgElements)
        }, 5000)
    }

    function creationDuDOMCards (cardsElements) {
        for (let index = 0; index < 16; index++) {
            const divCardElement = document.createElement('div')
            divCardElement.setAttribute('class', 'card-' + index)
            cardsElements[0].appendChild(divCardElement)
            const imgCardElement = document.createElement('img')
            imgCardElement.setAttribute('src', '../image/image-0.jpg')
            imgCardElement.setAttribute('alt', 'faune')
            divCardElement.appendChild(imgCardElement)
        }
    }

    function initialiseAffichagePaireTrouve (paireTrouveIdElement) {
        console.log('initialiseAffichagePaireTrouve')
        paireTrouveIdElement.textContent++
    }

    function initialisationDesCartesAleatoirement (cardElements) {
        console.log('initialisationDesCartesAleatoirement')
        const cardsTable = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]
        function getRandomInt (max) {
            return Math.floor(Math.random() * max)
        }
        for (let index = 0; index < cardElements.length; index++) {
            const element = cardElements[index]
            const random = getRandomInt(cardsTable.length)
            element.style.background = 'url(../image/image-' + cardsTable[random] + '.jpg)'
            element.style.backgroundSize = 'cover'
            element.style.backgroundRepeat = 'no-repeat'
            cardsTable.splice(random, 1)
        }
    }

    function removeCoverDesCartes (imgElements) {
        console.log('afficherCoverDesCartes')
        imgElements.forEach(element => {
            element.style.display = 'none'
        })
    }
    function afficherCoverDesCartes (imgElements) {
        console.log('afficherCoverDesCartes')
        imgElements.forEach(element => {
            element.style.display = 'grid'
        })
    }

    let premierChoixDeCarte = ''
    let choixDeCarte = []
    function afficherUneCarteChoisie (event) {
        console.log('afficherUneCarteChoisie')
        if (choixDeCarte.length < 2) {
            event.target.parentNode.style.animation = ' turnDiv 2s'
            if (choixDeCarte.length < 1) {
                premierChoixDeCarte = event.target.parentNode
                choixDeCarte.push(premierChoixDeCarte.querySelector('img'))
                removeCoverDesCartes(choixDeCarte)
            } else if ((event.target.parentNode.style.background === premierChoixDeCarte.style.background) && (event.target.parentNode.getAttribute('class') !== premierChoixDeCarte.getAttribute('class'))) {
                choixDeCarte.push(event.target)
                removeCoverDesCartes(choixDeCarte)
                premierChoixDeCarte = ''
                choixDeCarte = []
                const paireTrouveIdElement = document.getElementById('paireTrouve')
                initialiseAffichagePaireTrouve(paireTrouveIdElement)
                afficherMessage()
            } else if (event.target.parentNode.style.background !== premierChoixDeCarte.style.background) {
                choixDeCarte.push(event.target)

                removeCoverDesCartes(choixDeCarte)
                setTimeout(function () {
                    choixDeCarte.push(event.target)
                    afficherCoverDesCartes(choixDeCarte)
                }, 1000)
                premierChoixDeCarte = ''
                setTimeout(function () {
                    choixDeCarte = []
                }, 1000)
            }
        }
    }

    let heures = 0
    let minutes = 0
    let secondes = 0
    let timeout
    let estArrete = true

    const chrono = document.getElementById('chrono')
    function defilerTemps () {
        if (estArrete) return

        secondes = parseInt(secondes)
        minutes = parseInt(minutes)
        heures = parseInt(heures)

        secondes++

        if (secondes === 60) {
            minutes++
            secondes = 0
        }

        if (minutes === 60) {
            heures++
            minutes = 0
        }

        if (secondes < 10) {
            secondes = '0' + secondes
        }

        if (minutes < 10) {
            minutes = '0' + minutes
        }

        if (heures < 10) {
            heures = '0' + heures
        }

        chrono.textContent = `${heures}:${minutes}:${secondes}`

        timeout = setTimeout(defilerTemps, 1000)
    }

    function demarrer () {
        if (estArrete) {
            estArrete = false
            defilerTemps()
        }
    }

    function arreter () {
        if (!estArrete) {
            estArrete = true
            clearTimeout(timeout)
        }
    }

    function reset () {
        chrono.textContent = '00:00:00'
        estArrete = true
        heures = 0
        minutes = 0
        secondes = 0
        clearTimeout(timeout)
    }

    function afficherMessage () {
        const modal = document.getElementById('popup1')
        const paireTrouveIdElement = document.querySelector('.timer>div:nth-of-type(2)>span:last-of-type')
        if (paireTrouveIdElement.textContent === '8') {
            clearInterval(timeout)
            const finalTime = chrono.innerHTML
            modal.classList.add('show')
            document.getElementById('totalTime').innerHTML = finalTime
            const starRatingElement = document.getElementById('starRating')
            const scoreCalculer = calculeMathPourLeScore(heures, minutes, secondes)
            const meilleureScoreElement = document.getElementById('best')
            if (meilleureScoreElement.innerHTML < scoreCalculer) {
                meilleureScoreElement.innerHTML = scoreCalculer
            }
            starRatingElement.innerHTML = scoreCalculer
            modal.style.display = 'inline-block'
            const buttonNouvellePartieMessage = document.querySelector('.popup input')
            buttonNouvellePartieMessage.addEventListener('click', function () {
                modal.style.display = 'none'
                const buttonNouvellePartie = document.querySelector('.option>input:first-child')
                buttonNouvellePartie.setAttribute('value', 'Nouvelle Partie')
                const cardsElements = document.getElementsByClassName('cards')
                cardsElements[0].style.display = 'none'
            })
        };
    }

    function calculeMathPourLeScore (param1, param2, param3) {
        param2++
        param1++
        console.log('param', param1, param2, param3)
        return Math.round((8 / param3) * 10000 / param2)
    }

    return {
        init: function (param) {
            initialiseLeJeu(param)
        }
    }
})()
