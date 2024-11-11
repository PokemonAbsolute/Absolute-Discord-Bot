import MySQL from '../classes/mysql';

export interface PokemonRarityData {
    Name: string;
    Forme: string;
    TOTAL: number;
    NORMAL: number;
    SHINY: number;
}

export interface RarityCommandOptionData {
    name: string;
    type: number;
    value: string;
}

export const getPokemonRarity = async (ID: string, Alt_ID: string) => {
    let MYSQL_QUERY: string = '';
    let MYSQL_PARAMS: any[] = [];

    MYSQL_QUERY =
        "SELECT `Name`, `Forme`, COUNT(`ID`) as TOTAL, SUM(`Type` = 'Normal') as NORMAL, SUM(`Type` = 'Shiny') as SHINY FROM `pokemon` WHERE `Pokedex_ID` = ? AND `Alt_ID` = ? LIMIT 1";
    MYSQL_PARAMS = [ID, Alt_ID];

    let POKEMON_RARITY;
    try {
        POKEMON_RARITY = await MySQL.doQuery<PokemonRarityData>(MYSQL_QUERY, MYSQL_PARAMS);
    } catch (err) {
        console.log(
            '[Absolute / Discord Bot | getPokemonRarity] Unable to process SQL query:',
            MYSQL_QUERY,
            [ID, Alt_ID],
            err
        );
    }

    return POKEMON_RARITY;
};
