// OTP behavior: forward typing, backspace to previous, auto-select on focus, paste support

document.addEventListener('DOMContentLoaded', () => {
  const inputs = Array.from(document.querySelectorAll('.code'));

  if (inputs.length === 0) return;

  // helper: focus index safely
  const focusIndex = (idx) => {
    if (idx >= 0 && idx < inputs.length) {
      inputs[idx].focus();
      // select existing content so new typing replaces it
      inputs[idx].select();
    }
  };

  // initial focus on first
  focusIndex(0);

  // handle paste: if user pastes full code, distribute into fields
  inputs.forEach((input, idx) => {
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text');
      // keep only digits
      const digits = paste.replace(/\D/g, '').split('');
      for (let i = 0; i < digits.length && (idx + i) < inputs.length; i++) {
        inputs[idx + i].value = digits[i];
      }
      const nextPos = Math.min(inputs.length - 1, idx + digits.length);
      focusIndex(nextPos);
    });

    // input event: when user types, move forward automatically
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      // keep only first digit and numeric
      const digit = (val.match(/\d/) || [''])[0];
      e.target.value = digit;
      if (digit !== '') {
        // move to next
        const next = idx + 1;
        if (next < inputs.length) focusIndex(next);
      }
    });

    // keydown to handle backspace behavior and left/right arrow navigation
    input.addEventListener('keydown', (e) => {
      const key = e.key;

      if (key === 'Backspace') {
        // if current has a value, clear it and keep focus here
        if (input.value !== '') {
          input.value = '';
          e.preventDefault();
          return;
        }
        // otherwise move to previous and clear it
        const prevIdx = idx - 1;
        if (prevIdx >= 0) {
          inputs[prevIdx].value = '';
          focusIndex(prevIdx);
          e.preventDefault();
        }
      } else if (key === 'ArrowLeft') {
        if (idx > 0) {
          focusIndex(idx - 1);
          e.preventDefault();
        }
      } else if (key === 'ArrowRight') {
        if (idx < inputs.length - 1) {
          focusIndex(idx + 1);
          e.preventDefault();
        }
      } else if (key === 'Enter') {
        // optionally you may do something with final code
        // e.g., collect value and submit
      } else {
        // allow numeric keys only; but we rely also on input filtering
        // do nothing here (input event will sanitize)
      }
    });

    // when focused, select to allow overwrite
    input.addEventListener('focus', (e) => {
      e.target.select();
    });
  });
});
