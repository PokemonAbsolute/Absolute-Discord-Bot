import MySQL from '../classes/mysql';

export interface PokemonRarityData {
    Pokemon: string;
    Forme: string;
    TOTAL: number;
    NORMAL: number;
    SHINY: number;
}

export const getPokemonRarity = async (ID: string, Alt_ID: string) => {
    let MYSQL_QUERY =
        'SELECT p.`Pokemon`, p.`Forme`, r.`TOTAL`, r.`NORMAL`, r.`SHINY` FROM `pokedex` ' +
        "p JOIN (SELECT COUNT(`ID`) as TOTAL, SUM(`Type` = 'Normal') as NORMAL, " +
        " SUM(`Type` = 'Shiny') as SHINY FROM `pokemon` WHERE `Pokedex_ID` = ? AND `Alt_ID` = ? LIMIT 1 " +
        ') r ON p.`Pokedex_ID` = ? AND p.`Alt_ID` = ? LIMIT 1';

    let MYSQL_PARAMS = [ID, Alt_ID, ID, Alt_ID];

    let POKEMON_RARITY;
    try {
        POKEMON_RARITY = await MySQL.doQuery<PokemonRarityData>(MYSQL_QUERY, MYSQL_PARAMS);
    } catch (err) {
        console.log(
            '[Absolute / Discord Bot | getPokemonRarity] Unable to process SQL query:',
            MYSQL_QUERY,
            MYSQL_PARAMS,
            err
        );
    }

    return POKEMON_RARITY;
};
