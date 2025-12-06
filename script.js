//your JS code here. If required.
const inputs = Array.from(document.querySelectorAll('.code'));
inputs[index].focus();
inputs[index].setSelectionRange(0, 0);
}


inputs.forEach((input, idx) => {
input.addEventListener('input', (e) => {
const val = e.target.value || '';
const digit = val.replace(/[^0-9]/g, '').slice(0, 1);
e.target.value = digit;


if (digit !== '') {
if (idx + 1 < inputs.length) {
focusAt(idx + 1);
} else {
e.target.blur();
}
}
});


input.addEventListener('keydown', (e) => {
const key = e.key;


if (key === 'Backspace') {
if (input.value === '') {
if (idx > 0) {
e.preventDefault();
inputs[idx - 1].value = '';
focusAt(idx - 1);
}
}
} else if (key === 'ArrowLeft') {
if (idx > 0) {
e.preventDefault();
focusAt(idx - 1);
}
} else if (key === 'ArrowRight') {
if (idx + 1 < inputs.length) {
e.preventDefault();
focusAt(idx + 1);
}
} else if (key === 'Enter') {
e.preventDefault();
}
});


input.addEventListener('paste', (e) => {
e.preventDefault();
const paste = (e.clipboardData || window.clipboardData).getData('text');
const digits = paste.replace(/[^0-9]/g, '');
if (!digits) return;


for (let i = 0; i < digits.length && (idx + i) < inputs.length; i++) {
inputs[idx + i].value = digits.charAt(i);
}
if ((idx + digits.length) < inputs.length) {
focusAt(idx + digits.length);
} else {
inputs[inputs.length - 1].blur();
}
});


input.addEventListener('focus', (e) => {
e.target.select();
});
});


// initial focus
if (inputs.length > 0) inputs[0].focus();