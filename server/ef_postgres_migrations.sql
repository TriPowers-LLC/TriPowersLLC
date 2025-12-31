IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250325160847_InitialCreate')
BEGIN
    CREATE TABLE [Applicants] (
        [id] int NOT NULL IDENTITY,
        [firstName] nvarchar(max) NOT NULL,
        [lastName] nvarchar(max) NOT NULL,
        [email] nvarchar(max) NOT NULL,
        [password] nvarchar(max) NOT NULL,
        [phone] nvarchar(max) NOT NULL,
        [streetAddress] nvarchar(max) NOT NULL,
        [city] nvarchar(max) NOT NULL,
        [state] nvarchar(max) NOT NULL,
        [country] nvarchar(max) NOT NULL,
        [zipCode] nvarchar(10) NOT NULL,
        CONSTRAINT [PK_Applicants] PRIMARY KEY ([id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250325160847_InitialCreate')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250325160847_InitialCreate', N'7.0.11');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250711194218_UpdateTables')
BEGIN
    ALTER TABLE [Applicants] ADD [AppliedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250711194218_UpdateTables')
BEGIN
    ALTER TABLE [Applicants] ADD [JobId] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250711194218_UpdateTables')
BEGIN
    ALTER TABLE [Applicants] ADD [ResumeText] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250711194218_UpdateTables')
BEGIN
    CREATE TABLE [Jobs] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [PostedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Jobs] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250711194218_UpdateTables')
BEGIN
    CREATE TABLE [Users] (
        [Id] int NOT NULL IDENTITY,
        [Username] nvarchar(max) NOT NULL,
        [PasswordHash] varbinary(max) NOT NULL,
        [PasswordSalt] varbinary(max) NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250711194218_UpdateTables')
BEGIN
    CREATE INDEX [IX_Applicants_JobId] ON [Applicants] ([JobId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250711194218_UpdateTables')
BEGIN
    ALTER TABLE [Applicants] ADD CONSTRAINT [FK_Applicants_Jobs_JobId] FOREIGN KEY ([JobId]) REFERENCES [Jobs] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250711194218_UpdateTables')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250711194218_UpdateTables', N'7.0.11');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250711203847_AddUsersTable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250711203847_AddUsersTable', N'7.0.11');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250716191907_Added Columns to Job Table')
BEGIN
    ALTER TABLE [Jobs] ADD [Benefits] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250716191907_Added Columns to Job Table')
BEGIN
    ALTER TABLE [Jobs] ADD [EmploymentType] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250716191907_Added Columns to Job Table')
BEGIN
    ALTER TABLE [Jobs] ADD [Location] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250716191907_Added Columns to Job Table')
BEGIN
    ALTER TABLE [Jobs] ADD [Requirements] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250716191907_Added Columns to Job Table')
BEGIN
    ALTER TABLE [Jobs] ADD [Responsibilities] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250716191907_Added Columns to Job Table')
BEGIN
    ALTER TABLE [Jobs] ADD [Salary] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250716191907_Added Columns to Job Table')
BEGIN
    ALTER TABLE [Jobs] ADD [VendorName] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250716191907_Added Columns to Job Table')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250716191907_Added Columns to Job Table', N'7.0.11');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250717124709_Changed Salary to SalaryRangeMin and SalaryRangeMax')
BEGIN
    EXEC sp_rename N'[Jobs].[Salary]', N'SalaryRangeMin', N'COLUMN';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250717124709_Changed Salary to SalaryRangeMin and SalaryRangeMax')
BEGIN
    ALTER TABLE [Jobs] ADD [SalaryRangeMax] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250717124709_Changed Salary to SalaryRangeMin and SalaryRangeMax')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250717124709_Changed Salary to SalaryRangeMin and SalaryRangeMax', N'7.0.11');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250911213524_update_new_db_and_added_Model.JobDescriptionRequest')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250911213524_update_new_db_and_added_Model.JobDescriptionRequest', N'7.0.11');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20250917224441_InitUsers')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250917224441_InitUsers', N'7.0.11');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Jobs] ADD [Company] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Jobs] ADD [Url] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Jobs] ADD [SalaryRange] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Jobs] ADD [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Jobs] ADD [ClosingDate] datetime2 NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Jobs] ADD [Views] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Jobs] ADD [ApplicantsCount] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Jobs] ADD [CreatedAt] datetime2 NOT NULL DEFAULT (NOW());
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Jobs] ADD [UpdatedAt] datetime2 NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Applicants] ADD [ResumeUrl] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Applicants] ADD [CoverLetter] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Applicants] ADD [LinkedInProfile] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Applicants] ADD [PortfolioUrl] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    ALTER TABLE [Applicants] ADD [Message] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20251230120000_MergeJobsApiModels')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251230120000_MergeJobsApiModels', N'7.0.11');
END;
GO

COMMIT;
GO

