# You Don't Know JS: Scope & Closures
# Chapter 1: Scope là gì?

Một trong những nền tảng quan trọng nhất của mọi ngôn ngữ lập trình là khả năng lưu values (giá trị) vào trong các variables (biến), và sau đó sao chép lại hoặc thay đổi những giá trị đó. Thực tế thì khả năng đấy đã trang bị cho mỗi chương trình (program) một thứ gọi là "trạng thái" (*state*).

Không có những khái niệm trên, dẫu cho chương trình có thể thực thi một vài "tasks" (nhiệm vụ), nó vẫn bị giới hạn vô cùng, chẳng thể làm được gì thú vị. 

Tuy thế, khi đã thêm variables vào việc viết chương trình, một loạt vấn đề mới lại nảy sinh. Tưởng tượng thêm variables giống như tạo những sinh vật mới, vậy ta sẽ lưu những sinh vật này ở đâu? khi cần thì tìm chúng như thế nào? 

Những câu hỏi này dẫn đến nhu cầu tạo ra 1 tập hợp các quy định rõ ràng về:
- cách lưu các variables ở một nơi nào đó, và 
- cách để tìm các variables này ở một thời điểm sau đó. 
Tập hợp các quy định này là gì? Đó là **Scope**. 

Vậy, từ đâu và làm thế nào để có thể thiết lập các quy luật cho **Scope**? 

## Lý thuyết về Compiler

Tuỳ thuộc vào kinh nghiệm làm việc với ít/ nhiều ngôn ngữ lập trình mà bạn sẽ thấy khẳng định sau là đương nhiên/ hoặc ngạc nhiên (:D): "*Cho dù JavaScript được sắp vào nhóm ngôn ngữ lập trình loại *động*, hoặc *thông dịch*, thì thực tế nó vẫn là 1 ngôn ngữ *biên dịch**". Không giống như các ngôn ngữ lập trình biên dịch truyền thống khác, các đoạn code JavaScript *không* được biên dịch trước, và cũng chẳng là kết quả của compilation portable among nhiều hệ thống phân tán.

Dẫu vậy, engine của JavaScirpt thực hiện rất nhiều bước tương tự như các ngôn ngữ biên dịch truyền thống, nhưng theo cách phức tạp hơn những gì chúng ta nghĩ. 

Khi nhìn vào quá trình của các ngôn ngữ biên dịch truyền thống, mỗi đoạn mã chương trình sẽ đi qua ba bước điển hình sau *trước* khi nó được thực thi, ta gọi nôm na quá trình này là "sự compilation (biên dịch)":

1. **Tokenizing/Lexing (Quá trình phân tích đoạn code thành các phần tử token):** là quá trình chia 1 đoạn code ra thành những phần có nghĩa, mỗi phần được gọi là 1 "token". Ví dụ đoạn code sau: `var a = 2;`. Đoạn mã này khả năng sẽ được chia thành các token: `var`, `a`, `=`, `2`, và `;`. Khoảng trắng có thể (hoặc không) được coi là 1 token, phụ thuộc vào việc nó có mang ý nghĩa gì hay không.

	**Note:** Không dễ để chỉ ra sự khác biệt giữa "tokenizing" và "lexing", mà có nói thì đấy cũng là vấn đề học thuật cao cấp vượt qua khuôn khổ bài viết này. Nhưng nói chung, việc xác định mỗi phần nhỏ của đoạn code là token hay không sẽ thông qua 1 trong 2 cách: *stateless* hoặc *stateful*. Put simply, if the tokenizer were to invoke stateful parsing rules to figure out whether `a` should be considered a distinct token or just part of another token, *that* would be **lexing**.

2. **Parsing (Quá trình phân tích cú pháp):** sử dụng 1 luồng (stream)/ chuỗi (array) các tokens, biến chúng thành 1 cây với các phần tử lồng vào nhau (tree of nested elements), cùng nhau biểu diễn cấu trúc ngữ pháp của chương trình (collectively represent the grammatical structure of the program). Cây này được gọi là "AST" (<b>A</b>bstract <b>S</b>yntax <b>T</b>ree) (Dịch thô: "Cây Cú pháp Trừu tượng") .

	Cây của đoạn code `var a = 2;` có thể được bắt đầu với điểm nốt cấp cao nhất (top-level node) tên là `VariableDeclaration`, nốt con (child node) tên là  `Identifier` (giá trị của nó bằng `a`), và 1 nốt con khác tên là `AssignmentExpression` (bản thân `AssignmentExpression` có 1 nốt con tên là `NumericLiteral` (giá trị của nút con `NumericLiteral` này là `2`)).

3. **Code-Generation (Quá trình tạo code):** đây là quá trình sử dụng 1 AST và biến thành 1 đoạn code thực thi được (executable code). Phần này sẽ có khác biệt lớn giữa các ngôn ngữ lập trình, cũng như nền tảng thực hiện.

	Thế đó, thay vì bị tắc trong mớ lý thuyết chi tiết, chúng ta sẽ chỉ hiểu ngắn gọn rằng có một quá trình để phân tích đoạn code `var a=2` thành cây cú pháp trừu tượng AST; sau đó biến nó thành 1 tập hợp các đoạn mã máy tính - *tạo* một variable tên là `a` (bao gồm cả reversing memory, v.v.), rồi lưu giá trị (value) nào đó vào `a`.


    **Lưu ý:** Cách engine sử lý tài nguyên hệ thống (system resources) phức tạp hơn rất nhiều những gì chúng ta nói ở trên, vì thế ta cứ coi chuyện engine có khả năng tạo và lưu variables khi cần là điều hiển nhiên.

Engine của JavaScript cũng như các ngôn ngữ biên dịch khác phức tạp hơn nhiều so với ba bước kể trên. Ví dụ, đối với bước "parsing" và "code-generation", chắc chắn sẽ có bước để tối ưu hoá hiệu suất thực thi (to optimize the performance of the execution), trong bước tối ưu hoá này lại có việc xoá bỏ các phần tử dư thừa (collapsing redundant elements), v.v.

Cho nên, ở đây tôi chỉ vẽ lên nguyên lý của compiler bằng những nét đậm phác thảo. Nhưng tôi nghĩ bạn sẽ sớm hiểu tại sao những thông tin mà chúng ta đã lướt quá, kể cả ở mức độ khó, vẫn hữu dụng. 

Hãy nhớ rằng, engine Javascript không có nhiều thời gian (bằng các ngôn ngữ biên dịch khác) để tối ưu hoá, bởi sự biên dịch ngôn ngữ JavaScript (JavaScript compilation) không diễn ra trước cả 1 khoảng thời gian như những ngôn ngữ khác. 

Với Javascript thì quá trình biên dịch trong nhiều trường hợp xảy ra trước khi đoạn code được thực thi chỉ khoảng vài phần triệu của giây. Để đảm bảo hiệu suất nhanh nhất, các engines JavaScript sử dụng tất cả các loại mánh lới (tricks) như JITS (lazy compile, hot re-compile, v.v.) nhưng đề tài này lại nằm quá khuôn khổ của cuốn sách này. Túm lại là bất kỳ đoạn code JavaScript nào đều phải được biên dịch *ngay* (chú ý là *ngay*) trước khi nó được thực thi. 

## Hiểu về Scope

Chúng ta sẽ cùng tìm hiểu về "scope" dưới dạng một cuộc đối thoại giữa vài "nhân vật" sau đây. 

### Dàn diễn viên của chúng ta

Xin mời gặp dàn diễn viên sẽ nhập vai và thể hiện quá trình xử lý đoạn code `var a = 2;`. 

1. Diễn viên vào vai *Engine*: chịu trách nhiệm từ đầu-đến-cuối của việc biên dịch và thực thi các chương trình JavaScript.

2. Diễn viên vào vai *Compiler*: là một người bạn của *Engine*; xử lý mọi công việc chẳng lấy làm dễ chịu gì liên quan đến "parsing" và "code-generation" (xem lại mục trước).

3. Diễn viên vào vai *Scope*: một người bạn khác *Engine*; tập hợp và bảo quản một danh sách tra cứu tất cả các identifiers (định danh) đã được khai báo (tức là variables), đảm bảo các quy định được thực hiện nghiêm ngặt, cũng như cho phép các đoạn code đang thực thi truy cập vào variables. 

Để có thể *nắm được hoàn toàn* cách JavaScript làm việc, bạn cần bắt đầu *nghĩ* như *Engine* (và 2 người bạn) nghĩ, hỏi tương tự thứ họ hỏi, trả lời theo cách họ trả lời. 

### Back & Forth

Khi nhìn đoạn code `var a = 2;` thường là bạn sẽ cho rằng đây là là 1 câu lệnh (statement). Thực tế là *Engine* sẽ thấy 2 câu lệnh khác nhau (two distinct statements), một dành cho *Compiler* - người sẽ xử lý trong quá trình biên dịch, và một dành cho *Engine* xử lý trong quá trình thực thi.

Vậy hãy thử cùng tìm hiểu từng bước cách mà *Engine* và đồng bọn sẽ làm khi gặp đoạn code `var a = 2;`.

Điều đầu tiên mà đồng chí *Compiler* sẽ làm với đoạn mã trên là thực hiện nhiệm vụ "lexing" để chia nhỏ mã thành các "token", sau đó "parse" vào cây Cú pháp Trừu tượng AST. Nhưng khi *Compiler* đến bước code-generation, nó sẽ xử lý khác so với những gì chúng ta đoán. 

Chúng ta đoán như thế nào? Rằng *Compiler* sẽ chỉ định bộ nhớ cho variable, dán nhãn nó là `a`, rồi gắn giá trị `2` vào variable `a` kia. Tuy nhiên, cách hiểu này lại không thực sự chính xác. 

Sự thực thì *Compiler* sẽ làm như sau: 

1. Thấy `var a`, *Compiler* hỏi xem cậu bạn *Scope* của mình đã từng thấy variable `a` tồn tại ở đâu hay chưa. Nếu câu trả lời là "CÓ", thì *Compiler* bỏ qua dòng `var a` kia và chạy dòng tiếp theo. Còn nếu là "KHÔNG", thì *Compiler* yêu cầu bạn *Scope* khai báo 1 variable mới với nhãn `a` trong bộ sưu tập của bạn *Scope* đó.

2. Bạn *Compiler* tiếp theo sẽ viết ra một đoạn mã máy tính (machine code) để *Engine* thực hiện một lúc sau đó, nhằm xử lý việc gán `a = 2`. Mã máy mà *Engine* chạy sẽ hỏi *Scope* xem nếu bạn ý có thể tiếp cận variable nhãn `a` trong bộ sưu tập của bạn *Scope* hay không. Nếu có thể tiếp cận, *Engine* sẽ sử dụng variable này. Còn không, *Engine* sẽ đi tìm *chỗ khác* (xem mục "nested *Scope*" bên dưới).

Nếu *Engine* thực sự tìm thấy 1 variable mang nhãn `a` mà nó đang đi tìm (trong *Scope* hoặc *chỗ khác* như nói ở trên, thì Enginer sẽ gán giá trị `2` cho nó. Còn không tìm thấy, thì *Engine* sẽ "giơ tay" báo lỗi. 

**Túm lại**: để gán giá trị cho biến (variable assignment) thì phải thực hiện 2 hành động riêng rẽ: Đầu tiên, *Compiler* khai báo variable đấy (nếu nó chưa tồn tại ở không gian hiện tại), và thứ hai, đó là việc *Engine* tìm variable nhãn `a` và gán giá trị mới cho nó (nếu variable nhãn `a` được tìm thấy). 

### Compiler lên tiếng

Để hiểu đoạn này, ta cần đề cập đến 1 vài thuật ngữ liên quan đến complier. 

Khi *Engine* thực thi đoạn máy tính mà *Compiler* tạo ra ở bước (2), nó (tức *Engine*) phải "hỏi" *Scope* để kiểm tra variable mang nhãn `a` đã có hay chưa. Động tác "hỏi" này của *Engine* cũng chia ra làm hai loại, tạm gọi là "hỏi bên trái" và "hỏi bên phải", mỗi loại có công dụng và hiệu năng khác nhau [*Người dịch: trong cuộc sống khi cần hỏi người khác điều gì, thì cách hỏi rất quan trọng. Hỏi khéo thì nhận được câu trả lời, hỏi không khéo thì có thể vẫn nhận được câu trả lời nhưng kèm theo 1 câu chửi, và trong thế giới 0101 của máy tính cũng tương tự như vậy*]. 

Từ "hỏi" nguyên gốc có thể dịch sang tiếng Việt là "tìm kiếm". Với trường hợp cụ thể trên, *Engine* sẽ thực hiện "tìm bên trái" (viết tắt tiếng Anh là "LHS - **L**eft **H**and **S**ide") với *Scope* để kiểm tra sự tồn tại của variable nhãn `a`. Sẽ có trường hợp mà *Engine* cần phải "tìm bên phải" (viết tắt tiếng Anh là "RHS - **R**ight **H**and **S**ide").

Câu hỏi đặt ra là "bên phải/ bên trái" so với cái gì? Trả lời: **so với phép gán "="**

Điều này có nghĩa là thủ tục "tìm bên trái" được coi là hoàn thành khi mà variable được đặt phía bên trái của phép gán "=", và thủ tục "tìm bên phải" hoàn thành khi variable ở bên phải của "=". 

Để cho dễ hiểu, và để chính xác hơn, hãy nghĩ như sau:
- Phép "tìm bên phải" (RHS) sẽ đi tìm giá trị của 1 variable nào đó.
- Phép "tìm bên trái" (LHS) sẽ đi tìm nơi chứa variable để sau đó Engine sẽ lưu giá trị vào đấy. 
- Cái tên "tìm bên phải" (RHS) thực ra là không đúng về mặt nghĩa đen, đơn giản nó là phép "tìm bên không phải bên trái". "Tìm bên phải" RHS thực chất là đi tìm và lấy "giá trị của variable". 

Hãy đối chiếu những lý thuyết trên vào đoạn code bên dưới:

```js
console.log(a);
```

Tham chiếu đến `a` là 1 tham chiếu dạng "tìm bên phải" bởi không có gì được gán vào giá trị của `a` ở đây. Chúng ta đang cần "đim tìm và lấy giá trị của `a`", rồi truyền giá trị đó cho `console.log(...)`.

Ví dụ sau thì là ngược lại: 
```js
a = 2;
```
Tham chiếu đến `a` ở trên lại là 1 tham chiếu dạng "tìm bên trái", bởi chúng ta không quan tâm đến giá trị hiện tại của `a` bằng bao nhiêu, ta đơn giản chỉ muốn tìm nơi chứa variable `a` rồi gán cho nó giá trị bằng 2 (ứng với `=2`).

Đoạn code dưới đây có cả RHS và LHS:

```js
function foo(a) {
	console.log(a); // 2
}

foo(2);
```
Dòng cuối cùng đã gọi `foo(..)` ở dạng 1 tham chiếu RHS đến `foo` ("hey, hãy tìm xem giá trị của `foo` bằng bao nhiêu rồi đưa cho tớ!"). Hơn nữa, `(..)` có nghĩa là giá trị của `foo` cần được thực thi, do vậy nó là một hàm số!

Bạn có nhận ra một phép gán dù rất thoảng qua nhưng lại vô cùng quan trọng ở đây? Đó là phép gán `a = 2` khi `2` được truyền dưới dạng tham số đến đến hàm `foo(..)`, sau đó `2` được gán vào `a`. Phép gán này chính là 1 dạng của việc "tìm bên trái (LHS)" (đi tìm nơi chứa variable để lưu giá trị vào đấy).

There's also an RHS reference for the value of `a`, and that resulting value is passed to `console.log(..)`. `console.log(..)` needs a reference to execute. It's an RHS look-up for the `console` object, then a property-resolution occurs to see if it has a method called `log`.

Finally, we can conceptualize that there's an LHS/RHS exchange of passing the value `2` (by way of variable `a`'s RHS look-up) into `log(..)`. Inside of the native implementation of `log(..)`, we can assume it has parameters, the first of which (perhaps called `arg1`) has an LHS reference look-up, before assigning `2` to it.

**Note:** You might be tempted to conceptualize the function declaration `function foo(a) {...` as a normal variable declaration and assignment, such as `var foo` and `foo = function(a){...`. In so doing, it would be tempting to think of this function declaration as involving an LHS look-up.

However, the subtle but important difference is that *Compiler* handles both the declaration and the value definition during code-generation, such that when *Engine* is executing code, there's no processing necessary to "assign" a function value to `foo`. Thus, it's not really appropriate to think of a function declaration as an LHS look-up assignment in the way we're discussing them here.

### Cuộc nói chuyện giữa 2 bạn Engine và Scope

```js
function foo(a) {
	console.log(a); // 2
}

foo(2);
```

Nếu Engine và Scope là 2 con người thực ngoài đời, thì dưới đây sẽ là đoạn chat giữa 2 bạn khi nhìn thấy đoạn code trên: 

> ***Engine***: Chào *Scope*, tớ có một tham chiếu "tìm bên phải - RHS" cho 1 hàm tên `foo`. Cậu đã nghe thấy hàm này bao giờ chưa?

> ***Scope***: Có, tớ biết hàm đấy. Tên *Compiler* đã khai báo mấy giây trước. Hàm cậu cần tìm đây [Scope đưa Engine thông tin về hàm mà Engine đang kiếm].

> ***Engine***: Yup, tuyệt vời. Cảm ơn nhé. Tớ sẽ cho thực thi hàm `foo`.

> ***Engine***: À, *Scope*, tớ có một tham chiếu "tìm bên trái LHS" cho 1 variable tên `a`, cậu biết variable này không?

> ***Scope***: Biết chứ. Tên *Compiler* đã khai báo `a` là một tham số cho `foo`. Thông tin cậu cần tìm đây!!!!

> ***Engine***: Cậu đúng là biết tuốt, *Scope* ạ. Cảm ơn lần nữa. Giờ là lúc gán `2` cho `a`.

> ***Engine***: Ôi quên quên, *Scope*, xin lỗi vẫn cần phiền cậu. Tớ cần một phép "tìm bên phải - RHS" cho hàm `console`. Cậu giúp được không? 

> ***Scope***: Có hề gì, *Engine*, tớ nhẵn mặt cái hàm `console` này rồi. Hàm này vốn có sẵn mà. Của cậu đây.

> ***Engine***: Trên cả tuyệt vời. Tớ sẽ tìm tiếp `log(..)`. Chuẩn man, đây đúng là 1 hàm. 

> ***Engine***: Ơ, *Scope*. Còn một phép tham chiếu "tìm bên phải - RHS" tới `a` nữa, tớ muốn kiểm tra lại xem mình nhớ đúng hay không. 

> ***Scope***: Cậu nhớ đúng rồi, *Engine*. Vẫn là `a` đấy không thay đổi gì cả. 

> ***Engine***: Tốt. Giờ tớ sẽ truyền giá trị của `a`, tức là `2`, cho `log(..)`.

> ...

### Đố vui

Hãy kiểm tra xem bạn hiểu đến đâu thông qua các câu hỏi dưới đây! Nhớ tưởng tượng bạn đang là *Engine* nói chuyện với bạn *Scope*:

```js
function foo(a) {
	var b = a;
	return a + b;
}

var c = foo( 2 );
```

1. Tìm tất cả phép "tìm bên trái" (gợi ý: 3).

2. Tìm tất cả phép "tìm bên phải" (gợi ý: 4).

**Ghi chú:** Xem trả lời ở phần tổng kết chương!

## Nested Scope

Chúng ta đã nói rằng *Scope* là một tập hợp các quy định về việc tìm kiếm variables thông qua tên định danh (identifier name). Tuy thế, thông thường là ta sẽ luôn cần xem xét nhiều hơn 1  *Scope*. Chỉ cần 1 khối mã (block), hoặc 1 hàm được đặt bên trong 1 khối mã hoặc 1 hàm khác thì đã làm nảy sinh Scope bên trong những Scope khác. Nếu *Engine* không thể tìm thấy variable nào đó trong Scope hiện tại, nó sẽ kiểm tra để tiếp tục tìm trong Scope ở vòng ngoài, vòng ngoài nữa, cho đến khi Scope ngoài cùng (tức là global) được rờ đến. 

Xem đoạn sau:

```js
function foo(a) {
	console.log( a + b );
}

var b = 2;

foo( 2 ); // 4
```

Ở bên trong hàm `foo`, việc "tìm bên phải" của `b` (tức là tìm giá trị của `b`) không đem lại kết quả, và Engine cần mở rộng phạm vi tìm kiếm ra thêm 1 cấp *Scope* nữa (trong trường hợp này chính là global). Phía sau "hậu trường", 2 diễn viên *Engine* và *Scope* sẽ nói với nhau là:

> ***Engine***: "Xin chào, *Scope* của `foo`, cậu nghe về `b` bao giờ chưa? Tớ cần tìm giá trị của `b`, đang có 1 tham chiếu "tìm bên phải" cho nó."

> ***Scope***: "Chưa nghe thấy bao giờ. Cậu tìm tiếp đi!"

> ***Engine***: "Êu, *Scope* ngoài `foo`, cậu là *Scope* "global" hả? ok tốt. Tớ đang tìm giá trị cho 1 thông số ký hiệu là `b`? Tớ đang có 1 tham chiếu "tìm bên phải" cho nó."

> ***Scope***: "Có, tớ có thể giúp. Giá trị của `b` cậu đang tìm đây."

Có 1 nguyên tắc đơn giản về việc "du lịch" qua những vùng *Scope* được lồng vào nhau: *Engine* luôn bắt đầu từ *Scope* hiện tại (đang được thực thi), tìm kiếm variables ở đây trước khi mở rộng phạm vi thêm 1 cấp, 1 cấp tiếp theo cho đến khi dừng ở cấp global.

### Phép ẩn dụ về các Scope lồng nhau

Tưởng tượng các Scope lồng nhau như 1 toà cao ốc minh hoạ ở hình dưới đây: 

<img src="fig1.png" width="250">

Tầng 1 chính là *Scope* hiện tại, tầng trên cùng là *Scope* global. Để thực hiện các nhiệm vụ "tìm trái, tìm phải" (LHS/ RHS) bạn luôn bắt đầu từ tầng 1, nếu không thấy thì đi thang máy lên đến tầng tiếp theo, tiếp theo nữa, cho đến khi chạm tầng trên cùng. Nếu không tìm thấy thứ bạn cần thì bắt buộc phải dừng lại (vì còn chỗ nào mà tìm nữa đâu).

## Errors - Các lỗi thường gặp

Đến đoạn này chắc bạn thắc mắc tại sao chúng ta cần biết và phân biệt giữa phép "tìm bên trái" với "tìm bên phải"? Bởi vì hai phép tìm kiếm này diễn ra khác nhau trong trường hợp variable chưa được khai báo ở bất kỳ chỗ nào (tức là trong bất kỳ tầng nào của "cao ốc" *Scope*).

Xem đoạn code sau:

```js
function foo(a) {
	console.log( a + b );
	b = a;
}

foo( 2 );
```
Khi lần đầu tiên *Engine* thực hiện phép "tìm bên phải - RHS"  để tra cứu giá trị của `b`, nó sẽ chẳng tìm thấy gì cả vì variable này chưa được khai báo, không tồn tại trong scope hiện tại. 

Nếu phép tìm bên phải RHS không tìm thấy varible trong bất kỳ tầng nào của cao ốc Scope (tức là trong hệ các Scope lồng nhau) thì *Engine* sẽ trả về lỗi `ReferenceError`.

Ngược lại, nếu *Engine* "tìm bên trái - LHS" (thay vì "tìm phải" như trên) và tìm đến tận tầng trên cùng (tức là *Scope* global) mà vẫn không thấy, thì trong thiết lập "Non-Strict Mode", *Scope* global sẽ tạo 1 variable mới với cái tên trùng với tên mà *Engine* đang đi tìm, variable mới này sẽ được đặt trong **Scope global**, giá trị mới cũng được đưa cho *Engine*. Bạn *Scope* global đáng yêu này còn không quên nhắn nhủ *Engine* là: "*"Variable mà cậu tìm không có ở đây đâu, nhưng tớ vốn là đứa tốt bụng, tớ tạo luôn 1 tên cho cậu."*

"Strict Mode" [^note-strictmode] - là 1 "mode" mới được thêm vào từ ES5. So với những mode cũ (ví dụ: normal, relaxed, lazy) thì nó có một vài điểm khác biệt. Một trong những điểm khác biệt đó chính là một khi đã thiết lập "mode" này, nó sẽ không cho phép tự động tạo các variable ở scope global. Trong trường hợp đó, bạn *Scope* global đáng yêu ở trên sẽ không có cơ hội để làm điều tốt (tạo variable trong phép tìm bên trái) nữa, kết quả là *Engine* sẽ trả về thông báo lỗi `ReferenceError` tương tự như phép "tìm bên phải - RHS".

Quay sang 1 trường hợp khác, là phép "tìm bên phải" đã tìm thấy variable mà bạn cần, nhưng sau đó bạn lại định dùng giá trị của variable tìm được để làm vài thứ bất khả thi, ví dụ: variable được gán với 1 con số nhưng lại lôi variable đấy ra thực thi như thực thi 1 hàm; hoặc tìm thuộc tính của `null`/ `undefined`. Lúc này thì *Engine* sẽ trả về 1 thông báo lỗi khác, đó là `TypeError`.

Vậy có thể thấy là lỗi `ReferenceError` liên quan đến thất bại trong việc định vị *Scope* (của variable), trong khi với `TypeError` thì việc định vị *Scope* (của variable) đã thành công, nhưng hành động tiếp theo dựa vào value của variable tìm được thì lại không được Engine cho phép (hoặc bất khả thi).

## Tổng kết (TL;DR - Dài quá, Ứ đọc)

Scope là một tập hợp các quy định về việc tìm và cách thức đi tìm (hay là tra cứu) một variable. 
- Nếu mục đích là để tìm vị trí chứa variable sau đó gán giá trị cho variable, thì người ta gọi phép tìm kiếm đó là "tìm bên trái - LHS". 
- Còn nếu mục đích là để tìm vị trí chứa variable, rồi lấy 1 bản sao chép giá trị của variable, thì gọi là "tìm bên phải - RHS". 

Kết quả của phép "tìm bên trái - LHS" có được nhờ phép gán. Phép gán này có thể:
- hoặc sử dụng toán từ `=` (như trong `a=2`)
- hoặc truyền tham số cho hàm (như trong `foo(2)`.

*Engine* của JavaScript sẽ luôn cần biên dịch đoạn code trước khi thực thi nó, và để làm vậy, nó cần phân tích một câu lệnh như `var a = 2;` trong 2 bước riêng biệt: 

1. Thứ nhất, phân tích `var a` để khai báo variable `a` trong trong *Scope*. Việc này cần làm ngay từ đầu trước khi đoạn code được chạy.

2. Sau đó, phân tích `a = 2` để tìm kiếm vị trí chứa variable `a` (phép "tìm bên trái - LHS"), sau đó gán vào giá trị `2` nếu tìm thấy `a`.

Cả 2 phép tìm trái (LHS) và tìm phải (RHS) đều xuất phát từ Scope hiện tại, và nếu cần (khi *Engine* không thấy cái nó cần) thì các Scope ở phạm vi rộng hơn sẽ được xem xét tới (các Scope lồng nhau) cho đến Scope ngoài cùng (global) thì sẽ dừng lại.

Nếu phép "tìm bên phải" không dẫn đến kết quả thì *Engine* sẽ trả về lỗi `ReferenceError`. Nếu phép "tìm bên trái" cũng không dẫn đến kết quả nào thì tuỳ thuộc vào "mode" hiện tại:
- trường hợp "None-Strict Mode", *Engine* sẽ nhận được 1 variable mới (trùng tên với variable mà nó đang tìm kiếm) ở scope global.
- trường hợp "Strict Mode", *Engine* trả về lỗi `ReferenceError`.

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
