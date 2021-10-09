function error(err) {
  return console.error(err.stack);
}

module.exports = error;
