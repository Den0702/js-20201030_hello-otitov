class Tooltip {
  static tooltip;

  constructor() {
    if (Tooltip.tooltip) {
      return Tooltip.tooltip;
    }

    Tooltip.tooltip = this;
  }

  render(text) {
    this.element = document.createElement('div');
    this.element.classList.add('tooltip');
    this.element.innerHTML = text;
    document.body.append(this.element);
  }

  initialize() {
    this.addEventListener();
  }

  addEventListener() {
    document.body.addEventListener('pointerout', this.pointerOut);
    document.body.addEventListener('pointerover', this.pointerOver);
  }

  pointerOut = event => {
    this.remove();
  }

  pointerOver = event => {
    const tooltip = event.target.closest('[data-tooltip]');
    if (!tooltip) return;

    this.render(tooltip.dataset.tooltip);

    document.addEventListener('pointermove', this.pointerMove);
  }

  pointerMove = event => {
    const tooltip = event.target.closest('[data-tooltip]');
    if (!tooltip) return;

    this.element.style.top = event.clientY + 5 + 'px';
    this.element.style.left = event.clientX + 5 + 'px';
  }

  remove() {
    this.element.remove();
    document.removeEventListener('pointermove', this.pointerMove);
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerout', this.pointerOut);
    document.removeEventListener('pointerover', this.pointerOver);
  }
}

const tooltip = new Tooltip();

export default tooltip;
