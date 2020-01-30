



var usuarios=[];
var nUsers=0;
var user, userID, channelID, message, bot;

//la funcion inicio actua de constructor para el programa
exports.main=function inicio(u, uID, cID, m, b) {
    if(uID!==b.id) {
        user = u;
        userID = uID;
        channelID = cID;
        message = m;
        bot = b;
        main();
    }
};

//la funcion main redirige a los otros metodos segun el usuario, el estado y la entrada
function main() {
    if(userID===bot.id)
    return 0;

    var args = message.split(' ');
    //si el usuario que envio el mensaje no esta en los activos del bot se le anade
    if (usuarioactivo(userID) === -1) {
        usuarios.push(new Usuarionuevo(userID, 1, user,1,null));
        nUsers++;
    }
    //se guarda el index del usuario activo
    var posUser=usuarioactivo(userID);
    //el mensaje hola lleva a la funcion hola
    if (args[0] === "?hola") {
    usuarios[posUser].estado=1;
        hola();
    }
    //si se quiere acceder al test se cambia el estado al inicio de test, estados reservados de test de 10 a 29
    if(args[0]==="?test"){
        usuarios[posUser].estado=10;

    }
    //si el estado es tres significa que accede al menu de personajes, a los 8 segundos el acceso caduca y se tendria que volver a llamar
    if(usuarios[posUser].estado===3){

        personajes(message);
        setTimeout(function(){usuarios[posUser].estado=1},8000);
    }
    //si el estado esta entre 10 y 20, reservados para mostrar en pantalla las puntuacions del test
    if(usuarios[posUser].estado>=10&&usuarios[posUser].estado<=20){

        test(posUser);
    }
    //si el estado esta por encima de 20 significa que el usuario responde a una de las puntuacions del test
    if(usuarios[posUser].estado>20){
        repTest(posUser);

    }
//se accede al menu de personajes
        if(args[0]==="?personajes") {
            usuarios[posUser].estado=3;
            personajes();
        }


}


        //la funcion hola simplemente sirve a modo de presentacion con una explicacion de los comandos principales
function hola() {
    bot.sendMessage({
        to: channelID,
        message: '**SOY EL LEONCIO FORMULA TU DESEO**'
    });
    bot.uploadFile({
         to: channelID,
         file: 'ico.jpg'
     });//un retardo para dar tiempo a subir la imagen y esto salga debajo
    setTimeout(function(){bot.sendMessage({
        to: channelID,
        message: '```Para continuar usa uno de los siguientes comandos\n' +
            '?test\n' +
            '?personajes```'
    })},1000);

}
//funcion personajes a la que se le pasa el personaje del que se quiere saber, y devuelve una descripcion corta, si se llama sin
//personaje devuelve la lista de estos para ayuda del usuario
function personajes(personaje) {
    if (personaje === undefined) {
        bot.sendMessage({
            to: channelID,
            message: 'sobre que personaje te gustaria saber'
        });
        setTimeout(function () {
            bot.sendMessage({
                to: channelID,
                message: '```estos son los protagonistas, escribe su nombre para saber de ellos\n' +
                    'Shiwa\n' +
                    'Masu\n' +
                    'Koi\n' +
                    'Gala\n' +
                    'Lion```'
            })
        }, 1000);
    }


     switch (personaje) {
        case "shiwa" :
            bot.sendMessage({
                to: channelID,
                message: 'shiwasassasasas'
            });
            break;
        case"masu":
            bot.sendMessage({
                to: channelID,
                message: 'masususususussu'
            });
            break;
        case"Koi":
            bot.sendMessage({
                to: channelID,
                message: 'koibitususususu'
            });
            break;
        case "Gala":
            bot.sendMessage({
                to: channelID,
                message: 'galasasasas'
            });
            break;
        case "Lion":
            bot.sendMessage({
                to: channelID,
                message: 'Lionesesesese'
            });
            break;


    }


}




//funcion test que recibe el index del usuario haciendo el test y muestra en pantalla la puntuacion y las respuestas posibles
    function test(posUser){
        //si el usuario esta en la puntuacion de reseteo de personaje (estado 11) y responde si se procedera a ello
        if(usuarios[posUser].estado===11){
            if(message==="si"){
                usuarios[posUser].personaje=null;
                usuarios[posUser].estado=10;
                test(posUser);}

            return 0

        }
            //si el usuario ya tiene un personaje asignado se le puntuacion si quiere volver a hacer el test reseteando el personaje
        if(usuarios[posUser].personaje!=null){
            bot.sendMessage({
                to:channelID,
                message:"Tu personaje es **"+usuarios[posUser].personaje+"**, ¿quieres volver a hacer el test?"

            });
            usuarios[posUser].estado=11;
            return 0;
        }//si no tiene personaje asignado o ha sido reseteado y esta en la entrada del test se lepone el estado de la primera puntuacion:12
        else if(usuarios[posUser].estado===10)
            usuarios[posUser].estado=12;

        if((usuarios[posUser].estado-11)>2){
            resFinal(posUser);
            return 0;
        }
        let mensaje="**puntuacion numero"+(usuarios[posUser].estado-11)+"**\n";

        switch (usuarios[posUser].estado-11) {
            case 1:mensaje+="Cual es tu color favorito de entre los siguientes:\n" +
                "a) Rojo\n" +
                "b) Rosa\n" +
                "c) Blanco\n" +
                "d) Azul\n" +
                "e) Gris\n";
                break;
            case 2:mensaje+="Que ambientes prefieres dentro de estos:\n" +
                "a) Prados\n" +
                "b) Casa de campo\n" +
                "c) Azotea de un edificio\n" +
                "d) Bosque\n" +
                "e) Ciudad\n";
                break;

        }
            //una vez mostradas las opciones se actualiza el estado al de la respuesta correspondiente(estado puntuacion +10)
            usuarios[posUser].estado+=10;

            bot.sendMessage({
                to:channelID,
                message: mensaje
            });


            return 0;}






//funcion para las respuestas del test
    function repTest(posUser){

        let resultado=0;
                switch (message) {
                    case "a":
                        resultado += 1;

                        break;

                    case 'b':
                        resultado += 4;
                        break;

                    case 'c':
                        resultado += 3;
                        break;

                    case 'd':
                        resultado += 2;
                        break;

                    case 'e':
                        resultado += 5;
                        break;
                    default:return 0;

                }
                usuarios[posUser].puntuacion+=resultado;
                usuarios[posUser].estado+=-9;

                test(posUser);
                return 0;
    }





    function resFinal(posUser) {

        let msg="Tu personaje es: ";
        let person;
        switch(Math.round(usuarios[posUser].puntuacion/(usuarios[posUser].estado-11))){
            case 1:person="Lion. un chico algo timido, pero daria lo que fuera por sus seres queridos";break;
            case 2:person="Nishikisho Gala. Una hibrida lobo-elfo con el mayor corazon";break;
            case 3:person="Shiwa. Un guardaespaldas que esta muy bueno, pero quizas te parta la cara si te acercas mucho";break;
            case 4:person="Ketsukei Masumi. La mas famosa idol, Masu-chan";break;
            case 5:person="Koi. Un joven con demasiados sentimientos y un profundo amor platónico.";break;
        }
        bot.sendMessage({
            to:channelID,
            message:msg+person
        });
        usuarios[posUser].estado=1;
        usuarios[posUser].personaje=person;
        usuarios[posUser].puntuacion=0;
    }



























exports.diase= function diasemana() {
    var fecha=new Date();
    fecha.setHours(fecha.getUTCHours()+12);
    let dias=fecha.getTime()/1000/60/60/24;
    var diassemana=["miercoles","jueves", "viernes", "sabado","domingo","lunes", "martes"];
    return diassemana[Math.trunc(dias)%7];

};


function usuarioactivo(userID) {
    let esta=-1;
    for(let i=0;i<nUsers;i++){
        if(usuarios[i].userID===userID){
            esta=i;break;}
}return esta;
}

function Usuarionuevo(userID, estado, user,puntuacion,personaje) {
    this.userID = userID;
    this.estado = estado;
    this. user =  user;
    this.puntuacion=puntuacion;
    this.personaje=personaje;
}
