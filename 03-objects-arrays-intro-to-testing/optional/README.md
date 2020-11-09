Необходимо передать в функцию такие параметры, при вызове с которыми
функция возвращает булевское значение "true"

```javascript
    function returnTrue0(a) {
        return a;
    }
    // true

    function returnTrue1(a) {
      return typeof a !== 'object' && !Array.isArray(a) && a.length === 4;
    }
    // function(a,b,c,d) {...}

    function returnTrue2(a) {
        return a !== a;
    }
    // NaN


    function returnTrue3(a, b, c) {
        return a && a == b && b == c && a != c;
    }
    // хм...

    function returnTrue4(a) {
        return (a++ !== a) && (a++ === a);
    }
    // потеря точности 
    // 9999999999999998

    function returnTrue5(a) {
        return a in a;
    }
    // const obj = {[obj]: 1};
    // returnTrue5(obj);

    function returnTrue6(a) {
        return a[a] == a;
    }
    // const obj = {};
    // obj[obj] = obj;
    // returnTrue5(obj);

    function returnTrue7(a, b) {
        return a === b && 1/a < 1/b; 
    }
    // кхм...
```