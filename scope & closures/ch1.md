# You Don't Know JS: Scope & Closures
# Chapter 1: What is Scope?

One of the most fundamental paradigms of nearly all programming languages is the ability to store values in variables, and later retrieve or modify those values. In fact, the ability to store values and pull values out of variables is what gives a program *state*.

Without such a concept, a program could perform some tasks, but they would be extremely limited and not terribly interesting.

But the inclusion of variables into our program begets the most interesting questions we will now address: where do those variables *live*? In other words, where are they stored? And, most importantly, how does our program find them when it needs them?

These questions speak to the need for a well-defined set of rules for storing variables in some location, and for finding those variables at a later time. We'll call that set of rules: *Scope*.

But, where and how do these *Scope* rules get set?

## Compiler Theory

It may be self-evident, or it may be surprising, depending on your level of interaction with various languages, but despite the fact that JavaScript falls under the general category of "dynamic" or "interpreted" languages, it is in fact a compiled language. It is *not* compiled well in advance, as are many traditionally-compiled languages, nor are the results of compilation portable among various distributed systems.

But, nevertheless, the JavaScript engine performs many of the same steps, albeit in more sophisticated ways than we may commonly be aware, of any traditional language-compiler.

In traditional compiled-language process, a chunk of source code, your program, will undergo typically three steps *before* it is executed, roughly called "compilation":

1. **Tokenizing/Lexing:** breaking up a string of characters into meaningful (to the language) chunks, called tokens. For instance, consider the program: `var a = 2;`. This program would likely be broken up into the following tokens: `var`, `a`, `=`, `2`, and `;`. Whitespace may or may not be persisted as a token, depending on whether it's meaningful or not.

    **Note:** The difference between tokenizing and lexing is subtle and academic, but it centers on whether or not these tokens are identified in a *stateless* or *stateful* way. Put simply, if the tokenizer were to invoke stateful parsing rules to figure out whether `a` should be considered a distinct token or just part of another token, *that* would be **lexing**.

2. **Parsing:** taking a stream (array) of tokens and turning it into a tree of nested elements, which collectively represent the grammatical structure of the program. This tree is called an "AST" (<b>A</b>bstract <b>S</b>yntax <b>T</b>ree).

    The tree for `var a = 2;` might start with a top-level node called `VariableDeclaration`, with a child node called `Identifier` (whose value is `a`), and another child called `AssignmentExpression` which itself has a child called `NumericLiteral` (whose value is `2`).

3. **Code-Generation:** the process of taking an AST and turning it into executable code. This part varies greatly depending on the language, the platform it's targeting, etc.

    So, rather than get mired in details, we'll just handwave and say that there's a way to take our above described AST for `var a = 2;` and turn it into a set of machine instructions to actually *create* a variable called `a` (including reserving memory, etc.), and then store a value into `a`.

    **Note:** The details of how the engine manages system resources are deeper than we will dig, so we'll just take it for granted that the engine is able to create and store variables as needed.

The JavaScript engine is vastly more complex than *just* those three steps, as are most other language compilers. For instance, in the process of parsing and code-generation, there are certainly steps to optimize the performance of the execution, including collapsing redundant elements, etc.

So, I'm painting only with broad strokes here. But I think you'll see shortly why *these* details we *do* cover, even at a high level, are relevant.

For one thing, JavaScript engines don't get the luxury (like other language compilers) of having plenty of time to optimize, because JavaScript compilation doesn't happen in a build step ahead of time, as with other languages.

For JavaScript, the compilation that occurs happens, in many cases, mere microseconds (or less!) before the code is executed. To ensure the fastest performance, JS engines use all kinds of tricks (like JITs, which lazy compile and even hot re-compile, etc.) which are well beyond the "scope" of our discussion here.

Let's just say, for simplicity's sake, that any snippet of JavaScript has to be compiled before (usually *right* before!) it's executed. So, the JS compiler will take the program `var a = 2;` and compile it *first*, and then be ready to execute it, usually right away.

## Understanding Scope

The way we will approach learning about scope is to think of the process in terms of a conversation. But, *who* is having the conversation?

### The Cast

Let's meet the cast of characters that interact to process the program `var a = 2;`, so we understand their conversations that we'll listen in on shortly:

1. *Engine*: responsible for start-to-finish compilation and execution of our JavaScript program.

2. *Compiler*: one of *Engine*'s friends; handles all the dirty work of parsing and code-generation (see previous section).

3. *Scope*: another friend of *Engine*; collects and maintains a look-up list of all the declared identifiers (variables), and enforces a strict set of rules as to how these are accessible to currently executing code.

For you to *fully understand* how JavaScript works, you need to begin to *think* like *Engine* (and friends) think, ask the questions they ask, and answer those questions the same.

### Back & Forth

When you see the program `var a = 2;`, you most likely think of that as one statement. But that's not how our new friend *Engine* sees it. In fact, *Engine* sees two distinct statements, one which *Compiler* will handle during compilation, and one which *Engine* will handle during execution.


Vậy hãy thử cùng tìm hiểu từng bước cách mà *Engine* và đồng bọn sẽ làm khi gặp đoạn code `var a = 2;`.

Điều đầu tiên mà đồng chí *Compiler* sẽ làm với đoạn mã trên là thực hiện nhiệm vụ mang tên "lexing" để chia nhỏ mã thành các "token", sau đó "parse" vào 1 "tree". Nhưng khi *Compiler* đến bước code-generation, nó sẽ xử lý khác so với những gì chúng ta đoán. 

Chúng ta đoán như thế nào? Rằng *Compiler* sẽ "Allocate memory cho variable, dán nhãn nó là `a`, rồi gắn giá trị `2` vào variable `a` kia. Tuy nhiên, cách hiểu này lại không thực sự chính xác. 

Sự thực thì *Compiler* sẽ làm như sau: 

1. Thấy `var a`, *Compiler* hỏi xem cậu bạn *Scope* của mình đã từng thấy variable `a` tồn tại ở đâu hay chưa. Nếu câu trả lời là "CÓ", thì *Compiler* bỏ qua dòng `var a` kia và chạy dòng tiếp theo. Còn nếu là "KHÔNG", thì *Compiler* yêu cầu bạn *Scope* khai báo 1 variable mới với nhãn `a` trong bộ sưu tập của bạn *Scope* đó.

2. Bạn *Compiler* tiếp theo sẽ viết ra một đoạn mã máy tính (machine code) để *Engine* thực hiện một lúc sau đó, nhằm xử lý việc gán `a = 2`. Mã máy mà *Engine* chạy sẽ hỏi *Scope* xem nếu bạn ý có thể tiếp cận variable nhãn `a` trong bộ sưu tập của bạn *Scope* hay không. Nếu có thể tiếp cận, *Engine* sẽ sử dụng variable này. Còn không, *Engine* sẽ đi tìm *chỗ khác* (xem mục "nested *Scope*" bên dưới).

Nếu *Engine* cuối cùng tìm thấy 1 variable mang nhãn `a` mà nó đang đi tìm (trong *Scope* hoặc *chỗ khác* như nói ở trên, thì Enginer sẽ gán giá trị `2` cho nó. Còn không tìm thấy, thì *Engine* sẽ "giơ tay" báo lỗi. 

**Túm lại**: để gán giá trị cho biến (variable assignment) thì phải thực hiện 2 hành động riêng rẽ: Đầu tiên, *Compiler* khai báo variable đấy (nếu nó chưa tồn tại ở không gian hiện tại), và thứ hai, đó là việc *Engine* tìm variable nhãn `a` và gán giá trị mới cho nó (nếu variable nhãn `a` được tìm thấy). 

### Compiler lên tiếng

Để hiểu đoạn này, ta cần đề cập đến 1 vài thuật ngữ liên quan đến complier. 

Khi *Engine* thực thi đoạn máy tính mà *Compiler* tạo ra ở bước (2), nó (tức *Engine*) phải "hỏi" *Scope* để kiểm tra variable mang nhãn `a` đã có hay chưa bằng cách. Động tác "hỏi" này của *Engine* cũng chia ra làm hai loại, tạm gọi là "hỏi bên trái" và "hỏi bên phải", mỗi loại có công dụng và hiệu năng khác nhau [*Người dịch: trong cuộc sống khi cần hỏi người khác điều gì, thì cách hỏi rất quan trọng. Hỏi khéo thì nhận được câu trả lời, hỏi không khéo thì có thể vẫn nhận được câu trả lời nhưng kèm theo 1 câu chửi, và trong thế giới 0101 của máy tính cũng tương tự như vậy*].

Với trường hợp cụ thể trên, *Engine* sẽ thực hiện "hỏi bên trái" (viết tắt tiếng Anh là "LHS") với *Scope* để kiểm tra sự tồn tại của variable nhãn `a`. Sẽ có trường hợp mà *Engine* cần phải "hỏi bên phải" (viết tắt tiếng Anh là "RHS").

Câu hỏi đặt ra là "bên phải/ bên trái" so với cái gì? Trả lời: **so với phép gán "="**

Điều này có nghĩa là thủ tục "hỏi bên trái" được coi là hoàn thành khi mà variable được đặt phía bên trái của phép gán "=", và thủ tục "hỏi bên phải" hoàn thành khi variable ở bên phải của "=". 

Actually, let's be a little more precise. An RHS look-up is indistinguishable, for our purposes, from simply a look-up of the value of some variable, whereas the LHS look-up is trying to find the variable container itself, so that it can assign. In this way, RHS doesn't *really* mean "right-hand side of an assignment" per se, it just, more accurately, means "not left-hand side".

Để cho dễ hiểu, bạn tưởng tưởng tượng RHS nghĩa là "nhận lấy giá trị của nguồn". 

Hãy đối chiếu những lý thuyết trên vào đoạn code bên dưới:

```js
console.log( a );
```

Tham chiếu đến `a` là 1 tham chiếu dạng "nhìn phải" bởi không có gì được gán vào giá trị của `a` ở đây. Chúng ta đang cần "nhận lấy giá trị của `a`", rồi truyền giá trị đó cho `console.log(...)`.

Ví dụ sau thì là ngược lại: 
```js
a = 2;
```
Tham chiếu đến `a` ở trên lại là 1 tham chiếu dạng "nhìn trái", bởi chúng ta không quan tâm đến giá trị hiện tại của `a` bằng bao nhiêu, ta đơn giản chỉ muốn tìm variable `a` rồi gán cho nó giá trị bằng 2 (ứng với `=2`).

**Lưu ý:** LHS và RHS không hoàn toàn mang nghĩa đen vật lý là "ở bên trái/ bên phải phép "_". Còn vài cách khác nữa để thực hiện phép gán. Do đó, tốt nhất là hãy nghĩ một cách hình tượng hơn là: LHS (nhìn bên trái) là nhìn xem đích đến của phép gán là gì (đích đến của phép gán `a=2` là `a`). RHS (nhìn bên phải) là nhìn xem đâu là nguồn (dữ liệu).

Đoạn code dưới đây có cả RHS và LHS:

```js
function foo(a) {
	console.log( a ); // 2
}

foo( 2 );
```
Dòng cuối cùng đã gọi `foo(..)` ở dạng 1 tham chiếu RHS đến `foo` ("hey, hãy tìm xem giá trị của `foo` bằng bao nhiêu rồi đưa cho tớ!"). Hơn nữa, `(..)` có nghĩa là giá trị của `foo` cần được thực thi, do vậy nó là một hàm số!

Có một phép gán dù rất thoảng qua nhưng lại vô cùng quan trọng ở đây. *Bạn có nhận ra nó?*

You may have missed the implied `a = 2` in this code snippet. It happens when the value `2` is passed as an argument to the `foo(..)` function, in which case the `2` value is **assigned** to the parameter `a`. To (implicitly) assign to parameter `a`, an LHS look-up is performed.

There's also an RHS reference for the value of `a`, and that resulting value is passed to `console.log(..)`. `console.log(..)` needs a reference to execute. It's an RHS look-up for the `console` object, then a property-resolution occurs to see if it has a method called `log`.

Finally, we can conceptualize that there's an LHS/RHS exchange of passing the value `2` (by way of variable `a`'s RHS look-up) into `log(..)`. Inside of the native implementation of `log(..)`, we can assume it has parameters, the first of which (perhaps called `arg1`) has an LHS reference look-up, before assigning `2` to it.

**Note:** You might be tempted to conceptualize the function declaration `function foo(a) {...` as a normal variable declaration and assignment, such as `var foo` and `foo = function(a){...`. In so doing, it would be tempting to think of this function declaration as involving an LHS look-up.

However, the subtle but important difference is that *Compiler* handles both the declaration and the value definition during code-generation, such that when *Engine* is executing code, there's no processing necessary to "assign" a function value to `foo`. Thus, it's not really appropriate to think of a function declaration as an LHS look-up assignment in the way we're discussing them here.

### Engine/Scope Conversation

```js
function foo(a) {
	console.log( a ); // 2
}

foo( 2 );
```

Let's imagine the above exchange (which processes this code snippet) as a conversation. The conversation would go a little something like this:

> ***Engine***: Hey *Scope*, I have an RHS reference for `foo`. Ever heard of it?

> ***Scope***: Why yes, I have. *Compiler* declared it just a second ago. He's a function. Here you go.

> ***Engine***: Great, thanks! OK, I'm executing `foo`.

> ***Engine***: Hey, *Scope*, I've got an LHS reference for `a`, ever heard of it?

> ***Scope***: Why yes, I have. *Compiler* declared it as a formal parameter to `foo` just recently. Here you go.

> ***Engine***: Helpful as always, *Scope*. Thanks again. Now, time to assign `2` to `a`.

> ***Engine***: Hey, *Scope*, sorry to bother you again. I need an RHS look-up for `console`. Ever heard of it?

> ***Scope***: No problem, *Engine*, this is what I do all day. Yes, I've got `console`. He's built-in. Here ya go.

> ***Engine***: Perfect. Looking up `log(..)`. OK, great, it's a function.

> ***Engine***: Yo, *Scope*. Can you help me out with an RHS reference to `a`. I think I remember it, but just want to double-check.

> ***Scope***: You're right, *Engine*. Same guy, hasn't changed. Here ya go.

> ***Engine***: Cool. Passing the value of `a`, which is `2`, into `log(..)`.

> ...

### Quiz

Check your understanding so far. Make sure to play the part of *Engine* and have a "conversation" with the *Scope*:

```js
function foo(a) {
	var b = a;
	return a + b;
}

var c = foo( 2 );
```

1. Identify all the LHS look-ups (there are 3!).

2. Identify all the RHS look-ups (there are 4!).

**Note:** See the chapter review for the quiz answers!

## Nested Scope

We said that *Scope* is a set of rules for looking up variables by their identifier name. There's usually more than one *Scope* to consider, however.

Just as a block or function is nested inside another block or function, scopes are nested inside other scopes. So, if a variable cannot be found in the immediate scope, *Engine* consults the next outer containing scope, continuing until found or until the outermost (aka, global) scope has been reached.

Consider:

```js
function foo(a) {
	console.log( a + b );
}

var b = 2;

foo( 2 ); // 4
```

The RHS reference for `b` cannot be resolved inside the function `foo`, but it can be resolved in the *Scope* surrounding it (in this case, the global).

So, revisiting the conversations between *Engine* and *Scope*, we'd overhear:

> ***Engine***: "Hey, *Scope* of `foo`, ever heard of `b`? Got an RHS reference for it."

> ***Scope***: "Nope, never heard of it. Go fish."

> ***Engine***: "Hey, *Scope* outside of `foo`, oh you're the global *Scope*, ok cool. Ever heard of `b`? Got an RHS reference for it."

> ***Scope***: "Yep, sure have. Here ya go."

The simple rules for traversing nested *Scope*: *Engine* starts at the currently executing *Scope*, looks for the variable there, then if not found, keeps going up one level, and so on. If the outermost global scope is reached, the search stops, whether it finds the variable or not.

### Building on Metaphors

To visualize the process of nested *Scope* resolution, I want you to think of this tall building.

<img src="fig1.png" width="250">

The building represents our program's nested *Scope* rule set. The first floor of the building represents your currently executing *Scope*, wherever you are. The top level of the building is the global *Scope*.

You resolve LHS and RHS references by looking on your current floor, and if you don't find it, taking the elevator to the next floor, looking there, then the next, and so on. Once you get to the top floor (the global *Scope*), you either find what you're looking for, or you don't. But you have to stop regardless.

## Errors

Why does it matter whether we call it LHS or RHS?

Because these two types of look-ups behave differently in the circumstance where the variable has not yet been declared (is not found in any consulted *Scope*).

Consider:

```js
function foo(a) {
	console.log( a + b );
	b = a;
}

foo( 2 );
```

When the RHS look-up occurs for `b` the first time, it will not be found. This is said to be an "undeclared" variable, because it is not found in the scope.

If an RHS look-up fails to ever find a variable, anywhere in the nested *Scope*s, this results in a `ReferenceError` being thrown by the *Engine*. It's important to note that the error is of the type `ReferenceError`.

By contrast, if the *Engine* is performing an LHS look-up and arrives at the top floor (global *Scope*) without finding it, and if the program is not running in "Strict Mode" [^note-strictmode], then the global *Scope* will create a new variable of that name **in the global scope**, and hand it back to *Engine*.

*"No, there wasn't one before, but I was helpful and created one for you."*

"Strict Mode" [^note-strictmode], which was added in ES5, has a number of different behaviors from normal/relaxed/lazy mode. One such behavior is that it disallows the automatic/implicit global variable creation. In that case, there would be no global *Scope*'d variable to hand back from an LHS look-up, and *Engine* would throw a `ReferenceError` similarly to the RHS case.

Now, if a variable is found for an RHS look-up, but you try to do something with its value that is impossible, such as trying to execute-as-function a non-function value, or reference a property on a `null` or `undefined` value, then *Engine* throws a different kind of error, called a `TypeError`.

`ReferenceError` is *Scope* resolution-failure related, whereas `TypeError` implies that *Scope* resolution was successful, but that there was an illegal/impossible action attempted against the result.

## Review (TL;DR)

Scope is the set of rules that determines where and how a variable (identifier) can be looked-up. This look-up may be for the purposes of assigning to the variable, which is an LHS (left-hand-side) reference, or it may be for the purposes of retrieving its value, which is an RHS (right-hand-side) reference.

LHS references result from assignment operations. *Scope*-related assignments can occur either with the `=` operator or by passing arguments to (assign to) function parameters.

The JavaScript *Engine* first compiles code before it executes, and in so doing, it splits up statements like `var a = 2;` into two separate steps:

1. First, `var a` to declare it in that *Scope*. This is performed at the beginning, before code execution.

2. Later, `a = 2` to look up the variable (LHS reference) and assign to it if found.

Both LHS and RHS reference look-ups start at the currently executing *Scope*, and if need be (that is, they don't find what they're looking for there), they work their way up the nested *Scope*, one scope (floor) at a time, looking for the identifier, until they get to the global (top floor) and stop, and either find it, or don't.

Unfulfilled RHS references result in `ReferenceError`s being thrown. Unfulfilled LHS references result in an automatic, implicitly-created global of that name (if not in "Strict Mode" [^note-strictmode]), or a `ReferenceError` (if in "Strict Mode" [^note-strictmode]).

### Quiz Answers

```js
function foo(a) {
	var b = a;
	return a + b;
}

var c = foo( 2 );
```

1. Identify all the LHS look-ups (there are 3!).

	**`c = ..`, `a = 2` (implicit param assignment) and `b = ..`**

2. Identify all the RHS look-ups (there are 4!).

    **`foo(2..`, `= a;`, `a + ..` and `.. + b`**


[^note-strictmode]: MDN: [Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode)
