class Messenger {
  constructor() {
    this.messages = new Map();
  }
  has(id) { return this.messages.has(id); }
  get(id) { return this.messages.get(id); }
  set(id, o) { return this.messages.set(id, o); }
  delete(id) { return this.messages.delete(id); }
  generateId() { return ((this.messages.size + Math.random()) * Math.random()); }
  createMessage({ name, email, phone, message }) {
    const id = this.generateId();
    return this.set(id, { id, name, email, phone, message });
  }
  updateMessage(id, updates) {
    const message = this.get(id);
    return this.set(id, Object.assign(message, updates));
  }
  deleteMessage(id) {
    return this.delete(id);
  }
}

module.exports = new Messenger();
