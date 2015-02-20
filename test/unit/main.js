const realAddEventListener = global.addEventListener;
const listeners = [];

global.addEventListener = function() {
    listeners.push(arguments);
    return realAddEventListener.apply(global, arguments);
};

afterEach(function() {
    let args;

    while (args = listeners.shift()) {
        global.removeEventListener.apply(global, args);
    }
});
