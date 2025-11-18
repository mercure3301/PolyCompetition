program FibonacciLoop;

uses
  Crt;

var
  n, i: Integer;
  fib, prev, curr: Int64;
  input: String;

begin
  ClrScr;
  repeat
    Write('Entrez le nombre de termes de Fibonacci : ');
    ReadLn(input);
    Val(input, n);  { Convertit le texte en nombre }

    if n < 0 then
    begin
      WriteLn('Nombre invalide.');
      Continue;
    end;

    prev := 0;
    curr := 1;

    WriteLn('Sequence de Fibonacci:');

    for i := 1 to n do
    begin
      if i = 1 then
        fib := 0
      else if i = 2 then
        fib := 1
      else
      begin
        fib := prev + curr;
        prev := curr;
        curr := fib;
      end;
      Write(fib, ' ');
    end;
    WriteLn;
    WriteLn;
  until False;
  
  WriteLn('Au revoir !');
end.
