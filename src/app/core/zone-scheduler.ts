import { Subscription } from 'rxjs/Subscription';
import { queue } from 'rxjs/scheduler/queue';

export class ZoneScheduler {

    // TODO: Correctly add ambient zone typings instead of using any.
    constructor(public zone: any) {}

    schedule(...args: any[]): Subscription {
      return <Subscription>this.zone.run(() => queue.schedule.apply(queue, args));
    }
  }
