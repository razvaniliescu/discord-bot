const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const huggingFaceApiKey = process.env.HUGGING_FACE_KEY;

module.exports = {
    cooldown: 5,
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Get a response from the chatbot.')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('The message to send to the chatbot')
                .setRequired(true)),
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        await interaction.deferReply();

        try {
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
                { inputs: prompt },
                {
                    headers: {
                        'Authorization': `Bearer ${huggingFaceApiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        
            console.log('API Response:', JSON.stringify(response.data, null, 2));
        
            const chatbotResponse = response.data.generated_text || 
                (response.data[0]?.generated_text) || 
                "No response received. Try again.";
        
            await interaction.editReply({
                content: chatbotResponse,
            });
        } catch (error) {
            console.error('Error fetching chatbot response:', error.response?.data || error.message);
        
            await interaction.editReply({
                content: 'Sorry, there was an error getting a response from the chatbot. Please try again later.',
            });
        }
    },
};
