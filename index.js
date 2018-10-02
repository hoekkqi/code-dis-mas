// Made my code#3621
// Github Repo: https://github.com/codepupper/discord-mastodon-bridge
// Mastodon https://pounced-on.me/@code
// Website https://e-six-two.one

const Mastodon = require('mastodon-api');
const Discord = require('discord.js');
const {prefix, dtoken, mtoken, key, secret, instanceURL, ID} = require('./config.json');
const D = new Discord.Client();
const M = new Mastodon({
    client_key: key,
    client_secret: secret,
    access_token: mtoken,
    timeout_ms: 60 * 1000,
    api_url: instanceURL + '/api/v1/'
})


D.on('ready', () => {
    console.log('Connected to Discord');
    D.user.setActivity('Mastodon | ' + prefix + 'stat', 'WATCHING');
})



D.on('message', async mas =>{
    
    if(mas.author.bot) return;
    if(mas.content.indexOf(prefix) !== 0) return;
    
    const words = mas.content.slice(prefix.length).trim().split(/ +/g);
    const target = words.shift().toLowerCase();
    
    if(target === 'stat' || target === 'status'){
        let status = words.join(' ');
        let params = {
            status: status
        }
    
        
        M.post('statuses', params, (error, data) => {
            if (error){
                console.log(error)
                mas.channel.send("```js\n" + error + "```")
            } else {
                console.log(data)
                mas.channel.send(`Status update sent.\n<${data.uri}>`)
            }
        });


    }



    if(target === 'ev' || target === 'eval'){
        if(mas.author.id !== ID) return mas.channel.send("`You're not my Developer!`");
        // ? Easy
        const pu = mas.channel
        let command = mas.content.slice(prefix.length);
        let split = command.split(" ");
        command = split[0];
        split.shift();
        let code = split.join(" ");
        try {
          let ev = require('util').inspect(eval(code));
        if (ev.length > 1950) {
          ev = ev.substr(0, 1950);
        }
        embed = new Discord.RichEmbed();
        let token = dtoken.replace(/\./g, "\.")
        let tooken = new RegExp(token, 'g')
        ev = ev.replace(tooken, `haha yes`);
            embed.addField("Input", "```js\n" + code + "```")
            .addField("Eval", "```js\n"+ev+"```");
            mas.channel.send(embed)
      } catch(err) {
        mas.channel.send(embed.setDescription("```js\n" + err + "```"));
      }
    }


});
D.login(dtoken);