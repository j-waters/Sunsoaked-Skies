export default class DataStore {
  constructor() {
    this.worlds = [];
  }
  static create() {
    if (!this.instance) {
      this.instance = new DataStore();
    }
    return this.instance;
  }
}
