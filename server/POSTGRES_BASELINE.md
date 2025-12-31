Postgres baseline

What this is
- An idempotent SQL script that creates the current schema on PostgreSQL and inserts entries into __EFMigrationsHistory so EF Core believes historical migrations have been applied.

Files
- `server/postgres_baseline.sql` — run this against your Postgres database (RDS) to create the schema and mark the migrations.

How to apply (example)
1. Provision a Postgres RDS instance and allow your app server access.
2. Copy/paste the connection parameters somewhere secure (AWS Secrets Manager recommended).
3. From a machine that can reach the DB (or using psql locally if allowed):

   psql "host=<HOST> port=5432 dbname=<DB> user=<USER> password=<PASSWORD> sslmode=require" -f postgres_baseline.sql

4. Verify tables exist: `psql -c "\dt"` and `psql -c "select * from \"__EFMigrationsHistory\";"`
5. Update your environment (`DEFAULT_CONNECTION`) to the Postgres connection string and deploy the app.

Notes
- This baseline approach avoids translating each SQL Server migration. It is the fastest and safest path when moving an existing app to Postgres.
- If you want to preserve a SQL history for auditing, keep the existing SQL Server migrations in source control; we simply mark them applied for EF's benefit.
- After this, future EF migrations (created with the Npgsql provider) will generate Postgres DDL and can be applied normally with `dotnet ef database update`.

If you want, I can:
- Create and run this script against a new RDS instance I provision for you (requires temporary AWS access or credentials), or
- Walk you through the RDS provisioning steps and security group configuration.
