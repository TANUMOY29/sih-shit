const express = require('express');
const router = express.Router();
const axios = require('axios'); // or fetch

// POST /api/translate
router.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ msg: 'Text and targetLang are required' });
  }

  try {
    // Example: using OpenAI API for translation
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Translate text to ${targetLang} in a concise way.`
          },
          { role: 'user', content: text }
        ]
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const translatedText = response.data.choices[0].message.content.trim();
    res.json({ translatedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Translation failed', error: err.message });
  }
});

module.exports = router;
