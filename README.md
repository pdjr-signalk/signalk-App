# signalk-libapp

Library implementing the ```App``` class, a container for Signal K API
functions which have been proposed but not yet implemented.
Useful for getting ahead of the curve!

## Installation
```
$> npm install https://github.com/pdjr-signalk/signalk-libapp.git
```

## Use
```
// Load the library class
const App = require('signalk-libapp/App.js');
…
// Create an instance of App (put it in a variable if you like)
plugin.App = new App(app, plugin.id);
…
// Use a library function 
plugin.App.notify(path, value, plugin.id);
```

## Author

Paul Reeve <*preeve_at_pdjr_dot_eu*>

