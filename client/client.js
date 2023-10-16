let rosterStr = "";

const handleResponse = async (id, response, parseResponse, handlers) => {
  const rosterResponse = document.getElementById(id);

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

  if (parseResponse) {
    let obj = await response.json();
    console.log(obj);

    if(obj.message) {
      rosterResponse.innerHTML += `<p>Message: ${obj.message}</p>`;
    }

    if (obj.roster) {
      let roster = '';
      if (obj.roster === 'empty') {
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
  }
  else {
    for (handler of handlers) {
      handler.function(response, handler.data);
    }
  }
};

const updateText = (response, id) => {

}

const sendFetch = async (action, handlers) => {
  let response = await fetch(action, {
    method: 'get',
    headers: {
    'Accept': 'application/json',
    }
  });

  handleResponse('rosterResponse', response, true, handlers);
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

  handleResponse('rosterResponse', response, true, handlers);
};

const handleRoster = (rosterForm) => {
  const select = rosterForm.querySelector('select');
  const action = select.options[select.selectedIndex].getAttribute('action');
  const method = select.options[select.selectedIndex].getAttribute('method');

  //console.log(`action: ${action}, method: ${method}`);
  if (method === 'get') sendFetch(action + `?id=${document.getElementById('idField').value}`, {});
  else sendPost(action, `id=${document.getElementById('idField').value}&roster=${rosterStr}`, {});
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