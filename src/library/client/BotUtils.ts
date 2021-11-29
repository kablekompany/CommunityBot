import {
  GuildMember,
  GuildChannel,
  PermissionResolvable,
  User,
  Message,
  TextChannel,
  Snowflake,
} from 'discord.js';
import { colours } from '../assets/colours';
import { config } from '#dmc/config';
import fetch from 'node-fetch';

export namespace BotUtils {
  /**
   * Asserts a class constructor as an instantiable function regardless of it's abstract status.
   * @template T - The type to assert.
   */
  export type Constructor<T> = T extends new (...args: infer A) => T
    ? new (...args: A) => T
    : never;

  /**
   * Represents the options to haste.
   */
  export interface HasteOptions {
    ext?: string;
    input: string;
  }
}

export class BotUtils {
  /**
   * Check if the member has the permissions in the channel.
   * @param member - The member to be checked.
   * @param channel - The guild channel to check for.
   * @param perms - Array of permission bits or strings.
   */
  checkUserPerms = (
    member: GuildMember,
    channel: GuildChannel,
    perms: PermissionResolvable,
  ): boolean => {
    return member.permissionsIn(channel).has(perms);
  };

  /**
   * Check if the member's highest role is higher than the target's highest role.
   * @param member - The context member for.
   * @param target - The user to compare with.
   */
  checkHierarchy = (member: GuildMember, target: GuildMember): boolean => {
    return member.roles.highest.position > target.roles.highest.position;
  };

  /**
   * Check whether the author is the context guild owner.
   * @param msg - The context message.
   */
  isGuildOwner = (msg: Message): boolean =>
    msg.guild!.ownerId === msg.author.id;

  /**
   * Check whether the user is one of the bot owners.
   * @param user - The user to check for.
   */
  isBotOwner = (user: User): boolean => config.owners.includes(user.id);

  /**
   * Parse a date object to a readable date.
   * @param date - A date instance.
   */
  parseDate = (date = new Date()): string =>
    date.toLocaleString('utc', {
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      month: 'long',
    });

  /**
   * Parse the time to short readable ones.
   * @param time - The time in seconds.
   */
  parseTime = (time: number): string => {
    const methods = [
      { name: 'd', count: 86400 },
      { name: 'h', count: 3600 },
      { name: 'm', count: 60 },
      { name: 's', count: 1 },
    ];

    const timeStr = [
      Math.floor(time / methods[0].count).toString() + methods[0].name,
    ];
    for (let i = 0; i < 3; i++) {
      timeStr.push(
        Math.floor(
          (time % methods[i].count) / methods[i + 1].count,
        ).toString() + methods[i + 1].name,
      );
    }

    return timeStr.filter((t) => !t.startsWith('0')).join(' ');
  };

  /**
   * Hastes something.
   * @param content - The content to haste.
   * @param opts - The options to haste something.
   */
  haste = async (content: string, opts: BotUtils.HasteOptions) => {
    const body = new URLSearchParams({
      raw: 'false',
      ext: opts.ext ?? 'javascript',
      text: encodeURIComponent(
        (opts.input ? `${opts.input}\n\n` : '') + content,
      ),
    });

    const res = await fetch('https://hastepaste.com/api/create', {
      method: 'POST',
      body: body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return res.text();
  };

  /**
   * Random item from the array
   * @template T - The array's type.
   * @param array - The array to get the random item from.
   */
  randomItem = <T>(array: T[]): T =>
    array[Math.floor(Math.random() * array.length)];

  /**
   * Generate a random color from daunt's epic color list.
   */
  randomColour = (): number =>
    Number(this.randomItem(colours).replace('#', '0x'));

  /**
   * Daunt's pretty date parser.
   */
  prettyDate = (): string => {
    const date = new Date(Date.now() - 1.44e7); // UTC to UTC -4
    const times = [date.getHours(), date.getMinutes(), date.getSeconds()];

    return `${times
      .map((t) => t.toString().padStart(2, '0'))
      .join(':')} — ${date.toLocaleDateString()}`;
  };

  /**
   * Pages the contents in data.
   * @template T - The data type.
   * @param data - The values to paginate.
   * @param size - The number of items per page.
   */
  paginate = <T>(data: T[], size?: number): T[][] => {
    const pages: T[][] = [];

    for (let i = 0, j = 0; i < Math.ceil(data.length / (size || 5)); i++) {
      pages.push(data.slice(j, j + (size || 5)));
      j += size || 5;
    }

    return pages;
  };

  /**
   * Mute a member from DMC.
   * @param msg - The message context.
   * @param duration - The duration of the mute.
   */
  muteMember = async (
    msg: Message,
    duration = 1.2e6 /* 20min */,
  ): Promise<void> => {
    await msg.member?.roles.add(config.dmc.mutedRole);
    await this.sleep(duration);
    await msg.member?.roles.remove(config.dmc.mutedRole);
  };

  /**
   * Remove duplicates from an array.
   * @template T - The array's type.
   * @param array - The array to remove the dupes from.
   */
  removeDuplicates = <T>(array: T[]): T[] =>
    Array.from(new Set(array).values());

  /**
   * Convert timestamps to Discord's in-built relative time format.
   */
  relativeTime = (date = Date.now()): string =>
    `<t:${Math.round(date / 1000)}:R>`;

  /**
   * Timeout for a certain period of time in ms.
   * @param ms - The tiemout in ms format.
   */
  sleep = (ms: number): Promise<void> =>
    new Promise((res) => setTimeout(res, ms));

  /**
   * Log a certain message to some specific log channel.
   * @param msg - The context message.
   * @param channel - The channel id to log into.
   */
  logMsg = (msg: Message, channel: Snowflake): Promise<Message> => {
    const logs = msg.client.channels.resolve(channel);
    const description: string[] = [];

    if (msg.content) description.push(`**Content:**\n${msg.content}`);
    if (msg.attachments.size > 0) {
      description.push(
        `**Attachments:**${msg.attachments
          .map((attachment, i) => {
            return `[\`Attachment - ${i}\`](${attachment.url})`;
          })
          .join('\n')}`,
      );
    }

    return (logs as TextChannel).send({
      embeds: [
        {
          description: description.join('\n\n'),
          title: `Recieved DM from ${msg.author.tag}`,
          footer: { text: msg.author.id },
          color: 0x039be5,
        },
      ],
    });
  };
}
