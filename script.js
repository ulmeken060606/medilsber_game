  document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameScreen = document.getElementById('game-screen');
    const mazeContainer = document.getElementById('maze-container');
    const stepsCount = document.getElementById('steps-count');
    const levelCount = document.getElementById('level-count');
    const questionScreen = document.getElementById('question-screen');
    const questionText = document.getElementById('question-text');
    const answersDiv = document.getElementById('answers');
    const resultScreen = document.getElementById('result-screen');
    const resultText = document.getElementById('result-text');
    const confettiCanvas = document.getElementById('confetti-canvas');
  
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
  
    let playerName = '';
    let steps = 0;
    let score = 0;
    let canMove = true;
    let level = 1;
    let stepSinceQuestion = 0;
  
    // Барлық деңгейдегі лабиринттер
    const mazes = [

  // 🔹 1-деңгей (оңай)
  [
    [0,0,0,0,1,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,0,1,0],
    [0,0,0,0,0,0,1,0,0,0],
    [1,1,1,1,1,0,1,1,1,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,1,1,0,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,1,2], // 2 = шығу
    [0,1,1,1,1,1,1,0,0,0],
  ],

  // 🔹 2-деңгей (орташа)
  [
    [0,1,0,0,0,1,0,0,0,0],
    [0,1,0,1,0,1,0,1,1,0],
    [0,0,0,1,0,0,0,1,0,0],
    [1,1,0,1,1,1,0,1,0,1],
    [0,0,0,0,0,1,0,0,0,0],
    [0,1,1,1,0,1,1,1,1,0],
    [0,0,0,1,0,0,0,0,1,0],
    [1,1,0,1,1,1,1,0,1,0],
    [0,0,0,0,0,0,1,0,0,2],
    [0,1,1,1,1,0,0,0,1,0],
  ],

  // 🔹 3-деңгей (қиын)
  [
    [0,1,1,1,0,0,0,1,0,0],
    [0,0,0,1,0,1,0,1,0,1],
    [1,1,0,1,0,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,0],
    [0,1,1,1,0,0,0,0,1,0],
    [0,0,0,1,1,1,1,0,1,0],
    [1,1,0,0,0,0,1,0,0,0],
    [0,0,0,1,1,0,1,1,1,0],
    [0,1,0,0,0,0,0,0,1,2],
    [0,1,1,1,1,1,1,0,0,0],
  ]

];
    
    let maze = [];
    let playerPos = {x:0,y:0};
  
    // 15

    const questions = [
  { q: "Аурухана жер телімін таңдауда ең маңызды фактор:", options: ["A) Қала орталығына жақындық", "B) Экологиялық тазалық", "C) Бағаның арзандығы", "D) Көлік көптігі"], answer: "B) Экологиялық тазалық" },
  { q: "Жел бағыты ескерілмесе қандай қауіп туындайды?", options: ["A) Шу көбейеді", "B) Аурухана ластанған ауада қалады", "C) Су жетіспейді", "D) Жарық азаяды"], answer: "B) Аурухана ластанған ауада қалады" },
  { q: "Павильондық құрылыс жүйесінің артықшылығы:", options: ["A) Арзан", "B) Инфекцияның таралуы аз", "C) Бір ғимаратта орналасу", "D) Қызмет көрсету жылдам"], answer: "B) Инфекцияның таралуы аз" },
  { q: "Орталықтандырылған жүйенің кемшілігі:", options: ["A) Қымбат емес", "B) Инфекция тез тарайды", "C) Құрылыс қиын", "D) Бөлімдер бөлек"], answer: "B) Инфекция тез тарайды" },
  { q: "Палата бөлімінің негізгі қызметі:", options: ["A) Диагностика", "B) Операция жасау", "C) Науқастарды орналастыру және емдеу", "D) Құжат толтыру"], answer: "C) Науқастарды орналастыру және емдеу" },
  { q: "Бір науқасқа палатада қанша м² қажет?", options: ["A) 3 м²", "B) 5 м²", "C) 7 м²", "D) 10 м²"], answer: "C) 7 м²" },
  { q: "Емдеу-диагностикалық бөлімге жатады:", options: ["A) Асхана", "B) Рентген кабинеті", "C) Қойма", "D) Кір жуатын бөлме"], answer: "B) Рентген кабинеті" },
  { q: "Аурухана ішілік инфекция дегеніміз:", options: ["A) Үйде жұққан ауру", "B) Ауруханада жұққан инфекция", "C) Тұқым қуалайтын ауру", "D) Созылмалы ауру"], answer: "B) Ауруханада жұққан инфекция" },
  { q: "Аурухана ішілік инфекцияның негізгі таралу жолы:", options: ["A) Тамақ арқылы", "B) Қол арқылы", "C) Су арқылы", "D) Күн арқылы"], answer: "B) Қол арқылы" },
  { q: "Инфекцияның алдын алуда ең тиімді әдіс:", options: ["A) Терезе ашу", "B) Қол жуу", "C) Жарықты азайту", "D) Дыбысты азайту"], answer: "B) Қол жуу" },
  
  // 11-20
  { q: "Хирургиялық бөлімде ең маңызды талап:", options: ["A) Жарық", "B) Стерильдік", "C) Температура", "D) Шу"], answer: "B) Стерильдік" },
  { q: "Акушерлік бөлімнің ерекшелігі:", options: ["A) Ер адамдар емделеді", "B) Жүкті әйелдерге арналған", "C) Балаларға арналған", "D) Тек диагностика"], answer: "B) Жүкті әйелдерге арналған" },
  { q: "Балалар бөлімінде басты қауіп:", options: ["A) Шу", "B) Иммунитеттің әлсіздігі", "C) Жарық", "D) Температура"], answer: "B) Иммунитеттің әлсіздігі" },
  { q: "Қорғану режимінің мақсаты:", options: ["A) Ақша үнемдеу", "B) Инфекцияның таралуын болдырмау", "C) Ғимаратты сақтау", "D) Қызметкерлерді көбейту"], answer: "B) Инфекцияның таралуын болдырмау" },
  { q: "Қабылдау бөлімінің негізгі қызметі:", options: ["A) Операция жасау", "B) Науқасты қабылдау және тексеру", "C) Тамақ беру", "D) Демалыс ұйымдастыру"], answer: "B) Науқасты қабылдау және тексеру" }
];
    
    let questionsShownGlobal = []; // ← барлық деңгейде қайталанбайтындай глобалды
  
    startBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('player-name');
      if(!nameInput.value.trim()){ alert("Атыңызды енгізіңіз!"); return; }
      playerName = nameInput.value.trim();
      welcomeScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
  
      level = 1; score = 0; steps = 0; stepSinceQuestion = 0;
      questionsShownGlobal = [];
      levelCount.textContent = level; stepsCount.textContent = steps;
      maze = JSON.parse(JSON.stringify(mazes[level-1]));
      playerPos={x:0,y:0};
      drawMaze();
    });
  
    function drawMaze(){
      mazeContainer.innerHTML='';
      for(let y=0;y<10;y++){
        for(let x=0;x<10;x++){
          const cell=document.createElement('div');
          cell.classList.add('cell');
          if(maze[y][x]===1) cell.classList.add('wall');
          if(maze[y][x]===2) cell.classList.add('exit');
          if(playerPos.x===x && playerPos.y===y) cell.classList.add('player');
          mazeContainer.appendChild(cell);
        }
      }
    }
  
    function move(dx,dy){
      if(!canMove) return;
      const nx=playerPos.x+dx, ny=playerPos.y+dy;
      if(nx<0||nx>=10||ny<0||ny>=10) return;
      if(maze[ny][nx]===1) return;
  
      playerPos={x:nx,y:ny};
      steps++; stepSinceQuestion++; stepsCount.textContent=steps;
      drawMaze();
  
      if(stepSinceQuestion>=3){ showQuestion(); stepSinceQuestion=0; }
      if(maze[ny][nx]===2){ nextLevel(); }
    }
  
    function showQuestion(){
      canMove=false;
      let availableQuestions = questions.filter((_,i)=>!questionsShownGlobal.includes(i));
      if(availableQuestions.length===0) return;
      const qIndex = questions.indexOf(availableQuestions[Math.floor(Math.random()*availableQuestions.length)]);
      questionsShownGlobal.push(qIndex);
      const q = questions[qIndex];
  
      questionText.textContent=q.q;
      answersDiv.innerHTML='';
      questionScreen.classList.remove('hidden');
  
      q.options.forEach(opt=>{
        const btn=document.createElement('button');
        btn.textContent=opt;
        btn.onclick=()=>{
          if(opt===q.answer){ 
            score++; 
            btn.style.backgroundColor='green'; 
          } else { 
            btn.style.backgroundColor='red'; 
            // дұрыс жауапты көрсету
            Array.from(answersDiv.children).forEach(b=>{
              if(b.textContent===q.answer) b.style.backgroundColor='green';
            });
          }
          setTimeout(()=>{
            questionScreen.classList.add('hidden');
            questionText.textContent=''; answersDiv.innerHTML=''; canMove=true;
          },800);
        };
        answersDiv.appendChild(btn);
      });
    }
  
    function nextLevel(){
      if(level<mazes.length){
        level++; levelCount.textContent=level;
        maze=JSON.parse(JSON.stringify(mazes[level-1]));
        playerPos={x:0,y:0}; steps=0; stepSinceQuestion=0;
        stepsCount.textContent=steps;
        drawMaze();
      } else { showResult(); }
    }
  
    function showResult(){
      gameScreen.classList.add('hidden');
      questionScreen.classList.add('hidden');
      resultScreen.classList.remove('hidden');
      resultText.textContent=`${playerName}, сіз барлық деңгейді аяқтадыңыз! Дұрыс жауаптар: ${score}/${questions.length}`;
      confettiCanvas.width=window.innerWidth;
      confettiCanvas.height=window.innerHeight;
      confetti.create(confettiCanvas,{resize:true})({particleCount:200,spread:160});
    }
  
    upBtn.onclick=()=>move(0,-1);
    downBtn.onclick=()=>move(0,1);
    leftBtn.onclick=()=>move(-1,0);
    rightBtn.onclick=()=>move(1,0);
  });
