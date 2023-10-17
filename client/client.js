/* eslint-env browser */

let rosterStr = '';
let rosterId = '';

const handleResponse = async (response, parseResponse, handlers) => {
  /*
  switch(response.status) {
    case 200: //success
      rosterResponse.innerHTML = `<b>Success</b>`;
      break;
    case 201: //created
      rosterResponse.innerHTML = '<b>Created</b>';
      break;
    case 204: //updated (no response back from server)
      rosterResponse.innerHTML = '<b>Updated</b>';
      return; // won't hit the parse
    case 400: //bad request
      rosterResponse.innerHTML = `<b>Bad Request</b>`;
      break;
    case 404: //not found
      rosterResponse.innerHTML = `<b>Not Found</b>`;
      break;
    case 500: //uh oh
      rosterResponse.innerHTML = `<b>Internal Server Error</b>`;
      break;
    default: //any other status code
      rosterResponse.innerHTML = `Error code not implemented by client.`;
      break;
  }
  */

  if (parseResponse) {
    let obj = {};
    if (response.status === 204) {
      obj.message = 'Success - Updated';
    } else {
      obj = await response.json();
    }

    console.log(obj);

    handlers.forEach((handler) => {
      handler.function(obj, handler.data, response);
    });
  } else {
    handlers.forEach((handler) => {
      handler.function(response, handler.data);
    });
  }
};

const sendFetch = async (action, handlers, shouldParse = true, type = 'application/json') => {
  const response = await fetch(action, {
    method: 'get',
    headers: {
      Accept: type,
    },
  });

  handleResponse(response, shouldParse, handlers);
};

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
const updateTextFromJSON = (obj, id) => {
  updateText(obj.message, id);
};

const removeMon = (monElement) => {

};

const removeMonHandler = (obj, monElement) => {
  removeMon(monElement);
};

const removeMonFromRoster = (mon, monElement) => {
  sendPost('removeMon', `?mon=${mon}&id=${rosterId}`, [{
    function: removeMonHandler,
    data: monElement,
  }]);
};

const addMon = (mon, divId) => {
  const monElement = document.createElement('div');
  monElement.setAttribute('class', 'mon');

  const monHeader = document.createElement('h3');
  monHeader.setAttribute('class', 'monHeader');
  monHeader.innerHTML = mon;

  const monArt = document.createElement('image');
  monArt.setAttribute('src', `getArt?mon=${mon}`);
  monArt.setAttribute('alt', `Art of ${mon}`);

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

const addMonHandler = (obj, mon, response) => {
  if (response.status !== 204) {
    return obj;
  }

  return addMon(mon);
};

const updateRosterDisplay = (obj, id) => {
  if (obj.id) {
    return;
  }

  const roster = JSON.stringify(obj.roster);
  rosterStr = roster;
  rosterId = id;

  obj.roster.forEach((mon) => {
    addMon(mon, 'rosterDisplay');
  });
};

const handleRoster = (rosterForm) => {
  const select = rosterForm.querySelector('select');
  const action = select.options[select.selectedIndex].getAttribute('action');
  const method = select.options[select.selectedIndex].getAttribute('method');

  const id = document.getElementById('idField').value;

  // console.log(`action: ${action}, method: ${method}`);
  if (method === 'get') {
    sendFetch(`${action}?id=${id}`, [{
      function: updateTextFromJSON,
      data: 'rosterResponse',
    }, {
      function: updateRosterDisplay,
      data: id,
    }]);
  } else {
    sendPost(action, `id=${id}&roster=${rosterStr}`, [{
      function: updateTextFromJSON,
      data: 'rosterResponse',
    }]);
  }
};

const addMonToRoster = () => {
  const mon = document.getElementById('monInput').value;
  sendPost('addMon', `?d=${rosterId}&mon=${mon}`, [{
    function: addMonHandler,
    data: mon,
  }, {
    function: updateTextFromJSON,
    data: 'addResponse',
  }]);
};

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
