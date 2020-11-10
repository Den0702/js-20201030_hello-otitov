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
    // function(a,b,c,d) {...}, func.length выдаст количество аргументов, поэтому и равен 4
    // Еще можно передать "text", "text".length === 4, и не объект и не массив 

    function returnTrue2(a) {
        return a !== a;
    }
    // a = NaN


    function returnTrue3(a, b, c) {
        return a && a == b && b == c && a != c;
    }
    // a = '0', b = 0, c = ''
    //
    // Boolean('0') === true, Boolean(0) === false, Boolean('') === false
    // '0' == 0, 0 == '', '0' != '';

    function returnTrue4(a) {
        return (a++ !== a) && (a++ === a);
    }
    // потеря точности 
    // a = 9999999999999998

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
    // a = -0, b = 0
    // 
    // так как -0 === 0, 
    // -Infinity < Infinity
```