alert("Velomy tompoko ny connexion alohany hilalao!Maztoa tompoko!")
const canvas = document.querySelector('canvas')
// Creation de l'espace de combat
const c = canvas.getContext('2d')
//dimensionde l'espace de combat
canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)
//Intégration de la gravité des joueurs
const gravity = 1.5
//Intégration de la gravité des joueurs
const background = new sprite({
    position:{
        x:0,
        y:0
    },
    //Source de l'image 
    imageSrc:'./img/background(3).jpg'
})
//Classe pour la décoration
const fire = new sprite({
    position:{
        x:750,
        y:220
    },
    //Source de l'image
    imageSrc:'./dec/loop.png',
    scale: 8.0,
    framesMax:8
})
//Creation du joueur
const player = new fighter({
    position:{
        x:200,
        y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset: {
        x:0,
        y:0
    },
    imageSrc:'./huntress/idle.png',
    framesMax : 8,
    scale:2.75, 
    offset:{
        x:175,
        y:110
    },
    sprites:{
        idle:{
            imageSrc:'./huntress/idle.png',
            framesMax : 8
        },
        run:{
            imageSrc:'./huntress/run.png',
            framesMax : 8
        },
        jump:{
            imageSrc:'./huntress/jump.png',
            framesMax : 2
        },
        fall:{
            imageSrc:'./huntress/fall.png',
            framesMax : 2
        },
        attack1:{
            imageSrc:'./huntress/Attack1.png',
            framesMax : 5
        },
        takeHit:{
            imageSrc:'./huntress/Take hit.png',
            framesMax : 3
        },
        death:{
            imageSrc:'./huntress/Death.png',
            framesMax : 8
        }
    },
    attackBox:{
        offset:{
            x:70,
            y:60
        },
        width:100,
        height:50
    }
})
// Creation de l'enemi
const enemy = new fighter({
    position:{
        x:700,
        y:100
    },
    velocity:{
        x:0,
        y:0
    },
    color:'blue',
    offset: {
        x:-50,
        y:0
    },
    imageSrc:'./evil/idle.png',
    framesMax : 8,
    scale:1.90, 
    offset:{
        x:175,
        y:162
    },
    sprites:{
        idle:{
            imageSrc:'./evil/idle.png',
            framesMax : 8
        },
        run:{
            imageSrc:'./evil/run.png',
            framesMax : 8
        },
        jump:{
            imageSrc:'./evil/jump.png',
            framesMax : 2
        },
        fall:{
            imageSrc:'./evil/fall.png',
            framesMax : 2
        },
        attack1:{
            imageSrc:'./evil/Attack1.png',
            framesMax : 8
        },
        takeHit:{
            imageSrc:'./evil/Takehit.png',
            framesMax : 3
        },
        death:{
            imageSrc:'./evil/Death1.png',
            framesMax : 7
        }
    },
    attackBox:{
        offset:{
            x:-150,
            y: 60
        },
        width:150,
        height:50
    }
})

const keys = {
    q:{
        pressed : false
    },
    d:{
        pressed : false
    },
    z:{
        pressed : false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowUp:{
        pressed:false
    }
}
//Compte à rebourd
decreaseTimer()
// Animation du joueur et de l'enemi 
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle='black'// Fond Noir(décor)
    c.fillRect(0,0,canvas.width,canvas.height)

    background.update()
    //fire.update()

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    //Mouvement du joueur 
    if(keys.q.pressed && player.lastkey==='q'){
        player.switchSprite('run')
        player.velocity.x = -5
    }
    else if(keys.d.pressed && player.lastkey==='d'){
        player.switchSprite('run')
        player.velocity.x = 5
    } else {
        player.switchSprite('idle')
    }
    //Condition pour faire sauter le joueur
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }
    // Mouvement de l'ennemi
    if(keys.ArrowLeft.pressed && enemy.lastkey==='ArrowLeft'){
        enemy.switchSprite('run')
        enemy.velocity.x = -5
    }
    else if(keys.ArrowRight.pressed && enemy.lastkey==='ArrowRight'){
        enemy.switchSprite('run')
        enemy.velocity.x = 5
    }else {
        enemy.switchSprite('idle')
    }
    //Condition pour faire sauter l'ennemi
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //Detecter la collision et le choc que l'ennemi va recevoir
    if(
        rectangulaCollision({
            rectangle1:player,
            rectangle2:enemy
        })
        && player.isAttacking && player.framesCurrent === 3
    ){
        enemy.takeHit()
        player.isAttacking = false
        //Réduire la barre de vie de l'ennemi
        gsap.to('#enemyHealth',{
            width : enemy.health + '%'
        })
    }

    //Condition si ne joueur ne touche pas l'ennemi
    if(player.isAttacking && player.framesCurrent === 3 ){
        player.isAttacking = false
    }

    //Detecter la collision et le choc que le joueur va recevoir
    if(
        rectangulaCollision({
            rectangle1:enemy,
            rectangle2:player
        })
        && enemy.isAttacking && enemy.framesCurrent === 4
    ){
        player.takeHit()
        enemy.isAttacking = false
        //Réduire la barre de vie du joueur
        gsap.to('#playerHealth',{
            width : player.health + '%'
        })
    }

    //Condition si ne l'ennemi ne touche pas le joueur 
    if(enemy.isAttacking && enemy.framesCurrent === 4 ){
        enemy.isAttacking = false
    }
    //determiner le gagnant
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy,timerId})
    }
}
animate()

/*Ajout de l' evenements qui deplace 
le joueur et l'ennemi via le clavier */
window.addEventListener('keydown',(event)=>{
    if(!player.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed = true
                player.lastkey='d'
                break;
            case 'q':
                keys.q.pressed = true
                player.lastkey='q'
                break;
            case 'z':
                player.velocity.y = -20
                break;
            case ' ':
                player.attack()
                break;
    }
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey='ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey='ArrowLeft'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20
            break;
        case 'ArrowDown':
            enemy.attack()
            break;
        }
    }
    }

})
/*Ajout de l' evenements qui arrete le deplacement 
du joueur et de l'ennemi via le clavier */
window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break;
        case 'q':
            keys.q.pressed = false
            break;
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
    }

})