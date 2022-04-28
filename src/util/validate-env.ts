export const VALIDATE_ENV = (): boolean => {
  if (!process.env.DISCORD_BOT_TOKEN) {
    console.warn('Missing Discord Bot Token');
    return false;
  }

  return true;
};
