// Número com DDI + DDD, só dígitos.
const WHATSAPP_NUMERO = "5591980814834";
const WHATSAPP_MENSAGEM = "Olá, Dr. Gael. Gostaria de conversar sobre um caso.";

document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  el.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});
