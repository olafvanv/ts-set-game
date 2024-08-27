import { CardColor, CardFill, CardShape } from "./utils.js";

export class Card {
  number: Number;
  color: CardColor;
  fill: CardFill;
  shape: CardShape;

  isSelected = false;

  constructor(
    _number: Number,
    _color: CardColor,
    _fill: CardFill,
    _shape: CardShape
  ) {
    this.number = _number;
    this.color = _color;
    this.fill = _fill;
    this.shape = _shape;
  }

  public get shapeName(): string {
    return CardShape[this.shape];
  }

  public get colorName(): string {
    return CardColor[this.color];
  }

  public get fillName(): string {
    return CardFill[this.fill];
  }

  public get id(): string {
    return `${this.number}-${this.colorName}-${this.fillName}-${this.shapeName}`;
  }

  public getHtmlTemplate(): string {
    return `
    <div class="card" id="${this.id}">
      ${this.getImage().join('')}
    </div>
    `;
  }

  private getImage(): string[] {
    const imgs: string[] = [];
    const src = `./assets/cards/${this.colorName}-${this.fillName}-${this.shapeName}.png`;

    for(let i = 1; i <= +this.number; i++) {
      imgs.push(`<img src="${src}" class="shape-img" />`);
    }

    return imgs;
  }
}
