export default class SortableTable {
  element;
  subElements = {};
  refSortables = null;

  constructor(header = [], { data = [] } = {}) {
    if (!header.length) {
      throw new Error('header is not set');
    }

    this._header = header;
    this._data = data;
    this.render();
  }

  get template() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.header}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.data}
          </div>
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  get header() {
    return this._header.map( item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
        </div>
      `;
    }).join('');
  }

  get data() {
    return this._data.map( item => {
      const cell = this.getCellTemplate(item);

      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${cell}
        </a>
      `;
    }).join('');
  }

  get direction() {
    return this._direction;
  }

  set direction(value) {
    switch(value) {
      case 'asc':
        this._direction = 1;
        break;
      case 'desc':
        this._direction = -1;
        break;
      default:
        this._direction = 0;
    }
  }

  getCellTemplate(data) {
    return this._header.map( item => {
      if (item.template) {
        return item.template(data[item.id]);
      }
      return `<div class="sortable-table__cell">${data[item.id]}</div>`
    }).join('');
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    this.element.querySelectorAll('[data-element]').forEach( el => {
      this.subElements[el.dataset.element] = el;
    });
  }

  sort(fieldValue, sortValue = 'asc') {
    this.direction = sortValue;

    // зачем каждый раз искать sortType? "закешируем"
    if (!this.refSortables) {
      this.refSortables = this._header.reduce((acc, item) => {
        if (item.sortable) {
          acc[item.id] = item.sortType;
        }
        return acc;
      }, {});
    }

    const sortType = this.refSortables[fieldValue];

    this._data.sort((a, b) => {
      switch (sortType) {
        case "number":
          return this.direction * (a[fieldValue] - b[fieldValue]);
        default:
          return this.direction * (
              a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'], { caseFirst: 'upper' })
            );
      }
    });

    this.update('body', this.data);
  }

  update(ref, data) {
    this.subElements[ref].innerHTML = data;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.refElements = {};
    this.refSortables = {};
  }
}
