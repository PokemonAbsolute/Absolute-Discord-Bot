import MySQL from '../classes/mysql';

export const getPlayerbyAuthCode = async (authCode: string): Promise<any> => {
  const PLAYER_DATA = await MySQL.doQuery(
    'SELECT `ID`, `Username`, `Discord_UserID` FROM `users` WHERE `Auth_Code` = ?',
    [authCode]
  ).catch((err) =>
    console.log(
      '[Absolute / Discord Bot | getPlayerByAuthCode] Error when performing SQL query',
      err
    )
  );

  return PLAYER_DATA?.[0] ?? undefined;
};
