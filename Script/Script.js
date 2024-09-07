import { decks, randomCards } from './decks.js';  // Import random cards as well

document.addEventListener('DOMContentLoaded', () => {
    let shuffledDeck = [];
    let currentCardIndex = 0;
    let isFrontVisible = true; 
    let currentPlayer = 1;  // Track the current player (1 or 2)
    let player1Jokers = 3;  // Jokers for player 1
    let player2Jokers = 3;  // Jokers for player 2
    let canClickMainCard = true; // Flag to control main card clicks

    let player1Name = "Vaduna";
    let player2Name = "my bebe";

    function combineDecks(decks) {
        let combinedDeck = [];
        for (let category in decks) {
            combinedDeck = combinedDeck.concat(decks[category]);
        }
        return combinedDeck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]]; 
        }
        return deck;
    }

    function updateCounter() {
        const counterElement = document.getElementById('counter');
        const cardsLeft = shuffledDeck.length - currentCardIndex;
        counterElement.textContent = `Cards left: ${cardsLeft}`;
    }

    function updatePlayerTurn() {
        const playerTurnElement = document.getElementById('playerTurn');
        playerTurnElement.textContent = `${currentPlayer === 1 ? player1Name : player2Name}`;
    
        // Update the layout of #mainContainer based on the current player
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

        } else {
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

    function randomCardChance() {
        return Math.random() < 0.95; 
    }

    function displayRandomCard() {
        const randomCard = randomCards[Math.floor(Math.random() * randomCards.length)];
        const randomCardFront = document.querySelector('.random_card_front');
        const randomCardBack = document.querySelector('.random_card_back');
    
        if (randomCardFront && randomCardBack) {
            randomCardFront.innerHTML = `
                <div class="random_card_heading">${randomCard.heading}</div>
                <div class="random_card_text">${randomCard.text}</div>
            `;
            randomCardBack.innerHTML = ''; // Clear the back content
    
            // Apply styles to show the random card
            randomCardFront.classList.add('randomCardFrontShow');
            console.log("Random card displayed.");
    
            // Disable the main card click temporarily
            canClickMainCard = false;
    
            // Add event listener to dismiss the random card
            randomCardFront.addEventListener('click', () => {
                randomCardFront.classList.remove('randomCardFrontShow');
                canClickMainCard = true; // Re-enable main card clicks
                displayCard(currentCardIndex); // Show the next regular card
            }, { once: true }); // Ensure the listener is triggered only once
        }
    }
    
    function resetRandomCard() {
        const randomCardFront = document.querySelector('.random_card_front');
        const randomCardBack = document.querySelector('.random_card_back');

        if (randomCardFront && randomCardBack) {
            randomCardFront.classList.remove('randomCardFrontShow', 'randomCardFrontHide');
            randomCardBack.classList.remove('randomCardBackShow');
            console.log("Random card reset.");
        }
    }

    function displayCard(index) {
        resetRandomCard();  // Reset random card styles before showing the next card
    
        const cardFront = document.querySelector('.card_front .card_heading');
        const cardBack = document.querySelector('.card_back .card_text');
        const card = shuffledDeck[index];
    
        // Set the card's class based on the category and id
        const dealCardElement = document.getElementById('dealCard');
        dealCardElement.className = ''; // Reset classes
        dealCardElement.classList.add(`card-${card.heading.toLowerCase()}`, `card-${card.id}`); // Add category and id-specific classes
    
        if (index >= shuffledDeck.length) {
            cardFront.innerHTML = '<p>No more cards left in the deck!</p>';
            cardBack.innerHTML = '';
            updateCounter();
            return;
        }
    
        cardFront.textContent = card.heading; // Display card heading on the front
        cardBack.textContent = card.text;     // Display card text on the back
    
        updateCounter();
    }
        
    function handleCardClick() {
        if (!canClickMainCard) return; // Prevent card clicks if random card is active
    
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
                } else {
                    displayCard(currentCardIndex); // Show the next regular card immediately
                }
            }
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updatePlayerTurn();
        }
    
        isFrontVisible = !isFrontVisible;
    }  
        
    function useJoker() {
        const jokerMessage = document.querySelector(".jokerMessage");
    
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
    
            // Move to the next card and reset the card to display the front side
            currentCardIndex++;
            if (currentCardIndex < shuffledDeck.length) {
                isFrontVisible = true;  // Ensure that the front side is shown after a joker is used
                displayCard(currentCardIndex);
    
                // Reset card animations
                const cardFront = document.querySelector('.card_front');
                const cardBack = document.querySelector(".card_back");
                const jokerButton = document.querySelector(".jokerButton");
    
                // Reset animation classes to ensure the front side is visible
                cardFront.classList.remove('cardFrontAnimation');
                cardBack.classList.remove("cardBackAnimation");
                jokerButton.classList.remove("jokerButtonHide");
            } else {
                alert('No more cards left in the deck!');
            }
    
            // Re-enable card clicks after using a joker
            canClickMainCard = true;
        }, 2000); // Display joker message for 2 seconds
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