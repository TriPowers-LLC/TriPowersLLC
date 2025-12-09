// jobs_react/src/lib/appwriteClient.js
import { Client, TablesDB } from 'appwrite';

// Use your Appwrite Cloud endpoint & project ID (no API key in frontend)
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT?.trim() ?? 'https://sfo.cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID?.trim() ?? '6931e19600334b1440fa';

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const tablesDB = new TablesDB(client);
