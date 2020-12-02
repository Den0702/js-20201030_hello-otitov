import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  subElements = {};
  loading = false;
  data = [];

  constructor(
    headers = [],
    {
      url = '',
      sorted = {
        id: headers.find(item => item.sortable).id,
        order: 'asc'
      },
      step = 20,
      start = 1,
      end = start + step
    } = {}
  ) {
    this.headers = headers;
    this.url = new URL(url, BACKEND_URL);
    this.sorted = sorted;

    this.step = step;
    this.start = 1;
    this.end = end;
    
    this.render();
    this.renderSortingArrow();
  }

  get headers() {
    return this._headers.map(item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
        </div>
      `;
    }).join('');
  }

  set headers(value = []) {
    this._headers = value;
  }

  get template() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.headers}
        </div>
        <div data-element="body" class="sortable-table__body"></div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
          </div>
        </div>
      </div>
    `;
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = {};

    this.element.querySelectorAll('[data-element]').forEach(el => {
      this.subElements[el.dataset.element] = el;
    });

    await this.loadData();

    this.addEventListener();
  }

  renderSortingArrow() {
    const element = document.createElement('div');
    element.innerHTML = `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
    this.sortingArrow = element.firstElementChild;

    const defaultSortElem = this.element.querySelector(`[data-sortable="true"][data-id="${this.sorted.id}"]`);
    defaultSortElem.append(this.sortingArrow);
    defaultSortElem.dataset.order = this.sorted.order;
  }

  async sortOnServer(id, order, start, end) {
    await this.loadData(id, order, start, end);
  }

  async loadData(
    id = this.sorted.id,
    order = this.sorted.order,
    start = this.start,
    end = this.end
  ) {
    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    this.element.classList.add('sortable-table_loading');
    this.element.classList.remove('sortable-table_empty');


    if (!this.loading) {
      this.subElements.body.innerHTML = '';
    }

    const result = await fetchJson(this.url);

    this.update(result);

    this.element.classList.remove('sortable-table_loading');

    if (!result.length && !this.loading) {
      this.element.classList.add('sortable-table_empty');
    }
  }

  update(result = []) {
    const body = result.map(item => {
      const cell = this.getCellTemplate(item);
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${cell}
        </a>
      `;
    }).join('');

    if (!this.loading) {
      this.subElements.body.innerHTML = body;
    }
    else {
      const element = document.createElement('div');
      element.innerHTML = body;

      this.subElements.body.append(...element.childNodes);
    }
  }

  getCellTemplate(data) {
    return this._headers.map(item => {
      if (item.template) {
        return item.template(data[item.id]);
      }
      return `<div class="sortable-table__cell">${data[item.id]}</div>`
    }).join('');
  }

  addEventListener() {
    this.subElements.header.addEventListener('pointerdown', event => {
      const collumn = event.target.closest('[data-sortable="true"]');

      if (collumn) {
        const toggleOrder = {
          'asc': 'desc',
          'desc': 'asc'
        };
        const currentOrder = collumn.dataset.order ?? 'asc';
        collumn.dataset.order = toggleOrder[currentOrder];

        this.sorted = {
          id: collumn.dataset.id,
          order: collumn.dataset.order
        };

        collumn.append(this.sortingArrow);

        this.sortOnServer(this.sorted.id, this.sorted.order, 1, 1 + this.step);
      }
    });

    document.addEventListener('scroll', this.onWindowScroll);
  }

  onWindowScroll = async () => {
    const { bottom } = this.element.getBoundingClientRect();
    
    if (bottom < document.documentElement.clientHeight && !this.loading) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      await this.loadData(this.sorted.id, this.sorted.order, this.start, this.end);
      
      this.loading = false;
    }
  }

  remove() {
    this.element.remove();
    document.removeEventListener('scroll', this.onWindowScroll);
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
