import { genkit } from 'genkit';
import { ollama } from 'genkitx-ollama';

export const ai = genkit({
    plugins: [
        ollama({
            models: [
                { name: 'gemma3:4b' }
            ],
            serverAddress: process.env.OLLAMA_URL || 'http://localhost:11434', // Configurable via .env
        })
    ],
    model: 'ollama/gemma3:4b'
});
