import Sortable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends Sortable{
  constructor(
    header = [],
    {
      data = [],
      defaultSorted = header.find(item => item.sortable).id
    } = {}
  ){
    super(header, {data});

    this.defaultSorted = defaultSorted;

    this.renderSortingArrow();
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

    const defaultSortElem = this.element.querySelector(`[data-sortable="true"][data-id="${this.defaultSorted}"]`);
    defaultSortElem.append(this.sortingArrow);
    defaultSortElem.dataset.order = 'asc';

    this.sort(this.defaultSorted, 'asc');
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

        this.sort(collumn.dataset.id, collumn.dataset.order);

        collumn.append( this.sortingArrow );
      }
    });
  }
}
