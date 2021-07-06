$(document).ready( () => {
  
  let name;
  let currentWords = [];
  let timer = 0;
  let timeElapsed = 0;
  let remainingWords = 25;
  let points = 0;
  const letters = $(".letter");
  let currentLetter = 0;
  let playerState;
  
  // Name Handler
  $("#name-form").on("submit", e => {
    e.preventDefault();
    if ( $("#name-form-input").val().length !== 0 ) {
      name = $("#name-form-input").val();
      settings();
    } else {
      modalHandler("Error", "Debes introducir al menos una letra en tu nombre.")
    }
  });

  // Modal Handler
  function modalHandler( title, message ) {
    $(".modal").addClass("visible");
    $("#modal-header").text(title);
    $("#modal-message").text(message);
    setTimeout(() => {
      $(".modal").removeClass("visible");
    }, 2000)
  };

  // Settings Screen
  function settings() {
    currentLetter = 0;
    timer = 0;
    timeElapsed = 0;
    remainingWords = 25;
    points = 0;
    getWords();
    $("#start-screen").fadeOut(1000);
    $("#game-over-screen").fadeOut(1000);
    getWords();
    setTimeout(() => {
      $("#settings-screen").fadeIn(1000);
    }, 1000)
  };

  // Difficuty Buttons functions

  $("#diff-easy").on("click", () => {
    timer = 240;
    startGame();
  });
  $("#diff-mid").on("click", () => {
    timer = 180;
    startGame();
  });
  $("#diff-hard").on("click", () => {
    timer = 120;
    startGame();
  });

  // Start Game

  function startGame() {
    $("#settings-screen").fadeOut(1000)
    setTimeout(() => {
      $("#game-screen").fadeIn(1000)
      setTimeout(() => {
        startTimer();
        $("#game-form-input").focus();
        showHints(currentLetter);
      }, 1000);
    }, 1000);
  };

  function showHints(pos) {
    if (remainingWords === 0) {
      endGame();
    } else {
      if ( pos === 25 ) {
        currentLetter = 0;
        pos = 0;
      }
      if ( !currentWords[pos].done ) {
        $(letters[pos]).addClass("flicker-animation");
        $("#question").html(currentWords[pos].question);
        $("#question-desc").html(currentWords[pos].desc);
      } else {
        currentLetter++;
        showHints(currentLetter);
      };
    };
  };

  // Timer set function

  let gameTimer;

  function startTimer() {
    gameTimer = setInterval(() => {
      timer -= 1;
      timeElapsed += 1;
      $("#countdown").html(timer)
      if (timer <= 0){
        endGame();
        clearInterval(gameTimer);
      };
    }, 1000);
  }

  // Check answer function

  function checkAnswer(pos) {
    const userAnswer = $("#game-form-input").val().toLowerCase(); 
    console.log(userAnswer);
    if (userAnswer === currentWords[pos].answer) {
      currentWords[pos].correct = true;
      currentWords[pos].done = true;
      points++;
      $("#points").html(points.toString())
      $(letters[pos]).addClass("success")
      $(letters[pos]).removeClass("flicker-animation");
      $("#game-form-input").val("");
      currentLetter++;
      remainingWords--;
      showHints(currentLetter);
    } else {
      currentWords[pos].done = true;
      $(letters[pos]).removeClass("flicker-animation");
      $(letters[pos]).addClass("failure");
      $("#game-form-input").val("");
      remainingWords--;
      currentLetter++;
      showHints(currentLetter);
    }
  }

  // Pass the word function

  function pasapalabra(pos) {
    $(letters[pos]).addClass("pasapalabra");
    $(letters[pos]).removeClass("flicker-animation");
    $("#game-form-input").val("");
    currentLetter++;
    showHints(currentLetter);
  }

  // End Game

  function endGame() {
    console.log("Fin del juego");
    clearInterval(gameTimer);
    $("#game-screen").fadeOut(1000);
    setTimeout(() => {
      $("#game-over-screen").fadeIn(1000);
      if ( points === 25) {
        playerState = "Perfecto";
      } else {
        playerState = points > 12 ? "Muy bien" : "No ha sido suficiente";
      }
      $
      $("#game-over-state").html(playerState);
      $("#game-over-name").html(name);
      $("#game-over-points").html(points);
      $("#game-over-time").html(timeElapsed);
    }, 1000);
  }

  // Get words function

  function getWords() {
    for( let i = 0; i < letters.length ; i++){
      let random = randomNum();
      console.log(random);
      currentWords[i] ={
        ...words[i][random],
        correct: false,
        done: false
      }
    };
  };

  // Send the answer button

  $("#send-button").click( () => {
    checkAnswer(currentLetter);
  });

  // Key binding for send the answer

  $("#game-form-input").keypress( e => {
    let keycode = e.keyCode ? e.keyCode : e.which;
    if ( keycode === 13 ) {
      checkAnswer(currentLetter);
    }
  });

  // Pasapalabra button

  $("#pasapalabra-button").click( () => {
    pasapalabra(currentLetter);
  });

  // Key binding for pass

  $("#game-form-input").keypress( e => {
    let keycode = e.keyCode ? e.keyCode : e.which;
    if ( keycode === 32 ) {
      pasapalabra(currentLetter);
    }
  })

  $("#play-again-button").on("click", () => {
    for (let i = 0; i < letters.length; i++) {
      $(letters[i]).removeClass("failure success pasapalabra");
    }
    settings();    
  })

  // Create random number to get the words
  
  function randomNum() {
    return Math.floor(Math.random() * 3)
  }
})

const words = [
  [
    {
      question: "Empieza con A",
      desc: "Guardar dinero como previsión para necesidades futuras",
      answer : "ahorrar"
    },
    {
      question: "Empieza con A",
      desc: "Edificio que sirve para guardar o depositar gran cantidad de artículos",
      answer : "almacen"
    },
    {
      question: "Empieza con A",
      desc: "Objeto o instrumento que sirve para atacar o defenderse de una persona o animal",
      answer : "arma"
    }
  ],
  [
    {
      question: "Empieza con B",
      desc: "Juego de habilidad que se practica sobre una mesa rectangular cubierta por fieltro verde con un reborde de goma y que consiste en golpear con la punta de un taco una bola",
      answer : "billar"
    },
    {
      question: "Empieza con B",
      desc: "Instrumento para pesar mediante la comparación del objeto que se quiere pesar con otro de peso conocido",
      answer : "balanza"
    },
    {
      question: "Empieza con B",
      desc: "Trozo de carbón, leña u otra materia combustible que arde sin dar llama",
      answer : "brasa"
    },
  ],
  [
    {
      question: "Empieza con C",
      desc: "Instrumento óptico para ver a larga distancia que consiste en un tubo, generalmente extensible",
      answer : "catalejo"
    },
    {
      question: "Empieza con C",
      desc: "Tira de cuero, especialmente para sujetar algo",
      answer : "correa"
    },
    {
      question: "Empieza con C",
      desc: "Aparato que sirve para registrar imágenes estáticas o en movimiento",
      answer : "camara"
    },
  ],
  [
    {
      question: "Empieza con D",
      desc: "Pieza cúbica que se usa en juegos de azar y en cuyas caras hay puntos, de uno hasta seis, o figuras distintas",
      answer : "dado"
    },
    {
      question: "Empieza con D",
      desc: "Atraer la atención de alguien haciendo que la aparte de lo que estaba haciendo o de lo que tenía que hacer",
      answer : "distraer"
    },
    {
      question: "Empieza con D",
      desc: "Espacio, considerado desde una perspectiva lineal, entre una persona o cosa y otra",
      answer : "distancia"
    },
  ],
  [
    {
      question: "Empieza con E",
      desc: "Acción que no sigue lo que es correcto, acertado o verdadero",
      answer : "error"
    },
    {
      question: "Empieza con E",
      desc: "Comunicar conocimientos, ideas, experiencias, habilidades o hábitos a una persona que no los tiene",
      answer : "enseñar"
    },
    {
      question: "Empieza con E",
      desc: "Astro o cuerpo celeste que brilla con luz propia en el firmamento",
      answer : "estrella"
    },
  ],
  [
    {
      question: "Empieza con F",
      desc: "De la cara o relacionado con ella",
      answer : "facial"
    },
    {
      question: "Empieza con F",
      desc: "Figura irreal, imaginaria o fantástica y normalmente incorpórea, que alguien cree ver",
      answer : "fantasma"
    },
    {
      question: "Empieza con F",
      desc: "Imaginar sucesos, historias o cosas que no existen en la realidad",
      answer : "fantasear"
    },
  ],
  [
    {
      question: "Empieza con G",
      desc: "Envase metálico con cierre hermético, que contiene gas o líquidos volátiles que son usados como combustible",
      answer : "garrafa"
    },
    {
      question: "Empieza con G",
      desc: "Cada una de las uñas fuertes, curvas y afiladas que tienen en el extremo de los dedos algunos vertebrados",
      answer : "garra"
    },
    {
      question: "Empieza con G",
      desc: "Manera de andar del caballo y otros animales, la más rápida de todas, en la cual el animal mantiene por un momento las cuatro patas en el aire",
      answer : "galope"
    },
  ],
  [
    {
      question: "Empieza con H",
      desc: "Órgano o parte de él que sale, de forma natural o accidental, fuera de la cavidad que normalmente lo contiene",
      answer : "hernia"
    },
    {
      question: "Contiene H",
      desc: "Hablar con alguien de forma amena, familiar y distendida sobre temas sin trascendencia",
      answer : "charlar"
    },
    {
      question: "Empieza con H",
      desc: "Pieza de hierro en forma de U que se les clava a las caballerías en los cascos para protegérselos",
      answer : "herradura"
    },
  ],
  [
    {
      question: "Empieza con I",
      desc: "Porción de tierra rodeada de agua por todas partes",
      answer : "isla"
    },
    {
      question: "Empieza con I",
      desc: "Capacidad que tiene una persona para imaginar o inventar cosas combinando con inteligencia y habilidad los conocimientos que posee y los medios de que dispone",
      answer : "ingenio"
    },
    {
      question: "Empieza con I",
      desc: "Proporcionar conocimientos, habilidades, ideas o experiencias a una persona para darle una determinada formación",
      answer : "instruir"
    },
  ],
  [
    {
      question: "Empieza con J",
      desc: "Conjunto de perros que participan en la caza",
      answer : "jauria"
    },
    {
      question: "Contiene J",
      desc: "Tallo delgado de los cereales, una vez seco y separado del grano",
      answer : "paja"
    },
    {
      question: "Empieza con J",
      desc: "Proporcionar conocimientos, habilidades, ideas o experiencias a una persona para darle una determinada formación",
      answer : "jubilo"
    },
  ],
  [
    {
      question: "Empieza con L",
      desc: "Que hurta o roba",
      answer : "ladron"
    },
    {
      question: "Empieza con L",
      desc: "Hacienda agrícola de gran extensión que pertenece a un solo propietario",
      answer : "latifundio"
    },
    {
      question: "Empieza con L",
      desc: "Fruto comestible, de forma ovalada, piel de color amarillo o verde y pulpa dividida en gajos, de sabor ácido y muy aromático",
      answer : "limon"
    },
  ],
  [
    {
      question: "Empieza con M",
      desc: "Aplastar o triturar algo en la boca con los dientes para extraer su jugo o sabor o para ser tragado",
      answer : "masticar"
    },
    {
      question: "Empieza con M",
      desc: "Afirmación que una persona hace consciente de que no es verdad",
      answer : "mentira"
    },
    {
      question: "Empieza con M",
      desc: "Pieza de metal, generalmente redonda y con un relieve en cada cara, a la que se le asigna un valor económico determinado y se emplea como medio legal de pago",
      answer : "moneda"
    },
  ],
  [
    {
      question: "Empieza con N",
      desc: "Fruto comestible, de forma redonda, cáscara gruesa y rugosa y pulpa dividida en gajos, agridulce y muy jugosa",
      answer : "naranja"
    },
    {
      question: "Empieza con N",
      desc: "Que va de un lugar a otro y no se establece en ningún sitio de forma permanente",
      answer : "nomada"
    },
    {
      question: "Empieza con N",
      desc: "Octavo planeta en distancia respecto al Sol y el más lejano del sistema solar",
      answer : "neptuno"
    },
  ],
  [
    {
      question: "Empieza con Ñ",
      desc: "Ave corredora similar al avestruz, pero de menor tamaño, sin cola, con tres dedos en cada pie y el plumaje gris o pardo",
      answer : "ñandu"
    },
    {
      question: "Contiene Ñ",
      desc: "Parte del día que transcurre desde el amanecer hasta el mediodía",
      answer : "mañana"
    },
    {
      question: "Contiene Ñ",
      desc: "Disponer algo con maña para falsearlo y obtener un provecho",
      answer : "amañar"
    },
  ],
  [
    {
      question: "Empieza con O",
      desc: "Exhibir con vanidad y presunción una cosa",
      answer : "ostentar"
    },
    {
      question: "Empieza con O",
      desc: "Color amarillo oscuro",
      answer : "ocre"
    },
    {
      question: "Empieza con O",
      desc: "Estación del año comprendida entre el verano y el invierno",
      answer : "otoño"
    },
  ],
  [
    {
      question: "Empieza con P",
      desc: "De la planta del pie o relacionado con ella",
      answer : "plantar"
    },
    {
      question: "Empieza con P",
      desc: "Depresión del terreno donde de forma natural queda agua estancada, generalmente con poca profundidad, y cuyo fondo es más o menos cenagoso",
      answer : "pantano"
    },
    {
      question: "Empieza con P",
      desc: "En lógica, lo que se afirma o se niega de un sujeto en una proposición",
      answer : "predicado"
    },
  ],
  [
    {
      question: "Empieza con Q",
      desc: "Que se querella",
      answer : "querellante"
    },
    {
      question: "Empieza con Q",
      desc: "Alimento sólido que se obtiene por maduración de la cuajada de la leche una vez eliminado el suero",
      answer : "queso"
    },
    {
      question: "Empieza con Q",
      desc: "Que ha sufrido quemaduras",
      answer : "quemado"
    },
  ],
  [
    {
      question: "Empieza con R",
      desc: "Que se produce de repente, de forma imprevista",
      answer : "repentino"
    },
    {
      question: "Empieza con R",
      desc: "Poner una cosa en el estado o estimación que antes tenía",
      answer : "restaurar"
    },
    {
      question: "Empieza con R",
      desc: "Someterse al dominio o voluntad de alguien o algo, dejando de oponer resistencia",
      answer : "rendirse"
    },
  ],
  [
    {
      question: "Empieza con S",
      desc: "Elevarse del suelo u otra superficie con impulso para caer en el mismo lugar o en otro",
      answer : "saltar"
    },
    {
      question: "Empieza con S",
      desc: "Del significado de las palabras o de las oraciones o relacionado con él",
      answer : "semantico"
    },
    {
      question: "Empieza con S",
      desc: "Impresión que los estímulos externos producen en la conciencia y que es recogida por medio de alguno de los sentidos",
      answer : "sensacion"
    },
  ],
  [
    {
      question: "Empieza con T",
      desc: "Vehículo tirado por perros, caballos o renos y provisto de esquís o patines en lugar de ruedas para desplazarse sobre la nieve y el hielo",
      answer : "trineo"
    },
    {
      question: "Empieza con T",
      desc: "Técnica de disecar animales",
      answer : "taxidermia"
    },
    {
      question: "Empieza con T",
      desc: "Impulso de hacer o tomar algo atrayente pero que puede resultar inconveniente",
      answer : "tentacion"
    },
  ],
  [
    {
      question: "Empieza con U",
      desc: "Necesidad o falta apremiante de algo",
      answer : "urgencia"
    },
    {
      question: "Empieza con U",
      desc: "Pronombre con el que la persona que habla o escribe se refiere a su interlocutor o a la persona a quien escribe",
      answer : "usted"
    },
    {
      question: "Empieza con U",
      desc: "Recipiente o caja de piedra o de metal que se utiliza para guardar ciertas cosas, como dinero, joyas o las cenizas de las personas muertas",
      answer : "urna"
    },
  ],
  [
    {
      question: "Empieza con V",
      desc: "Envoltura alargada de ciertas cosas",
      answer : "vaina"
    },
    {
      question: "Empieza con V",
      desc: "Determinación para enfrentarse a situaciones arriesgadas o difíciles",
      answer : "valentia"
    },
    {
      question: "Empieza con V",
      desc: "Que varia o puede variar",
      answer : "variable"
    },
  ],
  [
    {
      question: "Empieza con X",
      desc: "Instrumento musical de percusión formado por una serie de láminas de madera dispuestas horizontalmente y ordenadas según su tamaño",
      answer : "xilofono"
    },
    {
      question: "Contiene X",
      desc: "Unión que se establece entre dos o más cosas  o personas para que entre ellas haya una relación o una comunicación",
      answer : "conexion"
    },
    {
      question: "Empieza con X",
      desc: "Rechazo a los extranjeros",
      answer : "xenofobia"
    },
  ],
  [
    {
      question: "Empieza con Y",
      desc: "Caimán de unos 2,5 m de largo, de color verde oscuro, con la punta del hocico redondeada",
      answer : "yacare"
    },
    {
      question: "Contiene Y",
      desc: "Esposo o esposa de una persona",
      answer : "conyuge"
    },
    {
      question: "Contiene Y",
      desc: "Poner una cosa de manera que otra la sostenga para que no se caiga",
      answer : "apoyar"
    },
  ],
  [
    {
      question: "Empieza con Z",
      desc: "Fruto comestible, de forma redondeada, color verde al nacer y morado o negro cuando está maduro y de sabor dulce",
      answer : "zarzamora"
    },
    {
      question: "Contiene Z",
      desc: "Herramienta para golpear o aplastar, parecida a un martillo",
      answer : "maza"
    },
    {
      question: "Contiene Z",
      desc: "Recubrir con harina y huevo u otros ingredientes un alimento antes de freírlo",
      answer : "rebozar"
    },
  ],
]
