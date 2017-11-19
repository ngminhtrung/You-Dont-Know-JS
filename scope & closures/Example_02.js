function baz() {
    // call-stack là: `baz`
    // vì vậy, call-site của `baz` là ở global scope

    console.log( "baz" );
    bar(); // <-- call-site cho `bar`
}

function bar() {
    // call-stack là: `baz` -> `bar`
    // vậy, call-site của `bar` là ở trong `baz`

    console.log( "bar" );
    foo(); // <-- call-site cho `foo`
}

function foo() {
    // call-stack là: `baz` -> `bar` -> `foo`
    // vậy, call-site của `foo` là trong `bar`

    console.log( "foo" );
}

baz(); // <-- call-site cho `baz`