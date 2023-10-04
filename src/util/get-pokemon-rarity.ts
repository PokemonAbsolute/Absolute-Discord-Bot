import MySQL from '../classes/mysql';

export const getPokemonRarity = async (
  species: string,
  forme: string | null
) => {
  if (!forme) {
    forme = '';
  }

  let MYSQL_QUERY: string = '';
  let MYSQL_PARAMS: string[] = [];

  if (forme == '') {
    MYSQL_QUERY =
      "SELECT COUNT(`ID`) as TOTAL,SUM(`Type` = 'Normal') as NORMAL, SUM(`Type` = 'Shiny') as SHINY FROM `pokemon` WHERE UPPER(`Name`) = UPPER(?) LIMIT 1";
    MYSQL_PARAMS = [species];
  } else {
    MYSQL_QUERY =
      "SELECT COUNT(`ID`) as TOTAL,SUM(`Type` = 'Normal') as NORMAL, SUM(`Type` = 'Shiny') as SHINY FROM `pokemon` WHERE UPPER(`Name`) = UPPER(?) AND UPPER(`Forme`) = UPPER(?) LIMIT 1";
    MYSQL_PARAMS = [species, forme];
  }

  let POKEMON_RARITY: any[] | undefined;
  try {
    POKEMON_RARITY = await MySQL.doQuery(MYSQL_QUERY, MYSQL_PARAMS);
  } catch (err) {
    console.log(
      '[Absolute / Discord Bot | getPokemonRarity] Unable to process SQL query:',
      MYSQL_QUERY,
      [species, forme],
      err
    );
  }

  return POKEMON_RARITY;
};
