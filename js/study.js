//VARIABLES
var myGamePiece;
var myObstacle = [];
var score = 0;
var coordinates = [];
var start_check = false;
var number_of_obstacles = 6;
var time_count = 0;
var end_comp;
var interval = 10;
var game_num=0;
var results=[];
var systemTime = "";
var todayDate = "";
var hori=0;
var vert=0;
var arr=[];
var collide_counter=0;
var starter_comp

//CODE
// Get system time 
function addZero(x,n) {
    while (x.toString().length < n) 
    {
        x = "0" + x;
    }
    return x;
}
function myTime(){
    var d = new Date();
    var h = addZero(d.getHours(), 2);
    var m = addZero(d.getMinutes(), 2);
    var s = addZero(d.getSeconds(), 2);
    var ms = addZero(d.getMilliseconds(), 3);
    systemTime = h + ":" + m + ":" + s + ":" + ms;
    return systemTime;
}
// Get system date
function mySystemDate() { 
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    todayDate = mm + "/" + dd + "/" + yyyy;
    return todayDate;
}

//GAMESTARTING Loop to initilise obstacles and gamepiece,updates every frame to ouput those same objects
function startGame() {
    myGamePiece = new component(35, 35, "images/penguin.png", -10, 150,0.4,0.35,"image");
    starter_comp = new component(22, 22, "red",-10, 150,0,0);
    end_comp = new component(40, 40, "images/igloo.png", 1210, 400,0,0,"image");

    for (i = 0; i < number_of_obstacles; i++) {
        if (i==0)
                    myObstacle.push(new component(20, 350, "red", 150 , 0,0,0));
                else if(i==1)
                    myObstacle.push(new component(20, 330, "red", 350 , 280,0,0));
                else if(i==2)
                    myObstacle.push(new component(20, 450, "red", 550 , 0,0,0));
                else if(i==3)
                    myObstacle.push(new component(20, 200, "red", 750 , 400,0,0));
                else if(i==4)
                    myObstacle.push(new component(20, 430, "red", 950 , 0,0,0));
                else if(i==5)
                    myObstacle.push(new component(20, 230, "red", 1100 , 370,0,0));
            }

    myGameArea.start();
}
//Main canvas and event listener loop
var myGameArea = {
            canvas: document.createElement("canvas"),
            start: function() {
                if(game_num==0){
                this.canvas.width = 1250;
                this.canvas.height =600;
                //this.canvas.style.cursor = "none"; //hide the original cursor
                this.context = this.canvas.getContext("2d");
                document.body.insertBefore(this.canvas, document.body.childNodes[0]);
                this.interval = setInterval(updateGameArea, interval); //number of updates in ms and can be seen (speed in x effectively)
                this.context.font = "30px Verdana green";
                this.context.fillText("Click and hold you mouse to start playing!", this.canvas.width / 2 - 250, this.canvas.height / 2);
                myGamePiece.update();
                end_comp.update();
                starter_comp.update();
                window.addEventListener('mousedown', function(event) {
                    if (game_num==0) {
                        start_check = true;
                        game_num=1
                    }
                })
                window.addEventListener('mousemove', function(e) {
                    myGameArea.y = e.clientY * 1.20;         //multiplier can be used to control the speed of the y coordinate
                })
            }
            else{
                this.canvas.width = 1250;
                this.canvas.height = 600;
                //this.canvas.style.cursor = "none"; //hide the original cursor
                this.context = this.canvas.getContext("2d");
                document.body.insertBefore(this.canvas, document.body.childNodes[0]);
                this.interval = setInterval(updateGameArea, interval); //number of updates in ms and can be seen (speed in x effectively)
                this.context.font = "40px Verdana green";
                this.context.fillText("Well done! Click next to play again!", this.canvas.width / 2 - 250, this.canvas.height / 2);
                myGamePiece.update();
                end_comp.update();
                window.removeEventListener('mousedown', function(event) {
                    if (event.keyCode == 80) {
                        start_check = false;
                    }
                })
            }

             },
                //display on screen
        clear: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = "#000";
            this.context.font = "12px Times";
            this.context.fillText("Score : " + score, 20, 20);
            this.context.fillText("Time : " + systemTime+"secs", 20, 40);
            this.context.fillText("GameCounter : " + time_count/100 +"secs", 20, 60);

    }
}
//COMPONENT MAKING FUNCTION
function component(width, height, color, x, y,gravity,gravitySpeed,type) {
            this.type=type;
            if(type=="image"){
                this.image=new Image();
                this.image.src=color;
            }
            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;
            this.color = color;
            this.collide = false;
            this.gravity = gravity; //initial gravity value, depend and adust later accordingly
            this.gravitySpeed = gravitySpeed; //speed of initial gravity value
            this.update = function() {
                ctx = myGameArea.context;
                if (type == "image"){
                    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
                }else{
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            }
            this.newPos = function() {
                this.hitBottom();
            }
            this.hitBottom = function() {
                var rockbottom = myGameArea.canvas.height - myGamePiece.height;
                if (this.y > rockbottom) {
                    this.y = rockbottom;
                }
            }

        }
//OBJECT COLLISION AND DETECTION LOOP
function detectCollision(gp) {
    for (i = 0; i < myObstacle.length; i++) {
        if ((myObstacle[i].x - myObstacle[i].width / 2) <= gp.x && (myObstacle[i].x + myObstacle[i].width / 2) >= gp.x) {
            if (myObstacle[i].y <= gp.y + gp.height && (myObstacle[i].y + myObstacle[i].height) >= gp.y) {
                if (myObstacle[i].collide ==false) {    //change this to true if you want multiple object collision at the same object if it goes through
                    score =(score*100);
                    myObstacle[i].collide = true;
                    collide_counter +=1;
                    myObstacle[i].color = "yellow";
                }
            }
        }
    }
//OBSTACLE DETECTON WITH THE LAST COMPONENT TO END THE GAME AND FORCE A RESTART
    if (end_comp.x - (end_comp.width / 2) <= gp.x && end_comp.x + (end_comp.width / 2) >= gp.x) {

        if (end_comp.y <= gp.y + gp.height && end_comp.y + end_comp.height >= gp.y) {
            //write code here to dump co-ordinates array
            header = "SystemTime,\tSystemDate,\tGameTimer,\tX_Coordinate,\tY_Coordinate,\tScore,\tCollision\n";
            results.push(header);
            save_result();
            //
            this.myGameArea.clear();
            start_check = false;
            myGamePiece = null
            myObstacle = [];
            score = 0;
            coordinates = [];
            time_count = 0;
            end_comp = null;
            interval *= 7.5;
            game_num==1;
            this.startGame();
        }
    }
}

//FUNCTION TO RESTART AFTER 3 SECS INCASE GAME IS NOT ENDED BY GAMEPIECE
async function restart() {
    //write the coordinates array saving code here too
    header = "SystemTime,\tSystemDate,\tGameTimer,\tX_Coordinate,\tY_Coordinate,\tScore,\tCollision\n";
    results.push(header);
    save_result();
    //
    await new Promise(r => setTimeout(r, 1));
    this.myGameArea.clear(); 
    myGamePiece = null;
    myObstacle = [];
    score = 0;
    coordinates = [];
    start_check = false;
    time_count = 0;
    end_comp = null;
    interval *= 7.5;
    game_num=1;
    this.startGame();
}

//TRAJECTORY CALCULTOR FUNCTION
function trajectory(xx,yy){
    var u=100;  //speed of the pixel per seconds
    var h;
    var v;
    var p1={
        h:0,
        v:0
    };
    var p2={
        h:xx,
        v:yy
    }
    var angleRadians = Math.atan2(p2.v - p1.v, p2.h - p1.h);
    hori=u*Math.cos(angleRadians);
    vert=u*Math.sin(angleRadians);
    arr=[hori,vert]
    return arr;

}

//THE ESSENTIAL GAME LOOP WHICH UPDATES THE SCORES,SAVES THEM in ARRAY and UPATES POSITIONS,etc
function updateGameArea() {
    if (start_check == true) {
        myGameArea.clear();
        end_comp.update();
        for (i = 0; i < myObstacle.length; i++) {
            myObstacle[i].update();
        }
        this.detectCollision(myGamePiece);
        myTime();
        mySystemDate();
        //trajectory(myGamePiece.x,myGamePiece.y);
        coordinates.push(systemTime,todayDate,((time_count/100).toPrecision(3)))
        coordinates.push(myGamePiece.x)
        coordinates.push(-1*myGamePiece.y)
        coordinates.push(score,collide_counter,"\n")
        
        time_count += 1;
        myGamePiece.update();
        if (myGamePiece.x <= 1200 - myGamePiece.width / 2) {
            if (time_count % 1 == 0)     //Number of ms frames after which to update the score
            score -= 1;
            myGamePiece.x += 1 //make it move in the x direction itself
            myGamePiece.gravitySpeed += myGamePiece.gravity;
            myGamePiece.y = myGameArea.y + myGamePiece.gravitySpeed;
            myGamePiece.newPos();
        }
        if (myGamePiece.x > 1200 - myGamePiece.width / 2) {
            this.restart();
        }

    }

}
//SAVING RESULT TO OUTPUT DOWNLOADBLE FILE ON THE COMPUTER
function save_result(){
            //temResult += time + '\t'  + GamePiece_x + '\t'  + GamePiece_Y + '\t'  + Score;
            //results.push(temResult);
            var textToWrite=results.join("\n")+coordinates+ "\n" ;
            var blob = new Blob([textToWrite], { type: 'text/plain' });
            saveAs(blob, "results.csv");
}



