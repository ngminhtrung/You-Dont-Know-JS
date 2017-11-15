# You Don't Know JS: Scope & Closures
# Chapter 4: Hoisting

Cho đến chương này, bạn đã bắt đầu cảm thấy tự tin với các khái niệm về scope, về cách mà các variables được gắn với các cấp độ khác nhau của scope (phụ thuộc vào nơi và cách các variables đó được khai báo). Nhìn từ góc độ này, cả function scope và block scope đều giống nhau, nghĩa là variable được khai báo ở scope nào thì sẽ có giá trị sử dụng ở trong scope đấy. 

Ở chương này, chúng ta sẽ cùng xem một chi tiết quan trọng khác về cách scope vận hành, liên quan đến vị trí khai báo của functions và variables trong cùng 1 scope. 

## Câu hỏi: Quả trứng có trước hay con gà có trước? 

Thương thì nhiều người sẽ nghĩa rằng các đoạn code JavaScript mình viết sẽ được biên dịch theo từng dòng, thứ tự từ trên xuống dưới một cách trật tự, giống như cách mà chương trình thực thi. Dẫu suy nghĩ này về cơ bản là đúng, thì nó vẫn có một điều cần phải "chỉnh" lại. Hãy xem ví dụ 1 dưới đây. 

```js
a = 2;

var a;

console.log(a);
```

Bạn nghĩ là `console.log(..)` sẽ in ra kết quả nào? 

Nhiều người sẽ cho rằng kết quả là `undefined`, bởi `var a` được viết phía sau của `a = 2`, cho nên variable `a` sẽ được khai báo lại, và mang giá trị `undefined` mặc định. Mặc dù vậy, kết quả in ra lại là `2`.

Xem tiếp ví dụ 2 dưới đây: 

```js
console.log(a);

var a = 2;
```
Chắc bạn sẽ rút kinh nghiệm từ ví dụ 1, cho rằng trình biên dịch sẽ không chỉ đọc từ trên xuống dưới nữa, và sẽ cho ra kết quả là `2`. Nhiều người khác có thể cho rằng vì variable `a` được sử dụng trước khi nó được khai báo nên chương trình sẽ trả về lỗi `ReferenceError`.

Rất tiếc là cả 2 câu trả lời trên đều không đúng. Chương trình sẽ trả về kết quả là `undefined`. 

**Vậy tại sao lại có điều này?** Dường như chúng ta đang đâm vào câu hỏi con gà - quả trứng cái nào có trước. "Quả trứng" đây chính là việc khai báo (declaration), còn "con gà" chính là phép gán (assignment)?

## Lại là chuyện của trình biên dịch

Để trả lời câu hỏi trên, chúng ta cần quay lại với Chương 1, nơi thảo luận về các trình biên dịch. Hãy nhớ lại là *Engine* sẽ compile đoạn code JavaScript của bạn trước khi interprets đoạn code đấy. Một phần của quá trình biên dịch là tìm và liên kết tất cả các khai báo đến các scope tương ứng. Ở Chương 2, chúng ta đã hiểu rằng viện tìm và liên kết các khai báo này là điểm mấu chốt của khái niệm Lexical Scope.

Vì vậy, tốt nhất là hãy luôn tâm niệm trong đâu rằng, tất cả các khai báo variables và functions đều được tiến hành trước tiên, trước cả khi bất kỳ đoạn code nào trong chương trình của bạn được thực thi. 

Khi bạn thấy đoạn code `var a = 2;`, bạn cho rằng đây là 1 câu lệnh đơn. Nhưng JavaScript lại chia nó thành 2 câu lệnh: (1) là `var a;` và (2) là `a = 2;`. Câu lệnh thứ nhất chính là phép khai báo sẽ được tiến hành trong phần biên dịch. Còn câu lệnh thứ hai, phép gán, sẽ được để lại **nguyên vị trí** chờ đến phần thực thi.

Ví dụ 1 bên trên thực sự sẽ trông giống như sau:

```js
var a;
```
```js
a = 2;

console.log(a);
```

...với đoạn 1 là phần khai báo, đoạn 2 là phần thực thi. 

Tương tự như vậy với ví dụ thứ 2: 

```js
var a;
```
```js
console.log( a );

a = 2;
```

Như vậy bạn có thể nghĩa về cơ chế này là các khai báo variables và functiosn bị "nhấc đi" khỏi vị trí mà nó xuất hiện trong đoạn code để bị đẩy lên trên cùng. Đây chính là khái niệm "Hoisting" (nghĩa tiếng Anh: "kéo lên"). Hoặc nôm na là **quả trứng (việc khai báo) có trước con gà (phép gán)**.

**Lưu ý:** Chỉ có phần khai báo là được "đưa lên trên đầu", trong khi phần phép gán hoặc các phép toán logic khác sẽ bị để lại *nguyên vị trí*. Nếu khái niệm hoisting mà lại đụng chạm đến cả logic của đoạn code thì hẳn là chúng ta sẽ không thể viết nổi chương trình .

Ví dụ 3: 
```js
foo();

function foo() {
	console.log(a); // undefined

	var a = 2;
}
```

Việc khai báo function `foo` (trong ví dụ 3 này đã ngầm *bao gồm* cả giá trị của hàm) đã được "đưa lên trên đầu", dẫn đến dòng đầu tiên (tức là `foo()`) có thể được thực thi. 

Cần lưu ý một điều quan trọng là việc "hoisting" diễn ra trong **từng scope**. Vì vậy function `foo(..)` khi xem xét chính nó đã đưa khai báo `var a` lên trên đầu của nó (tức là `foo(..)`, chứ không phải lên đầu của toàn bộ chương trình). Điều này dẫn đến ví dụ 3 sẽ thực sự trông giống như sau:

Ví dụ 4: 
```js
function foo() {
	var a;

	console.log( a ); // undefined

	a = 2;
}

foo();
```

Một điều nữa là chỉ có khai báo hàm được "đưa lên đầu", còn function expressions thì không.

Ví dụ 5: 

```js
foo(); // not ReferenceError, but TypeError!

var foo = function bar() {
	// ...
};
```

Việc khai báo `foo` (chính là `var foo`) đã được đưa lên trên cùng và thuộc về global scope của chương trình này, do vậy mà việc chạy `foo()` không trả lại kết quả `ReferenceError`. Nhưng `foo` chưa có giá trị gì (đáng lẽ nó phải là một khai báo hàm - function declaration, thay vì là một function expression). Vì vậy, `foo()` cố gắng để gọi giá trị `undefined`, điều này dẫn đến một hành vị không được phép, kết qủa trả về là `TypeError`.

Hãy lưu ý thêm là mặc dù đây là một function expression được đặt tên, thì định danh đó không tồn tại trong scope chứa function đấy. 

```js
foo(); // TypeError
bar(); // ReferenceError

var foo = function bar() {
	// ...
};
```

Đoạn code trên thực chất được trình biên dịch hiểu như sau:

```js
var foo;

foo(); // TypeError
bar(); // ReferenceError

foo = function() {
	var bar = ...self...
	// ...
}
```

## Functions luôn được ưu tiên

Cả khai báo hàm và khai báo variables đều được "đưa lên trên cùng". Tuy vậy, cần lưu ý là khai báo hàm luôn được ưu tiên đặt trước so với khai báo variables. 

Ví dụ 6:

```js
foo(); // 1

var foo;

function foo() {
	console.log( 1 );
}

foo = function() {
	console.log( 2 );
};
```

Kết quả được in ra là `1` thay vì `2`! Bởi đoạn code trong ví dụ 6 được *Engine* diễn giải là:

```js
function foo() {
	console.log( 1 );
}

foo(); // 1

foo = function() {
	console.log( 2 );
};
```

Lưu ý: `var foo` là phép khai báo không cần thiết, vì vậy bị bỏ qua, cho dù nó có được đặt trước `function foo()...` trong phép khai báo hàm, bởi khai báo function declarations được đưa lên trên cả các variables thông  thường.

Nếu việc dùng khai báo qua `var` bị bỏ qua trong ví dụ trên, thì lại có những trường hợp việc khai báo lần nữa của cùng một hàm sẽ *thực sự* ghi đè lên khai báo phía trước.

```js
foo(); // 3

function foo() {
	console.log( 1 );
}

var foo = function() {
	console.log( 2 );
};

function foo() {
	console.log( 3 );
}
```

Mặc dù lời khuyên sau có vẻ nhàm chán, nhưng lập trình viên nên tránh việc khai báo trùng lặp trong cùng 1 scope vì điều đó dễ dẫn đến những kết quả gây khó hiểu. 

Trong ví dụ sau, mặc dù các khai báo hàm được đặt trong mệnh đề điều kiện, tuy vậy tất cả đều được hoisted (đưa lên trên cùng) trong scope bên ngoài chứa nó. 

Ví dụ 7: 
```js
foo(); // "b"

var a = true;
if (a) {
   function foo() { console.log( "a" ); }
}
else {
   function foo() { console.log( "b" ); }
}
```

Việc khai báo như trên không đáng tin cậy, và kết quả xuất ra như thế nào phụ thuộc vào sự thay đổi trong các phiên bản tương lai của JavaScript. Do đó, tốt nhất là tránh các khai báo hàm bên trong block kiểu trên. 

## Tóm tắt (Phần trên quá dài, ứ đọc!)

Thường mọi người đều nhìn vào đoạn mã `var a = 2;` và cho rằng đây là 1 câu lệnh, tuy nhiên *Engine* của JavaScript sẽ coi đó là 2 câu lệnh riêng rẽ, (1) ứng với `var a`, (2) ứng với `a = 2`. Câu (1) là ứng với giai đoạn biên dịch, câu (2) ứng với giai đoạn thực thi.

Quy định trên dẫn đến một điều rằng mọi khai báo trong scope, không quan tâm vị trí của khai báo, đều được xử lý "trước tiên", sau mới đến phần thực thi. Một cách hình tượng, các khai báo (variables và functions) dược "đẩy" lên trên cùng của scope chứa chúng. Vấn đề này được gọi là "hoisting". 

Việc khai báo bản thân đã được "đẩy" lên trên, nhưng phép gán, nhất là phép gán trong function expression lại *không* như vậy. 

Luôn cẩn thận với việc khai báo trùng, nhất là khi có sự trùng lặp giữa khai báo var thông thường và khai báo hàm. Bạn không sớm thì muộn sẽ gặp vấn đề.
