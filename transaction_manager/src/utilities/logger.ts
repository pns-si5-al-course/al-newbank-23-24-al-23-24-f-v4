const chalk = require('chalk');
chalk.level = 3;

class Logger {
    log: CallableFunction;
    error: CallableFunction;
    public static log(message?: any, color: string = 'blue'): void {
        console.log(chalk[color](message));
    }

    public static error(message?: any, color: string = 'bgBlue'): void {
        console.error(chalk[color](message));
    }
}


export default Logger;


