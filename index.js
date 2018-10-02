const Mastodon = require('mastodon-api');
const Discord = require('discord.js');
// const db = require('quick.db');
const {prefix, dtoken, mtoken, key, secret} = require('./config.json');
const D = new Discord.Client();
D.on('ready', () => {
    console.log('Connected to Discord');
    D.user.setActivity('Mastodon | ' + prefix + 'stat', 'WATCHING');
})
D.on('message', async mas =>{
    if(mas.author.bot) return;
    if(mas.content.indexOf(prefix) !== 0) return;
    const words = mas.content.slice(prefix.length).trim().split(/ +/g);
    const target = words.shift().toLowerCase();
    if(target === 'stat'){
        let stat = words.join(' ');
        let params = {
            status: stat + '\n\n\nSent by: ' + mas.author.tag + ' in ' + mas.guild.name
        }
        M.post('statuses', params, (error, data) => {
            if (error){
                console.log(error)
            } else {
                console.log(data)
            }
        });
    }
    if(target === 'ev' || target === 'eval'){
        if(mas.author.id !== 'YOUR ID') return mas.channel.send("`You're not my Developer!`");
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
        deep = new Discord.RichEmbed();
        let token = dtoken.replace(/\./g, "\.")
        let tooken = new RegExp(token, 'g')
        ev = ev.replace(tooken, `haha yes`);
            deep.addField("Input", "```js\n" + code + "```")
            .addField("Eval", "```js\n"+ev+"```");
            mas.channel.send(deep)
      } catch(err) {
        mas.channel.send(deep.setDescription("```js\n" + err + "```"));
      }
    }


});
D.login(dtoken);