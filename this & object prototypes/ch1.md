# You Don't Know JS: *this* & Object Prototypes
# Chapter 1: `this` Or That?

Một trong những điểm gây bối rối nhất khi lập trình JavaScript là việc dùng từ khoá `this`. Đây là một từ khoá nhận dạng (identifier) đặc biệt được định nghĩa một cách tự động bên trong "scope" của mọi hàm, nhưng nó (`this`) thực sự là gì thì ngay cả những lập trình viên JavaScript có kinh nghiệm cũng đau đầu. 

> Bất kỳ **kỹ thuật tiên tiến** nào, lúc mới nhìn cũng không khác chi ma thuật. -- định luật thứ 3 của Arthur C. Clarke, một nhà khoa học và nhà văn người Anh

Thực ra thì cơ chế hoạt động của `this` trong JavaScript không tiên tiến đến mức *đó*, nhưng các lập trình viên thường trích lại định luật Clarke nói trên trong tâm trí, thêm vào những từ tiêu cực như "phức tạp", hay "rối rắm", và đương nhiên nếu không tìm hiểu thì dần dần `this` sẽ thực sự trở thành ma thuật trong tâm trí của *bạn*. 

**Lưu ý:** this" là một đại từ vô cùng thông dụng trong rất nhiều bài luận, hoặc thuyết trình. Và chương này (Chương 1: `this` Or That?) cũng không tránh khỏi việc dùng từ `this`! Vậy làm thế nào để người đọc hiểu là tác giả đang nói về từ khoá `this` trong Javascript, hay là đang dùng đại từ "this" như cách sử dụng thông thường ngoài đời? Để tránh nhầm lẫn, tác giả thông nhất viết `this` là chỉ đến từ khoá của JavaScript, còn để đại từ "this" trong dấu ngoặc " ... " hoặc in nghiêng *this*. 

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

Trước tiên, hãy đập tan những hiểu nhầm về cách mà `this` **không** làm việc.

Từ `this` tạo ra sự mơ hồ vì lập trình viên chỉ hiểu nó theo đúng nghĩa đen (định nghĩa trong từ điển tiếng Anh). Có hai cách hiểu liệt kê bên dưới, mà cả hai đều ... **sai**. 

### `this` = "chính nó"

Cách hiểu thông dụng nhất là cho rằng `this` trở đến bản thân chính hàm gọi nó. Đây là cách hiểu theo kiểu ngữ pháp.

Tại sao bạn lại muốn gọi 1 hàm từ bên trong chính nó? Một trong những lý do phổ biến là vì để tạo hàm "đệ quy" (một loại hàm có thể gọi lại chính nó từ bên trong), hoặc một event handler có thể unbind itself when it's first called.

Những lập trình viên mới sử dụng JavaScript đều nghĩ rằng việc trỏ đến function thông qua object của function (chú ý là mọi hàm của JavaScript đều là object) sẽ giúp họ lưu lại *trạng thái* (các giá trị (values) của thuộc tính (properties) giữa các lần gọi hàm. Dẫu đây là một phương án và có thể sử dụng trong một vài trường hợp, phần còn lại của quyển sách này sẽ chỉ ra rất nhiều cách khác *tốt hơn* để lưu các trạng thái của hàm giữa các lần gọi. 

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

**Lưu ý:** Một câu hỏi quan trọng thường bị bỏ qua khi đọc lướt đoạn trên, đó là: "Đoạn code viết trên nhằm mục đích tăng biến `count` lên 1 đơn vị mỗi lần chạy `foo`, nhưng kết quả lại không ra như trông đợi, vậy có biến `count` ở chỗ khác đang bị thay đổi hay không?" Thực tế là việc viết code như trên đã vô tình tạo ra 1 `count` thuộc dạng global variable  (xem Chương 2 để hiểu *tại sao* nó diễn ra!), tạm thời lúc này nó đang có giá trị là `NaN`. Sau câu hỏi này, ta sẽ có thêm cả tỷ câu hỏi nữa, ví dụ như là: "Tại sao variable này lại là global, tại sao nó lại là `NaN` thay vì 1 giá trị nào đó?" (xem Chương 2).

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
Mặc dù cách làm trên đã cho đúng giá trị của số lần hàm `foo` được gọi, nhưng rất tiếc nó đã bỏ qua vấn đề thực sự - không giải đáp được `this` có nghĩa gì và cơ chế bên trong nó, và rồi rơi lại vào vùng an toàn của một cơ chế quen thuộc hơn tên là "lexical scope". 

**Lưu ý:** Lexical scope là một cơ chế vô cùng hoàn hảo và hữu dụng; tác giả không có ý coi thường việc dùng nó (hãy xem quyển *"Scope & Closures"* trong series sách này). Nhưng nếu luôn phải *đoán và đoán* cách dùng `this` thì lại không nên, càng không nên quay sang "lexical scope" và không chịu học lý do mà `this` quay mặt đi với bạn.

Nếu bạn muốn trỏ đến function object từ bên trong chính object này, thì viết `this` như trên là không đủ. Bạn sẽ cần một "lexical identifier" (một variable) để trỏ đến object function.

Hãy xem 2 hàm bên dưới đây:

```js
function foo() {
	foo.count = 4; // `foo` trỏ đến chính nó
}

setTimeout( function(){
	// function dạng "anonymous" (không có tên), không thể trỏ đến chính nó
}, 10 );
```

Trong hàm đầu tiên, tạm gọi là "hàm có tên", `foo` là một tham chiếu dùng để trỏ đến hàm này từ bên trong chính nó. 

Còn trong hàm thứ hai, hàm callback (đặt bên trong `setTimeout(...)` không hề có tên (không có "identifier", còn được gọi là hàm "anonymous"), vì vậy mà chẳng có cách nào để tham chiếu đến chính nó. 

**Note:** Còn một cách khác (dù cũ và đã tuyệt chủng) đó là dùng `arguments.callee` bên trong hàm để trỏ đến function object của function đang được thực thi. Đây là cách duy nhập để gọi 1 hàm không tên từ bên trong chính nó. Dẫu vậy, tốt nhất là tránh dùng hàm không tên ít nhất đối với các trường hợp cần tham chiếu chính nó, thay hàm không tên thành hàm có tên (dạng expression). `arguments.callee` đã tuyệt chủng, đừng nghĩ đến nó nữa!

Một giải pháp khác để tham chiếu đến `foo` mà không cần dùng `this` là:

```js
function foo(num) {
	console.log( "foo: " + num );

	// dòng bên dưới để tính số lần `foo` được gọi
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

// số lần `foo` được gọi?
console.log( foo.count ); // 4
```

Tuy nhiên, cách trên *thực chất* vẫn đang lảng tránh việc hiểu bản chất của `this`, hoàn toàn dựa vào lexical scope của variable `foo`.

Một cách khác nữa đó là ép `this` trỏ đến function object `foo`:

```js
function foo(num) {
	console.log( "foo: " + num );

	// code dưới dùng để lưu số lần `foo` được gọi
	// Lưu ý: `this` ở đây đúng là trỏ đến `foo`,
	// do cách `foo` được gọi đến ở dưới đây
	this.count++;
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
	if (i > 5) {
		// dùng `call(..)`, ta đảm bảo rằng `this`
		// trỏ đến (`foo`)
		foo.call( foo, i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// số lần `foo` được gọi?
console.log( foo.count ); // 4
```

**Hãy yêu quý `this` thay vì lảng tránh nó.**  Sau đây, chúng ta sẽ đi xa thêm một chút về *cách* mà `this`, còn cho đến lúc này, đừng quá lo lắng nếu bạn vẫn còn thấy mơ hồ!

### Scope của "this"

Một hiểu nhầm phổ biến nữa đó là hiểu `this` tham chiếu đến scope của function. Cách hiểu này vừa đúng vừa sai, cái khó là hiểu nó đúng ở trường hợp nào, sai ở trường hợp nào. 

Đầu tiên, hãy nhớ rằng trong bất kỳ trường hợp nào, `this` không bao giờ dính dáng đến **lexical scope** của hàm. Scope đúng là 1 thể loại object có thuộc tính (properties) với với ứng mỗi function. Nhưng ta không thể dùng Javascript để truy cập vào "object". Đây là một phần của những gì *Engine* thực thi.

Hãy xem đoạn code sau đã thử và thất bại khi định xâm nhậm và dùng `this` để trỏ đến lexical scope của hàm:

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

Có quá nhiều vấn đề với đoạn code mẫu trên. Trông thì có vẻ tinh tế, nhưng nó là một ví dụ điển hình về những đoạn code đang được trao đổi trong những diễn đàn trên Internet, là minh hoạ rõ ràng việc `this` đang được dùng sai cách thế nào. 

- Thứ nhất là việc cố gắng trỏ đến hàm `bar()` thông qua `this.bar()`. Chỉ vì *ngẫu nhiên* mà đoạn code kia chạy, nhưng chúng ta sẽ xem giải thích *tại sao* lại có sự "ngẫu nhiên" này sau. Cách tự nhiên nhất để gọi hàm `bar()` chính là bỏ `this.` đi, chỉ cần để `bar()` là đủ (nó chính là lexical reference đến identifier).

- Thứ hai là việc cố gắng dùng `this` để bắc cầu giữa lexical scopes của `foo()` và `bar()`, để `bar()` truy cập variable `a` bên trong `foo()`. **Hãy nhớ là phép bắc cầu đó là không đem lại kết quả!** Không thể dùng `this` để tìm kiếm thứ gì trong lexical scope. Điều này là không thể.

Bất cứ lúc nào bạn định tìm kiếm trong lexical scope với `this`, hãy tự nhủ là: **không có phép bắc cầu ở đây!**.

## Vậy `this` là gì?

Sau khi đi qua các ví dụ cho thấy cách hiểu sai về `this`, giờ ta quay lại với cơ chế hoạt động của `this`. 

Như đã nói phía trên, `this` không phải một "**author-time binding**" mà là "**runtime binding**". Việc `this` trỏ đến cái gì phụ thuộc vào hoàn cảnh và cách mà hàm được gọi, không liên quan đến *nơi* hàm được khai báo.

Mỗi khi hàm được gọi (invoked), một quyển sổ ghi chép (với tên kỹ thuật là "execution context") được tạo mới. Quyển sổ này chứa thông tin:
- *nơi gọi* hàm này (tức là "call-stack")
- *cách* hàm được gọi 
- các tham số được truyền
- v.v.
Một trong những thông tin trong quyển sổ này là về `this`, lưu trữ trong suốt quá trình thực thi hàm.  

Trong chương tiếp theo, ta sẽ tìm hiểu về **call-site** của hàm dùng để xác định cách mà `this` gắn với hàm.

## Review (TL;DR - Dài quá, ứ đọc)

`this` trỏ về đâu? đây là nguồn gốc của bao rắc rối mà các lập trình viên JavaScript thường gặp, nhưng không chịu bỏ thời gian để học cơ chế phía sau này. Họ đơn thuần chỉ "*đoán*", "*thử - sai - thử lại*", hoặc đơn thuần "copy-n-paste" từ StackOverflow (trong khi chẳng hiểu gì), cách này không giúp chúng ta hiểu đúng tầm quan trọng của việc hiểu cơ chế với `this`. 

Để hiểu về `this`, đầu tiên hãy xem `this` *không* phải là những gì, gạt ra khỏi đầu những hiểu nhầm khiến cho bạn bị lạc hướng. `this` không hề là một tham chiếu đến hàm, cũng không hề tham chiếu đến *lexical* scope.

`this` được tạo khi function được gọi, và *thứ* mà nó trỏ đến hoàn toàn được xác định bởi cái gọi là **call-site** (nơi gọi function).
