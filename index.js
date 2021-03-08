const { token, prefix, MONGODB } = require("./config.json")
const { config } = require("dotenv");
const mongoose = require('mongoose')
const discord = require("discord.js")
const client = new discord.Client({
  disableEveryone: true
});

client.commands = new discord.Collection();
client.aliases = new discord.Collection();




["command"].forEach(handler => { 
  require(`./handlers/${handler}`)(client)
})

mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(`Connected To Mongo DB!`)
}).catch((err) => {
    console.log(err)
})



client.on("ready", () => { //When bot is ready
  console.log(`Logged in as ${client.user.tag}`)
  client.user.setActivity(`Made By Awoken and MTGSquad`)
})

client.on("message", async message => {
  
if(message.author.bot) return;
  if(!message.guild) return;
  if(!message.content.startsWith(prefix)) return;
  
     if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // If a command is finally found, run the command
    if (command) 
        command.run(client, message, args);

 
 })

client.login(token)