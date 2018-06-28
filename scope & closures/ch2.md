# You Don't Know JS: Scope & Closures
# Chapter 2: Lexical Scope

Trong Chương 1, chúng ta đã định nghĩa "scope" là tập hợp các quy định hướng dẫn *Engine* trong việc tìm kiếm một variable thông qua định danh của nó (identifier), hoặc tìm trong *Scope* hiện thời, hoặc trong những "Scope" ngay kế trên nó.

Trong thế giới lập trình, để mô tả hoạt động của Scope thì có 2 mô hình (model) chính:
1. Mô hình 1: **Lexical Scope**, thông dụng nhất, được sử dụng bởi hầu hết các ngôn ngữ lập trình. 
2. Mô hình 2: **Dynamic Scope**, sử dụng bởi 1 vài ngôn ngữ khác như Bash scripting, Perl, v.v.

"Dynamic Scope" sẽ được trình bày trong Appendix A. Tôi chỉ nhắc đến nó ở đây để độc giả biết thêm về 1 khái niệm bên cạnh "Lexical Scope", mô hình mà JavaScript sử dụng.

## Lex-time

Như đã nói trong Chương 1, bước đầu tiên của 1 trình biên dịch (với ngôn ngữ biên dịch truyền thống) là phân tích đoạn code thành những phần nhỏ (mỗi phần gọi là token), thuật ngữ chuyên môn gọi bước này là "lexing" (hay là "tokenizing"). Quá trình "lexing" sẽ khảo sát đoạn code, thêm ý nghĩa (về mặt lập trình) cho từng token (đây là kết quả của "stateful parsing"). Khái niệm này là nền tảng để hiểu "lexical scope" là gì, và thuật ngữ này đến từ đâu. 

Việc định nghĩa "lexical scope" khá là ngoằn ngoèo, nó là ... "scope" nhưng tồn tại trong *thời gian "lexing"*. Để đơn giản thì lexical scope được xác định vào lúc tác giả viết code, sắp xếp các variables hoặc khối code ở các vị trí nhất định. Lexical scope sẽ được giữ nguyên cho đến thời điểm "lexing" (tức là giai đoạn mà code được chia thành các phần nhỏ có ý nghĩa).

**Lưu ý:** Bạn sẽ thấy có những cách để ăn gian "lexical scope", tức là thay đổi "lexical scope" sau thời điểm "lexing". Tuy vậy những cách này không nên chút nào, tốt nhất hãy giữa "lexical scope" là chính nó. 

Quan sát đoạn code sau:

```js
function foo(a) {

	var b = a * 2;

	function bar(c) {
		console.log( a, b, c );
	}

	bar(b * 3);
}

foo( 2 ); // 2 4 12
```

Có 3 scopes lồng nhau trong đoạn code trên, giống như 3 quả bong bóng kích thước từ nhỏ - nhỡ - to lồng trong nhau. 

<img src="fig2.png" width="500">

**Bóng 1** tương ứng với global scope, bên trong global scope này chỉ 1 "đối tượng" có định danh là `foo`.

**Bóng 2** tương ứng với scope `foo`, bên trong có 3 "đối tượng" với định danh lần lượt là: `a`, `bar` and `b`.

**Bóng 3** tương ứng với scope `bar`, bên trong có 1 "đối tượng" với định danh là: `c`.

Scope của từng quả bóng được xác định thông qua vị trí của nó (tức là bóng ở bên trong cùng/ ở giữa/ hay ngoài cùng). Trong chương tiếp theo, chúng ta sẽ thảo luận về các đơn vị khác nhau của scope, còn ở chương này, cứ giả sử rằng mỗi function sẽ tạo 1 quả bóng scope mới. 

Quả bóng cho `bar` nằm gọn bên trong quả bóng cho `foo` vì và chỉ vì ta đặt hàm `bar` bên trong `foo`. 

Lưu ý là ở đây, quả bóng scope của 1 function sẽ nằm hoàn toàn trong quả bóng scope to hơn nó. Sẽ không có chuyện nó nằm "một phần" chân trong chân ngoài, hay "trùng" vào một phần của 1 quả bóng scope của 1 function khác. Những đặc tính của [giản đồ Venn](https://en.wikipedia.org/wiki/Venn_diagram) không áp dụng ở đây. 

### Tìm kiếm trong Scope

Việc các quả bóng được sắp xếp, nằm bên trong nhau như thế nào sẽ giúp cho *Engine* hiểu được nếu cần tìm 1 đối tượng có định danh nào đó thì tìm ở đâu. 

Với đoạn code ở bên trên, *Engine* thực thi câu lệnh `console.log(..)`, đi tìm các variables có nhãn định danh là `a`, `b`, and `c`. *Engine*  sẽ:
- bắt đầu với quả bóng scope trong cùng ứng với function `bar(..)`
- do không tìm thấy `a` ở bước đầu, nó nhảy lên 1 quả bóng ở cấp cao hơn, đấy là quả bóng scope của hàm `foo(..)`. *Engine* tìm thấy `a` ở đây, sử dụng `a` cho công việc nó cần. 
- với `b` thì các bước trên được lặp lại tương tự.
- với `c`, *Engine* tìm thấy nó ngay trong quả bóng scope của hàm `bar(..)`.

Giả sử mà có 2 bạn cùng định danh `c` tồn tại cả ở trong `bar(..)` lẫn bên trong `foo(..)`, thì `c` trong `bar(..)` sẽ được sử dụng (bỏ qua `c` trong `foo(...)`).

Vậy là **việc tìm kiếm trong Scope sẽ dừng ngay lập tức khi Engine tìm được thứ nó cần**. Nếu có nhiều variables cùng định danh, tồn tại cùng lúc ở nhiều quả bóng scope, thì những định danh ở vòng ngoài sẽ được gọi là "cái bóng" (từ "bóng" trong bóng râm/ bóng tối). Không cần biết có bao nhiêu "cái bóng" ở các scope lồng nhau, việc tìm kiếm trong sẽ luôn bắt đầu với "quả bóng" trong cùng tại thời điểm code được thực thi, và đi từ trong ra ngoài đến khi *Engine* lần đầu tiên gặp cái nó đi tìm. 

**Lưu ý:** "Global variables" mặc nhiên là thuộc tính (properties) của "global object" (trong trình duyệt web thì global object chính là `window`), cho nên ta có thể gọi 1 "global variable" từ 1 hàm (có scope ở dưới/trong cùng trong nhóm các scope lồng nhau) một cách gián tiếp thông qua tham chiếu đến đến "global object".

```js
window.a
```
Kỹ thuật này giúp ta điều gì? Giả sử ta cần gọi 1 global variable `a` từ 1 hàm có scope nằm tít dưới cùng của 1 nhóm các scope lồng nhau, và variable này lại có rất nhiều "cái bóng" (tức là các variables cũng đặt trùng tên `a`) ở các quả bóng khác. Nếu gọi theo cách thông thường thì *Engine* sẽ chỉ tìm `a` trong quả bóng nào gần nhất mà không với đến tận quả bóng global scope. Với cách viết `windows.a`, chắc chắn giá trị của `a` ở global scope sẽ được trả về. Kỹ thuật này không áp dụng với các variable không được khai báo trong global scope.

> Không cần biết 1 function bị gọi (invoked) *từ đâu*, hoặc thậm chí là cũng không cần biết là *bằng cách nào* function đó được gọi, lexical scope của hàm **chỉ** gắn với nơi mà hàm đó được khai báo (declared). 

The lexical scope look-up process *only* applies to first-class identifiers, such as the `a`, `b`, and `c`. If you had a reference to `foo.bar.baz` in a piece of code, the lexical scope look-up would apply to finding the `foo` identifier, but once it locates that variable, object property-access rules take over to resolve the `bar` and `baz` properties, respectively.

## Chơi "ăn gian" Lexical Scope

Nếu lexical scope chỉ gắn với nơi mà hàm được khai báo, và vị trí khai báo hàm thì hoàn toàn phụ thuộc vào người viết đoạn code đó, vậy thì có cách nào để "thay đổi" (hay "chơi ăn gian") lexical scope vào thời điểm đoạn code được thực thi? 

Để trả lời câu hỏi nãy, hãy cùng bàn về 2 cơ chế (mechanisms) của JavaScript giúp ta "ăn gian" vụ trên, tiếc là cả 2 đều bị phần đông lập trình viên chê tả tơi. Tuy vậy, hầu hết các ý kiến chê bai đó đều bị thiếu 1 điểm quan trọng nhất: **thay đổi lexical scope sẽ làm hiệu suất thực thi giảm đi.** Trước khi đi vào vấn đề hiệu suất này, tôi sẽ giải thích cách hoạt động của 2 cơ chế vừa nói: 

### Ăn gian với `eval`

Hàm `eval(..)` của JavaScript sẽ nhận vào 1 chuỗi, nó coi nội dung của chuỗi là 1 đoạn code đã được cho phép thực thi vào thời điểm chạy hàm `eval(...)`. Nói cách khác, lập trình viên có thể "nhúng" một đoạn code vào làm tham số của hàm `eval(...)`, khiến cho đoạn code đấy được thực thi cứ bình thường như bao đoạn code khác ở bên ngoài `eval(...)`.

Evaluating `eval(..)` (pun intended) in that light, it should be clear how `eval(..)` allows you to modify the lexical scope environment by cheating and pretending that author-time (aka, lexical) code was there all along.

On subsequent lines of code after an `eval(..)` has executed, the *Engine* will not "know" or "care" that the previous code in question was dynamically interpreted and thus modified the lexical scope environment. The *Engine* will simply perform its lexical scope look-ups as it always does.

Quan sát đoạn code sau:

```js
function foo(str, a) {
	eval( str ); // đang "chơi ăn gian"!
	console.log( a, b );
}

var b = 2;

foo( "var b = 3;", 1 ); // 1 3
```

Tại thời điểm gọi hàm `eval(..)` thì chuỗi `"var b = 3;"` được coi như là 1 đoạn code vốn đã ở đó từ trước. Bởi trong đoạn code này có phần khai báo variable `b` nên lexical scope của `foo(..)` bị thay đổi, variable `b` được tạo bên trong `foo(..)`, che đi variable `b` vốn được khai báo ở scope vòng tiếp theo (trường hợp này là global scope).

Khi hàm `console.log(..)` được gọi, hàm này tìm thấy cả `a` lẫn `b` bên trong scope của `foo(..)`, nó dừng ở đó mà không hề mở rộng tìm kiếm `b` ở scope vòng tiếp theo. Do đó, kết quả thu được là "1 3" thay vì "1 2".

**Lưu ý:** Trong ví dụ trên, để dễ giải thích nên chúng ta đã sử dụng một chuỗi có nội dung "tĩnh" (a fixed literal). Thường thì không ai sử dụng nội dung "tĩnh" như thế với mà sẽ để nó dạng nội dung "động".

Mặc định nếu chuỗi nhận vào của `eval(..)` chứa từ 1 khai báo variables (hoặc khai báo hàm) trở lên thì lexical scope của hàm chứa `eval(..)` sẽ thay đổi. Người ta có thể gọi (invoke) `eval(..)` theo nhiều cách, cả trực tiếp (giống như trên) lẫn gián tiếp bằng rất nhiều mẹo (mẹo gì thì không bàn ở đây). Cách gọi gián tiếp causes it to instead execute in the context of the global scope, thus modifying it. But in either case, `eval(..)` can at runtime modify an author-time lexical scope.

**Lưu ý:** Trong strict-mode, `eval(..)` không làm thay đổi lexical scope của hàm chứa nó.

```js
function foo(str) {
   "use strict";
   eval( str );
   console.log( a ); // ReferenceError: a is not defined
}

foo( "var a = 2" );
```
Có một vài hàm khác trong JavaScript có tính năng tương tự `eval(..)`, ví dụ như `setTimeout(..)` và `setInterval(..)`. Hai hàm này *có thể* nhận 1 chuỗi làm tham số đầu vào, nội dung của chuỗi này cũng được coi như 1 đoạn code độc lập để chạy. Cách làm này đã cũ và bị tẩy chay. Đừng làm như vậy!

The `new Function(..)` function constructor similarly takes a string of code in its **last** argument to turn into a dynamically-generated function (the first argument(s), if any, are the named parameters for the new function). This function-constructor syntax is slightly safer than `eval(..)`, but it should still be avoided in your code.

The use-cases for dynamically generating code inside your program are incredibly rare, as the performance degradations are almost never worth the capability.

### Ăn gian với `with`

The other frowned-upon (and now deprecated!) feature in JavaScript which cheats lexical scope is the `with` keyword. There are multiple valid ways that `with` can be explained, but I will choose here to explain it from the perspective of how it interacts with and affects lexical scope.

`with` is typically explained as a short-hand for making multiple property references against an object *without* repeating the object reference itself each time.

For example:

```js
var obj = {
	a: 1,
	b: 2,
	c: 3
};

// more "tedious" to repeat "obj"
obj.a = 2;
obj.b = 3;
obj.c = 4;

// "easier" short-hand
with (obj) {
	a = 3;
	b = 4;
	c = 5;
}
```

However, there's much more going on here than just a convenient short-hand for object property access. Consider:

```js
function foo(obj) {
	with (obj) {
		a = 2;
	}
}

var o1 = {
	a: 3
};

var o2 = {
	b: 3
};

foo( o1 );
console.log( o1.a ); // 2

foo( o2 );
console.log( o2.a ); // undefined
console.log( a ); // 2 -- Oops, leaked global!
```

In this code example, two objects `o1` and `o2` are created. One has an `a` property, and the other does not. The `foo(..)` function takes an object reference `obj` as an argument, and calls `with (obj) { .. }` on the reference. Inside the `with` block, we make what appears to be a normal lexical reference to a variable `a`, an LHS reference in fact (see Chapter 1), to assign to it the value of `2`.

When we pass in `o1`, the `a = 2` assignment finds the property `o1.a` and assigns it the value `2`, as reflected in the subsequent `console.log(o1.a)` statement. However, when we pass in `o2`, since it does not have an `a` property, no such property is created, and `o2.a` remains `undefined`.

But then we note a peculiar side-effect, the fact that a global variable `a` was created by the `a = 2` assignment. How can this be?

The `with` statement takes an object, one which has zero or more properties, and **treats that object as if *it* is a wholly separate lexical scope**, and thus the object's properties are treated as lexically defined identifiers in that "scope".

**Note:** Even though a `with` block treats an object like a lexical scope, a normal `var` declaration inside that `with` block will not be scoped to that `with` block, but instead the containing function scope.

While the `eval(..)` function can modify existing lexical scope if it takes a string of code with one or more declarations in it, the `with` statement actually creates a **whole new lexical scope** out of thin air, from the object you pass to it.

Understood in this way, the "scope" declared by the `with` statement when we passed in `o1` was `o1`, and that "scope" had an "identifier" in it which corresponds to the `o1.a` property. But when we used `o2` as the "scope", it had no such `a` "identifier" in it, and so the normal rules of LHS identifier look-up (see Chapter 1) occurred.

Neither the "scope" of `o2`, nor the scope of `foo(..)`, nor the global scope even, has an `a` identifier to be found, so when `a = 2` is executed, it results in the automatic-global being created (since we're in non-strict mode).

It is a strange sort of mind-bending thought to see `with` turning, at runtime, an object and its properties into a "scope" *with* "identifiers". But that is the clearest explanation I can give for the results we see.

**Note:** In addition to being a bad idea to use, both `eval(..)` and `with` are affected (restricted) by Strict Mode. `with` is outright disallowed, whereas various forms of indirect or unsafe `eval(..)` are disallowed while retaining the core functionality.

### Hiệu năng thực thi

Cả `eval(..)` và `with` đều ăn gian với lexical scope định ra bởi người viết code thông qua việc thay đổi lexical scope đấy, hoặc thậm chí tạo 1 lexical scope mới tại thời điểm thực thi.

Nhưng thế thì đã sao nào? Nếu việc này cho chúng ta thêm những tính năng tinh tế và tăng tính linh động trong lập trình thì tại sao không coi đây là "điểm *tốt*"? Câu trả lời ở đây là nó **không** tốt chút nào.

*Engine* của JavaScript có một vài thao tác để tối ưu hiệu năng trong quá trình biên dịch. Các thao tác này có đạt được kết quả tốt nhất hay không cơ bản phụ thuộc vào việc đoạn code lôi ra phân tích (trong quá trình lexing) có "tĩnh" hay không. Các khai báo variables cùng functions sẽ được duyệt trước, đảm bảo công sức tìm kiếm các tên variables/ functiosn được giảm thiểu trong khi thực thi. Với `eval(...)` và `with`, *Engine* khi thấy 2 hàm này trong đoạn code, nó phải *tạm cho là* những variables/ functiosn vừa tìm được đều không còn đúng nữa. Tại sao? Bởi vì nó không thể biết tại thời điểm "lexing":
- cái gì sẽ được truyền cho `eval(..)` có thể dẫn đến thay đổi của của lexical scope? 
- hoặc liệu nội dung của object bạn truyền cho `with` sẽ tạo 1 lexical scope mới ảnh hưởng đến lexical scope hiện tại?  

Nói một cách tiêu cực thì mọi nỗ lực tối ưu *gần như* sẽ trở thành công cốc nếu có `eval(..)` hoặc `with` trong chương trình, và "điểm *tốt*" mà ta tưởng tượng ở trên lại không đep lại lợi ích gì.

Khả năng là 99% chương trình sẽ chạy chậm đi bởi `eval(..)` hoặc `with` được đặt vào những vị trí không đoán trước được trong code. Bất kể *Engine* có thông minh thế nào trong việc hạn chế các tác dụng phụ của 2 hàm này, **một sự thật không thể chối bỏ đó là không có tối ưu, chương trình sẽ chạy chậm đi.**

## Tổng kết (TL;DR - Quá dài, ứ đọc)

Lexical scope là scope được xác lập ngay từ lúc lập trình viên viết code và khai báo hàm (chưa cho chương trình thực thi). Giai đoạn "lexing" (phân tích đoạn code thành nhiều phần nhỏ có nghĩa - tokens) trong quá trình biên dịch sẽ cho *Engine* biết các variables và functions được khai báo ở đâu và chỗ nào. *Engine* sẽ dự đoán việc tìm những đối tượng này ở đâu khi thực thi chương trình.

Có 2 cách để "ăn gian" lexical scope trong Javascript: sử dụng `eval(...)` và `with`. 
- `eva(...)` lúc thực thi chương trình sẽ khiến lexical scope hiện tại thay đổi. Việc thay đổi này là do nội dung của chuỗi "code" truyền cho `eval(...)` có hay không có khai báo hàm/ khai báo variables trong đó. 
- `with` lúc thực thi sẽ tạo 1 lexical scope hoàn toàn mới bởi nó coi mỗi tham chiếu đến object là 1 scope, thuộc tính của object được coi là một variable/ function trong scope. 

Điểm trừ của hai cơ chế này là nó làm *Engine* mất khả năng tối ưu hoá việc tìm kiếm scope trong thời điểm biên dịch, bởi *Engine* phải giả sử rằng việc tối ưu của nó là vô ích. Hậu quả là chương trình *sẽ* chạy chậm đi. **Tốt nhất là đừng dùng `eval(...)` hoặc `with`.**
