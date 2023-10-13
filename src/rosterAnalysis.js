const apiURL = 'https://pokeapi.co/api/v2/';

const getMon = async (mon) => {
  const monResult = await fetch(apiURL + mon);

  if (monResult) return monResult;
  return `${mon} does not exist or is in the wrong format!`;
};

const validateRoster = async (roster) => {
  let monResult;
  let resultCount = 0;
  const returnObj = {
    pass: true,
    message: 'Roster is valid!',
  };

  roster.forEach((mon) => {
    monResult = getMon(mon);

    monResult.then((response) => {
      if (!monResult.abilities && returnObj.pass) {
        returnObj.pass = false;
        returnObj.message = monResult;
      }
    });
  });

  return returnObj;
};

module.exports = {
  validateRoster,
};
