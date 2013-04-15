/* game.js
 * Louis Rassaby
 */

score = 0;
hiscore = 0;

starttime = 0;
timelimit = 120;
timeremaining = timelimit;
newgame = true;

numlives = 5;   /* includes current frog */
levelnumber = 1;
time = 0;
vehicles_per_row = 2;
vehicle_randomness = 15;
vehicle_rows = 7;

logs_per_row = 2;
log_randomness = 30;
log_rows = 6;

safefrogs = [];
frogsafe = false;

speeds = {
	frog: 29,
	vehicles: 4,
	logs: 4
}

points = {
	frog_forward: 10,
	frog_home: 50,
	five_frogs: 1000,
	time_remaining: 10,  /* per second remaining */
}

safezones = [];

function Item (sx, sy, swidth, sheight, x, y, width, height, speed, direction) {
	this.sx = sx;
	this.sy = sy;
	this.swidth = swidth;
	this.sheight = sheight;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.direction = direction;
	
	this.moveright = function () {
		newx = this.x + this.speed;
		if(newx > ctx.canvas.width) {
			newx = -this.width;
		}
		if(this.direction == "any") {
			if(ctx.canvas.width - this.x - this.width <= this.speed) {
				newx = ctx.canvas.width - this.width;
			}
			this.sx = 10;
			this.sy = 334;
			$.playSound("assets/frogmove.mp3");
		}
		this.x = newx;
	}
	this.moveleft = function () {
		newx = this.x - this.speed;
		if(newx < -this.width) {
			newx = ctx.canvas.width;
		}
		if(this.direction == "any") {
			if(this.x <= this.speed) {
				newx = 0;
			}
			this.sx = 80;
			this.sy = 335;
			$.playSound("assets/frogmove.mp3");
		}
		this.x = newx;
	}
	this.moveup = function () {
		this.y -= this.speed;
		if(this.y < 50) {
			score -= points.frog_forward;
			this.y = 50;
		}
		this.sx = 10;
		this.sy = 366;
		$.playSound("assets/frogmove.mp3");
		score += points.frog_forward;
	}
	this.movedown = function () {
		this.y += this.speed;
		if(this.y > 505) {
			score += points.frog_forward;
			this.y = 505;
		}
		this.sx = 79;
		this.sy = 366;
		$.playSound("assets/frogmove.mp3");
		score -= points.frog_forward;
	}
	
	this.drawme = function () {
		ctx.drawImage(img, this.sx, this.sy, this.swidth, this.sheight, this.x, this.y, this.width, this.height);
	}
}


function reset() {
	if(numlives == 0 || timeremaining <= 0) {
		$.playSound("assets/death.mp3");
		//level
		if(hiscore < score) {
			hiscore = score;
		}
		var player_name = prompt("Please enter your name!","YOUR NAME HERE");
		$.post("http://fierce-stream-1211.herokuapp.com/submit.json",{game_title: "Frogger",
username:player_name,score:score,created_at:new Date()});
		score = 0;
		newgame = true;
	}
	if(newgame == true){
		score = 0;
		
		timelimit = 120;
		timeremaining = timelimit;
		
		numlives = 5;   /* includes current frog */
		levelnumber = 1;
		time = 0;
		vehicles_per_row = 2;
		vehicle_randomness = 15;
		vehicle_rows = 7;
		
		logs_per_row = 2;
		log_randomness = 30;
		log_rows = 6;
		starttime = new Date();
		newgame = false;
		safefrogs = [];
		
		newgame = false;
		frogsafe = false;
	} else if (frogsafe==true) {
		frogsafe = false;
	} else {
		$.playSound("assets/death.mp3");
	}
	
	items = new Object();
	items.vehicles = [];
	distance_apart = Math.floor(ctx.canvas.width/vehicles_per_row);
	/* make vehicles */
	for(var i = 0; i < vehicle_rows; i++) {
		var speed = speeds.vehicles - Math.floor(Math.random() * 3);
		if((i+speed+numlives)%2 == 0){
			for(var j = 0; j < vehicles_per_row; j++) {
				if((i%3)%2) {
					items.vehicles.push(new Item(42, 261, 34, 29, j * distance_apart - Math.floor(Math.random()*vehicle_randomness) * i, 300 + i * 29, 34, 29, speed, "right"));
				} else {
					items.vehicles.push(new Item(10, 266, 34, 29, j * distance_apart - Math.floor(Math.random()*vehicle_randomness) * i, 300 + i * 29, 34, 29, speed - 1, "right"));
				}
			}
		} else { 
			if((i%3)%2) {
				for(var j = 0; j < vehicles_per_row; j++) {
					items.vehicles.push(new Item(77, 261, 34, 29, j * distance_apart - Math.floor(Math.random()*vehicle_randomness) * i, 300 + i * 29, 34, 29, speed, "left"));
				}
			} else {
				for(var j = 0; j < vehicles_per_row; j++) {
					items.vehicles.push(new Item(104, 300, 51, 24, j * distance_apart - Math.floor(Math.random()*vehicle_randomness) * i, 303 + i * 29, 51, 24, speed + 1, "left"));
				}
			}
			
		}
	}
		
	items.logs = [];
	distance_apart = Math.floor(ctx.canvas.width/logs_per_row);
	/* make logs */ 
	for(var i = 0; i < log_rows; i++) {
		var speed = speeds.logs - Math.floor(Math.random() * 3);
		if((i + numlives + safefrogs.length)%2 == 0){
			for(var j = 0; j < logs_per_row; j++) {
				items.logs.push(new Item(8, 190, 118, 34, j * distance_apart - Math.floor(Math.random()*log_randomness) * i, 98 + i * 29, 118, 34, speed, "right"));
			}
		} else { 
			for(var j = 0; j < logs_per_row; j++) {
				items.logs.push(new Item(8, 190, 118, 34, j * distance_apart - Math.floor(Math.random()*log_randomness) * i, 98 + i * 29, 118, 34, speed, "left"));
			}
		}
	}

	items.frog = new Item(10, 366, 24, 22, 185, 508, 24, 22, speeds.frog, "any");
}

function start_game() {
	$(document).ready(function(){
		delay = 40; // milliseconds
		ctx = document.getElementById('game').getContext('2d');
		reset();
		initialize();
		img.onload = function() {
			draw_board();
			setInterval(draw_board, delay); // draw refers to the function
		}
	});
}

function initialize() {
	img = new Image();
	img.src = 'assets/frogger_sprites.png';
	
	for(var i = 0; i < 5; i++) {
		safezones.push(new Item(-1, -1, -1, -1, 10 + i * 84.5, 72, 34, 32, -1, -1));
	}
	
    document.addEventListener("keydown", KeyDown, true);
    function KeyDown(evt)
    {
        var KeyID = evt.keyCode;
        switch(KeyID)
        {
            case 37:
            case 65:
                items.frog.moveleft();
                break;
            case 39:
            case 68:
                items.frog.moveright();
                break;
            case 38:
            case 87:
                items.frog.moveup();
                break;
            case 40:
            case 83:
                items.frog.movedown();
                break;
        }
    }
}


function draw_board() {
	add_backgrounds();
	add_static_elements();
	add_bottom_bar ();
	add_moving_pieces ();		
}

function add_backgrounds () {
	//water
	ctx.fillStyle = "#191970";
	ctx.fillRect(0, 0, 399, 280); 
	//road
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 280, 399, 285);
}

function add_static_elements () {
	//logo and goal
	ctx.drawImage(img, 0, 0, 399, 110, 0, 0, 399, 110);
	//middle bar
	ctx.drawImage(img, 0, 118, 399, 37, 0, 268, 399, 37);
	//bottom bar
	ctx.drawImage(img, 0, 118, 399, 37, 0, 500, 399, 37);
	//safe frogs
	for(var i in safefrogs) {
		safefrogs[i].drawme();
	}
}

function add_moving_pieces () {
	//log
	hitlog = false;
	for(var i in items.logs) {
		if(collision(items.logs[i], items.frog)) {
			if(items.logs[i].direction == "right") {
				items.frog.x += items.logs[i].speed;
			} else if(items.logs[i].direction == "left") {
				items.frog.x -= items.logs[i].speed;
			}
			hitlog = true;
		} 
		
		if(items.frog.x > ctx.canvas.width || items.frog.x < -items.frog.width) {
			numlives --;
			reset();
			return;
		}
		 
		if(items.logs[i].direction == "right"){
			items.logs[i].moveright();
		} else if(items.logs[i].direction == "left"){
			items.logs[i].moveleft();
		}
		
		items.logs[i].drawme();	
	}

	if(items.frog.y < 260 && hitlog == false) { 
		var safe = false;
		for(var i in safezones) {
			if(collision(items.frog, safezones[i])) {
				safe = true;
				zone = i;
				for(var j in safefrogs) {
					if(collision(items.frog, safefrogs[j])) safe = false;
				}
			}
		}
		if(safe == false) {
			numlives --;
			reset();
			return;
		} else {
			safefrogs.push(new Item(79, 366, 24, 22, 15 + zone * 84.5, 76, 24, 22, -1, -1));
			score += points.frog_home;
			$.playSound("assets/safefrog.mp3");
			frogsafe = true;
			if(safefrogs.length == 5) {
				score += points.five_frogs + points.time_remaining * timeremaining;
				starttime = new Date();
				levelnumber++;
				safefrogs = [];
				if(levelnumber%2){
					vehicles_per_row++;
					vehicle_randomness -= 4;
				} else {
					speeds.vehicles++;
					speeds.logs++;
				}

				speeds.vehicles++;
				speeds.logs++;
				$.playSound("assets/levelup.mp3");
			}
			reset();
			return;
		}
	}
	//cars
	for(var i in items.vehicles) {
		if(collision(items.vehicles[i], items.frog)) {
			numlives --;
			reset();
			return;
		}
		if(items.vehicles[i].direction == "right"){
			items.vehicles[i].moveright();
		} else if(items.vehicles[i].direction == "left"){
			items.vehicles[i].moveleft();
		}

		items.vehicles[i].drawme();	
	}
	//frog
	items.frog.drawme();
}

function add_bottom_bar () {
	ctx.fillStyle = "rgb(0, 255, 0)";
	//level
	ctx.font = "bold 18px Arial";
	ctx.fillText("Level " + levelnumber, 65, 550);
	//score and hiscore
	ctx.font = "bold 10px Arial";
	ctx.fillText("Score: " + score, 5, 562);
	ctx.fillText("Highscore: " + hiscore, 65, 562);
	ctx.font = "bold 18px Arial";
	time = new Date();
	timeremaining = Math.floor(timelimit-(time - starttime)/1000);
	ctx.fillText(("Time: " + timeremaining), 300, 555);
	if(timeremaining == 0) {
		numlives = 0;
		reset();
		return;
	}
	//life frogs
	for(i = 0; i < numlives-1; i++) {
			ctx.drawImage(img, 10, 334, 24, 24, 4 + 13*i, 538, 16, 16);
	}
}

function collision(obj1, obj2){
    if (obj1.x + obj1.width - 5 < obj2.x) {
      	return false;
    } else if (obj1.y + obj1.height - 5< obj2.y) {
      	return false;
    } else if (obj1.x > obj2.x + obj2.width - 5) {
      	return false;
    } else if (obj1.y > obj2.y + obj2.height- 5){
     	return false;
    } else {
    	return true;
    }
}

/* credit to https://github.com/admsev/jquery-play-sound */
(function($){
  $.extend({
    playSound: function(){
      return $("<embed src='"+arguments[0]+"' hidden='true' autostart='true' loop='false' class='playSound'>").appendTo('body');
    }
  });
})(jQuery);