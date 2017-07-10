import { NgRoutingSpikePage } from './app.po';

describe('ng-routing-spike App', () => {
  let page: NgRoutingSpikePage;

  beforeEach(() => {
    page = new NgRoutingSpikePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
