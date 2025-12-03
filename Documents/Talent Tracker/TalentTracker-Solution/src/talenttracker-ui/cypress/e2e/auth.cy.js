describe('Authentication Flow', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should successfully log in as a Job Seeker', () => {
        // Select role
        cy.get('select').select('seeker');

        // Enter credentials
        cy.get('input[type="text"]').type('aryan@seeker.com');
        cy.get('input[type="password"]').first().type('pass123'); // Use first() because there might be multiple password inputs in DOM (e.g. hidden ones or confirm password if on register) - though on login there is only one usually, but being safe.

        // Click login
        cy.get('button[type="submit"]').click();

        // Verify redirection to dashboard
        cy.url().should('include', '/');
        cy.contains('Welcome back, Aryan Kumar').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
        cy.get('select').select('seeker');
        cy.get('input[type="text"]').type('wrong@user.com');
        cy.get('input[type="password"]').first().type('wrongpass');
        cy.get('button[type="submit"]').click();

        cy.contains('Invalid credentials').should('be.visible');
    });

    it('should navigate to registration page', () => {
        cy.contains('Create an account').click();
        cy.url().should('include', '/register');
        cy.contains('Join Talent Tracker').should('be.visible');
    });
});

describe('Dashboard Navigation', () => {
    beforeEach(() => {
        // Programmatic login to speed up tests
        cy.visit('/login');
        cy.get('select').select('seeker');
        cy.get('input[type="text"]').type('aryan@seeker.com');
        cy.get('input[type="password"]').first().type('pass123');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/'); // Wait for login to complete
    });

    it('should display job listings', () => {
        cy.contains('Recommended Jobs').should('be.visible');
        // Check if at least one job card exists
        cy.get('.bg-white.rounded-xl').should('have.length.gt', 0);
    });
});
