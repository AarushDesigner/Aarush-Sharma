/* ============================================================
   AARUSH DESIGNER — CONTACT FORM VALIDATION
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const successMsg = document.querySelector('#form-success');

  const validators = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => v.trim() === '' || /^[+]?[0-9\s-]{7,15}$/.test(v.trim()),
    message: (v) => v.trim().length >= 10,
  };

  function setError(field, hasError) {
    const wrapper = field.closest('.field');
    if (!wrapper) return;
    wrapper.classList.toggle('has-error', hasError);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.keys(validators).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      const valid = validators[name](field.value);
      setError(field, !valid);
      if (!valid) isValid = false;
    });

    if (!isValid) return;

    /* No backend connected — show confirmation only */
    form.reset();
    form.style.display = 'none';
    if (successMsg) successMsg.style.display = 'block';
  });

  /* Clear error state as user types */
  Object.keys(validators).forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.addEventListener('input', () => setError(field, false));
  });
});