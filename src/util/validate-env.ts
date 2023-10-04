export const VALIDATE_ENV = (): boolean => {
  if (
    !process.env.DISCORD_BOT_TOKEN ||
    typeof process.env.DISCORD_BOT_TOKEN != 'string'
  ) {
    console.warn('Missing or malformed Discord Bot Token');
    return false;
  }

  if (!process.env.CLIENT_ID || typeof process.env.CLIENT_ID != 'string') {
    console.warn('Missing or malformed application client ID');
    return false;
  }

  if (!process.env.GUILD_ID || typeof process.env.GUILD_ID != 'string') {
    console.warn('Missing or malformed server ID');
    return false;
  }

  return true;
};
