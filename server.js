import express from 'express';
import { Anthropic } from '@anthropic-ai/sdk';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/anthropic', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: message,
                },
            ],
        });
        res.json({ response: response.content[0].text });
    } catch (error) {
        console.error('Anthropic API error:', error);
        res.status(500).json({ error: 'Failed to get response from Anthropic' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});