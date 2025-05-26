/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { config, database, up } from 'migrate-mongo'

@Injectable()
export class DbMigrationService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    const dbMigrationConfig: Partial<config.Config> = {
      mongodb: {
        databaseName: this.configService.getOrThrow('DB_NAME'),
        url: this.configService.getOrThrow('MONGODB_URL'),
      },
      migrationsDir: `${__dirname}/../../migrations`,
      changelogCollectionName: 'changelog',
      migrationFileExtension: '.js',
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    config.set(dbMigrationConfig);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const { db, client } = await database.connect();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await up(db, client)
  }
}
