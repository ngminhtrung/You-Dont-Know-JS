# You Don't Know JS: Scope & Closures
# Appendix A: Dynamic Scope

Trong Chương 2, chúng ta đã nhắc về "Dynamic Scope" (Scope động) như một khái niệm tương phản với "Lexical Scope", vốn là mô hình hoạt động của scope trong JavaScript (thực tế là nó cũng là mô hình của hầu hết các ngôn ngữ lập trình khác).

Ở phần này chúng ta sẽ nói ngắn gọn về dynamic scope, việc này sẽ giúp hiểu lexical scope kỹ hơn. Tuy nhiên, một điều quan trọng hơn là dynamic scope thực ra có quan hệ "anh em con cô con cậu" với 1 cơ chế khác trong JavaScript (`this`), ta sẽ nói về chủ đề này ở trong quyển "*this & Object Prototypes*".

Quay lại chương 2, *lexical scope* là một tập các quy định để *Engine* biết cách và nơi để tìm 1 variable nào đó. Một tính chất quan trọng của lexical scope là nó được xác định lúc lập trình viên viết code (chưa đến giai đoạn code được thực thi) (không tính cách ăn gian bằng `eval(...)` và `with`). 

Với dynamic scope, bản thân thuật ngữ này đã làm ta nghĩ đến 1 mô hình mà scope có thể thay đổi tại thời điểm code được thực thi, chứ không bị giữ cố định so với thời điểm viết code. Hãy xem ví dụ sau:

```js
function foo() {
	console.log(a); // 2
}

function bar() {
	var a = 3;
	foo();
}

var a = 2;

bar();
```

Khi `foo()` được gọi, `console.log(...)` cũng được gọi theo, *Engine* sẽ thực hiện một phép "tìm bên phải" để tìm giá trị `a` truyền cho `console.log(...)`. Theo mô hình "lexical scope", *Engine* khi không thấy `a` trong scope của `foo()` thì sẽ tìm kiếm thêm 1 cấp cao hơn, trong trường hợp này `a` được khai báo với giá trị `2` ở global scope, dẫn đến kết quả cuối cùng xuất ra bằng `2`.

Theo mô hình "dynamic scope", *Engine* sẽ không quan tâm đến nơi mà functions hoặc scopes được khai báo, mà là **nơi mà hàm được gọi**. Nói cách khác, chuỗi các scopes (scope chain) được xác định qua 1 nhóm lệnh gọi hàm (call-stack), không qua việc xem xét các scope lồng nhau trong code như thế nào. 

Giả sử JavaScript sử dụng mô hình "dynamic scope", thì khi `foo()` được thực thi, về **lý thuyết** thì đoạn code trên sẽ trả về kết quả bằng `3` chứ không phải `2`. 

```js
function foo() {
	console.log( a ); // 3  (not 2!)
}

function bar() {
	var a = 3;
	foo();
}

var a = 2;

bar();
```

Tại sao lại có chuyện này? Bởi khi `foo()` không tìm thấy `a` trong scope của nó, thay vì tiếp tục tìm kiếm ở cấp scope cao hơn, nó nhìn vào call-stack (nhóm các lệnh gọi hàm), để xem `foo()` được *gọi từ đâu*. Vì `foo()` được gọi từ `bar()`, nó sẽ tìm `a` trong scope của `bar()`. Do có 1 variable `a` được khai báo trong scope của `bar()` với giá trị bằng `3`, kết quả trả về (theo "lý thuyết") sẽ bằng `3`.

Lạ quá phải không? Lúc này đây bạn có thể nghĩ điều này kì cục. Có thể bởi bạn mới chỉ làm việc với những dòng code chỉ dùng lexical scope, nên bạn thấy dynamic scope như bọn ngoại lai. Nhưng nếu ngay từ đầu học lập trình bạn đã được giới thiệu, rồi thực hành với chỉ dynamic scope, bạn cũng sẽ có cảm giác tương tự với lexical scope. 

Xin nhắc lại lần nữa, ngắn gọn và rõ ràng, là JavaScript **không hề có dynamic scope**. JavaScript chỉ có lexical scope. Nhưng cơ chế của `this` thì lại có điểm chung với dynamic scope.

Điểm khác biệt lớn nhất giữa 2 mô hình này là: **lexical scope được xác định khi viết code, còn dynamic scope (và `this`!) được xác định lúc code được thực thi**. Lexical scope quan tâm đến *nơi mà function được khai báo*, trong khi  dynamic scope cần biết *nơi đã gọi* function.

Chốt: `this` liên quan đến *function được gọi theo cách nào*, nó rất giống với tư tưởng của dynamic scoping. Để đọc thêm về `this`, hãy xem quyển "*this & Object Prototypes*".