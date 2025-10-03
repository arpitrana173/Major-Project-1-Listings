const stars = document.querySelectorAll(".rating i");
const ratingValue = document.getElementById("rating-value");
 const ratingInput = document.getElementById("rating-input");
let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener("mouseover", () => highlightStars(star.dataset.value));
  star.addEventListener("mouseout", () => highlightStars(selectedRating));
  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;
    ratingValue.textContent = selectedRating;
    ratingInput.value = selectedRating;
    highlightStars(selectedRating);
  });
});

function highlightStars(rating) {
  stars.forEach(star => {
    if(star.dataset.value <= rating){
      star.classList.remove("bi-star");
      star.classList.add("bi-star-fill", "text-warning");
    } else {
      star.classList.remove("bi-star-fill", "text-warning");
      star.classList.add("bi-star");
    }
  });
}