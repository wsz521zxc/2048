var tetris={
	RN:20,
	CN:10,
	CSIZE:26,
	OFFSET:15,
	pg:null,
	shape:null,
	timer:null,
	interval:500,
	wall:null,
	lines:0,
	score:0,
	SCORE:[0,10,30,60,100],
	state:1,
	RUNNING:1,
	GAMEOVER:0,
	PAUSE:2,

	start:function(){
		this.state=this.RUNNING;
		this.wall=[];
		for(var r=0;r<this.RN;r++){
			this.wall.push(new Array(this.CN));
		};
		this.pg=document.getElementsByClassName("playground")[0];
		this.shape=this.randomShape();
		this.nextShape=this.randomShape();
		this.paint();
		this.timer=setInterval(this.moveDown.bind(this),this.interval);
		document.onkeydown=function(e){
			switch(e.keyCode){
				case 37:this.state==this.RUNNING && this.moveLeft(); break;
				case 39:this.state==this.RUNNING && this.moveRight(); break;
				case 40:this.state==this.RUNNING && this.moveDown(); break;
				case 32:this.state==this.RUNNING && this.hardDrop(); break;
				case 38:this.state==this.RUNNING && this.rotateR(); break;
				case 90:this.state==this.RUNNING && this.rotateL(); break;
				case 80:this.state==this.RUNNING && this.pause(); break;
				case 67:this.state==this.PAUSE && this.myContinue(); break;
				case 81:this.state==this.RUNNING && this.gameOver(); break;
				case 83:this.state==this.GAMEOVER && this.start(); break;
			}
		}.bind(this);
	},
	
	pause:function(){
		this.state=this.PAUSE;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},

	myContinue:function(){
		this.state=this.RUNNING;
		this.timer=setInterval(this.moveDown.bind(this),this.interval);
	},

	canRotate:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r<0||cell.r>=this.RN
				||cell.c<0||cell.c>=this.CN
				||this.wall[cell.r][cell.c]!==undefined){
					return false;
				}
		}
		return true;
	},

	rotateR:function(){
		this.shape.rotateR();
		if(!this.canRotate()){
			this.shape.rotateL();
		}else{
			this.paint();
		}
	},

	rotateL:function(){
		this.shape.rotateL();
		if(!this.canRotate()){
			this.shape.rotateR();
		}else{
			this.paint();
		}
	},

	hardDrop:function(){
		while(this.canDown()){
			this.shape.moveDown();
		}
		this.paint();
	},

	canLeft:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0 || this.wall[cell.r][cell.c-1]!=undefined){
				return false;
			}
		}
		return true;
	},

	moveLeft:function(){
		if(this.canLeft()){
			this.shape.moveLeft();
			this.paint();
		}
	},

	canRight:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1 || this.wall[cell.r][cell.c+1]!=undefined){
				return false;
			}
		}
		return true;
	},

	moveRight:function(){
		if(this.canRight()){
			this.shape.moveRight();
			this.paint();
		}
	},

	canDown:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r==this.RN-1 || this.wall[cell.r+1][cell.c]!==undefined){
				return false;
			}
		}
		return true;
	},  

	moveDown:function(){
		if(this.canDown()){
			this.shape.moveDown();
		}else{
			this.landIntoWall();
			var ln=this.deleteRows();
			this.score+=this.SCORE[ln];
			this.lines+=ln;
			if(!this.isGameOver()){
				this.shape=this.nextShape;
				this.nextShape=this.randomShape();
			}else{
				this.state=this.GAMEOVER;
				clearInterval(this.timer);
				timer=null;
			}
		}
		this.paint();
	},
	
	isGameOver:function(){
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]!==undefined){return true}
		}
		return false;
	},

	paintState:function(){
		if(this.state==this.GAMEOVER){
			var img=new Image();
			img.src="img/game-over.png";
			this.pg.appendChild(img);
		}else if(this.state==this.PAUSE){
			var img=new Image();
			img.src="img/pause.png";
			this.pg.appendChild(img);
		}
	},

	deleteRows:function(){
		for(var r=this.RN-1,ln=0;r>=0;r--){	
			if(this.wall[r].join("")=="" || (ln==4)){break}
			if(this.isFullRow(r)){
				this.deleteRow(r);
				r++;
				ln++;
			}
		}
		return ln;
	},
	
	isFullRow:function(r){
		return String(this.wall[r]).search(/^,|,,|,$/)==-1
	},

	deleteRow:function(r){
		for(;r>=0;r--){
			this.wall[r]=this.wall[r-1];
			this.wall[r-1]=new Array(this.CN);
			for(var c=0;c<this.CN;c++){
				if(this.wall[r][c]!==undefined){
					this.wall[r][c].r++}
			}
			if(this.wall[r-2].join("")==""){break}
		}
	},

	landIntoWall:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			this.wall[cell.r][cell.c]=cell;
		}
	},

	randomShape:function(){
		var r=Math.floor(Math.random()*7);
		switch(r){
		  case 0: return new T();
		  case 1: return new I();
		  case 2: return new T();
		  case 3: return new S();
		  case 4: return new Z();
		  case 5: return new L();
		  case 6: return new J();
		}
	},

	paint:function(){
		this.pg.innerHTML=this.pg.innerHTML.replace(/<img\s[^>]+>/g,"");
		this.paintShape();
		this.paintWall();
		this.paintNext();
		this.paintScore();
		this.paintState();
	},

	paintScore:function(){
		document.getElementById("score").innerHTML=this.score;
		document.getElementById("lines").innerHTML=this.lines;
	},

	paintNext:function(){
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			var img=this.paintCell(this.nextShape.cells[i],frag);
			img.style.top=parseFloat(img.style.top)+this.CSIZE+"px";
			img.style.left=parseFloat(img.style.left)+this.CSIZE*10+"px";
		}
		this.pg.appendChild(frag);
	},

	paintWall:function(){
		var frag=document.createDocumentFragment();
		for(var r=this.RN-1;r>=0;r--){
			if(this.wall[r].join("")!=""){
				for(var c=0;c<this.CN;c++){
					if(this.wall[r][c]){
						this.paintCell(this.wall[r][c],frag);
					}
				}  
			}else{break;}
		}
		this.pg.appendChild(frag);
	},

	paintCell:function(cell,frag){
		var img=new Image();
		img.src=cell.src;
		img.style.width=this.CSIZE+"px";
		img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
		img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
		frag.appendChild(img);
		return img;
	},

	paintShape:function(){
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.shape.cells.length;i++){
			this.paintCell(
				this.shape.cells[i],frag);
		}
		this.pg.appendChild(frag);
	},

}

tetris.start();