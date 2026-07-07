const header = document.querySelector("[data-header]");
const video = document.querySelector(".hero-video");
const videoToggle = document.querySelector("[data-video-toggle]");
const reveals = document.querySelectorAll(".reveal");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 360)}ms`;
  revealObserver.observe(item);
});

videoToggle.addEventListener("click", async () => {
  if (video.paused) {
    await video.play();
    videoToggle.textContent = "Pause Video";
  } else {
    video.pause();
    videoToggle.textContent = "Play Video";
  }
});

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-8px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
