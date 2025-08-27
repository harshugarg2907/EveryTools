
'use server';

/**
 * @fileOverview An agent for extracting text from PDF files.
 *
 * - pdfToWord - A function that handles the PDF text extraction process.
 * - PdfToWordInput - The input type for the pdfToWord function.
 * - PdfToWordOutput - The return type for the pdfToWord function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfToWordInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
});
export type PdfToWordInput = z.infer<typeof PdfToWordInputSchema>;

const PdfToWordOutputSchema = z.object({
  textContent: z.string().describe('The extracted text content from the PDF.'),
});
export type PdfToWordOutput = z.infer<typeof PdfToWordOutputSchema>;


export async function pdfToWord(input: PdfToWordInput): Promise<PdfToWordOutput> {
  return pdfToWordFlow(input);
}

const prompt = ai.definePrompt({
    name: 'pdfToTextPrompt',
    input: { schema: PdfToWordInputSchema },
    output: { schema: PdfToWordOutputSchema },
    prompt: `You are an expert at extracting plain text from documents.

    Extract all the text content from the following PDF file.
    
    PDF File: {{media url=pdfDataUri}}`,
});


const pdfToWordFlow = ai.defineFlow(
  {
    name: 'pdfToWordFlow',
    inputSchema: PdfToWordInputSchema,
    outputSchema: PdfToWordOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
