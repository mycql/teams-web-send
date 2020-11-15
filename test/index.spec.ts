import { bootstrap, MessageSender } from '../src';
import messageCard from '../resource/message-card.json';

function payloadMessageFromInput(input: HTMLInputElement): string {
	const payloadMessage: string = `${input.name}${input.value}`;
	const actualMessage: string = payloadMessage
		.substring(0, payloadMessage.lastIndexOf(','))
		.concat('}');
	return actualMessage;
}

function setup(host?: HTMLElement): [MessageSender, HTMLInputElement, HTMLIFrameElement, HTMLFormElement] {
	const sendMessage = bootstrap(host);
	const targetHost: HTMLElement = host || document.body;
	const form = targetHost.querySelector('form') as HTMLFormElement;
	const input = targetHost.querySelector('input') as HTMLInputElement;
	const frame = targetHost.querySelector('iframe') as HTMLIFrameElement;
	// jsdom doesn't implement submit so we just bypass here
	form.submit = () => { /* do nothing */ };
	return [sendMessage, input, frame, form];
}

function setupForSuccess(webhookUrl: string,
												 message: string,
												 done: () => void,
												 expectedMessage: () => string): void {
	const [sendMessage, input, frame] = setup();
	sendMessage(webhookUrl, message).then(() => {
		done();
	});
	const actualMessage: string = payloadMessageFromInput(input);
	expect(actualMessage).toEqual(expectedMessage());
	frame.dispatchEvent(new Event('load'));
}

describe('Setup a message publisher', () => {
	const webhookUrl: string = 'http://localhost/api/webhook';

	beforeEach(() => {
		document.body.innerHTML = '';
	});

  it('should post a message and succeed non IE', (done) => {
		const message: string = JSON.stringify(messageCard);
		setupForSuccess(webhookUrl, message, done, () => message);
	});

	it('should post a message and succeed IE', (done) => {
		const userAgent: string = 'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
		Object.defineProperty(window.navigator, 'userAgent', {
			get: () => userAgent,
		});
		const message: string = JSON.stringify(messageCard);
		setupForSuccess(webhookUrl, message, done, () => message.replace(/\"/g, `'`));
	});

	it('should post a message and fail for incorrect message', (done) => {
		const [sendMessage,,, form] = setup();
		// mock the form so that it throws an error
		form.submit = () => {
			throw new Error();
		};
		const message: string = JSON.stringify(messageCard);
		sendMessage(webhookUrl, message).catch((response: Error) => {
			expect(response.message).toEqual('Incorrectly formatted message.');
			done();
		});
	});
});
