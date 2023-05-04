# Whattabot

Whattabot is a discord bot programmed using Node and discord.js

Specifically made for facilitating weekly discussion in our game design discord, it creates a topic of the week every Sunday (by default, configurable) and takes in new topics from users.

## Development and Deployment

Make sure to install all required dependencies, and initialize the database with Prisma (npx prisma db push). Then make sure to fill in the .env template with the Discord bot token and the other fields.