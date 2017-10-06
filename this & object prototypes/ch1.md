# You Don't Know JS: *this* & Object Prototypes
# Chapter 1: `this` Or That?

Một trong những điểm gây bối rối nhất khi lập trình JavaScript là việc dùng từ khoá `this`. Đây là một từ khoá nhận dạng (identifier) đặc biệt được định nghĩa một cách tự động bên trong "scope" của mọi hàm, nhưng nó (`this`) thực sự là gì thì ngay cả những lập trình viên JavaScript có kinh nghiệm cũng đau đầu. 

> Bất kỳ **kỹ thuật tiên tiến** nào, lúc mới nhìn cũng không khác chi ma thuật. -- định luật thứ 3 của Arthur C. Clarke, một nhà khoa học và nhà văn người Anh

Thực ra thì cơ chế hoạt động của `this` trong JavaScript không tiên tiến đến mức *đó*, nhưng các lập trình viên thường trích lại định luật Clarke nói trên trong tâm trí, thêm vào những từ tiêu cực như "phức tạp", hay "rối rắm", và đương nhiên nếu không tìm hiểu thì dần dần `this` sẽ thực sự trở thành ma thuật trong tâm trí của *bạn*. 

**Lưu ý:** this" là một đại từ vô cùng thông dụng trong rất nhiều bài luận, hoặc thuyết trình. Và chương này (Chương 1: `this` Or That?) cũng không tránh khỏi việc dùng từ `this`! Vậy làm thế nào để người đọc hiểu là tác giả đang nói về từ khoá `this` trong Javascript, hay là đang dùng đại từ "this" như cách sử dụng thông thường ngoài đời? Để tránh nhầm lẫn, tác giả thông nhất viết `this` là chỉ đến từ khoá của JavaScript, còn để this trong dấu ngoặc "this" hoặc in nghiêng *this*. 

## Tại sao cần `this`?

Nếu cơ chế của`this` rắc rối đến thế (kể cả đối với lập trình viên JavaScript có kinh nghiệm), thì tại sao cần nó làm gì? `this` có ích hay không? Hay là nó chỉ tạo thêm nhiều vấn đề hơn là lợi ích mang lại? Trước khi đi vào câu hỏi *như thế nào*, hãy bắt đầu với câu hỏi *tại sao*. 

Dưới đây là một minh hoạt về lý do việc dùng `this`:

```js
function identify() {
	return this.name.toUpperCase();
}

function speak() {
	var greeting = "Hello, I'm " + identify.call( this );
	console.log( greeting );
}

var me = {
	name: "Kyle"
};

var you = {
	name: "Reader"
};

identify.call( me ); // KYLE
identify.call( you ); // READER

speak.call( me ); // Hello, I'm KYLE
speak.call( you ); // Hello, I'm READER
```

Đừng lo lắng nếu vẫn chưa hiểu đoạn code mẫu phía trên! Chúng ta sẽ giải thích nó ngay sau đây. Bây giờ, tạm thời đặt ra vài câu hỏi phụ để có thể góp phần trả lời cho câu hỏi *tại sao*.

Đoạn code trên cho phép các hàm `identify()` và `speak()` được tái sử dụng từ "context" của các object `me` và `you`, chứ không cần phải tạo hàm riêng cho từng đối tượng. 

Còn bây giờ, thử không dùng `this` mà hãy truyền một "context object" trực tiếp cho hai hàm `identify()` và `speak()`.

```js
function identify(context) {
	return context.name.toUpperCase();
}

function speak(context) {
	var greeting = "Hello, I'm " + identify( context );
	console.log( greeting );
}

identify( you ); // READER
speak( me ); // Hello, I'm KYLE
```
Dẫu cách trên cũng cho cùng kết quả, thì việc dùng `this` khiến cho đoạn code trở nên gần gũi về mặt ngữ nghĩa bề mặt, thể hiện ta đang truyền đi 1 object reference, khiến cho thiết kế API trở nên sạch sẽ và dễ dàng tái sử dụng. 

Khi bạn càng sử dụng các pattern phức tạp, bạn sẽ càng thấy rằng truyền context như cách phía sau (với 1 tham số trực tiếp) sẽ gây lộn xộn hơn là truyền thông qua `this`. When we explore objects and prototypes, you will see the helpfulness of a collection of functions being able to automatically reference the proper context object.

## `this` thật dễ nhầm lẫn

Trước tiên, hãy đập tan những hiểu nhầm về cách mà `this` không làm việc.

Từ `this` tạo ra sự mơ hồ vì lập trình viên chỉ hiểu nó theo đúng nghĩa đen (định nghĩa trong từ điển tiếng Anh). Có hai cách hiểu liệt kê bên dưới, mà cả hai đều ... sai. 

### `this` = "chính nó"

Cách hiểu thông dụng nhất là cho rằng `this` trở đến bản thân chính hàm gọi nó. Đây là cách hiểu theo kiểu ngữ pháp.

Tại sao bạn lại muốn gọi 1 hàm từ bên trong chính nó? Một trong những lý do phổ biết là vì để tạo hàm đệ quy (gọi một hàm bên trong chính hàm đó), hoặc một event handler có thể unbind itself when it's first called.

Những lập trình viên mới sử dụng JavaScript đều nghĩ rằng việc trỏ để function thông qua object của function (chú ý là mọi hàm của JavaScript đều là object) sẽ giúp họ lưu lại *trạng thái* (các giá trị (values) của thuộc tính (properties)) giữa các lần gọi hàm. Dẫu đây là một phương án và có thể sử dụng trong một vài trường hợp, phần còn lại của quyển sách này sẽ chỉ ra rất nhiều cách khác *tốt hơn* để lưu các trạng thái của hàm giữa các lần gọi. 

Với mục này, chúng ta sẽ xem vì sao mà `this` không cho phép hàm trỏ đến chính nó như ta giả định. 

Quan sát đoạn code dưới đây xem 1 hàm (hàm `foo`) được gọi:

```js
function foo(num) {
	console.log( "foo: " + num );

	// dòng bên dưới để tính số lần `foo` được gọi
	this.count++;
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// vậy `foo` đã được gọi bao nhiêu lần?
console.log( foo.count ); // 0 lần -- Tại saoooooo!?!?!?!
```

`foo.count` *vẫn* bằng `0`, dù `console.log` đã được gọi 4 lần và in ra các giá trị khác nhau từ 6 đến 9. Sự bối rối này bắt nguồn từ việc hiểu từ `this` trong `this.count++` theo nghĩa đen.

Khi dòng mã `foo.count = 0` được thực thi, thực chất thì một thuộc tính (property) gọi là `count` đã được gắn cho function object `foo`. Nhưng với `this.count` thì `this` lại *hoàn toàn không* trỏ đến function object của `foo`, vì vậy mà cứ tưởng là `foo.count` và `this.count` giống nhau, nhưng thực phần gốc của chúng khác nhau, kết quả là ta bị nhầm lẫn. 

**Note:** A responsible developer *should* ask at this point, "If I was incrementing a `count` property but it wasn't the one I expected, which `count` *was* I incrementing?" In fact, were she to dig deeper, she would find that she had accidentally created a global variable `count` (see Chapter 2 for *how* that happened!), and it currently has the value `NaN`. Of course, once she identifies this peculiar outcome, she then has a whole other set of questions: "How was it global, and why did it end up `NaN` instead of some proper count value?" (see Chapter 2).

Thay vì dừng ở đây và đào sâu vào lý do `this` không đưa ta đến giá trị *mong muốn* (cũng như trả lời các câu hỏi khác ở trên), rất nhiều lập trình viên đơn giản là quay mặt đi với mọi thứ, sử dụng mẹo để xử lý vấn đề này, ví dụ như tạo 1 object khác để lưu `count`:

```js
function foo(num) {
	console.log( "foo: " + num );

	// dòng bên dưới để tính số lần `foo` được gọi
	data.count++;
}

var data = {
	count: 0
};

var i;

for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// vậy `foo` đã được gọi bao nhiêu lần?
console.log( data.count ); // 4
```
Mặc dù cách làm trên đã cho đúng giá trị của số lần hàm `foo` được gọi, nhưng rất tiếc nó đã bỏ qua vấn đề thực sự - không giải đáp được `this` có nghĩa gì và cơ chế bê trong nó, và rồi rơi lại vào vùng an toàn của một cơ chế quen thuộc hơn tên là "lexical scope". 

**Lưu ý:** Lexical scope là một cơ chế vô cùng hoàn hảo và hữu dụng; tác giả hề không có ý coi thường việc dùng nó (hãy xem quyển *"Scope & Closures"* trong series sách "You don't know JS"). Nhưng nếu phải luôn *đoán và đoán* cách dùng `this` thì lại không nên, càng không nên quay sang "lexical scope" và không chịu học lý do `this` luôn lảng tránh bạn.

To reference a function object from inside itself, `this` by itself will typically be insufficient. You generally need a reference to the function object via a lexical identifier (variable) that points at it.

Consider these two functions:

```js
function foo() {
	foo.count = 4; // `foo` refers to itself
}

setTimeout( function(){
	// anonymous function (no name), cannot
	// refer to itself
}, 10 );
```

In the first function, called a "named function", `foo` is a reference that can be used to refer to the function from inside itself.

But in the second example, the function callback passed to `setTimeout(..)` has no name identifier (so called an "anonymous function"), so there's no proper way to refer to the function object itself.

**Note:** The old-school but now deprecated and frowned-upon `arguments.callee` reference inside a function *also* points to the function object of the currently executing function. This reference is typically the only way to access an anonymous function's object from inside itself. The best approach, however, is to avoid the use of anonymous functions altogether, at least for those which require a self-reference, and instead use a named function (expression). `arguments.callee` is deprecated and should not be used.

So another solution to our running example would have been to use the `foo` identifier as a function object reference in each place, and not use `this` at all, which *works*:

```js
function foo(num) {
	console.log( "foo: " + num );

	// keep track of how many times `foo` is called
	foo.count++;
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was `foo` called?
console.log( foo.count ); // 4
```

However, that approach similarly side-steps *actual* understanding of `this` and relies entirely on the lexical scoping of variable `foo`.

Yet another way of approaching the issue is to force `this` to actually point at the `foo` function object:

```js
function foo(num) {
	console.log( "foo: " + num );

	// keep track of how many times `foo` is called
	// Note: `this` IS actually `foo` now, based on
	// how `foo` is called (see below)
	this.count++;
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
	if (i > 5) {
		// using `call(..)`, we ensure the `this`
		// points at the function object (`foo`) itself
		foo.call( foo, i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was `foo` called?
console.log( foo.count ); // 4
```

**Instead of avoiding `this`, we embrace it.** We'll explain in a little bit *how* such techniques work much more completely, so don't worry if you're still a bit confused!

### Its Scope

The next most common misconception about the meaning of `this` is that it somehow refers to the function's scope. It's a tricky question, because in one sense there is some truth, but in the other sense, it's quite misguided.

To be clear, `this` does not, in any way, refer to a function's **lexical scope**. It is true that internally, scope is kind of like an object with properties for each of the available identifiers. But the scope "object" is not accessible to JavaScript code. It's an inner part of the *Engine*'s implementation.

Consider code which attempts (and fails!) to cross over the boundary and use `this` to implicitly refer to a function's lexical scope:

```js
function foo() {
	var a = 2;
	this.bar();
}

function bar() {
	console.log( this.a );
}

foo(); //undefined
```

There's more than one mistake in this snippet. While it may seem contrived, the code you see is a distillation of actual real-world code that has been exchanged in public community help forums. It's a wonderful (if not sad) illustration of just how misguided `this` assumptions can be.

Firstly, an attempt is made to reference the `bar()` function via `this.bar()`. It is almost certainly an *accident* that it works, but we'll explain the *how* of that shortly. The most natural way to have invoked `bar()` would have been to omit the leading `this.` and just make a lexical reference to the identifier.

However, the developer who writes such code is attempting to use `this` to create a bridge between the lexical scopes of `foo()` and `bar()`, so that `bar()` has access to the variable `a` in the inner scope of `foo()`. **No such bridge is possible.** You cannot use a `this` reference to look something up in a lexical scope. It is not possible.

Every time you feel yourself trying to mix lexical scope look-ups with `this`, remind yourself: *there is no bridge*.

## What's `this`?

Having set aside various incorrect assumptions, let us now turn our attention to how the `this` mechanism really works.

We said earlier that `this` is not an author-time binding but a runtime binding. It is contextual based on the conditions of the function's invocation. `this` binding has nothing to do with where a function is declared, but has instead everything to do with the manner in which the function is called.

When a function is invoked, an activation record, otherwise known as an execution context, is created. This record contains information about where the function was called from (the call-stack), *how* the function was invoked, what parameters were passed, etc. One of the properties of this record is the `this` reference which will be used for the duration of that function's execution.

In the next chapter, we will learn to find a function's **call-site** to determine how its execution will bind `this`.

## Review (TL;DR)

`this` binding is a constant source of confusion for the JavaScript developer who does not take the time to learn how the mechanism actually works. Guesses, trial-and-error, and blind copy-n-paste from Stack Overflow answers is not an effective or proper way to leverage *this* important `this` mechanism.

To learn `this`, you first have to learn what `this` is *not*, despite any assumptions or misconceptions that may lead you down those paths. `this` is neither a reference to the function itself, nor is it a reference to the function's *lexical* scope.

`this` is actually a binding that is made when a function is invoked, and *what* it references is determined entirely by the call-site where the function is called.
