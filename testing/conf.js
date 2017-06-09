exports.config = { 
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub/',

    // Disable directConnect and start up selenium webdriver using 'webdriver-manager update' and 'webdriver-manager start' if testing on any browsers other than Chrome
    directConnect: true,
    
    specs: ['regSpec.js'],

    suites: {
        registration: 'regSpec.js'
    },
    
    jasmineNodeOpts: {
        showColors: true
    }
}