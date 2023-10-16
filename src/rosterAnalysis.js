const apiURL = 'https://pokeapi.co/api/v2/';

const getMon = async (mon) => {
  const monResult = await fetch(`${apiURL}pokemon/${mon}`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
    },
  });

  const monJson = monResult.json();

  if (monJson) return monJson;
  return `${mon} does not exist or is in the wrong format!`;
};

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
        console.log(response.abilities);
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
