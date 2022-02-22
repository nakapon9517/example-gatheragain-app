import { User } from 'firebase/auth';
import { Adapter, ConsoleAdapter, FirebaseAdapter } from './adapters';

class Logger {
  adapters: Adapter[];
  currentScreen: string;

  constructor(adapters: Adapter[]) {
    this.adapters = adapters;
    this.currentScreen = 'Launch';
  }

  set(user?: User) {
    Promise.all(this.adapters.map((adapter) => adapter.set(user)));
  }

  screen(name: string) {
    Promise.all(this.adapters.map((adapter) => adapter.screen(name)));
  }

  action(name: string, id?: string) {
    Promise.all(this.adapters.map((adapter) => adapter.action(name, id)));
  }

  error(error: Error) {
    Promise.all(this.adapters.map((adapter) => adapter.error(error)));
  }
}

const logger = new Logger([new ConsoleAdapter(), new FirebaseAdapter()]);

export { logger };
