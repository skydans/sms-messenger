const validateBatch = (list) => {
  for (let i=0; i<list.length; i++) {
    if (list[i] == "" || list[i].slice(0, 2) != "04") {
      return false;
    } else {
      list[i] = "+614" + list[i].slice(2, 10);
    }
  }
  return true;
};

const validateBody = (body) => {
  if (body.length < 1) {
    return false;
  }
  return true;
}

module.exports = {
  validateBatch,
  validateBody
};
