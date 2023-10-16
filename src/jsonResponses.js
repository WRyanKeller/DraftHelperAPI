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

const getRoster = (request, response, params) => {
  const responseJSON = {
    roster: rosters[params.id],
  };

  if (!responseJSON.roster) {
    responseJSON.roster = 'empty';
  }

  return respondJSON(request, response, 200, responseJSON);
};

const getRosterMeta = (request, response) => respondJSONMeta(request, response, 200);

const addRoster = (request, response, body) => {
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

    if (rosters[body.id]) {
      rosters[body.id] = body.roster;
      return respondJSONMeta(request, response, 204);
    }

    rosters[body.id] = body.roster;
    const responseJSON = {
      message: 'Created Successfully',
    };
    return respondJSON(request, response, 201, responseJSON);
  });
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

module.exports = {
  getRoster,
  getRosterMeta,
  addRoster,
  notFound,
  notFoundMeta,
};
