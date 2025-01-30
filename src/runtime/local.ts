export class Local {
  private static conf = null;
  private static func = null;

  static loudConf() {
    if (!this.conf) {
      throw new Error('conf is not set!');
    }
    return this.conf;
  }

  static loudCloudFunctions() {
    if (!this.func) {
      throw new Error('func is not set!');
    }
    return this.func;
  }

  static initConf(conf) {
    this.conf = conf;
  }

  static initFunc(func) {
    this.func = func;
  }
}