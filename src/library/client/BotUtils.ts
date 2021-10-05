import type {
  GuildMember,
  GuildChannel,
  PermissionResolvable,
  User,
  Message,
  TextChannel,
  Snowflake,
} from 'discord.js';
import type { CommunityBot } from '#dmc/client';
import { colours } from '#dmc/assets';

export class BotUtil {
  /**
   * Construct this bot utility.
   * @param bot - The community bot instance
   */
  public constructor(public bot: CommunityBot) {}

  /**
   * Check if the member has the permissions in the channel.
   * @param member - The member to be checked
   * @param channel - The guild channel to check for
   * @param perms - Array of permission bits or strings
   */
  checkUserPerms = (
    member: GuildMember,
    channel: GuildChannel,
    perms: PermissionResolvable,
  ) => {
    return member.permissionsIn(channel).has(perms);
  };

  /**
   * Check if the member's highest role is higher than the target's highest role.
   * @param member - The context member
   * @param target - The user to compare
   */
  checkHierarchy = (member: GuildMember, target: GuildMember) => {
    return member.roles.highest.position > target.roles.highest.position;
  };

  /**
   * Check Whether the author is the context guild owner.
   * @param msg - The discord.js message instance
   */
  isGuildOwner = (msg: Message) => msg.guild.ownerId === msg.author.id;

  /**
   * Check Whether the user is one of the bot owners.
   * @param config - The config of this bot
   * @param user - The user to be checked for
   */
  checkBotOwner = async (user: User) => {
    const app = await this.bot.application!.fetch();
    return app.owner.id === user.id;
  };

  /**
   * Parse a date object to a readable date.
   * @param date - The date instance
   */
  parseDate = (date: Date) =>
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
   * @param time - The time in seconds
   */
  parseTime = (time: number) => {
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
   * @param array - The array to get the random item from.
   */
  randomItem = <T>(array: T[]): T =>
    array[Math.floor(Math.random() * array.length)];

  /**
   * Generate a random color from daunt's epic color list.
   */
  randomColour = () => Number(this.randomItem(colours).replace('#', '0x'));

  /**
   * Joins the items of the array to newlines.
   * @param string - The string to join.
   */
  join = (string: string[]) => string.join('\n');

  /**
   * Daunt's pretty date parser making me think im from the future.
   */
  prettyDate = () => {
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
  paginate = (data: any[], separator = '\n') => {
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
   * @param msg - The message context
   */
  muteMember = async (msg: Message, duration = 1.2e6) => {
    // 20 minutes = default
    await msg.member.roles.add(this.bot.config.dmc.mutedRole as Snowflake);
    await this.sleep(duration);
    await msg.member.roles.remove(this.bot.config.dmc.mutedRole as Snowflake);
  };

  /**
   * Log a certain message to some specific log channel.
   * @param msg - The context msg
   * @param channel - The channel id to log for
   */
  logMsg = (msg: Message, channel: Snowflake) => {
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

  /**
   * Timeout for a certain amount of time.
   */
  sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
}

// Oops! - Yung Gravy