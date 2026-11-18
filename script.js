/* ==========================================================
   CONFIGURAÇÃO DA BARBEARIA
   Edite os dados abaixo antes de publicar o site.
   WhatsApp: país + DDD + número, somente números.
   Exemplo: 5581999999999
   ========================================================== */

const CONFIG = {
  whatsapp: "55 81 9242-0529",
/* ==========================================================
   CONFIGURAÇÃO DA BARBEARIA
   ========================================================== */

const CONFIG = {
  whatsapp: "55 81 9242-0529",
  instagram: "marinhodu.corte",
  address: "Rua Frei Casimiro, 425",
  mapsQuery: "Rua Frei Casimiro, 425"
};

const whatsappNumber = CONFIG.whatsapp.replace(/\D/g, "");

function whatsappUrl(message = "Olá! Gostaria de saber mais sobre os serviços da Marinhodu.corte.") {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/* LINKS DO WHATSAPP */

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.href = whatsappUrl();
});

/* LINKS DO INSTAGRAM */

document.querySelectorAll("[data-instagram]").forEach(link => {
  const instagram = CONFIG.instagram.replace(/^@/, "");
  link.href = `https://www.instagram.com/${instagram}/`;
});

/* GOOGLE MAPS */

document.querySelectorAll("[data-maps]").forEach(link => {
  const endereco = CONFIG.mapsQuery || CONFIG.address;
  link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
});

/* AVALIAÇÃO PELO WHATSAPP */

document.querySelectorAll("[data-review]").forEach(link => {
  const mensagem =
    "Olá! Gostaria de avaliar meu atendimento na Marinhodu.corte.\n\n" +
    "Minha nota é: __/10.\n\n" +
    "Comentário: ";

  link.href = whatsappUrl(mensagem);
});

/* INFORMAÇÕES DA BARBEARIA */

const addressText = document.getElementById("addressText");
const yearElement = document.getElementById("year");

if (addressText) {
  addressText.textContent = CONFIG.address;
}

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* MENU PARA CELULAR */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

/* ==========================================================
   HORÁRIOS DE AGENDAMENTO
   Segunda a sexta: 02h às 08h
   Sábado: 10h às 16h
   Domingo: fechado
   ========================================================== */

const dateInput = document.getElementById("bookingDate");
const timeSelect = document.getElementById("bookingTime");

function getLocalDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function updateTimes() {
  if (!dateInput || !timeSelect) return;

  const selectedDate = dateInput.value;

  timeSelect.innerHTML = "";

  if (!selectedDate) {
    timeSelect.innerHTML =
      '<option value="">Escolha uma data primeiro</option>';
    return;
  }

  // Cria a data usando o horário local para evitar erro de fuso
  const [year, month, day] = selectedDate.split("-").map(Number);
  const selectedDay = new Date(year, month - 1, day).getDay();

  if (selectedDay === 0) {
    timeSelect.innerHTML =
      '<option value="">Fechado aos domingos</option>';
    return;
  }

  timeSelect.innerHTML =
    '<option value="">Selecione o horário</option>';

  let horarios = [];

  // Segunda a sexta: 02:00 até 08:00
  if (selectedDay >= 1 && selectedDay <= 5) {
    for (let hora = 2; hora <= 16; hora++) {
      horarios.push(hora);
    }
  }

  // Sábado: 10:00 até 16:00
  if (selectedDay === 6) {
    for (let hora = 10; hora <= 16; hora++) {
      horarios.push(hora);
    }
  }

  horarios.forEach(hora => {
    const horario = `${String(hora).padStart(2, "0")}:00`;

    const option = document.createElement("option");
    option.value = horario;
    option.textContent = horario;

    timeSelect.appendChild(option);
  });
}

if (dateInput && timeSelect) {
  // Impede selecionar datas anteriores a hoje
  dateInput.min = getLocalDate();

  // Atualiza os horários quando a data mudar
  dateInput.addEventListener("change", updateTimes);

  // Atualiza também se a página já tiver uma data preenchida
  updateTimes();
}

/* BOTÕES DOS SERVIÇOS */

document.querySelectorAll("[data-service]").forEach(button => {
  button.addEventListener("click", () => {
    const service = button.dataset.service;
    const serviceSelect = document.getElementById("serviceSelect");

    if (serviceSelect) {
      const option = [...serviceSelect.options].find(item =>
        item.textContent.startsWith(service)
      );

      if (option) {
        serviceSelect.value = option.value;
      }
    }

    document.getElementById("agendar").scrollIntoView({
      behavior: "smooth"
    });

    document.getElementById("clientName").focus({
      preventScroll: true
    });
  });
});

/* ENVIO DO AGENDAMENTO PELO WHATSAPP */

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", event => {
    event.preventDefault();

    const error = document.getElementById("formError");

    if (error) {
      error.textContent = "";
    }

    if (!whatsappNumber || whatsappNumber.length < 12) {
      if (error) {
        error.textContent = "Confira o número do WhatsApp configurado no script.js.";
      }
      return;
    }

    const data = new FormData(bookingForm);

    const selectedDate = data.get("date");
    const [year, month, day] = selectedDate.split("-");

    const formattedDate = `${day}/${month}/${year}`;

    const message = [
      "Olá! Gostaria de solicitar um agendamento no Marinhodu.corte.",
      "",
      `Nome: ${data.get("name")}`,
      `Telefone: ${data.get("phone")}`,
      `Serviço: ${data.get("service")}`,
      `Data desejada: ${formattedDate}`,
      `Horário desejado: ${data.get("time")}`,
      data.get("notes")
        ? `Observação: ${data.get("notes")}`
        : "",
      "",
      "Aguardo a confirmação da disponibilidade. Obrigado!"
    ].filter(Boolean).join("\n");

    window.open(whatsappUrl(message), "_blank", "noopener");
  });
}

  instagram: "marinhodu.corte",
  address: "Rua Frei Casimiro, 425",
  mapsQuery: "Rua frei casimiro 425"
};

const whatsappNumber = CONFIG.whatsapp.replace(/\D/g, "");

const whatsappUrl = (message = "Olá! Gostaria de saber mais sobre os serviços da Marinhodu.corte.") =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

// Links do WhatsApp
document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.href = whatsappUrl();
});

// Links do Instagram
document.querySelectorAll("[data-instagram]").forEach(link => {
  link.href = `https://instagram.com/${CONFIG.instagram.replace(/^@/, "")}`;
});

// Link do endereço no Google Maps
document.querySelectorAll("[data-maps]").forEach(link => {
  link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.mapsQuery || CONFIG.address)}`;
});

// Link para avaliação
document.querySelectorAll("[data-review]").forEach(link => {
  if (CONFIG.reviewUrl.trim()) {
    link.href = CONFIG.reviewUrl;
  } else {
    link.href = whatsappUrl("Olá! Gostaria de saber como posso deixar uma avaliação sobre meu atendimento.");
  }
});

// Informações da barbearia
document.getElementById("addressText").textContent = CONFIG.address;
document.getElementById("year").textContent = new Date().getFullYear();

/* Menu para celular */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

/* Preenche horários sugeridos */

const dateInput = document.getElementById("bookingDate");
const timeSelect = document.getElementById("bookingTime");

const today = new Date();

const localToday = new Date(
  today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.min = localToday;

function updateTimes() {
  const selected = dateInput.value;

  timeSelect.innerHTML = '<option value="">Escolha</option>';

  if (!selected) return;

  const day = new Date(`${selected}T12:00:00`).getDay();

  if (day === 0) {
    timeSelect.innerHTML = '<option value="">Fechado aos domingos</option>';
    return;
  }

  const horarios = [
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00"
  ];

  horarios.forEach(horario => {
    const option = document.createElement("option");

    option.value = horario;
    option.textContent = horario;

    timeSelect.appendChild(option);
  });
}

dateInput.addEventListener("change", updateTimes);

/* Botões dos serviços */

document.querySelectorAll("[data-service]").forEach(button => {
  button.addEventListener("click", () => {
    const service = button.dataset.service;

    const option = [...document.querySelectorAll("#serviceSelect option")]
      .find(item => item.textContent.startsWith(service));

    if (option) {
      document.getElementById("serviceSelect").value = option.value;
    }

    document.getElementById("agendar").scrollIntoView({
      behavior: "smooth"
    });

    document.getElementById("clientName").focus({
      preventScroll: true
    });
  });
});

/* Envia a solicitação para o WhatsApp */

document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  const error = document.getElementById("formError");

  error.textContent = "";

  if (!whatsappNumber || whatsappNumber === "55 81 9242-0529") {
    error.textContent = "Configure o número correto do WhatsApp no arquivo script.js antes de usar o agendamento.";
    return;
  }

  const data = new FormData(form);

  const date = new Date(`${data.get("date")}T12:00:00`);

  const formattedDate = date.toLocaleDateString("pt-BR");

  const message = [
    "Olá! Gostaria de solicitar um agendamento no Marinhodu.corte.",
    "",
    `Nome: ${data.get("name")}`,
    `Telefone: ${data.get("phone")}`,
    `Serviço: ${data.get("service")}`,
    `Data desejada: ${formattedDate}`,
    `Horário desejado: ${data.get("time")}`,
    data.get("notes") ? `Observação: ${data.get("notes")}` : "",
    "",
    "Aguardo a confirmação da disponibilidade. Obrigado!"
  ].filter(Boolean).join("\n");

  window.open(whatsappUrl(message), "_blank", "noopener");
});
