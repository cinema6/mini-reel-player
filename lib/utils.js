export function noop() {}

export function allSettled(promises) {
    return new Promise(function(fulfill) {
        const result = [];
        const total = promises.length;
        let resolved = 0;

        function checkDone() {
            if (++resolved === total) {
                fulfill(result);
            }
        }

        if (total === 0) {
            return fulfill(result);
        }

        promises.forEach((promise, index) => {
            Promise.resolve(promise).then((value) => {
                result[index] = {
                    state: 'fulfilled',
                    value
                };

                checkDone();
            }, (reason) => {
                result[index] = {
                    state: 'rejected',
                    reason
                };

                checkDone();
            });
        });
    });
}

export function map(array, fn) {
    const result = [];
    const length = array.length;
    let index = 0;

    for ( ; index < length; index++) {
        result[index] = fn(array[index], index);
    }

    return result;
}
