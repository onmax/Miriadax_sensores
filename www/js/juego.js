var app={
    inicio: function(){
        DIAMETRO_BOLA = 50;
        dificultad = 0;
        velocidadX = 0;
        velocidadY = 0;
        puntuacion = 0;
        cambioColorFondo = false;
        tipoColorFondo = '';
        
        //rgb(242, 125, 12)
        colorB = 12;
        colorG = 125;
        colorR = 242;
        colorRGB = 'rgb(242, 125, 12)';
        
        // Obtiene el tamaño pantalla dispositivo
        alto =  document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;
        
        app.vigilaSensores();
        app.iniciaJuego();

    },
    
    iniciaJuego: function(){
        // Ciclo de juego
        
        // Primero suceso este evento
        function preload(){
            game.physics.startSystem(Phaser.Physics.ARCADE); // Arrancamos el motor de fisica (motor mas sencillo ARCADE)
                        
            game.stage.backgroundColor = '#f27d0c'; // stage es el espacio donde se desarrolla el juego
            game.load.image('bola', 'assets/bola.png'); // Cargamos un elemento ene l juego y lo llamamos 'bola'
            game.load.image('objetivo', 'assets/objetivo.png'); // Cargamos un elemento ene l juego y lo llamamos 'objetivo'
            game.load.image('objetivo10', 'assets/objetivo10.png'); // Cargamos un elemento ene l juego y lo llamamos 'objetivo10'
        }
        
        // Despues sucede este evento
        function create(){
            scoreText = game.add.text(16, 16, puntuacion, {fontsize: '100px', fill: '#757676'});
            dificuladText = game.add.text(ancho - 50, 16, dificultad, {fontsize: '100px', fill: '#357676'});
            
            objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo'); // Cargamos la imagen 'objetivo' en el juego, sprite, dibujo se va a mover por la pantalla.  
            
            objetivo10 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo10'); // Cargamos la imagen 'objetivo10' en el juego, sprite, dibujo se va a mover por la pantalla.          

            bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola'); // Cargamos la imagen 'bola' en el juego, sprite, dibujo se va a mover por la pantalla.
            
            game.physics.arcade.enable(objetivo); // Sobre el sprite objetivo actuen las leyes de la fisica (ARCADE)
            game.physics.arcade.enable(objetivo10); // Sobre el sprite objetivo10 actuen las leyes de la fisica (ARCADE)
            game.physics.arcade.enable(bola); // Sobre el sprite bola actuen las leyes de la fisica (ARCADE)
            
            bola.body.collideWorldBounds = true; // Detecte colision con los bordes del mundo
            bola.body.onWorldBounds = new Phaser.Signal(); // Indicamos que genere una señal, cada vez se llegue bordes mundo.
            bola.body.onWorldBounds.add(app.decrementaPuntacion, this); // Añadimos el manejador de la señal generado linea arriba.
        }
        
        function update(){
            var factorDificultad =  (300 + (dificultad * 100));
            
            // Mapeamos la velocidad X/Y. 
            bola.body.velocity.y = (velocidadY * factorDificultad);
            bola.body.velocity.x = (velocidadX * (-1 *factorDificultad));
            
            game.physics.arcade.overlap(bola, objetivo, function(){ app.incrementaPuntuacion(1);}, null, this); // Cuando la bola se monte sobre el objetivo
            
            game.physics.arcade.overlap(bola, objetivo10, function(){ app.incrementaPuntuacion(10);}, null, this); // Cuando la bola se monte sobre el objetivo 10 puntos mas   
            
            if (cambioColorFondo){
                if (game.stage.backgroundColor != tipoColorFondo) {
                    game.stage.backgroundColor = tipoColorFondo;
                }    
            } else {
                if (game.stage.backgroundColor != colorRGB) {
                    game.stage.backgroundColor = colorRGB;
                }     
            }    
        }
        
        var estados = { preload: preload, create: create, update: update}; // Mapa de estado del ciclo de juego
        var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados); // Creamos un nuevo juego de Game/Phaser
        // Phaser.CANVAS es una forma de renderizacion, hay mas
    },
    
    incrementaPuntuacion: function(cuanto){
        puntuacion = puntuacion + cuanto;
        scoreText.text = puntuacion;       
        
        if (cuanto == 1){
          objetivo.body.x = app.inicioX();
          objetivo.body.y = app.inicioY();             
        } else {
            objetivo10.body.x = app.inicioX();
            objetivo10.body.y = app.inicioY();            
        }
        
        if (puntuacion > 0){
            dificultad = dificultad + 1;
            dificuladText.text = dificultad;
            app.cambiarRGB(4);
        }
        
        cambioColorFondo = true;
        tipoColorFondo = '#60f460';  
    },
    
    cambiarRGB: function(valor) {
        colorR =  colorR + valor;
        if (colorR < 0) {
            colorR = 0;
        }
        if (colorR > 255) {
            colorR = 255;
        }
        colorG =  colorG + valor;
        if (colorG < 0) {
            colorG = 0;
        }
        if (colorG > 255) {
            colorG = 255;
        }
        
        if (valor > 0) {
            colorB = colorB + 5;
        } else {
            colorB = colorB - 5;
        }
        if (colorB < 0) {
            colorB = 0;
        }
        if (colorB > 255) {
            colorB = 255;
        }    
        
        colorRGB = 'rgb(' + colorR + ',' + colorG + ',' + colorB + ')';
    },
    
    decrementaPuntacion: function(){
        puntuacion = puntuacion - 1;
        scoreText.text = puntuacion;
        
        cambioColorFondo = true;
        tipoColorFondo = '#ff9898';
        
        if (dificultad>1) {
            dificultad = dificultad - 1;
            if (dificultad < 0) {
                dificultad = 0;
            }
            dificuladText.text = dificultad;
            app.cambiarRGB(-4);
        }
    },
    
    inicioX: function(){
      return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);  
    },
    
    inicioY: function(){
      return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);  
    },   
    
    numeroAleatorioHasta: function(limite){
      var valor =  Math.floor(Math.random() *  limite);  
      //alert('limite ' +  limite +  'valor ' + valor);     
      return valor;
    },
    
    vigilaSensores: function(){
        
        function onError() {
            console.log('onError!');
        }        
        
        function onSuccess(datosAceleracion){
            app.detectaAgitacion(datosAceleracion);
            app.registroDireccion(datosAceleracion);
        }
        
        navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 10});
    },      
    
    recomienza: function(){
        document.location.reload(true); // A no dejar de ser una pagina web, hacemos que la recargue.
    },

    detectaAgitacion: function(datosAceleracion) {
        // si los valores de x o y son mayores de 10, es que se está agitando el movil
        agitacionX = datosAceleracion.x > 10;
        agitacionY = datosAceleracion.y > 10;
        
        if (agitacionX || agitacionY){
            //document.body.className = 'agitando';
            //alert('agitando');
            setTimeout(app.recomienza, 1000);
        } else {
            //document.body.className = '';
        }
    },
    
    registroDireccion: function(datosAceleracion){
        velocidadX = datosAceleracion.x;
        velocidadY = datosAceleracion.y;
        cambioColorFondo = false;
        tipoColorFondo = '';
    },
    
    representaValores: function(datosAceleracion) {
        app.representa(datosAceleracion.x, '#valorx');
        app.representa(datosAceleracion.y, '#valory');
        app.representa(datosAceleracion.z, '#valorz'); 
    },
    
    representa: function(dato, elementoHTML) {
        redondeo = Math.round(dato * 100) / 100;
        document.querySelector(elementoHTML).innerHTML = redondeo;
    }
};

if('addEventListener' in document){
    document.addEventListener('deviceready',function() {
        app.inicio();
    },false);
}



