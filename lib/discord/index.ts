import { env } from "../env.mjs";

type DiscordUser = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string;
  accent_color: number;
  global_name: string;
};

type DiscordMember = {
  user: DiscordUser;
  avatar: string;
  nick: string;
  roles: string[];
  joined_at: string;
};

const DISCORD_API = "https://discord.com/api/v10";

const TOKEN_HEADER = {
  Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
};

/**
 * Get all members with a specific role
 *
 * @param roleId role Id to filter by
 * @see https://discord.com/developers/docs/resources/guild#list-guild-members
 */
export const getAllMembersWithRole = async (roleId: string) => {
  const users: DiscordMember[] = [];

  let after: string | undefined = undefined;

  while (true) {
    const url = new URL(`${DISCORD_API}/guilds/${env.DISCORD_GUILD_ID}/members`);
    url.searchParams.append("limit", "1000");
    if (after) {
      url.searchParams.append("after", after);
    }

    const response = await fetch(url, {
      headers: TOKEN_HEADER,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch members: ${response.statusText}`);
    }

    const members: DiscordMember[] = await response.json();

    if (members.length === 0) {
      break;
    }

    for (const member of members) {
      if (member.roles.includes(roleId)) {
        users.push(member);
      }
    }

    after = members[members.length - 1].user.id;

    // Check api rate limit
    const remaining = parseInt(response.headers.get("x-ratelimit-remaining") ?? "0");
    const reset = parseInt(response.headers.get("x-ratelimit-reset-after") ?? "0");

    if (remaining < 1) {
      console.log("[Discord] Rate limit reached, sleeping for", reset * 1000);
      await new Promise(resolve => setTimeout(resolve, reset * 1000));
    }
  }

  return users;
};

/**
 * Add a role to a user
 * @param userId user Id to add role to
 * @param roleId role Id to add
 * @see https://discord.com/developers/docs/resources/guild#add-guild-member-role
 */
export const addRoleToUser = async (userId: string, roleId: string) => {
  const url = new URL(`${DISCORD_API}/guilds/${env.DISCORD_GUILD_ID}/members/${userId}/roles/${roleId}`);

  const response = await fetch(url, {
    method: "PUT",
    headers: TOKEN_HEADER,
  });

  console.log("[Discord] Add role to user", userId, response.status, response.statusText);

  if (!response.ok) {
    throw new Error(`Failed to add role to user: ${response.statusText}`);
  }

  const remaining = parseInt(response.headers.get("x-ratelimit-remaining") ?? "0");
  const reset = parseInt(response.headers.get("x-ratelimit-reset-after") ?? "0");

  return { success: true, rateLimit: { remaining, reset } };
};

/**
 * Remove a role from a user
 * @param userId user Id to remove role from
 * @param roleId role Id to remove
 * @see https://discord.com/developers/docs/resources/guild#remove-guild-member-role
 */
export const removeRoleFromUser = async (userId: string, roleId: string) => {
  const url = new URL(`${DISCORD_API}/guilds/${env.DISCORD_GUILD_ID}/members/${userId}/roles/${roleId}`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: TOKEN_HEADER,
  });

  console.log("[Discord] Remove role from user", userId, response.status, response.statusText);

  if (!response.ok) {
    throw new Error(`Failed to remove role from user: ${response.statusText}`);
  }

  const remaining = parseInt(response.headers.get("x-ratelimit-remaining") ?? "0");
  const reset = parseInt(response.headers.get("x-ratelimit-reset-after") ?? "0");

  return { success: true, rateLimit: { remaining, reset } };
};
