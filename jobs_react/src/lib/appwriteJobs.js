// jobs_react/src/lib/appwriteJobs.js
import { ID, Query } from 'appwrite';
import { tablesDB } from './appwriteClient';

// use your real IDs from Appwrite
const DATABASE_ID = '6931e37b000d1dc0ec63';
const JOBS_TABLE_ID = 'jobs';

export async function getJobsFromAppwrite() {
  const res = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: JOBS_TABLE_ID,
    // optional: queries: [Query.orderDesc('$createdAt')]
  });

  // rows is an array of { id, data: { title, description, ... } }
  return res.rows.map(row => ({
    id: row.id,
    title: row.data.title ?? '',
    description: row.data.description ?? '',
    salaryRange: row.data.salaryRange ?? '',
    employmentType: row.data.employmentType ?? '',
    location: row.data.location ?? '',
    company: row.data.company ?? '',
    url: row.data.url ?? ''
  }));
}
