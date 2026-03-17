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
    let questionIndex = 0;
    let canMove = true;
    let level = 1;
    let stepSinceQuestion = 0;
    
    let mazes = [
      // 5 деңгейлік лабиринттер (10x10)
      [
        [0,1,0,0,0,0,1,0,0,0],
        [0,1,0,1,1,0,1,0,1,0],
        [0,0,0,0,1,0,0,0,1,0],
        [1,1,1,0,1,1,1,0,1,0],
        [0,0,0,0,0,0,1,0,0,0],
        [0,1,1,1,1,0,1,1,1,0],
        [0,0,0,0,1,0,0,0,0,2],
        [0,1,1,0,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,0,0,0]
      ],
      [
        [0,1,0,1,0,0,1,0,1,0],
        [0,0,0,1,0,1,0,0,1,0],
        [1,1,0,1,0,1,0,1,1,0],
        [0,0,0,0,0,1,0,0,0,0],
        [0,1,1,1,0,1,1,1,1,0],
        [0,0,0,1,0,0,0,1,0,2],
        [0,1,0,1,1,1,0,1,0,0],
        [0,0,0,0,0,0,0,1,1,0],
        [1,1,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,0]
      ],
      [
        [0,0,1,1,0,0,0,1,0,0],
        [1,0,1,0,1,1,0,1,0,2],
        [1,0,0,0,0,1,0,0,0,1],
        [0,1,1,1,0,1,1,1,0,1],
        [0,0,0,1,0,0,0,1,0,0],
        [1,1,0,1,1,1,0,1,1,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,0]
      ],
      [
        [0,1,1,0,0,0,1,0,0,0],
        [0,0,1,0,1,0,1,1,1,0],
        [1,0,0,0,1,0,0,0,0,2],
        [0,1,1,1,1,1,1,1,0,1],
        [0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,0,1,1,1,0],
        [0,0,0,0,1,0,0,0,0,0],
        [0,1,0,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,0]
      ],
      [
        [0,0,0,1,1,0,0,0,1,0],
        [1,1,0,1,0,1,1,0,1,2],
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,0,1],
        [0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,1,1,1,0,1,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,0]
      ]
    ];
    
    let maze = [];
    let playerPos = {x:0,y:0};
    
    // 15 медициналық сұрақ
    const questions = [
        {q:"Қай витамин көзді жақсартады?", options:["A: Витамин A","B: Витамин B","C: Витамин C","D: Витамин D"], answer:"A: Витамин A"},
        {q:"Жүрек қанайналым жүйесінің негізгі қызметі қандай?", options:["A: Ас қорыту","B: Қан тасымалдау","C: Өсу","D: Сезімталдық"], answer:"B: Қан тасымалдау"},
        {q:"Саңырауқұлақтар қандай қоректік затқа бай?", options:["A: Май","B: Ақуыз","C: Сахароза","D: Кальций"], answer:"B: Ақуыз"},
        {q:"Қандай қан қысымы қалыпты?", options:["A: 120/80","B: 140/90","C: 160/100","D: 100/70"], answer:"A: 120/80"},
        {q:"Антибиотиктер не үшін қолданылады?", options:["A: Вирустарға","B: Бактерияларға","C: Су үшін","D: Энергия үшін"], answer:"B: Бактерияларға"},
        {q:"Қан құрамындағы глюкоза деңгейі?", options:["A: 70-100","B: 150-200","C: 30-50","D: 200-250"], answer:"A: 70-100"},
        {q:"Дем алу мүшесі?", options:["A: Жүрек","B: Өкпе","C: Бауыр","D: Бүйрек"], answer:"B: Өкпе"},
        {q:"Вакцина не үшін қажет?", options:["A: Ауруларды алдын алу","B: Өсу үшін","C: Энергия үшін","D: Ас қорыту"], answer:"A: Ауруларды алдын алу"},
        {q:"Қан тобы AB дегеніміз?", options:["A: Бірінші","B: Қарама-қайшы","C: Барлық антигендер бар","D: Ешбір"], answer:"C: Барлық антигендер бар"},
        {q:"Саңырауқұлақтарды қандай ортада өсіреді?", options:["A: Сулы","B: Құрғақ","C: Ыстық","D: Суық"], answer:"A: Сулы"},
        {q:"Қанның негізгі компоненті?", options:["A: Плазма","B: Ас қорыту","C: Өсу","D: Энергия"], answer:"A: Плазма"},
        {q:"Қан құрамында не бар?", options:["A: Қан жасушалары","B: Тек су","C: Май","D: Қант"], answer:"A: Қан жасушалары"},
        {q:"Жүрек қандай бұлшықет?", options:["A: Қаңқа","B: Жүрек","C: Жалпақ","D: Скелет"], answer:"B: Жүрек"},
        {q:"Симптом дегеніміз?", options:["A: Көрсеткіш","B: Ауру белгісі","C: Дәрі","D: Жағдай"], answer:"B: Ауру белгісі"},
        {q:"Гипертония қан қысымы?", options:["A: 120/80","B: 140/90","C: 100/70","D: 110/80"], answer:"B: 140/90"},
    ];
    
    // Бастау кнопкасы
    startBtn.addEventListener('click', ()=>{
      const nameInput = document.getElementById('player-name');
      if(!nameInput.value.trim()){ alert("Атыңызды енгізіңіз!"); return; }
      playerName = nameInput.value.trim();
      welcomeScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      level = 1; score=0; steps=0; questionIndex=0; stepSinceQuestion=0;
      levelCount.textContent = level; stepsCount.textContent = steps;
      maze = JSON.parse(JSON.stringify(mazes[level-1]));
      playerPos={x:0,y:0};
      drawMaze();
    });
    
    // Лабиринт суретін салу
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
    
    // Ойын қозғалысы
    function move(dx,dy){
      if(!canMove) return;
      const nx = playerPos.x + dx;
      const ny = playerPos.y + dy;
      if(nx<0||nx>=10||ny<0||ny>=10) return;
      if(maze[ny][nx]===1) return;
    
      playerPos = {x:nx,y:ny};
      steps++; stepSinceQuestion++;
      stepsCount.textContent = steps;
      drawMaze();
    
      if(stepSinceQuestion>=3 && questionIndex<questions.length){
        showQuestion();
        stepSinceQuestion=0;
      }
    
      if(maze[ny][nx]===2){
        nextLevel();
      }
    }
    
    // Сұрақ көрсету
    function showQuestion(){
      canMove=false;
      if(questionIndex>=questions.length) return;
    
      const q = questions[questionIndex];
      questionText.textContent = q.q;
      answersDiv.innerHTML='';
      questionScreen.classList.remove('hidden');
    
      q.options.forEach(opt=>{
        const btn=document.createElement('button');
        btn.textContent=opt;
        btn.onclick=()=>{
          if(opt===q.answer){
            score++;
            btn.classList.add('correct');
          } else {
            btn.classList.add('wrong');
          }
          setTimeout(()=>{
            questionScreen.classList.add('hidden');
            questionText.textContent='';
            answersDiv.innerHTML='';
            canMove=true;
            questionIndex++;
          },500);
        };
        answersDiv.appendChild(btn);
      });
    }
    
    // Деңгей өзгерту
    function nextLevel(){
      if(level<5){
        level++;
        levelCount.textContent=level;
        maze = JSON.parse(JSON.stringify(mazes[level-1]));
        playerPos={x:0,y:0};
        steps=0; stepSinceQuestion=0; questionIndex=0;
        stepsCount.textContent=steps;
        drawMaze();
      } else {
        showResult();
      }
    }
    
    // Нәтиже + салют
    function showResult(){
      gameScreen.classList.add('hidden');
      questionScreen.classList.add('hidden');
      resultScreen.classList.remove('hidden');
      resultText.textContent = `${playerName}, сіз барлық деңгейді аяқтадыңыз! Дұрыс жауаптар: ${score}/15`;
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
      confetti.create(confettiCanvas,{resize:true})({particleCount:200, spread:160});
    }
    
    // Кнопкалар қозғалысы
    upBtn.onclick=()=>move(0,-1);
    downBtn.onclick=()=>move(0,1);
    leftBtn.onclick=()=>move(-1,0);
    rightBtn.onclick=()=>move(1,0);
    });