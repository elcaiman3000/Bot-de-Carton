const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

let prefix = config.prefix;

client.on("ready", () => {
   console.log(`Estoy listo!,
            conectado en ${client.guilds.size} servidores y  ${client.users.size} usuarios.`);

   client.user.setPresence( {
       status: "idle",
       game: {
           name: `<ayuda | Estoy en ${client.guilds.size} servidores.`,
           type: "PLAYING"
       }
    });

});
client.on("guildMemberAdd", (member) => {
    let canal = client.channels.get('486948600782389260');
    canal.send(`Hola ${member.user}, bienvenido al servidor ${member.guild.name} espero que disfrutes.`);

});
client.on("guildMemberRemove", (member) => {
    let canal = client.channels.get('486948600782389260');
    canal.send(`${member.user}, ha salido del servidor.`);

});
client.on("messageDelete", (message) => {
    let canal = client.channels.get('486948782131642368');
    canal.send(`**${message.author.username}** eliminó un mensaje con el contenido: ${message}`);

});




client.on("message", (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();



if(command === 'unirse'){
  let Canalvoz = message.member.voiceChannel;

if(!Canalvoz || Canalvoz.type !== 'voice') {
    message.channel.send('¡Necesitas unirte a un canal de voz primero!.');

} else if (message.guild.voiceConnection) {
    message.channel.send('Ya estoy conectado en un canal de voz.');

} else {
    message.channel.send('Conectando...').then(m => {
        Canalvoz.join().then(() => {
            m.edit('Conectado exitosamente.').catch(error => console.log(error));

        }).catch(error => console.log(error));

    }).catch(error => console.log(error));

};

}

if(command === 'salir'){
  let Canalvoz = message.member.voiceChannel;

  if(!Canalvoz) {
      message.channel.send('No estas conectado a un canal de voz.');

  } else {
      message.channel.send('Dejando el canal de voz.').then(() => {
          Canalvoz.leave();

      }).catch(error => console.log(error));

  }
}

if(command === 'play'){
  const ytdl = require('ytdl-core');
  let Canalvoz = message.member.voiceChannel;

  if(!Canalvoz) return message.channel.send('¡Necesitas unirte a un canal de voz primero!.');
  if(!args) return message.channel.send('Ingrese un enlace de youtube para poder reproducirlo.');

  Canalvoz.join()
      .then(connection => {
          const url = ytdl(args.toString(), { filter : 'audioonly' });
          const dispatcher = connection.playStream(url);

          message.delete();
          message.channel.send('Reproduciendo ahora: '+ args);

      }).catch(console.error);

}

if(command === 'comandos'){
  message.channel.send('**'+message.author.username+'**, Revisa tus mensajes privados.');

const embed = new Discord.RichEmbed()
    .setAuthor(message.author.username, message.author.avatarURL)
    .addField('Todos los comandos llevan "<"" excepto autorespuestas.', true)

    .addField('ping', 'Compueba la latencia del BOT', true)

    .addField('avatar', 'Muestra el avatar de un usuario', true)

    .addField('server', 'Muestra información de un servidor', true)

    .addField('ban', 'Banear a un usuario del servidor, incluye razón.', true)

    .addField('kick', 'Patear a un usuario del servidor, incluye razón.', true)

    .addField('purgar', 'Borrar mensajes', true)

    .addField('decir', 'Dice lo que le mandes', true)

    .addField('mp', 'Mensaje privado', true)

    .addField('ayuda', 'Muestra la ayuda del bot', true)

    .addField('Autorrespuestas:', true)

    .addField('Hola', 'te responde', true)

    .addField('Invitación', '[Link de invitacion](https://discordapp.com/oauth2/authorize?client_id=490984048391356422&scope=bot&permissions=3145736)', true)
    .setFooter("Version 0.1", client.user.avatarURL)
    .setColor(0x66b3ff)

message.author.send({ embed });
}
  if(command === 'mp'){
  let mensaje = args.join(" ");

if(!mensaje) return message.channel.send(`Escriba un mensaje para enviarlo por privado.`);
message.author.send(mensaje);

}

if(command === 'purgar'){
  let cantidad = parseInt(args[0]);
message.channel.bulkDelete(cantidad);

}

if(command === 'ban'){
  let mencionado = message.mentions.users.first();
let razon = args.slice(1).join(' ');

if(!mencionado) return message.reply('No ha mencionando a ningún miembro.');
if(!razon) return message.channel.send('Escriba una razón para usar el ban.');

message.guild.member(mencionado).ban(razon);
message.channel.send(`**${mencionado.username}**, fue baneado del servidor por: ${razon}.`);

}





if(command === 'kick'){
  let mencionado = message.mentions.users.first();
let razon = args.slice(1).join(' ');
let permiso = message.member.hasPermission("KICK_MEMBERS");

if(!permiso){
    message.channel.send('No tiene el permiso de kickear'); return;
} else{
    message.channel.send('Si tiene el permiso de Kickear');
}

if(!mencionado) return message.reply('No ha mencionando a ningún miembro.');
if(!razon) return message.channel.send('Escriba una razón para usar kick.');

message.guild.member(mencionado).kick(razon);
message.channel.send(`**${mencionado.username}**, fué kickeado del servidor por: ${razon}.`);

}

if(command === 'server'){
  var server = message.guild;
let servidoresgrandes = client.guilds.filter(g => g.memberCount > 100);
const embed = new Discord.RichEmbed()
    .setThumbnail(server.iconURL)
    .setAuthor(server.name, server.iconURL)
    .addField('ID', server.id, true)
    .addField('Region', server.region, true)
    .addField('Creado el', server.joinedAt.toDateString(), true)
    .addField('Dueño del Servidor', server.owner.user.tag +'('+server.owner.user.id +')', true)
    .addField('Miembros', server.memberCount, true)
    .addField('Roles', server.roles.size, true)
    .setColor(0x66b3ff)

message.channel.send({ embed });

}





if(command === 'avatar'){
  let miembro = message.mentions.users.first()
if (!miembro) {
    const embed = new Discord.RichEmbed()
        .setImage(`${message.author.avatarURL}`)
        .setColor(0x66b3ff)
        .setFooter(`Avatar de ${message.author.tag}`);
    message.channel.send({ embed });

} else {
    const embed = new Discord.RichEmbed()
        .setImage(`${miembro.avatarURL}`)
        .setColor(0x66b3ff)
        .setFooter(`Avatar de ${miembro.tag}`);

    message.channel.send({ embed });

};
}

if(command === 'decir'){
  let texto = args.join(" ");
if(!texto) return message.channel.send(`Escriba algo para decir.`);


  message.channel.send(texto);

}

if(command === 'ping'){
    if (!message.content.startsWith(prefix)) return;
if (message.author.bot) return;
let ping = Math.floor(message.client.ping);
message.channel.send(":ping_pong: Pong!, "+ ping + "ms");
  }

  if(command === 'Hola'){
    if (!message.content.startsWith(prefix)) return;
if (message.author.bot) return;
    message.channel.send("¡Hola!, ¿Que tal?")

  }

  if(command === 'hola'){
    if (!message.content.startsWith(prefix)) return;
if (message.author.bot) return;
    message.channel.send("¡Hola!, ¿Que tal?")

  }

});

client.login(config.token);
