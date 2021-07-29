import { ClientEvents } from 'discord.js';
import Bot from '../Client';

export type HandlerFunction<Event extends keyof ClientEvents> = (
  this: Bot,
  ...args: ClientEvents[Event]
) => Promise<void>;

export class Handler<Event extends keyof ClientEvents = never> {
  /**
   * Construct a client listener.
   */
  public constructor(
    /**
     * The function of this listener.
     */
    public fn: HandlerFunction<Event>,
    /**
     * The options of this listener.
     */
    public props: HandlerProps<Event>,
  ) {}
}

export interface HandlerProps<Event> {
  /**
   * The name of the event.
   */
  event: Event;
}
