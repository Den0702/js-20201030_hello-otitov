export default class DoubleSlider {
  element;
  subElements = {};

  constructor({
    min = 100,
    max = 200,
    formatValue = value => '$' + value,
    selected = {
      from: min,
      to: max
    }
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;

    this.render();
    this.addEventListener();
  }

  get template() {
    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div class="range-slider__inner" data-element="inner">
          <span class="range-slider__progress" data-element="progress"></span>
          <span class="range-slider__thumb-left" data-element="btnMin"></span>
          <span class="range-slider__thumb-right" data-element="btnMax"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });

    this.update();
  }

  update() {
    const range = this.max - this.min;
    const left = Math.floor((this.selected.from - this.min) / range * 100) + '%';
    const right = Math.floor((this.max - this.selected.to) / range * 100) + '%';

    this.subElements.progress.style.left = left;
    this.subElements.progress.style.right = right;

    this.subElements.btnMin.style.left = left;
    this.subElements.btnMax.style.right = right;
  }

  addEventListener() {
    this.element.ondragstart = () => false;
    this.element.addEventListener('pointerdown', this.pointerDown);
  }

  pointerDown = event => {
    if (
      event.target !== this.subElements.btnMin
      && event.target !== this.subElements.btnMax
    ) {
      return;
    }

    this.dragging = event.target;

    this.element.classList.add('range-slider_dragging');

    const { left, right } = event.target.getBoundingClientRect();

    this.shiftX = (event.target === this.subElements.btnMin) ?
      right - event.clientX :
      left - event.clientX;

    document.addEventListener('pointermove', this.pointerMove);
    document.addEventListener('pointerup', this.pointerUp, true);
  }

  pointerMove = event => {
    const clientReact = this.subElements.inner.getBoundingClientRect();

    if (this.dragging === this.subElements.btnMin) {
      let newLeft = (event.clientX - clientReact.left + this.shiftX) / clientReact.width;

      if (newLeft < 0) {
        newLeft = 0;
      }
      newLeft *= 100;
      let right = parseFloat(this.subElements.btnMax.style.right);

      if (newLeft + right > 100) {
        newLeft = 100 - right;
      }

      this.dragging.style.left = this.subElements.progress.style.left = newLeft + '%';
      this.subElements.from.innerHTML = `$${this.getValue().from}`;
    } else {
      let newRight = (clientReact.right - event.clientX - this.shiftX) / clientReact.width;

      if (newRight < 0) {
        newRight = 0;
      }
      newRight *= 100;

      let left = parseFloat(this.subElements.btnMin.style.left);

      if (left + newRight > 100) {
        newRight = 100 - left;
      }
      this.dragging.style.right = this.subElements.progress.style.right = newRight + '%';
      this.subElements.to.innerHTML = `$${this.getValue().to}`;
    }
  }

  pointerUp = event => {
    document.removeEventListener('pointermove', this.pointerMove);
    document.removeEventListener('pointerup', this.pointerUp);

    this.element.classList.remove('range-slider_dragging');

    this.element.dispatchEvent(new CustomEvent('range-select', {
      detail: this.getValue(),
      bubbles: true
    }));
  }

  getValue() {
    const range = this.max - this.min;
    const left = this.subElements.btnMin.style.left === '' ? 0 : this.subElements.btnMin.style.left;
    const right = this.subElements.btnMax.style.right === '' ? 0 : this.subElements.btnMax.style.right;

    return {
      from: Math.round(this.min + parseFloat(left) * 0.01 * range),
      to: Math.round(this.max - parseFloat(right) * 0.01 * range),
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointermove', this.pointerMove);
    document.removeEventListener('pointerup', this.pointerUp);

    this.element.addEventListener('pointerdown', this.pointerDown);
  }
}
