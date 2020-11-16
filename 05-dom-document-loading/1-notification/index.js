export default class NotificationMessage {
  static activeElement;
  static timerId;

  static POSSIBLE_TYPES = [
    'success',
    'error'
  ];
  static DEFAULT_TYPE = 'success';

  constructor(
    text = '',
    {
      duration = 2000,
      type = 'success'
    } = {}
  ) {
    this._text = text;
    this._duration = duration;
    this._type = type;

    this.render();
  }

  get text() {
    return this._text;
  }

  get duration() {
    return this._duration;
  }

  get type() {
    return (NotificationMessage.POSSIBLE_TYPES.includes(this._type)) ?
      this._type : NotificationMessage.DEFAULT_TYPE;
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration/1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.text}
          </div>
        </div>
      </div>`;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  show(nodeEl = document.body) {
    if (NotificationMessage.activeElement) {
      this.remove();
    }
    
    nodeEl.append( this.element );
    NotificationMessage.activeElement = this.element;

    NotificationMessage.timerId = setTimeout( () => {
      this.remove();
    }, this.duration);
  }

  remove() {
    if (NotificationMessage.activeElement) {
      NotificationMessage.activeElement.remove();
      clearTimeout(NotificationMessage.timerId);
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.activeElement = null;
    NotificationMessage.timerId = null;
  }
}
