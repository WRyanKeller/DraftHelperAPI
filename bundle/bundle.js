/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/client.js":
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
/***/ (() => {

eval("let rosterStr = \"\";\r\n\r\nconst handleResponse = async (id, response, parseResponse) => {\r\n  const rosterResponse = document.getElementById(id);\r\n\r\n  switch(response.status) {\r\n    case 200: //success\r\n      rosterResponse.innerHTML = `<b>Success</b>`;\r\n      break;\r\n    case 201: //created\r\n      rosterResponse.innerHTML = '<b>Created</b>';\r\n      break;\r\n    case 204: //updated (no response back from server)\r\n      rosterResponse.innerHTML = '<b>Updated</b>';\r\n      return; // won't hit the parse\r\n    case 400: //bad request\r\n      rosterResponse.innerHTML = `<b>Bad Request</b>`;\r\n      break;\r\n    case 404: //not found\r\n      rosterResponse.innerHTML = `<b>Not Found</b>`;\r\n      break;\r\n    default: //any other status code\r\n      rosterResponse.innerHTML = `Error code not implemented by client.`;\r\n      break;\r\n  }\r\n\r\n  if (parseResponse) {\r\n    let obj = await response.json();\r\n    console.log(obj);\r\n\r\n    if(obj.message) {\r\n      rosterResponse.innerHTML += `<p>Message: ${obj.message}</p>`;\r\n    }\r\n\r\n    if (obj.roster) {\r\n      let roster = JSON.stringify(obj.roster);\r\n      rosterStr = roster;\r\n      document.getElementById('tempRoster').innerHTML = `<p>${roster}</p>`;\r\n    }\r\n  }\r\n};\r\n\r\nconst sendFetch = async (action) => {\r\n  let response = await fetch(action, {\r\n    method: 'get',\r\n    headers: {\r\n    'Accept': 'application/json',\r\n    }\r\n  });\r\n\r\n  handleResponse('rosterResponse', response, true);\r\n};\r\n\r\nconst sendPost = async (action, body) => {\r\n  let response = await fetch(action, {\r\n    method: 'post',\r\n    headers: {\r\n    'Content-Type': 'application/x-www-form-urlencoded',\r\n    'Accept': 'application/json',\r\n    },\r\n    body: body,\r\n  });\r\n\r\n  handleResponse('rosterResponse', response, true);\r\n};\r\n\r\nconst handleRoster = (rosterForm) => {\r\n  const select = rosterForm.querySelector('select');\r\n  const action = select.options[select.selectedIndex].getAttribute('action');\r\n  const method = select.options[select.selectedIndex].getAttribute('method');\r\n\r\n  //console.log(`action: ${action}, method: ${method}`);\r\n  if (method === 'get') sendFetch(action + `?id=${document.getElementById('idField').value}`);\r\n  else sendPost(action, `id=${document.getElementById('idField').value}&roster=${rosterStr}`);\r\n};\r\n\r\nconst init = () => {\r\n  const rosterForm = document.querySelector('#rosterForm');\r\n\r\n  const submitRosterForm = (e) => {\r\n    e.preventDefault();\r\n    handleRoster(rosterForm);\r\n    return false;\r\n  }\r\n\r\n  rosterForm.addEventListener('submit', submitRosterForm);\r\n};\r\n\r\nwindow.onload = init;\n\n//# sourceURL=webpack://draft-helper-api/./client/client.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./client/client.js"]();
/******/ 	
/******/ })()
;