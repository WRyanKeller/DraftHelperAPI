const rosterAnalysis = require('./rosterAnalysis.js');

const rosters = {
  sarah_rc: ['genesect',
    'rotom-wash',
    'sylveon',
  ],
};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

const getRoster = (request, response, params) => {
  const responseJSON = {
    roster: rosters[params.id],
    message: 'Success - Roster Loaded',
  };

  if (!responseJSON.roster) {
    responseJSON.roster = [];
    responseJSON.message = 'No roster exists with that ID!';
    responseJSON.id = 'rosterNotFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const getRosterMeta = (request, response, params) => {
  if (rosters[params.id]) {
    return respondJSONMeta(request, response, 200);
  }

  return notFoundMeta(request, response);
};

const addMonToRoster = (request, response, body) => {
  const monResponse = rosterAnalysis.validateMon(body.mon);

  monResponse.then((monValid) => {
    if (!monValid.message) {
      const responseJSON = {
        message: monValid.message,
        id: 'validationSeverError',
      };
      return respondJSON(request, response, 500, responseJSON);
    }
    if (!monValid.pass) {
      const responseJSON = {
        message: monValid.message,
        id: 'invalidMonName',
      };
      return respondJSON(request, response, 400, responseJSON);
    }

    // allows addition to blank rosters - everybody starts somewhere!
    // and considering it's only based on an id, a specific roster init
    // UI seems unnecessary
    if (!rosters[body.id]) {
      rosters[body.id] = [];
    }

    rosters[body.id].push(body.mon);

    return respondJSONMeta(request, response, 204);
  });

  return monResponse;
};

const addRosterSuccess = (request, response, body) => {
  if (rosters[body.id]) {
    rosters[body.id] = body.roster;
    return respondJSONMeta(request, response, 204);
  }

  rosters[body.id] = body.roster;
  const responseJSON = {
    message: 'Roster Created Successfully',
  };
  return respondJSON(request, response, 201, responseJSON);
};

const addRoster = (request, response, body) => {
  if (body.id && !body.roster) {
    const newBody = {
      id: body.id,
      roster: [],
    };
    return addRosterSuccess(request, response, newBody);
  }

  const rosterResponse = rosterAnalysis.validateRoster(body.roster);

  rosterResponse.then((rosterValid) => {
    if (!rosterValid.message) {
      const responseJSON = {
        message: rosterValid.message,
        id: 'validationSeverError',
      };
      return respondJSON(request, response, 500, responseJSON);
    }
    if (!rosterValid.pass) {
      const responseJSON = {
        message: rosterValid.message,
        id: 'invalidMonName',
      };
      return respondJSON(request, response, 400, responseJSON);
    }

    return addRosterSuccess(request, response, body);
  });

  return rosterResponse;
};

const removeMonFromRoster = (request, response, body) => {
  const responseJSON = {
    message: `${body.mon} not found in roster!`,
    id: 'monNotFoundInRoster',
  };

  if (!rosters[body.id]) {
    responseJSON.message = 'Roster not found!';
    responseJSON.id = 'rosterNotFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  if (rosters[body.id].splice(body.mon) === -1) {
    return respondJSON(request, response, 404, responseJSON);
  }

  return respondJSONMeta(request, response, 204);
};

module.exports = {
  getRoster,
  getRosterMeta,
  addRoster,
  addMon: addMonToRoster,
  removeMon: removeMonFromRoster,
  notFound,
  notFoundMeta,
};
