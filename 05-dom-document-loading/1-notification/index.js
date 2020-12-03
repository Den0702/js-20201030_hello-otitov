export default class NotificationMessage {
  static activeElement;
  static timerID;

  constructor(
    text = '',
    {
      duration = 2000,
      type = ''
    } = {}
  ) {
    /**
     * clearTimeout все-таки нужен. Как повторить баг:
     * тыкать 10 раз подряд "кнопку", остановится и увидеть, 
     * что мессендж исчез раньше заданного времени (2сек)
     */
    if (NotificationMessage.activeElement) {
      NotificationMessage.activeElement.remove();
      clearTimeout(NotificationMessage.timerID);
    }

    this.text = text;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get duration() {
    return this._duration;
  }

  set duration(value) {
    this._duration = (value > 0) ? value : 2000;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = ['success', 'error'].includes(value) ? value : 'success';
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
    nodeEl.append( this.element );
    NotificationMessage.activeElement = this.element;

    NotificationMessage.timerID = setTimeout( () => {
      this.remove();
    }, this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    NotificationMessage.activeElement = null;
    NotificationMessage.timerID = null;
  }
}
