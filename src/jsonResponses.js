const rosterAnalysis = require('./rosterAnalysis.js');

/*
Summary:
- basically the entire list of rosters that exist (until I move it elsewhere)
*/
const rosters = {
  sarah_rc: ['genesect',
    'rotom-wash',
    'sylveon',
  ],
};

/*
Summary:
- basic json response
*/
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// basic json response no body
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

/*
Summary:
- calls respond JSON with not found object and status
*/
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page or resource you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

// not found with no body
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

/*
Summary:
- requests a roster from the rosters object
*/
const getRoster = (request, response, params) => {
  const responseJSON = {
    roster: [],
    message: 'Success - Roster Loaded',
  };

  if (!params.id) {
    responseJSON.message = 'Must specify roster!';
    responseJSON.id = 'noRoster';
    return respondJSONMeta(request, response, 400);
  }

  if (!rosters[params.id]) {
    responseJSON.message = 'No roster exists with that ID!';
    responseJSON.id = 'rosterNotFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  responseJSON.roster = rosters[params.id];
  return respondJSON(request, response, 200, responseJSON);
};

// get roster with no body
const getRosterMeta = (request, response, params) => {
  if (!params.id) {
    return respondJSONMeta(request, response, 400);
  }

  if (rosters[params.id]) {
    return respondJSONMeta(request, response, 200);
  }

  return notFoundMeta(request, response);
};

/*
Summary:
- checks for a valid pokemon
- attempts an addition to a roster
- allows adding to a new roster
*/
const addMonToRoster = (request, response, body) => {
  if (!body.id || !body.mon) {
    return respondJSON(request, response, 400, {
      message: 'Must specify roster and mon!',
      id: 'noRosterOrMon',
    });
  }

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

/*
Summary:
- the second half of adding a roster - 
- determining if the roster is created or updated
*/
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

/*
Summary:
- the first hald of adding a roster - 
- validates mons, checks for bad requests, etc.
*/
const addRoster = (request, response, body) => {
  if (!body.id || !('roster' in body)) {
    return respondJSON(request, response, 400, {
      message: 'Must specify roster and mons!',
      id: 'noRosterOrMons',
    });
  }

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

/*
Summary:
- attempts removal of one specific mon from a roster
- checks for bad requests - from missing params to the roster not containing the mon
*/
const removeMonFromRoster = (request, response, body) => {
  const responseJSON = {
    message: `${body.mon} not found in roster!`,
  };

  if (!body.id || !body.mon) {
    responseJSON.message = 'Must specify roster and mon!';
    responseJSON.id = 'noRosterOrMon';
    return respondJSON(request, response, 400, responseJSON);
  }

  if (!rosters[body.id]) {
    responseJSON.message = 'Roster not found!';
    responseJSON.id = 'rosterNotFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  const index = rosters[body.id].indexOf(body.mon);

  if (index === -1) {
    responseJSON.id = 'monNotFoundInRoster';
    return respondJSON(request, response, 404, responseJSON);
  }

  rosters[body.id].splice(index, 1);
  return respondJSONMeta(request, response, 204);
};

/*
Summary:
- handles requesting art from roster analysis in the form of a url
*/
const getArt = (request, response, params) => {
  const responseJSON = {};

  if (!params.mon) {
    responseJSON.message = `${params.mon} is required!`;
    responseJSON.id = 'monNameNeededForArt';
    return respondJSON(request, response, 400, responseJSON);
  }

  const spriteResult = rosterAnalysis.getArt(params.mon);

  return spriteResult.then((monSprite) => {
    if (!monSprite) {
      return notFound(request, response);
    }

    responseJSON.url = monSprite;
    responseJSON.message = 'sprite successfully retreived';
    return respondJSON(request, response, 200, responseJSON);
  });
};

// get art with no body
const getArtMeta = (request, response, params) => {
  if (!params.mon) {
    return respondJSONMeta(request, response, 400);
  }

  const spriteResult = rosterAnalysis.getArt(params.mon);

  return spriteResult.then((monSprite) => {
    if (!monSprite) {
      return notFoundMeta(request, response);
    }

    return respondJSONMeta(request, response, 200);
  });
};

module.exports = {
  getRoster,
  getRosterMeta,
  addRoster,
  addMon: addMonToRoster,
  removeMon: removeMonFromRoster,
  notFound,
  notFoundMeta,
  getArt,
  getArtMeta,
};
