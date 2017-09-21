function Cell(r,c,src){
	this.r=r;
	this.c=c;
	this.src=src;
}

function Shape(cells,src,states,orgi){
	this.cells=cells;
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].src=src;
	}
	this.orgCell=this.cells[orgi];
	this.states=states;
	this.statei=0;
}

Shape.prototype={
	IMGS:{T:"img/T.png",O:"img/O.png",I:"img/I.png",S:"img/S.png",
		Z:"img/Z.png",L:"img/L.png",J:"img/J.png"},
	moveLeft:function(){
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].c--;
		}
	},
	moveRight:function(){
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].c++;
		}
	},
	moveDown:function(){
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].r++;
		}
	},
	rotateR:function(){
		this.statei++;
		this.statei==this.states.length && (this.statei=0);
		this.rotate();
	},
	rotate:function(){
		var state=this.states[this.statei];
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].r=this.orgCell.r+state["r"+i];
			this.cells[i].c=this.orgCell.c+state["c"+i];
		}
	},
	rotateL:function(){
		this.statei--;
		this.statei==-1 && (this.statei=this.states.length-1);
		this.rotate();
	},
}

function State(){
	for(var i=0;i<4;i++){
		this["r"+i]=arguments[2*i];
		this["c"+i]=arguments[2*i+1];
	}
}

function T(){
	Shape.call(
		this,
		[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(1,4)],
		this.IMGS.T,
		[new State(0,-1,  0,0,  0,+1,  +1,0),
			new State(-1,0,  0,0,  +1,0,  0,-1),
			new State(0,+1,  0,0,  0,-1,  -1,0),
			new State(+1,0,  0,0,  -1,0,  0,+1)],
		1
	);
}
Object.setPrototypeOf(T.prototype, Shape.prototype);

function O(){
	Shape.call(
		this,
		[new Cell(0,4),new Cell(0,5),new Cell(1,4),new Cell(1,5)],
		this.IMGS.O,
		[new State(0,-1,  0,0,  +1,-1,  +1,0)],
		1
	);
}
Object.setPrototypeOf(O.prototype,Shape.prototype);

function I(){
	Shape.call(
		this,
		[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(0,6)],
		this.IMGS.I,
		[new State(0,-1,  0,0,  0,+1,  0,+2),
			new State(-1,0,  0,0,  +1,0,  +2,0)],
		1
	);
}
Object.setPrototypeOf(I.prototype,Shape.prototype);

function S(){
	Shape.call(
		this,
		[new Cell(0,4),new Cell(0,5),new Cell(1,3),new Cell(1,4)],
		this.IMGS.S,
		[new State(0,-1,  0,0,  +1,-2,  +1,-1),
			new State(-1,-1,  0,0,  +1,0,  +0,-1)],
		1
	);
}
Object.setPrototypeOf(S.prototype,Shape.prototype);

function Z(){
	Shape.call(
		this,
		[new Cell(0,3),new Cell(0,4),new Cell(1,4),new Cell(1,5)],
		this.IMGS.Z,
		[new State(0,-1,  0,0,  +1,0,  +1,+1),
			new State(-1,0,  0,0,  0,-1,  +1,-1)],
		1
	);
}
Object.setPrototypeOf(Z.prototype,Shape.prototype);

function L(){
	Shape.call(
		this,
		[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(1,3)],
		this.IMGS.L,
		[new State(0,-1,  0,0,  0,+1,  +1,-1),
			new State(-1,0,  0,0,  +1,0,  -1,-1),
			new State(0,+1,  0,0,  0,-1,  -1,+1),
			new State(+1,0,  0,0,  -1,0,  +1,+1)],
		1
	);
}
Object.setPrototypeOf(L.prototype,Shape.prototype);

function J(){
	Shape.call(
		this,
		[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(1,5)],
		this.IMGS.J,
		[new State(0,-1,  0,0,  0,+1,  +1,+1),
			new State(-1,0,  0,0,  +1,0,  +1,-1),
			new State(0,+1,  0,0,  0,-1,  -1,-1),
			new State(+1,0,  0,0,  -1,0,  -1,+1)],
		1
	);
}
Object.setPrototypeOf(J.prototype,Shape.prototype);

