import { User } from 'firebase/auth';
import { Adapter } from './';
import { logger } from 'react-native-logs';

const log = logger.createLogger({
  severity: __DEV__ ? 'debug' : 'error',
});

class ConsoleAdapter implements Adapter {
  set(user?: User) {
    log.info(`👨🏻 ${user?.uid}`);
  }

  screen(name: string) {
    log.info(`🖥  ${name}`);
  }

  action(name: string, id?: string) {
    if (id) {
      log.info(`👈🏻 ${name} - ${id}`);
    } else {
      log.info(`👈🏻 ${name}`);
    }
  }

  error(error: Error) {
    log.error(`❌ ${error.name} - ${error.message}`);
  }
}

export { ConsoleAdapter };
