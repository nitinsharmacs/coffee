class EventNotifier {
  #actions
  constructor() {
    this.#actions = {}
  }

  register(event, action) {
    this.#actions[event] = action;
  }

  trigger(event, ...args) {
    this.#actions[event].apply(args);
  }
}

exports.EventNotifier = EventNotifier;
