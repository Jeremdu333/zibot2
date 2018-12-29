//On importe la librairie 'discord.js'
const Discord = require('discord.js');

//On importe la libraire 'ytdl-core.js'
const ytdl = require('ytdl-core');

const ffmpeg = require('ffmpeg');


const queue = new Map();


var servers = {};


function play(connection, message) {
  
    var server = servers[message.guild.id];
  
    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
  
    server.queue.shift();
  
    server.dispatcher.on("end", function() { 
      if (server.queue[0]) play(connection, message);
  
      else connection.disconnect();
  
    });
  }  

//On créer le bot
const bot = new Discord.Client();

//On connecte le bot avec le token nécessaire
bot.login(process.env.token);

//Evenement: Quand le bot est prêt
bot.once('ready', () => {

    //On envoit un message à la console pour lui dire que le bot est bien connecté
    console.log('Je suis prêt à être utilisé 2!');

});

//Evenement: Quand un message est envoyé
bot.on('message', message => {

    //On définit le préfix permettant d'appeler le bot
    var prefix = "..";

    //On regarde si le message envoyé commence par le préfixe
    if(message.content.startsWith(prefix)){

        //On cherche tout les arguments y compris la commande
        var args = message.content.substring(prefix.length).split(' ');

        //On définit la commande
        var cmd = args[0];

        //On supprime la commande de la liste des arguments
        args = args.splice(1);

        //On envoit la commande à la console
        console.log("Commande: " + cmd);

        //On envoit les arguments à la console
        console.log("Arguments: " + args);
        
        //On supprime le message envoyé
        message.delete();

        chann = message.channel;

        switch(cmd){

          //Quand on fait la commande 'ping'
          case 'ping':

            chann.send("Pong !");

          break;

          //Quand on fait la commande 'play'
          case 'play':

            if (!args[0]) {

              chann.send(":x: Tu dois m’indiquer un lien YouTube !"); 
              
              return;
              
            }
				
            if(!message.member.voiceChannel) {
              
              chann.send(":x: Tu dois être dans un salon vocal !"); 
              
              return;
              
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {

              queue: []
                
            };            

            var server = servers[message.guild.id];

            server.queue.push(args[0]);
                  
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                  
              play(connection, message) 
                  
            });
			  
				  break;
			
			    case "stop":

				    if(!message.member.voiceChannel){ 
					
					    return chann.send(":x: Tu dois être dans un salon vocal");

					    message.member.voiceChannel.leave();
				  
            }
          break;
        }

    }

});