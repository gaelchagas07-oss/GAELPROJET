// Número com DDI + DDD, só dígitos.
const WHATSAPP_NUMERO = "5591980814834";
const WHATSAPP_MENSAGEM = "Olá, Dr. Gael. Gostaria de conversar sobre um caso.";

document.documentElement.classList.add("js");

document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  el.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});

// Topo fica sólido e o botão flutuante aparece depois que o hero sai da tela
const topo = document.getElementById("topo");
const flutuante = document.querySelector(".flutuante");
const aoRolar = () => {
  const y = window.scrollY;
  topo.classList.toggle("topo--solido", y > 40);
  flutuante.classList.toggle("flutuante--visivel", y > window.innerHeight * 0.8);
};
window.addEventListener("scroll", aoRolar, { passive: true });
aoRolar();

// Elementos surgem ao entrar na tela, em leve cascata dentro do mesmo grupo
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    const irmaos = [...entrada.target.parentElement.querySelectorAll(":scope > [data-revelar]")];
    entrada.target.style.transitionDelay = `${Math.max(0, irmaos.indexOf(entrada.target)) * 90}ms`;
    entrada.target.classList.add("revelado");
    observador.unobserve(entrada.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll("[data-revelar]").forEach((el) => observador.observe(el));
