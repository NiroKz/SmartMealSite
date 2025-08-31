const telefoneInput = document.getElementById("telefone");
const cpfInput = document.getElementById("cpf");

telefoneInput.addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, '').slice(0, 11);

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

cpfInput.addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, '').slice(0, 11);

  let formatted = '';
  if (input.length > 0) {
    formatted += input.substring(0, 3);
  }
  if (input.length >= 4) {
    formatted += '.' + input.substring(3, 6);
  }
  if (input.length >= 7) {
    formatted += '.' + input.substring(6, 9);
  }
  if (input.length >= 10) {
    formatted += '-' + input.substring(9, 11);
  }

  e.target.value = formatted;
});

cpfInput.addEventListener('keydown', function (e) {
  const key = e.key;
  if (key === 'Backspace') {
    let pos = cpfInput.selectionStart;
    let val = cpfInput.value;
    if (val[pos - 1] === '.' || val[pos - 1] === '-') {
      cpfInput.setSelectionRange(pos - 1, pos - 1);
    }
  }
});

const form = document.querySelector("form");
form.addEventListener("submit", function () {
  telefoneInput.value = telefoneInput.value.replace(/\D/g, '');
  cpfInput.value = cpfInput.value.replace(/\D/g, '');
});
