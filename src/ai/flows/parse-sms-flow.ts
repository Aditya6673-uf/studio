
'use server';
/**
 * @fileOverview An AI flow to parse transaction details from an SMS message.
 *
 * - parseSms - A function that handles parsing the SMS.
 * - ParseSmsInput - The input type for the parseSms function.
 * - ParseSmsOutput - The return type for the parseSms function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ParseSmsInputSchema = z.string();
export type ParseSmsInput = z.infer<typeof ParseSmsInputSchema>;

const ParseSmsOutputSchema = z.object({
    type: z.enum(['income', 'expense']).describe("The type of transaction. 'income' for money received, 'expense' for money spent."),
    amount: z.number().describe("The numeric amount of the transaction."),
    category: z.string().describe("A suitable category for the transaction, like 'Food', 'Shopping', 'Travel', 'Salary', or the merchant name if it's a specific store."),
    paymentMethod: z.enum(['UPI', 'Card', 'Cash']).describe("The payment method used. Infer 'Card' for debited/credited to card messages, 'UPI' for UPI messages, 'Cash' if not specified."),
    notes: z.string().optional().describe("Any additional relevant information from the SMS, like merchant name or transaction details."),
});
export type ParseSmsOutput = z.infer<typeof ParseSmsOutputSchema>;


export async function parseSms(input: ParseSmsInput): Promise<ParseSmsOutput> {
  return parseSmsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseSmsPrompt',
  input: { schema: ParseSmsInputSchema },
  output: { schema: ParseSmsOutputSchema },
  prompt: `You are an expert at parsing financial transaction SMS messages from Indian banks.
  Analyze the following SMS and extract the transaction details.

  - Determine if it is an 'income' or 'expense'.
  - Extract the exact numerical 'amount'.
  - Determine a relevant 'category'. If it's a purchase, use the merchant name (e.g., 'Zomato', 'Swiggy'). If it's a salary, use 'Salary'. For generic spends, use 'Shopping' or 'Food'.
  - Infer the 'paymentMethod'. If the SMS mentions UPI, use 'UPI'. If it mentions a Debit or Credit Card, use 'Card'. Default to 'Card' if it's ambiguous but seems like a bank transaction.
  - Add any other useful context to the 'notes' field.

  SMS to parse:
  {{{input}}}
  `,
});

const parseSmsFlow = ai.defineFlow(
  {
    name: 'parseSmsFlow',
    inputSchema: ParseSmsInputSchema,
    outputSchema: ParseSmsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("The AI model could not parse the SMS. Please try again or enter manually.");
    }
    return output;
  }
);
