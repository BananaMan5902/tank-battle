const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ---------- Assets ---------- */

function loadImage(path){
    const img = new Image();
    img.src = path;
    return img;
}

const shermanImg = loadImage("assets/sherman.png");
const tigerImg = loadImage("assets/tiger.png");

/* ---------- Sounds ---------- */

function playSound(path){
    const audio = new Audio(path);
    audio.play();
}

/* ---------- Game Objects ---------- */

let tanks = [
    {x:120,y:300,alive:true},
    {x:250,y:320,alive:true},
    {x:380,y:310,alive:true},
    {x:520,y:330,alive:true}
];

let tiger = {
    x:650,
    y:250,
    health:100
};

let bullets = [];
let explosions = [];

let muzzleFlash = false;

/* ---------- Player Controls ---------- */

canvas.addEventListener("click",()=>{
    shoot();
});

function shoot(){
    playSound("assets/shoot.wav");

    muzzleFlash = true;
    setTimeout(()=>muzzleFlash=false,100);

    bullets.push({
        x:100,
        y:250,
        speed:8
    });
}

/* ---------- Game Logic ---------- */

function update(){

    bullets.forEach(b=>{
        b.x += b.speed;

        // hit tiger
        if(
            b.x > tiger.x &&
            b.x < tiger.x+80 &&
            b.y > tiger.y &&
            b.y < tiger.y+80
        ){
            tiger.health -= 10;

            explosions.push({
                x:tiger.x,
                y:tiger.y,
                timer:30
            });

            playSound("assets/explosion.wav");
        }
    });

    bullets = bullets.filter(b=>b.x<900);

    explosions.forEach(e=>e.timer--);
    explosions = explosions.filter(e=>e.timer>0);

    if(tiger.health<=0){
        tiger.dead = true;
    }
}

/* ---------- Draw ---------- */

function draw(){

    ctx.clearRect(0,0,900,500);

    // draw tanks
    tanks.forEach(t=>{
        if(t.alive){
            ctx.drawImage(shermanImg,t.x,t.y,80,60);
        }
    });

    // draw tiger
    if(!tiger.dead){
        ctx.drawImage(tigerImg,tiger.x,tiger.y,90,70);
    }

    // muzzle flash
    if(muzzleFlash){
        ctx.fillStyle="yellow";
        ctx.beginPath();
        ctx.arc(100,250,15,0,Math.PI*2);
        ctx.fill();
    }

    // bullets
    ctx.fillStyle="yellow";
    bullets.forEach(b=>{
        ctx.fillRect(b.x,b.y,12,4);
    });

    // explosions
    ctx.fillStyle="orange";
    explosions.forEach(e=>{
        ctx.beginPath();
        ctx.arc(e.x,e.y,30,0,Math.PI*2);
        ctx.fill();
    });

    // HUD
    ctx.fillStyle="white";
    ctx.fillText("Tiger Health: "+tiger.health,700,30);
}

/* ---------- Main Loop ---------- */

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
