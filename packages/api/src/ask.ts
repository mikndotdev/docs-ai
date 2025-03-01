import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const model = google('gemini-2.0-flash-lite-preview-02-05');

export async function ask(url: string, question: string) {
  const documentation = await fetch(url).then((res) => res.text());

  const prompt = `
  You are an AI assistant answering users questions about a certain product, based on documentation.

  The documentation is as follows:
  ${documentation}
  
  Here is the users question:
  ${question}

Give a helpful answer to the users question, through reading the documentation. If there doesn't seem to be any useful information in the documentation, apologise and DO NOT try to generate your own solution to the problem. You may also provide links to documentation in your responses, but try to explain a solution in your own words if possible.`;

  const response = await generateText({ model, prompt });

  return response.text
}
