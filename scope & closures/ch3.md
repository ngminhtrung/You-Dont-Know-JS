# You Don't Know JS: Scope & Closures
# Chapter 3: Function vs. Block Scope

Như đã nói trong Chương 2, scope là 1 series các "quả bóng" mà "bên trong quả bóng này", các variables và functions được khai báo. Các quả bóng này được lồng bên trong nhau một cách ngăn nắp, và việc sắp xếp này được xác định ngay từ lúc đoạn code được viết xong.

Nhưng liệu các quả bóng scope chỉ được tạo ra bởi các functions? còn 1 cấu trúc nào tạo ra bóng nữa hay không?

## Scope chỉ tạo ra bởi Functions?

Nếu hỏi câu trên, câu trả lời bạn thường gặp nhất là: "*Javascript là ngôn ngữ lập trình có scope tạo bởi function*". Điều đó có nghĩa là mỗi function được khai báo sẽ tạo ra 1 "quả bóng scope" cho chính nó, không còn cấu trúc nào khác tạo ra được bóng scope. Chúng ta sẽ cùng xem xét câu trả lời này qua các phân tích dưới đây, và sẽ thấy là nó không hoàn toàn đúng. 

Xem đoạn code dưới đây: 
```js
function foo(a) {
	var b = 2;

	// một đoạn code nào đó

	function bar() {
		// ...
	}

	// thêm vài đoạn code khác

	var c = 3;
}
```
Trong mẩu code trên, quả bóng scope của `foo(...)` sẽ chứa các variables `a`, `b`, `c` và function `bar`. Việc khai báo này nằm chính xác ở đâu bên trong scope **không quan trọng**, dù sao thì các variables và function kia vẫn thuộc về quả bóng scope `foo(...)` chứa nó. 

`bar(..)` có quả bóng scope của riêng nó. Global scope cũng vậy, nó chứa 1 định danh là `foo`.

Bởi vì `a`, `b`, `c`, và `bar` đều nằm bên trong scope của quả bóng `foo(..)`, ta không thể truy cập những variables và function đó từ bên ngoài của `foo(..)`. Dẫn đến đoạn code sau sẽ trả về thông báo lỗi `ReferenceError` do ở global scope không chứa các định danh `bar` hoặc `a`, `b`, `c`. (Lưu ý của người dịch: Xem lại chương 1, mục *Erros - Các lỗi thường gặp*, ở đây *Engine* thực hiện phép tìm bên phải - RHS - nhưng không thấy các variables và function này ở global scope, dẫn đến việc trả về thông báo lỗi `ReferenceError`).

```js
bar(); // báo lỗi

console.log( a, b, c ); // báo lỗi
```
Tuy vậy, `a`, `b`, `c`, `foo`, và `bar` có thể được gọi từ *bên trong* của `foo(..)`, thậm chí còn được gọi từ bên trong của `bar(..)` (với giả định rằng không tồn tại các định danh trùng tên ở trong `bar(..)`).

Function scope cổ vũ ý tưởng là mọi variables thuộc về 1 function thì có thể được sử dụng và tái sử dụng ở khắp nơi bên trong function (bao gồm cả ở trong những scopes bên trong nó). Cách tiếp cận này rất hữu dụng, nó tận dụng được bản chất "động" của các variables trong JavaScript nhằm lấy values về khi cần.

Mặt khác, nếu không cẩn trọng khi viết code, việc variables có thể được truy cập xuyên suốt bên trong function scope có thể dẫn đến những vấn đề không mong muốn.

## Hiding In Plain Scope

Khi nghĩ đến function, thường thì lập trình viên sẽ liên tưởng ngay đến việc khai báo function, rồi thêm các dòng code bên trong function. Tuy nhiên, hãy thử hình dung nếu ta làm ngược lại:
- viết trước những dòng code sẽ dùng bên trong hàm "tương lai".
- bọc những dòng code trên bằng 1 khai báo hàm.  

Bạn nhìn ra vấn đề ở đây không? Chúng ta vừa tạo ra 1 quả bóng scope để:
- bao lấy những dòng code trên, 
- "che dấu" variables và functions bên trong nó. 

Tại sao việc "che dấu" variables và functions lại là một kỹ thuật hữu ích? Thực ra là có rất nhiều lý do, nhưng chung quy đều xuất phát từ nguyên tắc thiết kế phần mềm tên là "Principle of Least Privilege" [^note-leastprivilege], một vài chỗ gọi nó là "Least Authority" hoặc "Least Exposure". Nguyên lý này nói rằng trong việc thiết kế phần mềm, ví dụ thiết kế API cho 1 module/object, bạn chỉ nên phơi bày tối thiểu những gì cần thiết, và "che" đi những thứ còn lại.

Nguyên lý này được áp dụng ngay vào việc chọn scope sẽ chứa variables và functions. Nếu như toàn bộ variables và functions đều thuộc về global scope thì mọi scope nhỏ bên trong đều sẽ truy cập được đến các variables và functions đấy. Việc này vi phạm nguyên tắc thiết kế nói trên. 

Ví dụ:

```js
function doSomething(a) {
	b = a + doSomethingElse( a * 2 );

	console.log( b * 3 );
}

function doSomethingElse(a) {
	return a - 1;
}

var b;

doSomething( 2 ); // 15
```

Trong mẩu code trên, varialbe `b` và hàm `doSomethingElse(..)` gần như là "tài sản cá nhân" để giúp riêng cho hoạt động của `doSomething(..)`. Việc để cho các các "tài sản" trên phơi bày ra với các scope khác không chỉ là không cần thiết, mà thậm chỉ là còn tiềm ẩn nguy cơ khiến "tài sản riêng" bị sử dụng theo cách ta không mong muốn (cả tốt lẫn xấu).

Để code hợp lý hơn, hãy giấu các tài sản riêng vào bên trong scope của `doSomething(..)`:

```js
function doSomething(a) {
	function doSomethingElse(a) {
		return a - 1;
	}

	var b;

	b = a + doSomethingElse( a * 2 );

	console.log( b * 3 );
}

doSomething( 2 ); // 15
```

Bây giờ ta không thể gọi thẳng `b` và `doSomethingElse(..)` từ các scope bên ngoài mà không thông qua `doSomething(..)`. Chức năng và kết quả cuối cùng của `doSomething(...)` không đổi, trong khi code được coi là chuẩn chỉ hơn. 

### Tránh nguy cơ xung đột 

Một lợi ích khác của việc "giấu" variables và functions bên trong scope là để tránh các nguy cơ xung đột giữa các variables hoặc functions trùng tên nhưng có mục đích sử dụng khác nhau. Một khi variables/ functiosn đã bị xung đột, nó sẽ dẫn đến việc kết quả trả về bị ghi đè theo cách không mong muốn. 

Xem ví dụ sau:

```js
function foo() {
	function bar(a) {
		i = 3; // thay đổi `i` in the enclosing scope's for-loop
		console.log( a + i );
	}

	for (var i=0; i<10; i++) {
		bar( i * 2 ); // oops, infinite loop ahead!
	}
}

foo();
```

Việc gán `i = 3` bên trong `bar(..)` đã chép đè lên `i` được khai báo trong vòng lặp for của `foo(..)`. Nó dẫn đến kết cục là vòng lặp chạy mãi không dừng bởi trong mỗi vòng lặp, `i` lại bị gán bằng `3` và sẽ luôn `< 10`.

`i` bên trong `bar(..)` cần được khai báo như một local variable, không cần biết là định danh của nó là gì. Để làm vậy, hãy thay đổi `i = 3;` thành `var i = 3;` thì vấn đề sẽ biến mất (and would create the previously mentioned "shadowed variable" declaration for `i`). Một cách *khác*, nhưng không nên dùng, đó là sử dụng một định danh hoàn toàn khác cho `i` bên trong vòng lặp for của `foo(...)`, ví dụ dùng `var j = 3;`. Nhưng trong thực tế việc sử dụng trùng tên variables là vô cùng thường gặp và tự nhiên, cho nên sử dụng scope để "che đi" các khai báo variables/ functions bên trong vẫn là cách làm tốt nhất.

#### Global "Namespaces"

Phần này, chúng ta sẽ đề cập đến một ví dụ điển hình của việc các variables bị xung đột trong global scope. Điều này xảy ra khi rất nhiều thư viện được gọi khi chạy chương trình, trong khi lập trình viên quên không ẩn đi các variables và functions vốn là tài sản riêng của từng thư viện. 

Mỗi thư viện sẽ tạo ra một khai báo variable đơn, thường là 1 object, tên gọi của object đó tương đối độc nhất trong global scope. Object này được sử dụng như một "namespace" cho thư viện đó, nơi mà all specific exposures of functionality are made as properties off that object (namespace), rather than as top-level lexically scoped identifiers themselves.

Ví dụ:

```js
var MyReallyCoolLibrary = {
	awesome: "stuff",
	doSomething: function() {
		// ...
	},
	doAnotherThing: function() {
		// ...
	}
};
```

#### Quản lý Module

Một cách làm khác để tránh việc bị xung đột chính là cách xây dựng "module" theo phương cách hiện đại, trong đó sử dụng rất nhiều các công cụ quản lý dependencies. Sử dụng các công cụ này sẽ giúp không thêm bất kỳ tên định danh (identifiers) nào của thư viện vào global scope, mà vẫn giúp những định danh đó được xuất hiện trong 1 scope đặc biệt khác quản lý của dependency managers. 

Lưu ý rằng những công cụ trên không hề có tính năng "thần kỳ" nào giúp tránh khỏi những quy định của lexical scope. Các công cụ đón đơn giản chỉ giúp thực hiện các quy định đã giải thích bên trên về scoping, đó là "cưỡng chế" không cho các định danh được chèn thẳng vào các không gian chung (shared scope), giữ chúng trong những không gian riêng tư hơn, không tiềm ẩn nguy cơ xung đột, từ đó phòng ngừa bất kỳ sự cố nào liên quan đến scope.

As such, you can code defensively and achieve the same results as the dependency managers do without actually needing to use them, if you so choose. See the Chapter 5 for more information about the module pattern.

## Functions As Scopes

We've seen that we can take any snippet of code and wrap a function around it, and that effectively "hides" any enclosed variable or function declarations from the outside scope inside that function's inner scope.

For example:

```js
var a = 2;

function foo() { // <-- insert this

	var a = 3;
	console.log( a ); // 3

} // <-- and this
foo(); // <-- and this

console.log( a ); // 2
```

While this technique "works", it is not necessarily very ideal. There are a few problems it introduces. The first is that we have to declare a named-function `foo()`, which means that the identifier name `foo` itself "pollutes" the enclosing scope (global, in this case). We also have to explicitly call the function by name (`foo()`) so that the wrapped code actually executes.

It would be more ideal if the function didn't need a name (or, rather, the name didn't pollute the enclosing scope), and if the function could automatically be executed.

Fortunately, JavaScript offers a solution to both problems.

```js
var a = 2;

(function foo(){ // <-- insert this

	var a = 3;
	console.log( a ); // 3

})(); // <-- and this

console.log( a ); // 2
```

Let's break down what's happening here.

First, notice that the wrapping function statement starts with `(function...` as opposed to just `function...`. While this may seem like a minor detail, it's actually a major change. Instead of treating the function as a standard declaration, the function is treated as a function-expression.

**Note:** The easiest way to distinguish declaration vs. expression is the position of the word "function" in the statement (not just a line, but a distinct statement). If "function" is the very first thing in the statement, then it's a function declaration. Otherwise, it's a function expression.

The key difference we can observe here between a function declaration and a function expression relates to where its name is bound as an identifier.

Compare the previous two snippets. In the first snippet, the name `foo` is bound in the enclosing scope, and we call it directly with `foo()`. In the second snippet, the name `foo` is not bound in the enclosing scope, but instead is bound only inside of its own function.

In other words, `(function foo(){ .. })` as an expression means the identifier `foo` is found *only* in the scope where the `..` indicates, not in the outer scope. Hiding the name `foo` inside itself means it does not pollute the enclosing scope unnecessarily.

### Anonymous vs. Named

You are probably most familiar with function expressions as callback parameters, such as:

```js
setTimeout(function(){
	console.log("I waited 1 second!");
}, 1000 );
```

This is called an "anonymous function expression", because `function()...` has no name identifier on it. Function expressions can be anonymous, but function declarations cannot omit the name -- that would be illegal JS grammar.

Anonymous function expressions are quick and easy to type, and many libraries and tools tend to encourage this idiomatic style of code. However, they have several draw-backs to consider:

1. Anonymous functions have no useful name to display in stack traces, which can make debugging more difficult.

2. Without a name, if the function needs to refer to itself, for recursion, etc., the **deprecated** `arguments.callee` reference is unfortunately required. Another example of needing to self-reference is when an event handler function wants to unbind itself after it fires.

3. Anonymous functions omit a name that is often helpful in providing more readable/understandable code. A descriptive name helps self-document the code in question.

**Inline function expressions** are powerful and useful -- the question of anonymous vs. named doesn't detract from that. Providing a name for your function expression quite effectively addresses all these draw-backs, but has no tangible downsides. The best practice is to always name your function expressions:

```js
setTimeout( function timeoutHandler(){ // <-- Look, I have a name!
	console.log( "I waited 1 second!" );
}, 1000 );
```

### Invoking Function Expressions Immediately

```js
var a = 2;

(function foo(){

	var a = 3;
	console.log( a ); // 3

})();

console.log( a ); // 2
```

Now that we have a function as an expression by virtue of wrapping it in a `( )` pair, we can execute that function by adding another `()` on the end, like `(function foo(){ .. })()`. The first enclosing `( )` pair makes the function an expression, and the second `()` executes the function.

This pattern is so common, a few years ago the community agreed on a term for it: **IIFE**, which stands for **I**mmediately **I**nvoked **F**unction **E**xpression.

Of course, IIFE's don't need names, necessarily -- the most common form of IIFE is to use an anonymous function expression. While certainly less common, naming an IIFE has all the aforementioned benefits over anonymous function expressions, so it's a good practice to adopt.

```js
var a = 2;

(function IIFE(){

	var a = 3;
	console.log( a ); // 3

})();

console.log( a ); // 2
```

There's a slight variation on the traditional IIFE form, which some prefer: `(function(){ .. }())`. Look closely to see the difference. In the first form, the function expression is wrapped in `( )`, and then the invoking `()` pair is on the outside right after it. In the second form, the invoking `()` pair is moved to the inside of the outer `( )` wrapping pair.

These two forms are identical in functionality. **It's purely a stylistic choice which you prefer.**

Another variation on IIFE's which is quite common is to use the fact that they are, in fact, just function calls, and pass in argument(s).

For instance:

```js
var a = 2;

(function IIFE( global ){

	var a = 3;
	console.log( a ); // 3
	console.log( global.a ); // 2

})( window );

console.log( a ); // 2
```

We pass in the `window` object reference, but we name the parameter `global`, so that we have a clear stylistic delineation for global vs. non-global references. Of course, you can pass in anything from an enclosing scope you want, and you can name the parameter(s) anything that suits you. This is mostly just stylistic choice.

Another application of this pattern addresses the (minor niche) concern that the default `undefined` identifier might have its value incorrectly overwritten, causing unexpected results. By naming a parameter `undefined`, but not passing any value for that argument, we can guarantee that the `undefined` identifier is in fact the undefined value in a block of code:

```js
undefined = true; // setting a land-mine for other code! avoid!

(function IIFE( undefined ){

	var a;
	if (a === undefined) {
		console.log( "Undefined is safe here!" );
	}

})();
```

Still another variation of the IIFE inverts the order of things, where the function to execute is given second, *after* the invocation and parameters to pass to it. This pattern is used in the UMD (Universal Module Definition) project. Some people find it a little cleaner to understand, though it is slightly more verbose.

```js
var a = 2;

(function IIFE( def ){
	def( window );
})(function def( global ){

	var a = 3;
	console.log( a ); // 3
	console.log( global.a ); // 2

});
```

The `def` function expression is defined in the second-half of the snippet, and then passed as a parameter (also called `def`) to the `IIFE` function defined in the first half of the snippet. Finally, the parameter `def` (the function) is invoked, passing `window` in as the `global` parameter.

## Blocks As Scopes

While functions are the most common unit of scope, and certainly the most wide-spread of the design approaches in the majority of JS in circulation, other units of scope are possible, and the usage of these other scope units can lead to even better, cleaner to maintain code.

Many languages other than JavaScript support Block Scope, and so developers from those languages are accustomed to the mindset, whereas those who've primarily only worked in JavaScript may find the concept slightly foreign.

But even if you've never written a single line of code in block-scoped fashion, you are still probably familiar with this extremely common idiom in JavaScript:

```js
for (var i=0; i<10; i++) {
	console.log( i );
}
```

We declare the variable `i` directly inside the for-loop head, most likely because our *intent* is to use `i` only within the context of that for-loop, and essentially ignore the fact that the variable actually scopes itself to the enclosing scope (function or global).

That's what block-scoping is all about. Declaring variables as close as possible, as local as possible, to where they will be used. Another example:

```js
var foo = true;

if (foo) {
	var bar = foo * 2;
	bar = something( bar );
	console.log( bar );
}
```

We are using a `bar` variable only in the context of the if-statement, so it makes a kind of sense that we would declare it inside the if-block. However, where we declare variables is not relevant when using `var`, because they will always belong to the enclosing scope. This snippet is essentially "fake" block-scoping, for stylistic reasons, and relying on self-enforcement not to accidentally use `bar` in another place in that scope.

Block scope is a tool to extend the earlier "Principle of Least ~~Privilege~~ Exposure" [^note-leastprivilege] from hiding information in functions to hiding information in blocks of our code.

Consider the for-loop example again:

```js
for (var i=0; i<10; i++) {
	console.log( i );
}
```

Why pollute the entire scope of a function with the `i` variable that is only going to be (or only *should be*, at least) used for the for-loop?

But more importantly, developers may prefer to *check* themselves against accidentally (re)using variables outside of their intended purpose, such as being issued an error about an unknown variable if you try to use it in the wrong place. Block-scoping (if it were possible) for the `i` variable would make `i` available only for the for-loop, causing an error if `i` is accessed elsewhere in the function. This helps ensure variables are not re-used in confusing or hard-to-maintain ways.

But, the sad reality is that, on the surface, JavaScript has no facility for block scope.

That is, until you dig a little further.

### `with`

We learned about `with` in Chapter 2. While it is a frowned upon construct, it *is* an example of (a form of) block scope, in that the scope that is created from the object only exists for the lifetime of that `with` statement, and not in the enclosing scope.

### `try/catch`

It's a *very* little known fact that JavaScript in ES3 specified the variable declaration in the `catch` clause of a `try/catch` to be block-scoped to the `catch` block.

For instance:

```js
try {
	undefined(); // illegal operation to force an exception!
}
catch (err) {
	console.log( err ); // works!
}

console.log( err ); // ReferenceError: `err` not found
```

As you can see, `err` exists only in the `catch` clause, and throws an error when you try to reference it elsewhere.

**Note:** While this behavior has been specified and true of practically all standard JS environments (except perhaps old IE), many linters seem to still complain if you have two or more `catch` clauses in the same scope which each declare their error variable with the same identifier name. This is not actually a re-definition, since the variables are safely block-scoped, but the linters still seem to, annoyingly, complain about this fact.

To avoid these unnecessary warnings, some devs will name their `catch` variables `err1`, `err2`, etc. Other devs will simply turn off the linting check for duplicate variable names.

The block-scoping nature of `catch` may seem like a useless academic fact, but see Appendix B for more information on just how useful it might be.

### `let`

Thus far, we've seen that JavaScript only has some strange niche behaviors which expose block scope functionality. If that were all we had, and *it was* for many, many years, then block scoping would not be terribly useful to the JavaScript developer.

Fortunately, ES6 changes that, and introduces a new keyword `let` which sits alongside `var` as another way to declare variables.

The `let` keyword attaches the variable declaration to the scope of whatever block (commonly a `{ .. }` pair) it's contained in. In other words, `let` implicitly hijacks any block's scope for its variable declaration.

```js
var foo = true;

if (foo) {
	let bar = foo * 2;
	bar = something( bar );
	console.log( bar );
}

console.log( bar ); // ReferenceError
```

Using `let` to attach a variable to an existing block is somewhat implicit. It can confuse you if you're not paying close attention to which blocks have variables scoped to them, and are in the habit of moving blocks around, wrapping them in other blocks, etc., as you develop and evolve code.

Creating explicit blocks for block-scoping can address some of these concerns, making it more obvious where variables are attached and not. Usually, explicit code is preferable over implicit or subtle code. This explicit block-scoping style is easy to achieve, and fits more naturally with how block-scoping works in other languages:

```js
var foo = true;

if (foo) {
	{ // <-- explicit block
		let bar = foo * 2;
		bar = something( bar );
		console.log( bar );
	}
}

console.log( bar ); // ReferenceError
```

We can create an arbitrary block for `let` to bind to by simply including a `{ .. }` pair anywhere a statement is valid grammar. In this case, we've made an explicit block *inside* the if-statement, which may be easier as a whole block to move around later in refactoring, without affecting the position and semantics of the enclosing if-statement.

**Note:** For another way to express explicit block scopes, see Appendix B.

In Chapter 4, we will address hoisting, which talks about declarations being taken as existing for the entire scope in which they occur.

However, declarations made with `let` will *not* hoist to the entire scope of the block they appear in. Such declarations will not observably "exist" in the block until the declaration statement.

```js
{
   console.log( bar ); // ReferenceError!
   let bar = 2;
}
```

#### Garbage Collection

Another reason block-scoping is useful relates to closures and garbage collection to reclaim memory. We'll briefly illustrate here, but the closure mechanism is explained in detail in Chapter 5.

Consider:

```js
function process(data) {
	// do something interesting
}

var someReallyBigData = { .. };

process( someReallyBigData );

var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt){
	console.log("button clicked");
}, /*capturingPhase=*/false );
```

The `click` function click handler callback doesn't *need* the `someReallyBigData` variable at all. That means, theoretically, after `process(..)` runs, the big memory-heavy data structure could be garbage collected. However, it's quite likely (though implementation dependent) that the JS engine will still have to keep the structure around, since the `click` function has a closure over the entire scope.

Block-scoping can address this concern, making it clearer to the engine that it does not need to keep `someReallyBigData` around:

```js
function process(data) {
	// do something interesting
}

// anything declared inside this block can go away after!
{
	let someReallyBigData = { .. };

	process( someReallyBigData );
}

var btn = document.getElementById( "my_button" );

btn.addEventListener( "click", function click(evt){
	console.log("button clicked");
}, /*capturingPhase=*/false );
```

Declaring explicit blocks for variables to locally bind to is a powerful tool that you can add to your code toolbox.

#### `let` Loops

A particular case where `let` shines is in the for-loop case as we discussed previously.

```js
for (let i=0; i<10; i++) {
	console.log( i );
}

console.log( i ); // ReferenceError
```

Not only does `let` in the for-loop header bind the `i` to the for-loop body, but in fact, it **re-binds it** to each *iteration* of the loop, making sure to re-assign it the value from the end of the previous loop iteration.

Here's another way of illustrating the per-iteration binding behavior that occurs:

```js
{
	let j;
	for (j=0; j<10; j++) {
		let i = j; // re-bound for each iteration!
		console.log( i );
	}
}
```

The reason why this per-iteration binding is interesting will become clear in Chapter 5 when we discuss closures.

Because `let` declarations attach to arbitrary blocks rather than to the enclosing function's scope (or global), there can be gotchas where existing code has a hidden reliance on function-scoped `var` declarations, and replacing the `var` with `let` may require additional care when refactoring code.

Consider:

```js
var foo = true, baz = 10;

if (foo) {
	var bar = 3;

	if (baz > bar) {
		console.log( baz );
	}

	// ...
}
```

This code is fairly easily re-factored as:

```js
var foo = true, baz = 10;

if (foo) {
	var bar = 3;

	// ...
}

if (baz > bar) {
	console.log( baz );
}
```

But, be careful of such changes when using block-scoped variables:

```js
var foo = true, baz = 10;

if (foo) {
	let bar = 3;

	if (baz > bar) { // <-- don't forget `bar` when moving!
		console.log( baz );
	}
}
```

See Appendix B for an alternate (more explicit) style of block-scoping which may provide easier to maintain/refactor code that's more robust to these scenarios.

### `const`

In addition to `let`, ES6 introduces `const`, which also creates a block-scoped variable, but whose value is fixed (constant). Any attempt to change that value at a later time results in an error.

```js
var foo = true;

if (foo) {
	var a = 2;
	const b = 3; // block-scoped to the containing `if`

	a = 3; // just fine!
	b = 4; // error!
}

console.log( a ); // 3
console.log( b ); // ReferenceError!
```

## Review (TL;DR)

Hàm là nơi tạo ra scope thông dụng nhất trong JavaScript. Những variables và functions dược khai báo bên trong 1 function A sẽ bị ẩn đi, chỉ có thể được truy xuất nội bộ bên trong scope đóng gói bởi fuction A, và đây là nguyên tắc thiết kế chuẩn trong ngành phần mềm. 

Tuy vậy, scope không chỉ được tạo ra bởi các functions mà còn bởi các block-scope, nghĩa là bởi bất kỳ khối code nào được đóng gói bởi cặp `{ .. }`.

Kể từ ES3, cấu trúc `try/catch` tạo ra một block-scope bên trong mệnh đề `catch`.

Trong ES6, từ khoá `let` (chị em họ với từ khoá `var`) được đưa vào cho phép khai báo variables trong bất kỳ khối code nào. `if (..) { let a = 2; }` sẽ khai báo một variable tên `a` và các lập trình viên có thể gọi nó bên trong cặp `{ .. }` của  `if`.

Though some seem to believe so, block scope should not be taken as an outright replacement of `var` function scope. Both functionalities co-exist, and developers can and should use both function-scope and block-scope techniques where respectively appropriate to produce better, more readable/maintainable code.

[^note-leastprivilege]: [Principle of Least Privilege](http://en.wikipedia.org/wiki/Principle_of_least_privilege)
