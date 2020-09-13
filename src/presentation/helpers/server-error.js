class ServerError extends Error {
  constructor() {
    super('Internal Error');
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
