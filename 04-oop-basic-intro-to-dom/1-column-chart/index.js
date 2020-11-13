export default class ColumnChart {
  chartHeight = 50;

  constructor({ label = '', link = false, value = 0, data = [] } = {}) {
    this._label = label;
    this._link = link;
    this._value = value;
    this._data = data;

    this.render();
    this.initEventListeners();
  }

  get link() {
    return this._link ? `<a href="${this._link}" class="column-chart__link">View all</a>` : '';
  }

  get charts() {
    const max = Math.max(...this._data);
    const scale = this.chartHeight / max;

    return this._data.reduce((acc, current) => {
      const percent = (current / max * 100).toFixed(0);
      return acc += `<div style="--value: ${Math.floor(current * scale)}" data-tooltip="${percent}%"></div>`;
    }, '');
  }

  get template() {
    return `
      <div class="column-chart">
        <div class="column-chart__title">
          ${this._label}
          ${this.link}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this._value}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.charts}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    // если данных нет, показываем заглушку
    if (this._data.length <= 0) {
      this.element.classList.add('column-chart_loading');
    }
  }

  update( data = [] ) {
    this._data = data;
    this.render();
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}
