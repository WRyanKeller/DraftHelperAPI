const apiURL = 'https://pokeapi.co/api/v2/';

const getMon = async (mon) => {
  const monResult = await fetch(`${apiURL}${mon}`, {
    method: 'get',
    headers: {
    'Accept': 'application/json',
    }
  });

  let monJson = monResult.json();

  if (monJson) return monJson;
  return `${mon} does not exist or is in the wrong format!`;
};

const validateRoster = async (roster) => {
  const monPromises = [];
  let resultCount = 0;
  const returnObj = {
    pass: true,
    message: 'Roster is valid!',
  };

  roster.forEach((mon) => {
    let monResult = getMon(mon);

    monResult.then((response) => {
      if (!monResult.abilities && returnObj.pass) {
        returnObj.pass = false;
        returnObj.message = response;
      }
    });

    monPromises.push(monResult);
  });

  await Promise.all(monPromises);

  return returnObj;
};

module.exports = {
  validateRoster,
};