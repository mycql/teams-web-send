export type MessageSender = (
  webhookUrl: string,
  message: string
) => Promise<void>;

function isIE(): boolean {
  const ua: string = window.navigator.userAgent;
  const msie: number = ua.indexOf('MSIE ');
  const trident: number = ua.indexOf('Trident');
  const edge: number = ua.indexOf('Edge');
  return msie > 0 || trident > 0 || edge > 0;
}

function prepareMessage(message: string): string {
  return message.substring(0, message.lastIndexOf('}')).concat(',"trash": "');
}

export function bootstrap(host?: HTMLElement): MessageSender {
  const targetHost: HTMLElement = host || document.body;
  const isIEBrowser: boolean = isIE();
  const sendForm: HTMLFormElement = document.createElement('form');
  sendForm.style.display = 'none';
  sendForm.className = 'mstws-send-form';
  sendForm.method = 'POST';
  sendForm.enctype = 'text/plain';
  sendForm.target = 'mstws-send-frame';
  const sendInput: HTMLInputElement = document.createElement('input');
  sendInput.type = 'text';
  sendInput.value = '"}';
  const sendFrame: HTMLIFrameElement = document.createElement('iframe');
  sendFrame.tabIndex = -1;
  sendFrame.name = 'mstws-send-frame';
  let resolveResult: (() => void) | null;
  sendFrame.addEventListener('load', () => {
    if (!resolveResult) {
      return;
    }
    resolveResult();
    // cleanup references
    resolveResult = null;
  });
  sendForm.appendChild(sendInput);
  sendForm.appendChild(sendFrame);
  targetHost.appendChild(sendForm);

  return (webhookUrl, message: string): Promise<void> => {
    return new Promise(
      (resolve: () => void, reject: (reason?: any) => void) => {
        try {
          sendForm.action = webhookUrl;
          let postData: string = prepareMessage(message);
          if (isIEBrowser) {
            postData = postData
              .replace(/'/g, `\\'`)
              .replace(/"/g, `'`)
              .replace(/\s\s+/g, '');
            sendInput.value = `'}`;
          }
          sendInput.name = postData;
          sendForm.submit();
        } catch (e) {
          console.error(e);
          reject(new Error('Incorrectly formatted message.'));
        }
        resolveResult = resolve;
      }
    );
  };
}
