import { Card } from "./models/card.class.js";
import { CardColor, CardFill, CardShape } from "./models/utils.js";

export class Game {
  public cardsDeck: Card[] = [];
  public tableCards: Card[] = [];
  public totalSetsFound = 0;

  private _selection: Card[] = [];
  private _gameGridEl = document.getElementById("game-grid");

  constructor() {
    this.newGame();
  }

  private newGame() {
    this.totalSetsFound = 0;
    this._selection = [];

    this.createCards();
    this.dealCards();
    this.addCardsToDOM();
    this.setButtonListeners();
  }

  private createCards() {
    const newDeck: Card[] = [];

    for (let number = 1; number <= 3; number++) {
      for (let color = 1; color <= 3; color++) {
        for (let shape = 1; shape <= 3; shape++) {
          for (let fill = 1; fill <= 3; fill++) {
            const newCard = new Card(number, color, shape, fill);
            newDeck.push(newCard);
          }
        }
      }
    }

    const shuffled = newDeck
      .map((card) => ({ card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((sort) => sort.card);

    this.cardsDeck = shuffled;
  }

  private dealCards() {
    const totalCards = 12;

    for (let i = 1; i <= totalCards; i++) {
      const card: Card = this.cardsDeck.pop()!;
      this.tableCards.push(card);
    }
  }

  private addCardsToDOM() {
    let boardHTML = "";

    this.tableCards.forEach((card) => {
      boardHTML += card.getHtmlTemplate();
    });

    this._gameGridEl!.innerHTML = boardHTML;

    document.getElementById(
      "cards-left"
    )!.innerHTML = `${this.cardsDeck.length}`;

    this.setCardEventListener();
  }

  private setCardEventListener() {
    this.tableCards.forEach((card) => {
      const cardEl = document.getElementById(card.id);
      cardEl?.addEventListener("click", () => this.toggleCardSelection(card));
    });
  }

  private setButtonListeners() {
    const hintBtn = document.getElementById("get-hint")!;
    hintBtn.addEventListener("click", () => this.getHint());
  }

  private toggleCardSelection(card: Card) {
    if (
      this._selection.length === 3 &&
      !this._selection.find((f) => f.id === card.id)
    )
      return;

    card.isSelected = !card.isSelected;

    const cardEl = document.getElementById(card.id)!;
    cardEl.classList.toggle("selected");

    this._selection = this.tableCards.filter((c) => c.isSelected);

    if (this._selection.length === 3) {
      const isSet = this.isCorrectSet(this._selection);

      if (isSet) {
        this.afterCorrectSet();
      } else {
        this.afterWrongSet();
      }
    }
  }

  private isCorrectSet([cardA, cardB, cardC]: Card[]): boolean {
    const setCardBasedOnFirstTwo = this.createThirdCardForSet(cardA, cardB);
    const isSet = setCardBasedOnFirstTwo.id === cardC.id;

    return isSet;
  }

  private createThirdCardForSet(cardA: Card, cardB: Card): Card {
    const number: Number =
      cardA.number === cardB.number
        ? cardA.number
        : this.getAlternativeCardProperty(cardA.number, cardB.number);
    const color: CardColor =
      cardA.color === cardB.color
        ? cardA.color
        : (this.getAlternativeCardProperty(
            cardA.color,
            cardB.color
          ) as CardColor);
    const fill: CardFill =
      cardA.fill === cardB.fill
        ? cardA.fill
        : (this.getAlternativeCardProperty(cardA.fill, cardB.fill) as CardFill);
    const shape: CardShape =
      cardA.shape === cardB.shape
        ? cardA.shape
        : (this.getAlternativeCardProperty(
            cardA.shape,
            cardB.shape
          ) as CardShape);

    return new Card(number, color, fill, shape);
  }

  private getAlternativeCardProperty(propA: Number, propB: Number): Number {
    if ((propA === 1 && propB === 2) || (propA === 2 && propB === 1)) {
      return 3;
    }

    if ((propA === 1 && propB === 3) || (propA === 3 && propB === 1)) {
      return 2;
    }

    return 1;
  }

  private afterWrongSet() {
    this._selection.forEach(({ id }) => {
      const el = document.getElementById(id)!;

      el.onanimationend = (e) => {        
        (<HTMLElement>e.target).classList.remove("shake");
      };
      el.classList.add("shake");
    });

    this._selection = [];
    this.tableCards.forEach((card) => {
      const cardEl = document.getElementById(card.id)!;
      card.isSelected = false;
      cardEl.classList.remove("selected");
    });
  }

  private afterCorrectSet() {
    this.totalSetsFound += 1;
    document.getElementById("total-sets-found")!.innerHTML =
      this.totalSetsFound.toString();

    let cardsReplaced = 0;

    this._selection.forEach((card) => {
      const cardEl = document.getElementById(card.id)!;
      cardEl.classList.add("remove-card");

      cardEl.onanimationend = (e: AnimationEvent) => {
        const index = this.tableCards.findIndex((f) => f.id === card.id);
        this.tableCards[index] = this.cardsDeck.pop()!;
        cardsReplaced += 1;

        if (cardsReplaced === 3) {
          this.addCardsToDOM();
        }
      };
    });

    this._selection = [];
  }

  private getHint() {
    const set = this.checkIfSetExists();

    if (set.length) {
      set.forEach(({ id }, i) => {
        // Only highlight two cards of the set, skip the first iteration
        if(i === 0) return;
        
        document.getElementById(id)!.classList.add("show-hint");
        setTimeout(() => {
          document.getElementById(id)!.classList.remove("show-hint");
        }, 1500);
      });
    } else {
      console.log("no set");
    }
  }

  private checkIfSetExists(): Card[] {
    let cards: Card[] = [];

    for (let cardI = 0; cardI < this.tableCards.length; cardI++) {
      if (cards.length) break;

      const cardA = this.tableCards[cardI];

      for (let cardJ = cardI + 1; cardJ < this.tableCards.length; cardJ++) {
        const cardB = this.tableCards[cardJ];
        const setCard = this.createThirdCardForSet(cardA, cardB);
        const found = this.tableCards.find((f) => f.id === setCard.id);

        if (found) {
          cards = [cardA, cardB, found];
          break;
        }
      }
    }

    return cards;
  }
}
