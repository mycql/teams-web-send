# TWS
## **T**eams **W**eb **S**end

### What is it?

One of Microsoft Teams' feature is allowing third parties to send external request to MS Teams using [incoming webhooks](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).

This is actually very straightforward when doing it from a machine, you can even do it via [curl](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using#post-a-message-to-the-webhook-using-curl).

Well you might say, *'It's just a webhook, I can do it from the browser using XHR or fetch!'* Well, you can't. Simple reason: [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

By using this library, you can send messages directly to a MS Teams webhook from your webapps directly from the browser, no servers involved! Use it to alert and page to your MS Teams channel from your production app, serverless!


### How do I use it?

#### 1 - Set up a custom incoming webhook

1. In Microsoft Teams, choose More options (⋯) next to the channel name and then choose Connectors.
2. Scroll through the list of Connectors to Incoming Webhook, and choose Add.
3. Enter a name for the webhook, upload an image to associate with data from the webhook, and choose Create.
4. Copy the webhook to the clipboard and save it. You'll need the webhook URL for sending information to Microsoft Teams.
Choose Done.

#### 2 - Use the library

* Inside a module bundler
```shell
npm install teams-web-send
```
```javascript
import { bootstrap } from 'teams-web-send';
const sendMessage = bootstrap();
const message = `{"text": "Hello World"}`;
sendMessage('http://your.msteams.webhook.url', message);
```

* Directly off the browser as a UMD
```html
<script src="https://unpkg.com/teams-web-send@0.1.1/dist/tws.umd.production.min.js"></script>
<script>
(() => {
	const sendMessage = window.tws.bootstrap();
	const message = `{"text": "Hello World"}`;
	sendMessage('http://your.msteams.webhook.url', message).then(() => {
		console.info('Message sent!')
	});
})();
</script>
```

The **message** argument should be a JSON string conforming to any of the [Office 365 Connector Card](https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-reference#office-365-connector-card) schema.

As shown by the code snippet above, **bootstrap** creates a function that actually does the message sending. Do note the **sendMessage** function always resolves to a successful Promise as long as it reaches the webhook endpoint. It cannot, however, provide the response status or body of the actual webhook from Microsoft. So always test your message payloads first.

### License
[MIT](./LICENSE)
