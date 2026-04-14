1  import { googleAI } from '@google-cloud/googleAI';
2  
3  // Initialize Vertex with your Cloud Org Project ID
4  const project = process.env.GCP_PROJECT_ID;
5  const location = 'us-central1';
6  
7  const vertex_ai = new googleAI({project: project, location: location});
8  const model = 'gemini-1.5-pro-002'; 
9  
10 export const generativeModel = vertex_ai.getGenerativeModel({
11   model: model,
12   generationConfig: {
13     maxOutputTokens: 8192,
14     temperature: 0.2, // Low temp for ArithmaGen precision
15   },
16 });