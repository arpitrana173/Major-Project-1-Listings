// Fetch all forms with class "needs-validation"
const forms = document.querySelectorAll(".needs-validation");

Array.from(forms).forEach((form) => {
  form.addEventListener(
    "submit",
    function (event) {
      if (!form.checkValidity()) {
        event.preventDefault(); // prevent submission
        event.stopPropagation();
      }
      form.classList.add("was-validated"); // apply Bootstrap styles
    },
    false
  );
});
