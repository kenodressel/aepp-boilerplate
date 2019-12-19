describe('Home.vue', function () {
  it('Verifies wallet', () => {
    cy.visit('/');

    cy.get('.address', {timeout: 15000}).should('contain', 'ak_');

    cy.get('.balance').should('be.visible');

  });
  it('Verifies tailwind', () => {
    cy.get('.hidden').should('not.be.visible');
  });
  it('Verifies aepp-components', () => {
    cy.get('.ae-button').should('have.css', 'background-color').and('match', /rgb\(255, 13, 106\)/);
  });
});
