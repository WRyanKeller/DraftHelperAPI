const apiURL = 'https://pokeapi.co/api/v2/';

/*
Summary:
- requests a pokemon from the pokemon api
*/
const getMon = async (mon) => {
  const monResult = await fetch(`${apiURL}pokemon/${mon}`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
    },
  });

  let monResponse = '';

  try {
    monResponse = await monResult.json();
  } catch (e) {
    monResponse = `${mon} does not exist or is in the wrong format!`;
  }

  return monResponse;
};

/*
Summary:
- deciphers result of validation for one mon
*/
const validateMon = async (mon) => {
  const returnObj = {
    pass: true,
    message: `${mon} added successfully`,
  };

  const monResult = await getMon(mon);

  if (!monResult.abilities) {
    returnObj.pass = false;
    returnObj.message = monResult;
  }

  return returnObj;
};

/*
Summary:
- deciphers result of validations for multiple mons
- sent in as one roster array
*/
const validateRoster = async (roster) => {
  const monPromises = [];
  const returnObj = {
    pass: true,
    message: 'Roster is valid!',
  };

  roster.forEach((mon) => {
    const monResult = getMon(mon);

    monResult.then((response) => {
      if (!response.abilities && returnObj.pass) {
        returnObj.pass = false;
        returnObj.message = response;
      }
    });

    monPromises.push(monResult);
  });

  await Promise.all(monPromises);

  return returnObj;
};

/*
Summary:
- returns the url for a mon
*/
const getArt = async (mon) => {
  const monResponse = await getMon(mon);

  if (!monResponse.sprites) {
    return '';
  }

  return monResponse.sprites.other['official-artwork'].front_default;
};

module.exports = {
  validateRoster,
  validateMon,
  getArt,
};
