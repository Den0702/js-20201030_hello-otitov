import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};

  constructor({
    label = '',
    link = '',
    formatHeading = data => data,
    url = '',
    range = {
      from: new Date(),
      to: new Date(),
    }
  } = {}) {
    this.label = label;
    this.link = link;

    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.formatHeading = formatHeading;

    this.render();
    this.update(this.range.from, this.range.to);
  }

  get link() {
    return this._link ? `<a href="${this._link}" class="column-chart__link">View all</a>` : '';
  }

  set link(value) {
    this._link = value;
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading">
        <div class="column-chart__title">
          ${this.label}
          ${this.link}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.value}</div>
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

    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  async update(from, to) {
    this.element.classList.add('column-chart_loading');

    const data = await this.loadData(from, to);
    
    if (!data || !Object.values(data).length) { return; }

    this.subElements['body'].innerHTML = this.renderCharts(data);
    this.subElements['header'].innerHTML = this.total;

    this.element.classList.remove('column-chart_loading');
  }

  loadData(from, to) {
    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());

    return fetchJson(this.url);
  }

  renderCharts(data) {
    const values = Object.values(data);
    const max = Math.max(...values);
    const scale = this.chartHeight / max;

    this.total = this.formatHeading(
      values.reduce((accum, item) => (accum + item), 0)
    );

    return Object.entries(data).map(([date, count]) => {
      const percent = (count / max * 100).toFixed(0);

      return `<div style="--value: ${Math.floor(count * scale)}" data-tooltip="${date}%"></div>`;
    }).join('');
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
