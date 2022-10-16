class AlreadyExistDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 89994;
  }
}

module.exports = AlreadyExistDataError;
