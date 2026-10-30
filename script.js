// Troque pelo número com DDI + DDD, só dígitos. Ex.: 5511999999999
const WHATSAPP_NUMERO = "55XXXXXXXXXXX";
const WHATSAPP_MENSAGEM = "Olá, gostaria de conversar sobre um caso.";

document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  el.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});
