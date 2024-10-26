import { decks, randomCards } from './decks.js'; 

document.addEventListener('DOMContentLoaded', () => {
    let shuffledDeck = [];
    let currentCardIndex = 0;
    let isFrontVisible = true; 
    let currentPlayer = 1;  
    let player1Jokers = 3;  
    let player2Jokers = 3; 
    let canClickMainCard = true; 

    let player1Name = "Vaduna";
    let player2Name = "Sia";
    
    function randomCardChance() {
        return Math.random() < 0.061; 
    }

    function shuffleDeck(deck) {
        let nonSexCards = deck.filter(card => !card.heading.toLowerCase().includes("sex"));
        let sexCards = deck.filter(card => card.heading.toLowerCase().includes("sex"));
        let finalDeck = [];
        let sexCardIndex = 0;

        for (let i = nonSexCards.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [nonSexCards[i], nonSexCards[randomIndex]] = [nonSexCards[randomIndex], nonSexCards[i]]; 
        }

        for (let i = sexCards.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [sexCards[i], sexCards[randomIndex]] = [sexCards[randomIndex], sexCards[i]]; 
        }

        while (nonSexCards.length > 0) {
            let interval = Math.floor(Math.random() * 4) + 10; 
            finalDeck = finalDeck.concat(nonSexCards.splice(0, interval));

            if (sexCardIndex < sexCards.length) {
                finalDeck.push(sexCards[sexCardIndex]);
                sexCardIndex++;
            }
        }
        return finalDeck;
    }
    
    function combineDecks(decks) {
        let combinedDeck = [];
        for (let category in decks) {
            combinedDeck = combinedDeck.concat(decks[category]);
        }
        return combinedDeck;
    }

    function updateCounter() {
        const counterElement = document.getElementById('counter');
        const cardsLeft = shuffledDeck.length - currentCardIndex;
        counterElement.textContent = `Cards left: ${cardsLeft}`;
    }

    function updatePlayerTurn() {
        const playerTurnElement = document.getElementById('playerTurn');
        playerTurnElement.textContent = `${currentPlayer === 1 ? player1Name : player2Name}`;
    
        const player1BG = document.querySelector('.player_1_BG');
        const player2BG = document.querySelector('.player_2_BG');
        const playerName = document.querySelector(".player_turn_display");
        const player1Jokers = document.querySelector(".player1Jokers");
        const player2Jokers = document.querySelector(".player2Jokers");
        const jokers = document.querySelector(".jokerButton");

        if (currentPlayer === 1) {
            player1BG.classList.remove('player1BGHide');
            player2BG.classList.remove('player2BGShow');
            playerName.classList.remove("player_turn_display_s");
            player1Jokers.classList.add('player1JokersShow');
            player2Jokers.classList.remove('player2JokersShow');
            jokers.classList.remove('jokerButton_p2');
        } 
        else 
        {
            player1BG.classList.add('player1BGHide');
            player2BG.classList.add('player2BGShow');
            playerName.classList.add("player_turn_display_s");
            player1Jokers.classList.remove('player1JokersShow');
            player2Jokers.classList.add('player2JokersShow');
            jokers.classList.add('jokerButton_p2');
        }
    }
    
    function updateJokers() {
        document.getElementById('player1Jokers').textContent = `Joker ${player1Jokers}`;
        document.getElementById('player2Jokers').textContent = ` ${player2Jokers} Joker`;
    }

    function displayRandomCard() {
        const randomCard = randomCards[Math.floor(Math.random() * randomCards.length)];
        const randomCardFront = document.querySelector('.random_card_front');
        const randomCardBack = document.querySelector('.random_card_back');
        const jokerContainer = document.getElementById('jokerContainer');
    
        if (randomCardFront && randomCardBack) {
            randomCardFront.innerHTML = `
                <div class="random_card_heading">${randomCard.heading}</div>
                <div class="random_card_text">${randomCard.text}</div>
            `;
            randomCardBack.innerHTML = ''; 
    
            randomCardFront.classList.add('randomCardFrontShow');
            jokerContainer.style.zIndex = "0";
    
            canClickMainCard = false;
    
            randomCardFront.addEventListener('click', () => {
                randomCardFront.classList.remove('randomCardFrontShow');
                canClickMainCard = true; 
                displayCard(currentCardIndex); 
            }, { once: true }); 
        }
    }
    
    function resetRandomCard() {
        const randomCardFront = document.querySelector('.random_card_front');
        const randomCardBack = document.querySelector('.random_card_back');
        const jokerContainer = document.getElementById('jokerContainer');

        if (randomCardFront && randomCardBack) {
            randomCardFront.classList.remove('randomCardFrontShow', 'randomCardFrontHide');
            randomCardBack.classList.remove('randomCardBackShow');
            jokerContainer.style.zIndex = "300";
        }
    }

    function displayCard(index) {
        resetRandomCard();  
    
        const cardFront = document.querySelector('.card_front .card_heading');
        const cardBack = document.querySelector('.card_back .card_text');
        const card = shuffledDeck[index];
    
        const dealCardElement = document.getElementById('dealCard');
        dealCardElement.className = '';
        dealCardElement.classList.add(`card-${card.heading.toLowerCase()}`, `card-${card.id}`);
    
        if (index >= shuffledDeck.length) {
            cardFront.innerHTML = '<p>No more cards left in the deck!</p>';
            cardBack.innerHTML = '';
            updateCounter();
            return;
        }
    
        cardFront.textContent = card.heading; 
        cardBack.textContent = card.text;
    
        updateCounter();
    }
        
    function handleCardClick() {
        if (!canClickMainCard) return; 

        vibrateSmall();
        
        const cardFront = document.querySelector('.card_front');
        const cardBack = document.querySelector(".card_back");
        const cardBackOverlay = document.querySelector(".cardBackOverlay");
        const jokerButton = document.querySelector(".jokerButton");
    
        if (isFrontVisible) {
            cardFront.classList.add('cardFrontAnimation');
            cardBack.classList.remove("cardBackAnimation");
            jokerButton.classList.add("jokerButtonHide");
            cardBackOverlay.classList.remove("cardBackOverlayShow");
        } else {
            cardFront.classList.remove('cardFrontAnimation');
            cardBack.classList.add("cardBackAnimation");
            jokerButton.classList.remove("jokerButtonHide");
            cardBackOverlay.classList.add("cardBackOverlayShow");
            currentCardIndex++;
    
            if (currentCardIndex < shuffledDeck.length) {
                if (randomCardChance()) {
                    displayRandomCard(); 
                    vibrateRandom();
                } else {
                    displayCard(currentCardIndex); 
                }
            }
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updatePlayerTurn();
        }
    
        isFrontVisible = !isFrontVisible;
    }  
        
    function useJoker() {
        const jokerMessage = document.querySelector(".jokerMessage");
        
        vibrateSmall();

        if (currentPlayer === 1 && player1Jokers > 0) {
            player1Jokers--;
            updateJokers();
            jokerMessage.textContent = `${player1Name} used a joker!`;
            currentPlayer = 2;
        } else if (currentPlayer === 2 && player2Jokers > 0) {
            player2Jokers--;
            updateJokers();
            jokerMessage.textContent = `${player2Name} used a joker!`;
            currentPlayer = 1;
        } else {
            alert('No jokers left or invalid player!');
            return;
        }
    
        jokerMessage.classList.add("jokerMessageShow");
    
        setTimeout(() => {
            jokerMessage.classList.remove("jokerMessageShow");
            updatePlayerTurn();
    
            currentCardIndex++;
            if (currentCardIndex < shuffledDeck.length) {
                isFrontVisible = true; 
                displayCard(currentCardIndex);
    
                const cardFront = document.querySelector('.card_front');
                const cardBack = document.querySelector(".card_back");
                const jokerButton = document.querySelector(".jokerButton");
    
                cardFront.classList.remove('cardFrontAnimation');
                cardBack.classList.remove("cardBackAnimation");
                jokerButton.classList.remove("jokerButtonHide");
            } else {
                alert('No more cards left in the deck!');
            }
    
            canClickMainCard = true;
        }, 2000); 
    }
                

    function vibrateSmall() {
        navigator.vibrate(10);
    }

    function vibrateRandom()
    {
        navigator.vibrate([100, 50, 100, 50, 100]);
    }

    function init() {
        shuffledDeck = shuffleDeck(combineDecks(decks));
        displayCard(currentCardIndex);
        updateCounter();
        updatePlayerTurn();
        updateJokers();
        document.getElementById('dealCard').addEventListener('click', handleCardClick);
        document.getElementById('useJokerButton').addEventListener('click', useJoker);
    }
    init();

});