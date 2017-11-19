Module pattern:
- Trông như thế nào?
- Hoạt động như thế nào?
- Sử dụng ở đâu?
- Tại sao lại dùng nó? (Ưu điểm)
- Tại sao lại không dùng? (Nhược điểm)
- Những kiến thức nền tảng để hiểu được module pattern?
- Cách hoạt động của module loaders


* Tham khảo:
1. You don't know JS (Kyle Simpson)
2. Learning JavaScript Design Patterns (Addy Osmani)


1. Module Pattern trông như thế nào?
```js
var foo = (function CoolModule(id) {

  var count = 0; 

	function change() {
		// modifying the public API
		publicAPI.identify = identify_02;
    count++; 
	}

	function identify_01() {
		console.log("Hello " + id);
    if count > 0 ? countChange() : "";
	}

	function identify_02() {
		console.log("Hello " + id.toUpperCase());
    if count > 0 ? countChange() : "";
	}

  function countChange() {
    console.log("Số lần thay đổi: " + count);
  }

	var publicAPI = {
		change: change,
		identify: identify_01
	};

	return publicAPI;
})("Trang");


