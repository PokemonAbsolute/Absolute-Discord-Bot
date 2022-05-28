import MySQL from '../classes/mysql';

export const connectDiscordAccount = async (
  discordClientID: string,
  discordClientTag: string,
  authCode: string
): Promise<any> => {
  const CHECK_PRIOR_CONNECTION = await MySQL.doQuery(
    'SELECT `ID`, `Username` FROM `users` WHERE `Discord_UserID` = ? LIMIT 1',
    [discordClientID]
  );

  if (
    typeof CHECK_PRIOR_CONNECTION !== 'undefined' &&
    CHECK_PRIOR_CONNECTION.length > 0
  ) {
    return CHECK_PRIOR_CONNECTION[0];
  }

  const PLAYER_DATA = await MySQL.doQuery(
    'UPDATE `users` SET `Discord_UserID` = ?, `Discord_User` = ? WHERE `Auth_Code` = ? LIMIT 1',
    [discordClientID, discordClientTag, authCode]
  ).catch((err) =>
    console.log(
      '[Function | connectDiscordAccount] Error when performing SQL query',
      err
    )
  );

  if (typeof PLAYER_DATA !== 'undefined') {
    return PLAYER_DATA[0];
  }
};
