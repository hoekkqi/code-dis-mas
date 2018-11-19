// Made by ryden#3621
// Github Repo: https://github.com/codepupper/code-dis-mas
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

let listen = 'LISTENING'
let watch = 'WATCHING'
let play = 'PLAYING'

D.on('ready', () => {
    console.log('Connected to Discord');
    D.user.setActivity(`mastodon | ${prefix}h`, {type: watch});
})



D.on('message', async µ =>{
    
    if(µ.author.bot) return;
    if(µ.content.indexOf(prefix) !== 0) return;
    
    const words = µ.content.slice(prefix.length).trim().split(/ +/g);
    const target = words.shift().toLowerCase();

    if(target === 'h' || target === 'help'){
        let E = new Discord.RichEmbed();
        E.setDescription('[] = __Important__')
         .addField('Help', `**•** \`${prefix}\`**h|help** - Shows this message
         **•** \`${prefix}\`**info|credits** - Show the Source Code
        **•** \`${prefix}\`**stat|status** \`[Your Text]\` - Sends your status
        **•** \`${prefix}\`**ev|eval** - Evaluate code`)

        µ.channel.send(E);
    }
    
    if(target === 'stat' || target === 'status'){
        if(µ.author.id !== ID) return;
        let status = words.join(' ');
        if(status === '') return µ.channel.send('Please write something, you cannot send empty status updates.');
        let params = {
            status: status
        }
    
        
        M.post('statuses', params, (error, data) => {
            if (error){
                console.log(error)
                µ.channel.send("```js\n" + error + "```")
            } else {
                console.log(data)
                let E = new Discord.RichEmbed();
                E.setTitle('Status Update')
                 .setAuthor(µ.author.tag, µ.author.avatarURL)
                 .setDescription(`[Click here to see it](${data.uri})`)
                 .setThumbnail(µ.author.avatarURL)
                 µ.channel.send(E);
            }
        });


    }

    if(target === 'ev' || target === 'eval'){
        if(µ.author.id !== ID) return µ.channel.send("`You're not my Developer!`");
        // ? Easy
        const pu = µ.channel
        let command = µ.content.slice(prefix.length);
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
            µ.channel.send(embed)
      } catch(err) {
        µ.channel.send(embed.setDescription("```js\n" + err + "```"));
      }
    }

    if(target === 'credits' || target === 'info'){
        let P = require('./package.json');
        let creator = D.users.get(P.creator);

        let E = new Discord.RichEmbed();
        E.setTitle(P.name)
         .setColor(0x36393E)
         .setDescription(P.description)
         .addField('Repository', `[${P.name}](${P.repository.url})`)
         .addField('Version', P.version, true)
         .addField('Dependencies', "discord.js\nmastodon-api", true)
         .addField('Creator', creator + " // " + creator.tag, true)
         .addField('Website', P.website, true)
         .addField('Changelog', P.changelog)
         .setThumbnail(creator.avatarURL)
         .setFooter('Made by ' + creator.tag, creator.avatarURL)


        µ.channel.send(E);

    }


});
D.login(dtoken);
