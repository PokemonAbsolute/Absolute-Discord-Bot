import * as mysql from 'mysql2/promise';

export default class MySQL {
  private static _instance: MySQL;
  private connection: mysql.Connection | undefined;

  public static get instance(): MySQL {
    return this._instance || (this._instance = new this());
  }

  public isConnected(): boolean {
    return this.connection !== null;
  }

  public static async doQuery(
    queryString: string,
    queryParams: any[]
  ): Promise<any[] | undefined> {
    try {
      const [rows, fields]: any = await this._instance.connection?.execute(
        queryString,
        queryParams
      );

      return rows as any[];
    } catch (error) {
      console.log(
        '[Absolute / Discord Bot | MySQL Query] An error occurred while performing a SQL query.',
        '\n[Query]:\n\t',
        queryString,
        '\n[Params]:\n\t',
        queryParams,
        '\n[Error]:\n\t',
        error
      );
    }
  }

  public async connectDatabase(): Promise<void> {
    return mysql
      .createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_GAME_DATABASE,
      })
      .then((connection): void => {
        this.connection = connection;
      })
      .catch((error): void => {
        console.error(
          '[Absolute / Discord Bot] Failed to create MySQL connection for Absolute Chat.',
          error
        );
        process.exit();
      });
  }
}
