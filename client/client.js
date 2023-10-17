let rosterStr = "";

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
      obj.message = 'Success - Updated'
    } else {
      obj = await response.json();
    }
    
    console.log(obj);

    for (handler of handlers) {
      handler.function(obj, handler.data, response);
    }
  }
  else {
    for (handler of handlers) {
      handler.function(response, handler.data);
    }
  }
};

// requires string id of html element
const updateText = (message, id) => {
  const responseElement = document.getElementById(id);

  responseElement.innerHTML = message;
}

// requires string id of html element
const updateTextFromJSON = (obj, id) => {
  updateText(obj.message, id);
}

const updateRoster = (obj) => {
  let roster = '';
  if (!(obj.roster)) {
    rosterStr = roster;
    return;
  }

  roster = JSON.stringify(obj.roster);

  const rosterDiv = document.createElement('div');
  let htmlStr = '';
    
  for (mon of obj.roster) {
    htmlStr += `<h3>${mon}</h3>`;
  }

  document.getElementById('tempRoster').innerHTML = htmlStr;
}

const sendFetch = async (action, handlers) => {
  let response = await fetch(action, {
    method: 'get',
    headers: {
    'Accept': 'application/json',
    }
  });

  handleResponse(response, true, handlers);
};

const sendPost = async (action, body, handlers) => {
  let response = await fetch(action, {
    method: 'post',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    },
    body: body,
  });

  handleResponse(response, true, handlers);
};

const handleRoster = (rosterForm) => {
  const select = rosterForm.querySelector('select');
  const action = select.options[select.selectedIndex].getAttribute('action');
  const method = select.options[select.selectedIndex].getAttribute('method');

  //console.log(`action: ${action}, method: ${method}`);
  if (method === 'get') sendFetch(action + `?id=${document.getElementById('idField').value}`, [{
      function: updateTextFromJSON,
      data: 'rosterResponse'
    }, {
      function: updateRoster,
      data: ''
    }]);
  else sendPost(action, `id=${document.getElementById('idField').value}&roster=${rosterStr}`, [{
    function: updateTextFromJSON,
    data: 'rosterResponse'
  }]);
};

const init = () => {
  const rosterForm = document.querySelector('#rosterForm');

  const submitRosterForm = (e) => {
    e.preventDefault();
    handleRoster(rosterForm);
    return false;
  }

  rosterForm.addEventListener('submit', submitRosterForm);
};

window.onload = init;