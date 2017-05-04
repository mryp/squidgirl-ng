import { SquidgirlPage } from './app.po';

describe('squidgirl App', () => {
  let page: SquidgirlPage;

  beforeEach(() => {
    page = new SquidgirlPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
