const chalk = require('chalk');


class Logger {
    log: CallableFunction;
    error: CallableFunction;
    public static log(message: string, color: string = 'blue'): void {
        console.log(chalk[color](message));
    }

    public static error(message: string, color: string = 'bgBlue'): void {
        console.error(chalk[color](message));
    }
}


export default Logger;


