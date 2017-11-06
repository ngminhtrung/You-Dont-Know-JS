# You Don't Know JS: Scope & Closures
# Chapter 4: Hoisting

Cho đến chương này, bạn đã bắt đầu cảm thấy tự tin với các khái niệm về scope, về cách mà các variables được gắn với các cấp độ khác nhau của scope (phụ thuộc vào nơi và cách các variables đó được khai báo). Nhìn từ góc độ này, cả function scope và block scope đều giống nhau, nghĩa là variable được khai báo ở scope nào thì sẽ có giá trị sử dụng ở trong scope đấy. 

Ở chương này, chúng ta sẽ cùng xem một chi tiết quan trọng khác về cách scope vận hành, liên quan đến vị trí khai báo của functions và variables trong cùng 1 scope. 

## Câu hỏi: Quả trứng có trước hay con gà có trước? 

Thương thì nhiều người sẽ nghĩa rằng các đoạn code JavaScript mình viết sẽ được biên dịch theo từng dòng, thứ tự từ trên xuống dưới một cách trật tự, giống như cách mà chương trình thực thi. Dẫu suy nghĩ này về cơ bản là đúng, thì nó vẫn có một điều cần phải "chỉnh" lại. Hãy xem ví dụ 1 dưới đây. 

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

Rất tiếc là cả 2 câu trả lời trên đều không đúng. Chương trình sẽ trả về kết quả là `undefined`. 

**Vậy tại sao lại có điều này?** Dường như chúng ta đang đâm vào câu hỏi con gà - quả trứng cái nào có trước. "Quả trứng" đây chính là việc khai báo (declaration), còn "con gà" chính là phép gán (assignment)?

## Lại là chuyện của trình biên dịch

Để trả lời câu hỏi trên, chúng ta cần quay lại với Chương 1, nơi thảo luận về các trình biên dịch. Hãy nhớ lại là *Engine* sẽ compile đoạn code JavaScript của bạn trước khi interprets đoạn code đấy. Một phần của quá trình biên dịch là tìm và liên kết tất cả các khai báo đến các scope tương ứng. Ở Chương 2, chúng ta đã hiểu rằng viện tìm và liên kết các khai báo này là điểm mấu chốt của khái niệm Lexical Scope.

Vì vậy, tốt nhất là hãy luôn tâm niệm trong đâu rằng, tất cả các khai báo variables và functions đều được tiến hành trước tiên, trước cả khi bất kỳ đoạn code nào trong chương trình của bạn được thực thi. 

Khi bạn thấy đoạn code `var a = 2;`, bạn cho rằng đây là 1 câu lệnh đơn. Nhưng JavaScript lại chia nó thành 2 câu lệnh: (1) là `var a;` và (2) là `a = 2;`. Câu lệnh thứ nhất chính là phép khai báo sẽ được tiến hành trong phần biên dịch. Còn câu lệnh thứ hai, phép gán, sẽ được để lại **nguyên vị trí** chờ đến phần thực thi.

Ví dụ 1 bên trên thực sự sẽ trông giống như sau:

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

Như vậy bạn có thể nghĩa về cơ chế này là các khai báo variables và functiosn bị "nhấc đi" khỏi vị trí mà nó xuất hiện trong đoạn code để bị đẩy lên trên cùng. Đây chính là khái niệm "Hoisting" (nghĩa tiếng Anh: "kéo lên"). Hoặc nôm na là **quả trứng (việc khai báo) có trước con gà (phép gán)**.

**Lưu ý:** Chỉ có phần khai báo là được "đưa lên trên đầu", trong khi phần phép gán hoặc các phép toán logic khác sẽ bị để lại *nguyên vị trí*. Nếu khái niệm hoisting mà lại đụng chạm đến cả logic của đoạn code thì hẳn là chúng ta sẽ không thể viết nổi chương trình .

```js
foo();

function foo() {
	console.log(a); // undefined

	var a = 2;
}
```

The function `foo`'s declaration (which in this case *includes* the implied value of it as an actual function) is hoisted, such that the call on the first line is able to execute.

It's also important to note that hoisting is **per-scope**. So while our previous snippets were simplified in that they only included global scope, the `foo(..)` function we are now examining itself exhibits that `var a` is hoisted to the top of `foo(..)` (not, obviously, to the top of the program). So the program can perhaps be more accurately interpreted like this:

```js
function foo() {
	var a;

	console.log( a ); // undefined

	a = 2;
}

foo();
```

Function declarations are hoisted, as we just saw. But function expressions are not.

```js
foo(); // not ReferenceError, but TypeError!

var foo = function bar() {
	// ...
};
```

The variable identifier `foo` is hoisted and attached to the enclosing scope (global) of this program, so `foo()` doesn't fail as a `ReferenceError`. But `foo` has no value yet (as it would if it had been a true function declaration instead of expression). So, `foo()` is attempting to invoke the `undefined` value, which is a `TypeError` illegal operation.

Also recall that even though it's a named function expression, the name identifier is not available in the enclosing scope:

```js
foo(); // TypeError
bar(); // ReferenceError

var foo = function bar() {
	// ...
};
```

This snippet is more accurately interpreted (with hoisting) as:

```js
var foo;

foo(); // TypeError
bar(); // ReferenceError

foo = function() {
	var bar = ...self...
	// ...
}
```

## Functions First

Both function declarations and variable declarations are hoisted. But a subtle detail (that *can* show up in code with multiple "duplicate" declarations) is that functions are hoisted first, and then variables.

Consider:

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

`1` is printed instead of `2`! This snippet is interpreted by the *Engine* as:

```js
function foo() {
	console.log( 1 );
}

foo(); // 1

foo = function() {
	console.log( 2 );
};
```

Notice that `var foo` was the duplicate (and thus ignored) declaration, even though it came before the `function foo()...` declaration, because function declarations are hoisted before normal variables.

While multiple/duplicate `var` declarations are effectively ignored, subsequent function declarations *do* override previous ones.

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

While this all may sound like nothing more than interesting academic trivia, it highlights the fact that duplicate definitions in the same scope are a really bad idea and will often lead to confusing results.

Function declarations that appear inside of normal blocks typically hoist to the enclosing scope, rather than being conditional as this code implies:

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

However, it's important to note that this behavior is not reliable and is subject to change in future versions of JavaScript, so it's probably best to avoid declaring functions in blocks.

## Review (TL;DR)

We can be tempted to look at `var a = 2;` as one statement, but the JavaScript *Engine* does not see it that way. It sees `var a` and `a = 2` as two separate statements, the first one a compiler-phase task, and the second one an execution-phase task.

What this leads to is that all declarations in a scope, regardless of where they appear, are processed *first* before the code itself is executed. You can visualize this as declarations (variables and functions) being "moved" to the top of their respective scopes, which we call "hoisting".

Declarations themselves are hoisted, but assignments, even assignments of function expressions, are *not* hoisted.

Be careful about duplicate declarations, especially mixed between normal var declarations and function declarations -- peril awaits if you do!
