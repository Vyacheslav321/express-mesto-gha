class NoAccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 99994;
  }
}

module.exports = NoAccessError;
