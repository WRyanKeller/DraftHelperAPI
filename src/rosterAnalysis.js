const apiURL = "https://pokeapi.co/api/v2/";

const validateRoster = (roster) => {
let monResult;

  for (mon of roster) {
    monResult = getMon(mon);
    if(!monResult.abilities) {
      return {
        pass: false,
        message: monResult
      };
    }
  }

  return {pass: true};
};

const getMon = (mon) => {
  let monResult = fetch(apiURL + mon);

  monResult.then(response => {
    if (monResult) return monResult;
    return mon + " does not exist or is in the wrong format!";
  });
};

module.exports = {
  validateRoster
};