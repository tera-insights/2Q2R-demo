describe('Registration', function() {
    browser.get('http://localhost:3030');
    it('can pass registration page', function() {
        // Note: 2Q2R accepts symbols as usernames, but does not process it correctly. Consider using pregenerated random strings to test this kind of behavior.
        element(by.model('username')).sendKeys('test user');
        // Note: 2Q2R accepts anything as password, so like username maybe try pregenerating random strings (or make a variety of cases) to test behavior.
        var password = '8VB%ho!6'
        element(by.model('password')).sendKeys(password);
        element(by.model('passwordRetype')).sendKeys(password);

        // click sign in button
        element(by.linkText('SIGN UP')).click();
        
        // checks that initial registration is successful
        expect(element.all(by.id('toast-container')).count()).toEqual(0);
    });
});