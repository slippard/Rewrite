const defMin = 0;
const defMax = Number.MAX_SAFE_INTEGER;

class FloatArgument {
    static args(a) {
        a.min = a.min !== undefined ? a.min : defMin;
        a.max = a.max !== undefined ? a.max : defMax;
        return a;
    }

    static parse(val, msg, arg) {
        let num = parseFloat(val);
        let valid = num >= arg.min && num <= arg.max;
        let error = isNaN(num) ? "Invalid number" : "Number out of range";

        return { valid, error, val: num };
    }

    static default () {
        return 0;
    }
}

module.exports = FloatArgument;