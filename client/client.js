/* eslint-env browser */
// above line acquired from https://eslint.org/docs/latest/use/configure/language-options

// state needed to track roster contents
// and roster id
let rosterStr = '';
let rosterId = '';

/*
Summary:
- all purpose response handler for json
- can choose not to parse response
- accepts handler array of handler objects:
  - function and accompanying data
*/
const handleResponse = async (response, parseResponse, handlers) => {
  if (parseResponse) {
    let obj = {};

    // adds message for update code
    if (response.status === 204) {
      obj.message = 'Success - Updated';
    } else {
      obj = await response.json();
    }

    handlers.forEach((handler) => {
      handler.function(obj, handler.data, response);
    });
  } else { // don't parse!
    handlers.forEach((handler) => {
      handler.function(response, handler.data);
    });
  }
};

/*
Summary:
- all purpose fetch for get and head requests
- accepts handlers for handling response
- allows for different type (not needed curently, but nice to have)
*/
const sendFetch = async (action, handlers, shouldParse = true, type = 'application/json') => {
  const response = await fetch(action, {
    method: 'get',
    headers: {
      Accept: type,
    },
  });

  handleResponse(response, shouldParse, handlers);
};

/*
Summary:
- json-purpose fetch for posting
- sends body in url query format
- accepts handlers for handling response
*/
const sendPost = async (action, body, handlers) => {
  const response = await fetch(action, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });

  handleResponse(response, true, handlers);
};

// requires string id of html element
const updateText = (message, id) => {
  const responseElement = document.getElementById(id);

  responseElement.innerHTML = message;
};

// requires string id of html element
// used after parsing response
const updateTextFromJSON = (obj, id) => {
  updateText(obj.message, id);
};

/*
Summary:
- update global roster id as handler function
*/
const setRosterID = (obj, id) => {
  rosterId = id;
  return obj;
};

/*
Summary:
- straight up removes the .mon container element provided
- and deletes the mon from the roster string
*/
const removeMon = (mon, monElement) => {
  rosterStr.replace(mon, '');

  return monElement.remove();
};

/*
Summary:
- Removes the element as a handler
- requires data to hold both the mon name and the .mon conatiner element
*/
const removeMonHandler = (obj, data, response) => {
  if (response.status !== 204) {
    return obj;
  }

  return removeMon(data.mon, data.monElement);
};

/*
Summary:
- calls the post request with removeMonHandler as the handler function
*/
const removeMonFromRoster = (mon, monElement) => {
  sendPost('removeMon', `mon=${mon}&id=${rosterId}`, [{
    function: removeMonHandler,
    data: {
      monElement,
      mon,
    },
  }]);
};

/*
Summary:
- A handler function to take in an html element and add a url for a new resource into its src
- the resource comes from a provided url
- code largely worked from https://stackoverflow.com/questions/47001306/display-png-from-http-get-request
*/
const updateImg = (obj, element) => {
  if (!obj.url) return;

  fetch(obj.url).then((response) => response.blob()).then((blob) => {
    const img = URL.createObjectURL(blob);
    element.setAttribute('src', img);
  });
};

/*
Summary:
- creates container alongside children:
  - header
  - image
  - delete button
*/
const addMon = (mon, divId) => {
  const monElement = document.createElement('div');
  monElement.setAttribute('class', 'mon');

  const monHeader = document.createElement('h3');
  monHeader.setAttribute('class', 'monHeader');
  monHeader.innerHTML = mon;

  const monArt = document.createElement('img');
  monArt.setAttribute('alt', `Art of ${mon}`);
  monArt.setAttribute('height', '95px');
  monArt.setAttribute('width', '95px');
  sendFetch(`getArt?mon=${mon}`, [
    {
      function: updateImg,
      data: monArt,
    },
  ]);

  const monDelete = document.createElement('button');
  monDelete.setAttribute('class', 'monDelete');
  monDelete.setAttribute('type', 'button');
  monDelete.innerHTML = 'x';
  monDelete.addEventListener('click', () => removeMonFromRoster(mon, monElement));

  monElement.appendChild(monHeader);
  monElement.appendChild(monArt);
  monElement.appendChild(monDelete);

  document.getElementById(divId).appendChild(monElement);
};

/*
Summary:
- calls add mon as a handler function
*/
const addMonHandler = (obj, mon, response) => {
  if (response.status !== 204) {
    return obj;
  }

  return addMon(mon, 'rosterDisplay');
};

/*
Summary:
- updates the roster display element by adding each mon in the roster
*/
const updateRosterDisplay = (obj, id) => {
  const displayId = 'rosterDisplay';

  document.getElementById(displayId).innerHTML = '';

  if (obj.id) {
    return;
  }

  const roster = JSON.stringify(obj.roster);
  rosterStr = roster;
  rosterId = id;

  obj.roster.forEach((mon) => {
    addMon(mon, displayId);
  });
};

/*
Summary:
- handles the click of the roster form - saving or loading!
- getting attributes of options with code from https://www.codexworld.com/how-to/get-attribute-value-of-the-selected-option-using-javascript/
*/
const handleRoster = (rosterForm) => {
  const select = rosterForm.querySelector('select');
  const action = select.options[select.selectedIndex].getAttribute('action');
  const method = select.options[select.selectedIndex].getAttribute('method');

  const id = document.getElementById('idField').value;

  // get case
  if (method === 'get') {
    // handlers are updating mons on display and updating roster response text
    sendFetch(`${action}?id=${id}`, [{
      function: updateTextFromJSON,
      data: 'rosterResponse',
    }, {
      function: updateRosterDisplay,
      data: id,
    }]);

  } else { // post case
    // handlers are updating roster response text and setting current roster
    sendPost(action, `id=${id}&roster=${rosterStr}`, [{
      function: updateTextFromJSON,
      data: 'rosterResponse',
    }, {
      function: setRosterID,
      data: id,
    }]);
  }
};

/*
Summary:
- calls post for adding a mon
  - handlers are adding a mon as a handler and updating add text
*/
const addMonToRoster = () => {
  const mon = document.getElementById('monInput').value;
  sendPost('addMon', `id=${rosterId}&mon=${mon}`, [{
    function: addMonHandler,
    data: mon,
  }, {
    function: updateTextFromJSON,
    data: 'addResponse',
  }]);
};

/*
Summary:
- called at onload
- adds event listeners to buttons
*/
const init = () => {
  const rosterForm = document.querySelector('#rosterForm');

  const submitRosterForm = (e) => {
    e.preventDefault();
    handleRoster(rosterForm);
    return false;
  };

  rosterForm.addEventListener('submit', submitRosterForm);

  const addForm = document.querySelector('#addMonForm');

  const submitAddForm = (e) => {
    e.preventDefault();
    addMonToRoster();
    return false;
  };

  addForm.addEventListener('submit', submitAddForm);
};

window.onload = init;
