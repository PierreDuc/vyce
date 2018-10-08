import { browser, element, by } from 'protractor';

describe('Initial state', () => {
  browser.get('/');

  it('should display welcome message', () => {
    expect(element(by.css('vc-home-welcome header')).getText()).toEqual('Welcome to VYCE!');
  });

  it('should show the logo', async () => {
    // EXTRACT URL FROM url('url');
    const url = await element(by.css('vc-app-header vc-logo .vc-background-cover')).getCssValue('background-image');

    const loaded: boolean = (await browser.executeAsyncScript(function(imgUrl: string, callback: Function) {
      const img = new Image();
      img.src = imgUrl;

      callback(img.complete && img.naturalWidth > 0);
    }, url)) as boolean;

    expect(loaded).toBeTruthy();
  });

  it('should have have an "add this device" button', () => {
    expect(element(by.css('vc-stream-list .inside-wrap span')).getText()).toEqual('Add this device');
  });
});
