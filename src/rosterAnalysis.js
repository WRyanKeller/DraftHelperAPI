const apiURL = 'https://pokeapi.co/api/v2/';

const getMon = (mon) => {
  const monResult = fetch(apiURL + mon);

  monResult.then((response) => {
    if (response) return response;
    return `${mon} does not exist or is in the wrong format!`;
  });
};

const validateRoster = (roster) => {
  let monResult;
  const returnObj = {
    pass: true,
    message: 'Roster is valid!',
  };

  roster.array.forEach((mon) => {
    monResult = getMon(mon);
    if (!monResult.abilities) {
      returnObj.pass = false;
      returnObj.message = monResult;
    }
  });

  return returnObj;
};

module.exports = {
  validateRoster,
};
