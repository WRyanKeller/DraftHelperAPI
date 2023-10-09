const handleResponse = async (id, response, parseResponse) => {
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
      let roster = JSON.stringify(obj.roster);
      document.getElementById('tempRoster').innerHTML = `<p>${roster}</p>`;
    }
  }
};

const sendFetch = async (action) => {
  let response = await fetch(action, {
    method: 'get',
    headers: {
    'Accept': 'application/json',
    }
  });

  handleResponse('rosterResponse', response, true);
};

const sendPost = async (nameForm) => {
  const nameAction = nameForm.getAttribute('action');
  const nameMethod = nameForm.getAttribute('method');

  const nameField = nameForm.querySelector('#nameField');
  const ageField = nameForm.querySelector('#ageField');

  const formData = `name=${nameField.value}&age=${ageField.value}`;

  let response = await fetch(nameAction, {
    method: nameMethod,
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    },
    body: formData,
  });

  handleResponse(response, true);
};

const handleRoster = (rosterForm) => {
    const select = rosterForm.querySelector('select');
    const action = select.options[select.selectedIndex].getAttribute('action');
    const method = select.options[select.selectedIndex].getAttribute('method');

    //console.log(`action: ${action}, method: ${method}`);
    if (method === 'get') sendFetch(action + `?id=${document.getElementById('nameField').value}`);
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