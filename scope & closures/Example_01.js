var foo = (function CoolModule(id) {

    var count = 0,
        personName = "";

    function change(new_name) {
        personName = new_name;
        count++;
    }

    function identify() {
        if (count == 0) { console.log("Xin chào " + id); }
        else if (count > 0) {
            console.log("Xin chào " + personName);
            console.log("Số lần thay đổi: " + count);
        }
    }

    var publicAPI = {
        change: change,
        identify: identify
    };

    return publicAPI;
})("Tâm");

function FCCHanoi() {
	var drinks = "uống Cà phê";
	var talks = "nói về design pattern";

	function doDrinking() {
		console.log(drinks);
	}

	function doCoding() {
		console.log(talks);
	}

	return {
		doDrinking: doDrinking,
		doCoding: doCoding
	};
}

var fcc = FCCHanoi();

fcc.doDrinking(); // 
fcc.doCoding(); //




function numberOne() {
    var a = 1;
    function numberTwo() {
        var b = 1;
        function numberThree() {
            console.log(b);
            console.log(a);
            a = a + 1;
            console.log("Change a: " + a);
        }
		numberThree();
    }
	numberTwo();
}


///////////////////////////////////////////////

for (var i=1; i<=5; i++) {
	setTimeout( function timer(){
		console.log( i );
	}, i*1000 );
}


var i = 1;          // declare "gần như" ngay lập tức    
function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 1000us
}
var i = 2;          // declare "gần như" ngay lập tức
function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 2000us
}
var i = 3;          // declare "gần như" ngay lập tức
function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 3000us
}
var i = 4;          // declare "gần như" ngay lập tức
function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 4000us
}
var i = 5;          // declare "gần như" ngay lập tức
function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 5000us
}

function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 1000us
}
function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 2000us
}
function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 3000us
}
function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 4000us
}
function timer() {  // declare "gần như" ngay lập tức
    console.log(i); // invoke sau 5000us
}
var i = 1;          // declare "gần như" ngay lập tức  
var i = 2;          // declare "gần như" ngay lập tức
var i = 3;          // declare "gần như" ngay lập tức
var i = 4;          // declare "gần như" ngay lập tức
var i = 5;          // declare "gần như" ngay lập tức