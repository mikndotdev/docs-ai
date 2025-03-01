import { Hono } from 'hono';
import * as crypto from 'node:crypto';
import { compile } from '@mikandev/ssg-parser';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
});

const upload = async (data: string) => {
  const id = crypto.randomBytes(16).toString('hex');
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: `${process.env.S3_UPLOAD_DIRECTORY}/${id}.txt`,
    Body: data,
    ContentType: 'text/plain',
  });

  client.send(command);

  return `${process.env.S3_URL}/${command.input.Key}`;
};

const app = new Hono();

app.post('/compile', async (c) => {
  const json = await c.req.json();
  const url = json.url;

  const data = await compile(url, process.env.JINA_API_KEY || '');
  const result = await upload(data);

  return c.json({ url: result });
});

export default app;
