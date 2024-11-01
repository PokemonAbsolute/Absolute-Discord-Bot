import MySQL from '../classes/mysql';

// { name: 'species', type: 3, value: '1' }
type SPECIES = {
  name: string;
  type: number;
  value: string;
};

export const getPokemonRarity = async (
  species: SPECIES,
  forme: string | null
) => {
  if (!forme) {
    forme = '';
  }

  let MYSQL_QUERY: string = '';
  let MYSQL_PARAMS: any[] = [];

  if (forme == '') {
    MYSQL_QUERY =
      "SELECT COUNT(`ID`) as TOTAL,SUM(`Type` = 'Normal') as NORMAL, SUM(`Type` = 'Shiny') as SHINY FROM `pokemon` WHERE UPPER(`Name`) = UPPER(?) LIMIT 1";
    MYSQL_PARAMS = [species.value];
  } else {
    MYSQL_QUERY =
      "SELECT COUNT(`ID`) as TOTAL,SUM(`Type` = 'Normal') as NORMAL, SUM(`Type` = 'Shiny') as SHINY FROM `pokemon` WHERE UPPER(`Name`) = UPPER(?) AND UPPER(`Forme`) = UPPER(?) LIMIT 1";
    MYSQL_PARAMS = [species.value, forme];
  }

  console.log(`[ ~ Absolute / Discord Bot] GetPokemonRarity species = '${species.value}'`);
  // console.log(`[ ~ Absolute / Discord Bot] GetPokemonRarity species = '${species.value}'`);
  // console.log(`[ ~ Absolute / Discord Bot] GetPokemonRarity(species = '${species?.value}', forme = '${forme?.value}')`);

  let POKEMON_RARITY: any[] | undefined;
  try {
    POKEMON_RARITY = await MySQL.doQuery(MYSQL_QUERY, MYSQL_PARAMS);
  } catch (err) {
    console.log(
      '[Absolute / Discord Bot | getPokemonRarity] Unable to process SQL query:',
      MYSQL_QUERY,
      [species.value, forme],
      err
    );
  }

  return POKEMON_RARITY;
};
