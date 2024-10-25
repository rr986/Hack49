import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Main function to check drug interactions
export const checkDrugInteractions = functions.https.onRequest(async (req, res) => {
  const { drugs } = req.body;
  console.log(`Received request to check interactions for drugs: ${JSON.stringify(drugs)}`);

  if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
    console.warn('Insufficient number of drugs provided for interaction check.');
    return res.status(400).send({
      hasInteraction: false,
      message: 'At least two drugs are required for interaction check.',
    });
  }

  try {
    const prompt = `Please check for potential interactions between the following drugs: ${drugs.join(', ')}.`;

    // Call OpenAI API for interaction analysis
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const resultMessage = response.choices[0].message.content.trim();

    // Assuming OpenAI provides details, parse for interaction details
    const hasInteraction = resultMessage.includes('interaction');
    const interactions = hasInteraction ? [{ description: resultMessage }] : [];

    return res.status(200).send({
      hasInteraction,
      message: hasInteraction ? 'Interactions found.' : 'No interactions found.',
      interactions,
    });
  } catch (error) {
    console.error('Error fetching drug interaction data:', error);
    return res.status(500).send({
      hasInteraction: false,
      message: 'Error checking drug interactions. Please try again later.',
    });
  }
});