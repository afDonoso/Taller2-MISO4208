context('Register Tests', () => {

    it('makes a wrong sing up attemp', () => {
        cy.visit('https://habitica.com/static/home')

        cy.get('#usernameInput').type('yemepe').should('have.value', 'yemepe');
        cy.get('input').eq(1).should('have.attr', 'placeholder', 'Correo electrónico')
            .type('true@email.com').should('have.value', 'true@email.com');
        cy.get('input').eq(2).should('have.attr', 'placeholder', 'Contraseña')
            .type('asdfghjkl').should('have.value', 'asdfghjkl');
        cy.get('input').eq(3).should('have.attr', 'placeholder', 'Confirma contraseña')
            .type('asdfghjkl').should('have.value', 'asdfghjkl');

        cy.contains('Username already taken.').should('be.visible');
    })
});

context('Login Tests', () => {

    it('makes a wrong login attemp', () => {
        cy.visit('https://habitica.com/static/home')
        cy.get('.login-button').click();
        setTimeout(100);
        cy.get('#usernameInput').type('fake@email.com').should('have.value', 'fake@email.com');
        cy.get('#passwordInput').type('fake@email.com');

        cy.get('.btn-info[type="submit"]').click()

        cy.contains("Uh-oh - your email address / username or password is incorrect.").should('be.visible')

    })

    it('makes a right login attemp', () => {
        cy.visit('https://habitica.com/static/home')
        cy.get('.login-button').click();
        setTimeout(100);
        cy.get('#usernameInput').type('true@email.com').should('have.value', 'true@email.com');
        cy.get('#passwordInput').type('12345678');

        cy.get('.btn-info[type="submit"]').click();

        cy.contains('Tareas').should('be.visible');
    });

    it('makes a right login attemp and create a Challenge', () => {
        cy.visit('https://habitica.com/static/home')
        cy.get('.login-button').click();
        setTimeout(100);
        cy.get('#usernameInput').type('true@email.com').should('have.value', 'true@email.com');
        cy.get('#passwordInput').type('12345678');

        cy.get('.btn-info[type="submit"]').click()

        cy.contains('Desafíos').should('be.visible').click();
        cy.get('.create-challenge-button').click();
        cy.get('input[placeholder="¿Cuál es el nombre de tu Desafío?"]').type('Challenge 1');
        cy.get('input[placeholder="¿Qué tipo de etiqueta debería usarse para identificar a tu Reto?"').type('Reto 1')
            .should('have.value', 'Reto 1');
        cy.get('.summary-textarea')
            .type('Resumen 1').should('have.value', 'Resumen 1');
        cy.get('.description-textarea')
            .type('Descripcion 1').should('have.value', 'Descripcion 1');
        cy.get('select')
            .select(['00000000-0000-4000-A000-000000000000']).invoke('val');
        //cy.get('.category-select').click();
        //cy.get('.challenge-modal-cat-academics').click();
        //cy.get('.challenge-modal-cat-time_management').click();
        //cy.contains('Cerrar').click();
        cy.contains('Añadir tareas del reto').click();

    })

    it('makes a right login attemp and create a task', () => {
        cy.visit('https://habitica.com/static/home')
        cy.get('.login-button').click();
        setTimeout(100);
        cy.get('#usernameInput').type('true@email.com').should('have.value', 'true@email.com');
        cy.get('#passwordInput').type('12345678');

        cy.get('.btn-info[type="submit"]').click()

        cy.get('.habit > .tasks-list > .quick-add').type('Nuevo Hábito{Enter}');
        cy.get('.daily > .tasks-list > .quick-add').type('Nueva Tarea Diaria{Enter}')

        cy.contains('Nuevo Hábito').should('be.visible');
        cy.contains('Nueva Tarea Diaria').should('be.visible');
    });
});