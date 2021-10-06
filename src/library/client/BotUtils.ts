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
import { CommunityBot } from './CommunityBot';

export class BotUtil {
  /**
   * Construct this bot utility.
   * @param bot the community bot instance
   */
  public constructor(public bot: CommunityBot) {}

  /**
   * Check if the member has the permissions in the channel.
   * @param member the member to be checked
   * @param channel the guild channel to check for
   * @param perms array of permission bits or strings
   */
  checkUserPerms = (
    member: GuildMember,
    channel: GuildChannel,
    perms: PermissionResolvable,
  ): Boolean => {
    return member.permissionsIn(channel).has(perms);
  };

  /**
   * Check if the member's highest role is higher than the target's highest role.
   * @param member the context member
   * @param target the user to compare
   */
  checkHierarchy = (member: GuildMember, target: GuildMember): Boolean => {
    return member.roles.highest.position > target.roles.highest.position;
  };

  /**
   * Check Whether the author is the context guild owner.
   * @param msg the discord.js message instance
   */
  isGuildOwner = (msg: Message): Boolean =>
    msg.guild?.ownerId === msg.author.id;

  /**
   * Check Whether the user is one of the bot owners.
   * @param config the config of this bot
   * @param user the user to be checked for
   */
  isBotOwner = (config: CommunityBot['config'], user: User): Boolean =>
    config.owners.includes(user.id);

  /**
   * Parse a date object to a readable date.
   * @param date the date instance
   */
  parseDate = (date: Date): string =>
    date.toLocaleString('utc', {
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      month: 'long',
    });

  /**
   * Parse the time to short readables.
   * @param time the time in seconds
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
   * Random item from the array
   * @param array the array to get the random item from.
   */
  randomItem = <T>(array: T[]): T =>
    array[Math.floor(Math.random() * array.length)];

  /**
   * Generate a random color from daunt's epic color list.
   */
  randomColour = (): number =>
    Number(this.randomItem(colours).replace('#', '0x'));

  /**
   * Transform something to a codeblock.
   * @param msg could be anything
   * @param language the syntax highlighting
   */
  codeblock = (msg: any, language = ''): string =>
    `${'```'}${language}\n${msg}${'```'}`;

  /**
   * Daunt's pretty date parser making me think im from the future.
   */
  prettyDate = (): string => {
    const date = new Date(Date.now() - 1.44e7); // UTC to UTC -4
    const times = [date.getHours(), date.getMinutes(), date.getSeconds()];
    const formattedDate = `${times
      .map((t) => t.toString().padStart(2, '0'))
      .join(':')} — ${date.toLocaleDateString()}`;
    return formattedDate;
  };

  /**
   * Paginator.
   */
  paginate = (data: any[], separator = '\n'): string[] => {
    let counter = 0;
    const pages = [];
    pages[counter] = '';
    for (const parts of data) {
      if (pages[counter].length > 1900) {
        counter++;
        pages[counter] = '';
      }
      pages[counter] += parts + separator;
    }
    return pages;
  };

  /**
   * Mute a member from DMC.
   * @TODO Extend GuildMember and apply this method.
   * @param msg the message context
   */
  muteMember = async (msg: Message, duration = 1.2e6): Promise<void> => {
    // 20 minutes = default
    await msg.member?.roles.add(this.bot.config.dmc.mutedRole as Snowflake);
    await this.sleep(duration);
    await msg.member?.roles.remove(this.bot.config.dmc.mutedRole as Snowflake);
  };

  /**
   * Remove duplicates from an array.
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
   */
  sleep = (ms: number): Promise<void> =>
    new Promise((res) => setTimeout(res, ms));

  /**
   * Log a certain message to some specific log channel.
   * @param msg the context msg
   * @param channel the channel id to log for
   */
  logMsg = (msg: Message, channel: Snowflake): Promise<Message> => {
    const logs = this.bot.channels.resolve(channel);
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

// Oops! - Yung Gravy
