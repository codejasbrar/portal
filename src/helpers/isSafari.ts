// @ts-ignore
const isSafari = /constructor/i.test(window.HTMLElement) || ((p) => p.toString() === "[object SafariRemoteNotification]")(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
export default isSafari;