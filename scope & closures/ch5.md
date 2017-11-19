# You Don't Know JS: Scope & Closures
# Chapter 5: Scope Closure

Hy vọng đến phần này, tất cả chúng ta đều hiểu thấu đáo về cách scope làm việc.

We turn our attention to an incredibly important, but persistently elusive, *almost mythological*, part of the language: **closure**. If you have followed our discussion of lexical scope thus far, the payoff is that closure is going to be, largely, anticlimactic, almost self-obvious. *There's a man behind the wizard's curtain, and we're about to see him*. No, his name is not Crockford!

If however you have nagging questions about lexical scope, now would be a good time to go back and review Chapter 2 before proceeding.

## Enlightenment

For those who are somewhat experienced in JavaScript, but have perhaps never fully grasped the concept of closures, *understanding closure* can seem like a special nirvana that one must strive and sacrifice to attain.

I recall years back when I had a firm grasp on JavaScript, but had no idea what closure was. The hint that there was *this other side* to the language, one which promised even more capability than I already possessed, teased and taunted me. I remember reading through the source code of early frameworks trying to understand how it actually worked. I remember the first time something of the "module pattern" began to emerge in my mind. I remember the *a-ha!* moments quite vividly.

What I didn't know back then, what took me years to understand, and what I hope to impart to you presently, is this secret: **closure is all around you in JavaScript, you just have to recognize and embrace it.** Closures are not a special opt-in tool that you must learn new syntax and patterns for. No, closures are not even a weapon that you must learn to wield and master as Luke trained in The Force.

Closures happen as a result of writing code that relies on lexical scope. They just happen. You do not even really have to intentionally create closures to take advantage of them. Closures are created and used for you all over your code. What you are *missing* is the proper mental context to recognize, embrace, and leverage closures for your own will.

The enlightenment moment should be: **oh, closures are already occurring all over my code, I can finally *see* them now.** Understanding closures is like when Neo sees the Matrix for the first time.

## Nitty Gritty

OK, enough hyperbole and shameless movie references.

Here's a down-n-dirty definition of what you need to know to understand and recognize closures:

> Closure là khi một function có thể ghi nhớ và truy cập lexical scope của nó ngay cả khi nó đó thực thi bên ngoài lexical scope đấy.

Hãy xem ví dụ sau:

```js
function foo() {
	var a = 2;

	function bar() {
		console.log( a ); // 2
	}

	bar();
}

foo();
```

Đoạn code trên trông tương tự với những gì đã thảo luận ở phần Nested Scope (Scope lồng nhau). Function `bar()` có *quyền truy cập* đến variable `a` ở scope bao bên ngoài theo quy định về phép tìm kiếm của lexical scope (trong trường hợp này, đây là phép tìm bên phải).

Đoạn code trên có minh họa cho "closure" hay không? Có lẽ, về mặt kỹ thuật thì ... *có vẻ đúng*. But by our what-you-need-to-know definition above... *not exactly*. I think the most accurate way to explain `bar()` referencing `a` is via lexical scope look-up rules, and those rules are *only* (an important!) **part** of what closure is.

Về mặt lý thuyết thuần túy, những gì đoạn code trên thể hiện cho thấy function `bar()` có một *closure* over the scope of `foo()` (and indeed, even over the rest of the scopes it has access to, such as the global scope in our case). Put slightly differently, it's said that `bar()` closes over the scope of `foo()`. Why? Because `bar()` appears nested inside of `foo()`. Plain and simple.

But, closure defined in this way is not directly *observable*, nor do we see closure *exercised* in that snippet. We clearly see lexical scope, but closure remains sort of a mysterious shifting shadow behind the code.

Let us then consider code which brings closure into full light:

```js
function foo() {
	var a = 2;

	function bar() {
		console.log( a );
	}

	return bar;
}

var baz = foo();

baz(); // 2 -- Whoa, closure was just observed, man.
```

Function `bar()` có lexical scope truy cập đến scope bên trong `foo()`. But then, we take `bar()`, the function itself, and pass it *as* a value. Trong trường hợp này, we `return` the function object itself that `bar` references.

After we execute `foo()`, we assign the value it returned (our inner `bar()` function) to a variable called `baz`, and then we actually invoke `baz()`, which of course is invoking our inner function `bar()`, just by a different identifier reference.

Function `bar()` đã được thực thi, nhưng mà thực thi *bên ngoài* lexical scope mà nó được khai báo.

Sau khi `foo()` được thực thi, về mặt cảm tính chúng ta sẽ cho rằng toàn bộ scope bên trong của `foo()` sẽ biến mất, bởi ta biết *Engine* sẽ cho *Garbage Collector* hoạt động để giải phóng bộ nhớ một khi `foo()` không còn cần đến nữa. Since it would appear that the contents of `foo()` are no longer in use, it would seem natural that they should be considered *gone*.

But the "magic" of closures does not let this happen. That inner scope is in fact *still* "in use", and thus does not go away. Who's using it? **The function `bar()` itself**.

By virtue of where it was declared, `bar()` has a lexical scope closure over that inner scope of `foo()`, which keeps that scope alive for `bar()` to reference at any later time.

**`bar()` still has a reference to that scope, and that reference is called closure.**

So, a few microseconds later, when the variable `baz` is invoked (invoking the inner function we initially labeled `bar`), it duly has *access* to author-time lexical scope, so it can access the variable `a` just as we'd expect.

The function is being invoked well outside of its author-time lexical scope. **Closure** lets the function continue to access the lexical scope it was defined in at author-time.

Of course, any of the various ways that functions can be *passed around* as values, and indeed invoked in other locations, are all examples of observing/exercising closure.

```js
function foo() {
	var a = 2;

	function baz() {
		console.log( a ); // 2
	}

	bar( baz );
}

function bar(fn) {
	fn(); // look ma, I saw closure!
}
```

We pass the inner function `baz` over to `bar`, and call that inner function (labeled `fn` now), and when we do, its closure over the inner scope of `foo()` is observed, by accessing `a`.

These passings-around of functions can be indirect, too.

```js
var fn;

function foo() {
	var a = 2;

	function baz() {
		console.log( a );
	}

	fn = baz; // assign `baz` to global variable
}

function bar() {
	fn(); // look ma, I saw closure!
}

foo();

bar(); // 2
```

Whatever facility we use to *transport* an inner function outside of its lexical scope, it will maintain a scope reference to where it was originally declared, and wherever we execute it, that closure will be exercised.

## Now I Can See

The previous code snippets are somewhat academic and artificially constructed to illustrate *using closure*. But I promised you something more than just a cool new toy. I promised that closure was something all around you in your existing code. Let us now *see* that truth.

```js
function wait(message) {

	setTimeout( function timer(){
		console.log( message );
	}, 1000 );

}

wait( "Hello, closure!" );
```

We take an inner function (named `timer`) and pass it to `setTimeout(..)`. But `timer` has a scope closure over the scope of `wait(..)`, indeed keeping and using a reference to the variable `message`.

A thousand milliseconds after we have executed `wait(..)`, and its inner scope should otherwise be long gone, that inner function `timer` still has closure over that scope.

Deep down in the guts of the *Engine*, the built-in utility `setTimeout(..)` has reference to some parameter, probably called `fn` or `func` or something like that. *Engine* goes to invoke that function, which is invoking our inner `timer` function, and the lexical scope reference is still intact.

**Closure.**

Or, if you're of the jQuery persuasion (or any JS framework, for that matter):

```js
function setupBot(name,selector) {
	$( selector ).click( function activator(){
		console.log( "Activating: " + name );
	} );
}

setupBot( "Closure Bot 1", "#bot_1" );
setupBot( "Closure Bot 2", "#bot_2" );
```

I am not sure what kind of code you write, but I regularly write code which is responsible for controlling an entire global drone army of closure bots, so this is totally realistic!

(Some) joking aside, essentially *whenever* and *wherever* you treat functions (which access their own respective lexical scopes) as first-class values and pass them around, you are likely to see those functions exercising closure. Be that timers, event handlers, Ajax requests, cross-window messaging, web workers, or any of the other asynchronous (or synchronous!) tasks, when you pass in a *callback function*, get ready to sling some closure around!

**Note:** Chapter 3 introduced the IIFE pattern. While it is often said that IIFE (alone) is an example of observed closure, I would somewhat disagree, by our definition above.

```js
var a = 2;

(function IIFE(){
	console.log( a );
})();
```

This code "works", but it's not strictly an observation of closure. Why? Because the function (which we named "IIFE" here) is not executed outside its lexical scope. It's still invoked right there in the same scope as it was declared (the enclosing/global scope that also holds `a`). `a` is found via normal lexical scope look-up, not really via closure.

While closure might technically be happening at declaration time, it is *not* strictly observable, and so, as they say, *it's a tree falling in the forest with no one around to hear it.*

Though an IIFE is not *itself* an example of closure, it absolutely creates scope, and it's one of the most common tools we use to create scope which can be closed over. So IIFEs are indeed heavily related to closure, even if not exercising closure themselves.

Put this book down right now, dear reader. I have a task for you. Go open up some of your recent JavaScript code. Look for your functions-as-values and identify where you are already using closure and maybe didn't even know it before.

I'll wait.

Now... you see!

## Loops + Closure

The most common canonical example used to illustrate closure involves the humble for-loop.

```js
for (var i=1; i<=5; i++) {
	setTimeout( function timer(){
		console.log( i );
	}, i*1000 );
}
```

**Note:** Linters often complain when you put functions inside of loops, because the mistakes of not understanding closure are **so common among developers**. We explain how to do so properly here, leveraging the full power of closure. But that subtlety is often lost on linters and they will complain regardless, assuming you don't *actually* know what you're doing.

The spirit of this code snippet is that we would normally *expect* for the behavior to be that the numbers "1", "2", .. "5" would be printed out, one at a time, one per second, respectively.

In fact, if you run this code, you get "6" printed out 5 times, at the one-second intervals.

**Huh?**

Đầu tiên, hãy cùng xem con số `6` đến từ đâu. Điều kiện để dừng vòng lặp là khi giá trị của `i` *không* `<=5`. Như vậy khi vòng lặp dừng thì `i` bằng 6. Vì thế, kết quả in ra chính là giá trị cuối cùng của `i` sau khi vòng lặp dừng.

Điều này mới đầu thì trông có vẻ hợp lý bởi các function callback trên đều được chạy chậm lại một quãng thời gian sau khi vòng lặp kết thúc. Tuy vậy, kể cả khi ta đặt `setTimeout(.., 0)` cho từng vòng lặp, thì kết quả vẫn là `6` giống như trên. Điều này chứng tỏ còn có gì nằm sâu hơn cần phải tìm hiểu. Chúng ta đã *quên* gì trong đoạn code trên để nó có thể dẫn đến kết quả như ta mong muống?

Vấn đề ở đây chính là vì chúng ta *tưởng* mỗi vòng lặp sẽ "lưu" lại bản sao của `i` tại thời điểm đó. Tuy nhiên, theo cái cách mà scope hoạt động, thì tất cả các functions trên, dẫu có được khai báo riêng biệt trong từng vòng lặp, thì đều **ở trong 1 scope chung là global scope**, mà scope này vốn chỉ có một `i` trong nó.

Khi hiểu như vậy thì *đương nhiên* là mọi functions đều chia sẻ cùng một tham chiếu đến `i`. Cấu trúc của vòng lặp thường khiến cho chúng ta bối rối, nghĩ rằng sẽ có thứ gì phức tạp hơn. Câu trả lời là không. Không có gì khác ngoài việc cứ như là không hề có vòng lặp, mà chỉ có 5 timeout callback được khai báo lần lượt từng function một. 

Ok, quay trở lại câu hỏi nhức đầu trên, chúng ta đang thiếu thứ gì? Chúng ta cần thêm closured scope. Chính xác hơn, chúng ta cần closured scope (hay là scope của riêng từng function) cho mỗi vòng lặp.

Trong chương 3, ta đã biết là IIFE tạo ra scope bằng cách khai báo và thực thi hàm ngay lập tức. Vậy hãy thử với IIFE xem sao:

```js
for (var i=1; i<=5; i++) {
	(function(){
		setTimeout( function timer(){
			console.log( i );
		}, i*1000 );
	})();
}
```

Nó có cho kết quả như ta cần không? **KHÔNG.** Tại sao? Rõ ràng chúng ta đã có thêm lexical scope. Mỗi timeout function callback thực tế đã được đóng gói trong scope tạo ra bởi từng IIFE trong từng vòng lặp. 

Câu trả lời là vì scope mà IIFE tạo ra ở trên là **scope rỗng**. Scope này cần thêm *dữ liệu* để có thể sử dụng. Nó cần variable của chính nó, chính là bản sao giá trị của `i` trong từng vòng lặp.

```js
for (var i=1; i<=5; i++) {
	(function(){
		var j = i;
		setTimeout( function timer(){
			console.log( j );
		}, j*1000 );
	})();
}
```

**Eureka! Nó đã chạy!**

Một phiên bản khác được ưu thích hơn là:

```js
for (var i=1; i<=5; i++) {
	(function(j){
		setTimeout( function timer(){
			console.log(j);
		}, j*1000 );
	})(i);
}
```

Rõ ràng, bởi IIFEs thực ra chỉ là các functions, chúng ta có thể truyền tham số `i` cho nó, và gọi tham số truyền vào là `j` nếu muốn, hoặc thậm chí vẫn để là `i` cũng được. Cả hai cách này đều cho kết quả giống nhau. Việc dùng IIFE bên trong mỗi vòng lặp đã tạo ra một scope mới ở từng vòng lặp, trong mỗi scope này có chứa variable mà ta có quyền truy cập giá trị của variable đấy.

Vậy là vấn đề trên đã được giải quyết!

### Cùng xem lại "Block Scoping"

Khi đọc kỹ lại phần trên, chúng ta thấy rằng ta đã sử dụng IIFE để tạo ra scope mới trong mỗi vòng lặp. Vậy thực ra để giải quyết vấn đề, chúng ta *đã cần* những **block scope** (scope có phạm vi trong từng khối code) trong các vòng lặp. Việc này gợi lại chương 3, chương đã đề cập đến khai báo dùng `let`, một từ khóa đã thay đổi đặc tính của 1 khối code, giúp khai báo variable ngay trong khối code đấy. 

**Từ đó,  essentially turns a block into a scope that we can close over.** So, the following awesome code "just works":

```js
for (var i=1; i<=5; i++) {
	let j = i; // yay, block-scope for closure!
	setTimeout( function timer(){
		console.log( j );
	}, j*1000 );
}
```

*But, that's not all!* (in my best Bob Barker voice). There's a special behavior defined for `let` declarations used in the head of a for-loop. This behavior says that the variable will be declared not just once for the loop, **but each iteration**. And, it will, helpfully, be initialized at each subsequent iteration with the value from the end of the previous iteration.

```js
for (let i=1; i<=5; i++) {
	setTimeout( function timer(){
		console.log( i );
	}, i*1000 );
}
```

How cool is that? Block scoping and closure working hand-in-hand, solving all the world's problems. I don't know about you, but that makes me a happy JavaScripter.

## Modules

There are other code patterns which leverage the power of closure but which do not on the surface appear to be about callbacks. Let's examine the most powerful of them: *the module*.

```js
function foo() {
	var something = "cool";
	var another = [1, 2, 3];

	function doSomething() {
		console.log( something );
	}

	function doAnother() {
		console.log( another.join( " ! " ) );
	}
}
```

As this code stands right now, there's no observable closure going on. We simply have some private data variables `something` and `another`, and a couple of inner functions `doSomething()` and `doAnother()`, which both have lexical scope (and thus closure!) over the inner scope of `foo()`.

But now consider:

```js
function CoolModule() {
	var something = "cool";
	var another = [1, 2, 3];

	function doSomething() {
		console.log( something );
	}

	function doAnother() {
		console.log( another.join( " ! " ) );
	}

	return {
		doSomething: doSomething,
		doAnother: doAnother
	};
}

var foo = CoolModule();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

This is the pattern in JavaScript we call *module*. Một trong những cách thông dụng nhất để áp dụng module pattern là mô hình "Revealing Module", và chúng ta sẽ xem xét biến thể của pattern này bên dưới đây.

Let's examine some things about this code.

Đầu tiên, `CoolModule()` chỉ đơn giản là một function, nhưng nó *cần phải được invoked* để tạo tạo ra instance của module. Không thực thi function bên ngoài (`CoolModule()`) thì sẽ không có inner scope và closures.

Thứ hai, function `CoolModule()` trả về một object dưới dạng `{ key: value, ... }`. Object được trả về có tham chiếu đến functions bên trong của `CoolModule()`, nhưng *không* tham chiếu đến các variables của `CoolModule()` như `something` hoặc `another`. Chúng ta giữ những variable này, không để lộ ra ngoài. Hãy coi object trả về kia như một **public API cho module của chúng ta**.

Khi variable `foo` được gán với `CoolModule()`, đồng nghĩa với việc nó cũng được gán với object trả về của `CoolModule()`, sau đó ta có thể truy cập vào các thuộc tính của API, như là `foo.doSomething()`.

**Note:** It is not required that we return an actual object (literal) from our module. We could just return back an inner function directly. jQuery is actually a good example of this. The `jQuery` and `$` identifiers are the public API for the jQuery "module", but they are, themselves, just a function (which can itself have properties, since all functions are objects).

Hai functions `doSomething()` và `doAnother()` có closure ứng với scope bên trong của module "instance" (có được nhờ vào việc invoke `CoolModule()`). Khi chúng ta gọi các hàm đó bên ngoài lexical scope của nó (thông qua các tham chiếu đến object được trả về kia), ta đã thiết lập một môi trường để quan sát và triển khai closure.

Để cho đơn giản, hãy nhớ rằng có hai "điều kiện" để một đoạn code được gọi là module pattern:

1. Nó phải có một function bao bên ngoài, và function này phải được gọi ít nhất một lần (mỗi lần gọi function này sẽ tạo ra 1 instance của module đó).

2. Function bao bên ngoài (tạm gọi là function `A`) phải trả về ít nhất 1 function khác (tạm gọi là function `a`) vốn khai báo bên trong nó (tức là function `a` được khai báo bên trong `A`). Nhờ vậy mà function `a` có thể truy cập & thay đổi các variables bên trong `A` như chương 3 đã đề cập.

Một object có chứa property là function thì không *thực sự* là module. An object which is returned from a function invocation which only has data properties on it and no closured functions is not *really* a module, in the observable sense.

The code snippet above shows a standalone module creator called `CoolModule()` which can be invoked any number of times, each time creating a new module instance. A slight variation on this pattern is when you only care to have one instance, a "singleton" of sorts:

```js
var foo = (function CoolModule() {
	var something = "cool";
	var another = [1, 2, 3];

	function doSomething() {
		console.log( something );
	}

	function doAnother() {
		console.log( another.join( " ! " ) );
	}

	return {
		doSomething: doSomething,
		doAnother: doAnother
	};
})();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

Ở đây, chúng ta chuyển module function thành một IIFE (xem Chương 3), rồi gọi nó *ngay lập tức*, gán giá trị trả về trực tiếp cho 1 instance của module này (instance có định danh là `foo`).

Do modules chỉ đơn giản là functions, vì vậy mà chúng ta có thể truyền tham số cho modules:

```js
function CoolModule(id) {
	function identify() {
		console.log( id );
	}

	return {
		identify: identify
	};
}

var foo1 = CoolModule( "foo 1" );
var foo2 = CoolModule( "foo 2" );

foo1.identify(); // "foo 1"
foo2.identify(); // "foo 2"
```

Một phiên bản khác (nhưng mạnh mẽ hơn) của modele pattern đó là việc đặt tên object trả về là publicAPI (Ghi chú của người dịch: Việc đặt tên này giúp người đọc - một lập trình viên khác, hiểu ngay đây đâu là giá trị trả về được công khai cho người dùng):

```js
var foo = (function CoolModule(id) {
	function change() {
		// modifying the public API
		publicAPI.identify = identify2;
	}

	function identify1() {
		console.log(id);
	}

	function identify2() {
		console.log(id.toUpperCase());
	}

	var publicAPI = {
		change: change,
		identify: identify1
	};

	return publicAPI;
})("foo module");

foo.identify(); // foo module
foo.change();
foo.identify(); // FOO MODULE
```

Bằng cách giữ một tham chiếu bên trong tới object "publicAPI", mà object này lại đặt bên trong của module, ta có thể thay đổi các thuộc tính của module instance **từ bên trong**, kể cả việc thêm, bớt methods, thuộc tính, *và* thay đổi các giá trị của chúng.

### Modern Modules

Various module dependency loaders/managers essentially wrap up this pattern of module definition into a friendly API. Rather than examine any one particular library, let me present a *very simple* proof of concept **for illustration purposes (only)**:

```js
var MyModules = (function Manager() {
	var modules = {};

	function define(name, deps, impl) {
		for (var i=0; i<deps.length; i++) {
			deps[i] = modules[deps[i]];
		}
		modules[name] = impl.apply( impl, deps );
	}

	function get(name) {
		return modules[name];
	}

	return {
		define: define,
		get: get
	};
})();
```

The key part of this code is `modules[name] = impl.apply(impl, deps)`. This is invoking the definition wrapper function for a module (passing in any dependencies), and storing the return value, the module's API, into an internal list of modules tracked by name.

And here's how I might use it to define some modules:

```js
MyModules.define( "bar", [], function(){
	function hello(who) {
		return "Let me introduce: " + who;
	}

	return {
		hello: hello
	};
} );

MyModules.define( "foo", ["bar"], function(bar){
	var hungry = "hippo";

	function awesome() {
		console.log( bar.hello( hungry ).toUpperCase() );
	}

	return {
		awesome: awesome
	};
} );

var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );

console.log(
	bar.hello( "hippo" )
); // Let me introduce: hippo

foo.awesome(); // LET ME INTRODUCE: HIPPO
```

Both the "foo" and "bar" modules are defined with a function that returns a public API. "foo" even receives the instance of "bar" as a dependency parameter, and can use it accordingly.

Spend some time examining these code snippets to fully understand the power of closures put to use for our own good purposes. The key take-away is that there's not really any particular "magic" to module managers. They fulfill both characteristics of the module pattern I listed above: invoking a function definition wrapper, and keeping its return value as the API for that module.

In other words, modules are just modules, even if you put a friendly wrapper tool on top of them.

### Future Modules

ES6 adds first-class syntax support for the concept of modules. When loaded via the module system, ES6 treats a file as a separate module. Each module can both import other modules or specific API members, as well export their own public API members.

**Note:** Function-based modules aren't a statically recognized pattern (something the compiler knows about), so their API semantics aren't considered until run-time. That is, you can actually modify a module's API during the run-time (see earlier `publicAPI` discussion).

By contrast, ES6 Module APIs are static (the APIs don't change at run-time). Since the compiler knows *that*, it can (and does!) check during (file loading and) compilation that a reference to a member of an imported module's API *actually exists*. If the API reference doesn't exist, the compiler throws an "early" error at compile-time, rather than waiting for traditional dynamic run-time resolution (and errors, if any).

ES6 modules **do not** have an "inline" format, they must be defined in separate files (one per module). The browsers/engines have a default "module loader" (which is overridable, but that's well-beyond our discussion here) which synchronously loads a module file when it's imported.

Consider:

**bar.js**
```js
function hello(who) {
	return "Let me introduce: " + who;
}

export hello;
```

**foo.js**
```js
// import only `hello()` from the "bar" module
import hello from "bar";

var hungry = "hippo";

function awesome() {
	console.log(
		hello( hungry ).toUpperCase()
	);
}

export awesome;
```

```js
// import the entire "foo" and "bar" modules
module foo from "foo";
module bar from "bar";

console.log(
	bar.hello( "rhino" )
); // Let me introduce: rhino

foo.awesome(); // LET ME INTRODUCE: HIPPO
```

**Note:** Separate files **"foo.js"** and **"bar.js"** would need to be created, with the contents as shown in the first two snippets, respectively. Then, your program would load/import those modules to use them, as shown in the third snippet.

`import` imports one or more members from a module's API into the current scope, each to a bound variable (`hello` in our case). `module` imports an entire module API to a bound variable (`foo`, `bar` in our case). `export` exports an identifier (variable, function) to the public API for the current module. These operators can be used as many times in a module's definition as is necessary.

The contents inside the *module file* are treated as if enclosed in a scope closure, just like with the function-closure modules seen earlier.

## Review (TL;DR)

Closure dường như là một thế giới JavaScript riêng bí ẩn trong bóng tối mà chỉ có vài chiến binh lập trình viên dũng cảm nhất mới dám bước tới. Tuy vậy, nó thực ra không gì hơn một tiêu chuẩn về cách chúng ta viết code trong môi trường lexical scope, nơi mà functions là những giá trị được truyền qua lại theo ý muốn.

**Closure là đặc tính của một function có thể ghi nhớ và truy cập lexical scope của nó kể cả khi function đó được gọi bên ngoài lexical scope đấy.**

Closures khi sử dụng trong vòng lặp có thể khiến kết quả của đoạn code không đúng như ta mong đợi, đơn gian vì ta bất cẩn không chú ý đến cách closurs hoạt động. Tuy vậy, closures cũng đồng thời là một công cụ mạnh mẽ, cho phép triển khai các patterns như *modules pattern* dưới nhiều hình thức khác nhau.

Để được gọi là module, đoạn code đó phải đảm bảo có hai yếu tố sau: (1) function bọc bên ngoài phải được gọi để giúp tạo ra một scope bao bên ngoài, (2) giá trị trả về của function bọc bên ngoài phải chứa tham chiếu đến ít nhất một hàm bên trong, hàm bên trong này có scope là private inner scope của function bọc bên ngoài.

Now we can see closures all around our existing code, and we have the ability to recognize and leverage them to our own benefit!
