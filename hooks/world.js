const { World, setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld extends World {
  constructor(options) {
    super(options);

    this.browser = null;
    this.context = null;
    this.page = null;
  }
}

setWorldConstructor(CustomWorld);