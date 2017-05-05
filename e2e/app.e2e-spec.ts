import { CcpdemoPage } from './app.po';

describe('ccpdemo App', function() {
  let page: CcpdemoPage;

  beforeEach(() => {
    page = new CcpdemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
