# You Don't Know JS: Scope & Closures
# Chapter 1: Scope là gì?

Một trong những nền tảng quan trọng nhất của mọi ngôn ngữ lập trình là khả năng lưu values (giá trị) vào trong các variables (biến), và sau đó sao chép lại hoặc thay đổi những giá trị đó. Thực tế thì khả năng đấy đã trang bị cho mỗi chương trình (program) một thứ gọi là "trạng thái" (*state*).

Không có những khái niệm trên, dẫu cho chương trình có thể thực thi một vài "tasks" (nhiệm vụ), nó vẫn bị giới hạn vô cùng, chẳng thể làm được gì thú vị. 

Tuy thế, khi đã thêm variables vào việc viết chương trình, một loạt vấn đề mới lại nảy sinh. Tưởng tượng thêm variables giống như tạo những sinh vật mới, vậy ta sẽ lưu những sinh vật này ở đâu? khi cần thì tìm chúng như thế nào? 

Những câu hỏi này liên quan đến nhu cầu tạo ra 1 tập hợp các quy định được định nghĩa rõ ràng về cách lưu các variables ở một nơi nào đó, và cách để tìm các variables này ở một thời điểm sau đó. Tập hợp các quy định này là gì? Đó là **Scope**. 

Vậy, từ đâu và làm thế nào để có thể thiết lập các quy luật cho **Scope**? 

## Lý thuyết về Compiler

Tuỳ thuộc vào kinh nghiệm làm việc với ít/ nhiều ngôn ngữ lập trình mà bạn sẽ thấy khẳng định sau là đương nhiên/ hoặc ngạc nhiên (:D): "Cho dù JavaScript được sắp vào nhóm ngôn ngữ lập trình loại *động*, hoặc *thông dịch*, thì thực tế nó vẫn là 1 ngôn ngữ *biên dịch*". Không giống như các ngôn ngữ lập trình biên dịch truyền thống khác, các đoạn code JavaScript *không* được biên dịch trước, và cũng chẳng là kết quả của compilation portable among nhiều hệ thống phân tán.

Dẫu vậy, engine của JavaScirpt thực hiện rất nhiều bước tương tự như các ngôn ngữ biên dịch truyền thống, theo cách phức tạp hơn những gì chúng ta nghĩ. 

Khi nhìn vào quá trình của các ngôn ngữ biên dịch truyền thống, mỗi đoạn mã chương trình sẽ đi qua ba bước điển hình sau *trước* khi nó được thực thi, ta gọi nôm na quá trình này là "sự compilation (biên dịch)":

1. **Tokenizing/Lexing (Quá trình phân tích thành các phần tử token):** là quá trình chia 1 đoạn code ra thành những phần có nghĩa, mỗi phần được gọi là 1 "token". Ví dụ đoạn code sau: `var a = 2;`. Đoạn mã này khả năng sẽ được chia thành các token: `var`, `a`, `=`, `2`, và `;`. Khoảng trắng có thể (hoặc không) được coi là 1 token, phụ thuộc vào việc nó có mang ý nghĩa gì hay không.

	**Note:** Không dễ để chỉ ra sự khác biệt giữa "tokenizing" và "lexing", hơn nữa lại vô cùng hàn lâm, nhưng nói chung là việc xác định là hay không phải là tokens sẽ thông qua 1 trong 2 cách: *stateless* hoặc *stateful*. Put simply, if the tokenizer were to invoke stateful parsing rules to figure out whether `a` should be considered a distinct token or just part of another token, *that* would be **lexing**.

2. **Parsing (Quá trình phân tích cú pháp):** sử dụng 1 luồng (stream)/ chuỗi (array) các tokens, biết chúng thành 1 cây với các phần tử lồng vào nhau (tree of nested elements), cùng nhau biểu diễn cấu trúc ngữ pháp của chương trình (collectively represent the grammatical structure of the program). Cây này được gọi là "AST" (<b>A</b>bstract <b>S</b>yntax <b>T</b>ree) (Dịch thô: "Cây Cú pháp Trừu tượng") .

	Cây của đoạn code `var a = 2;` có thể được bắt đầu với điểm nút cấp cao nhất (top-level node) tên là `VariableDeclaration`, nút con (child node) tên là  `Identifier` (giá trị của nó bằng `a`), và 1 nút con khác tên là `AssignmentExpression` (bản thân nó có 1 nút con tên là `NumericLiteral` (giá trị của nút con `NumericLiteral` này là `2`)).

3. **Code-Generation (Quá trình tạo code):** đây là quá trình sử dụng 1 AST và biến thành 1 đoạn code thực thi được (executable code). Phần này sẽ có khác biệt lớn giữa các ngôn ngữ lập trình, cũng như nền tảng thực hiện.

	Thế đó, thay vì bị tắc trong mớ lý thuyết chi tiết, chúng ta sẽ chỉ phẩy tay và nói rằng có một quá trình để phân tích đoạn code `var a=2` thành cây cú pháp trừu tượng AST; sau đó biến nó thành 1 tập hợp các đoạn mã máy tính - *tạo* một variable tên là `a` (bao gồm cả reversing memory, v.v.), rồi lưu giá trị (value) nào đó vào `a`.


    **Lưu ý:** Cách engine sử lý tài nguyên hệ thống (system resources) phức tạp hơn rất nhiều những gì chúng ta nói ở trên, vì thế ta cứ coi chuyện engine có khả năng tạo và lưu variables khi cần là điều hiển nhiên.

Engine của JavaScript cũng như các ngôn ngữ biên dịch khác phức tạp hơn nhiều so với ba bước kể trên. Ví dụ, đối với bước "parsing" và "code-generation", chắc chắn sẽ có bước để tối ưu hoá hiệu suất thực thi (to optimize the performance of the execution), trong bước tối ưu hoá này lại có việc xoá bỏ các phần tử dư thừa (collapsing redundant elements, v.v.

Cho nên, ở đây tôi chỉ vẽ lên nguyên lý của compiler bằng những nét đậm phác thảo. Nhưng tôi nghĩ bạn sẽ sớm hiểu tại sao những thông tin mà chúng ta đã lướt quá, kể cả ở mức độ khó, vẫn hữu dụng. 

Hãy nhớ rằng, engine Javascript không có nhiều thời gian (bằng các ngôn ngữ biên dịch khác) để tối ưu hoá, bởi sự biên dịch ngôn ngữ JavaScript (JavaScript compilation) không diễn ra trước cả 1 khoảng thời gian như những ngôn ngữ khác. 

Với Javascript thì quá trình biên dịch trong nhiều trường hợp xảy ra trước khi đoạn code được thực thi chỉ khoảng vài phần triệu của giây. Để đảm bảo hiệu suất nhanh nhất, các engines JavaScript sử dụng tất cả các loại mánh lới (tricks) như JITS (lazy compile, hot re-compile, v.v.) nhưng chúng lại nằm quá khuôn khổ của cuốn sách này. 

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
