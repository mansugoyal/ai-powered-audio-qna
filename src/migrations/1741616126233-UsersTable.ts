import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UsersTable1741616126233 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'name', type: 'varchar', length: '255', isNullable: true },
                { name: 'email', type: 'varchar', length: '255', isNullable: true },
                { name: 'phone_number', type: 'varchar', length: '255', isNullable: true },
                { name: 'password', type: 'varchar', length: '255', isNullable: true },
                { name: 'created_at', type: 'timestamp', isNullable: true, default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', isNullable: true, default: 'CURRENT_TIMESTAMP' },
            ]
        });

        const ifExsist = await queryRunner.hasTable('users');
        if (!ifExsist) {
            await queryRunner.createTable(table);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users', true);
    }

}
