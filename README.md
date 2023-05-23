# Bard <img src="https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg" width="35px" />

Reverse engineering of Google's Bard chatbot API translated from https://github.com/acheong08/Bard


## Get auth tokens from Google
Go to https://bard.google.com/


### Open Dev tools
- Session
```
Go to Application → Cookies → `__Secure-1PSID`. Copy the value of that cookie.
```

- SNlM0e
```
console.log(WIZ_global_data.SNlM0e);
```
<hr>

## Usage


```
npm install bardtalk
```


Once the library is installed, you can create a new Chatbot object by passing in your Google Bard session ID. 
```js
let SESSION_ID = process.env['__Secure-1PSID'];
let SNlM0e = process.env['SNlM0e']
let chatbot = new Chatbot(SESSION_ID, SNlM0e);
```

You can then ask the chatbot questions by calling the ask() method. 
```js
let response = await chatbot.ask("What is the capital of France?");
console.log(response.content); // "Paris"
```

The ask() method will return a promise that resolves to a response object. The response object will have the following properties:
```
content: The text of the chatbot's response.
conversation_id: The ID of the current conversation.
response_id: The ID of the current response.
factualityQueries: A list of factuality queries that were used to generate the response.
textQuery: The text query that was used to generate the response.
choices: A list of possible choices that the user could have made.
```


## Notes
https://kovatch.medium.com/deciphering-google-batchexecute-74991e4e446c
