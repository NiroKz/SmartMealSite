  const telefoneInput = document.getElementById("telefone");

  telefoneInput.addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, '').slice(0, 11); // Apenas números, máximo 11 dígitos

    let formatted = '';
    if (input.length > 0) {
      formatted += '(' + input.substring(0, 2);
    }
    if (input.length >= 3) {
      formatted += ') ' + input.substring(2, 7);
    }
    if (input.length >= 8) {
      formatted += '-' + input.substring(7, 11);
    }

    e.target.value = formatted;
  });

  telefoneInput.addEventListener('keydown', function (e) {
    const key = e.key;
    if (key === 'Backspace') {
      let pos = telefoneInput.selectionStart;
      let val = telefoneInput.value;
      if (val[pos - 1] === ')' || val[pos - 1] === '(' || val[pos - 1] === ' ' || val[pos - 1] === '-') {
        telefoneInput.setSelectionRange(pos - 1, pos - 1);
      }
    }
  });