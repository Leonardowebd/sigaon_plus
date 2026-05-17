// ── City Selection ──
document.addEventListener('DOMContentLoaded', function () {
  var cidade = localStorage.getItem('sigaon_cidade') || 'Vitória da Conquista';
  var pin = document.querySelector('.topbar__location span');
  if (pin) pin.textContent = cidade;

  if (document.body.dataset.page === 'index' && sessionStorage.getItem('sigaon_justSelected')) {
    sessionStorage.removeItem('sigaon_justSelected');
    setTimeout(showImg6Popup, 600);
  }

  document.querySelectorAll('.footer__info a').forEach(function (link) {
    if (link.textContent.trim() === 'Nossos Endereços') {
      link.href = '#';
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openAddressDialog();
      });
    }
  });

  injectDialogs();
  initMasks();

  var HELP_LINKS = {
    'Testar minha velocidade': 'https://www.speedtest.net/pt',
    'Atendimento via Chat': 'https://wa.me/557336136407?text=Ol%C3%A1.',
    '2ª via de conta': 'https://assine.sigaonmais.com.br/boleto',
    'Atendimento via WhatsApp': 'https://wa.me/557336136407?text=Ol%C3%A1.',
    'Alterar meu plano': 'https://wa.link/lbgho2',
    'Suporte técnico': 'https://wa.me/557336136407?text=Ol%C3%A1.'
  };
  document.querySelectorAll('.help__card').forEach(function (card) {
    var label = card.querySelector('.help__card-label');
    if (!label) return;
    var url = HELP_LINKS[label.textContent.trim()];
    if (url) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function () { window.open(url, '_blank'); });
    }
  });
});

// ── City Selector (localizacao.html) ──
function selectCity(name) {
  localStorage.setItem('sigaon_cidade', name);
  sessionStorage.setItem('sigaon_justSelected', '1');
  window.location.href = 'index.html';
}

// ── WhatsApp Button ──
function openWA(e, plan) {
  if (e) e.preventDefault();
  var cidade = localStorage.getItem('sigaon_cidade') || 'Vitória da Conquista';
  var cfg = {};
  try { cfg = (window.getSigaConfig && window.getSigaConfig()) || {}; } catch (ex) {}

  var phone = '557336136407';
  var cidadeCfg = cfg.cidades && cfg.cidades[cidade];
  if (cidadeCfg && cidadeCfg.whatsapp) {
    var m = cidadeCfg.whatsapp.match(/wa\.me\/(\d+)/);
    if (m) phone = m[1];
  } else if (cfg.links && cfg.links.whatsapp_geral) {
    var m2 = cfg.links.whatsapp_geral.match(/wa\.me\/(\d+)/);
    if (m2) phone = m2[1];
  }

  var msg = 'Olá!';
  if (plan) msg += ' Tenho interesse no plano ' + plan + '.';
  msg += ' Cidade: ' + cidade + '.';

  window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
}

// ── Address Dialog ──
function openAddressDialog() {
  var d = document.getElementById('addrDialog');
  if (d) { d.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeAddressDialog() {
  var d = document.getElementById('addrDialog');
  if (d) { d.classList.remove('open'); document.body.style.overflow = ''; }
}

// ── Image 6 Popup ──
function showImg6Popup() {
  var p = document.getElementById('img6Popup');
  if (p) { p.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeImg6Popup() {
  var p = document.getElementById('img6Popup');
  if (p) { p.classList.remove('open'); document.body.style.overflow = ''; }
}

// ── Inject Dialog HTML ──
function injectDialogs() {
  if (!document.getElementById('addrDialog')) {
    var el = document.createElement('div');
    el.id = 'addrDialog';
    el.className = 'addr-dialog';
    el.innerHTML =
      '<div class="addr-dialog__overlay" onclick="closeAddressDialog()"></div>' +
      '<div class="addr-dialog__box">' +
        '<button class="addr-dialog__close" onclick="closeAddressDialog()">✕</button>' +
        '<div class="addr-dialog__header">' +
          '<h2>Venha conhecer nossos escritórios</h2>' +
        '</div>' +
        '<div class="addr-dialog__list">' +
          '<div class="addr-item"><strong>VITÓRIA DA CONQUISTA</strong><span>Rua Zeferino Veloso, 245 – Recreio</span></div>' +
          '<div class="addr-item"><strong>ILHÉUS</strong><span>Rua Mal. Floriano Peixoto, 123 – Centro</span></div>' +
          '<div class="addr-item"><strong>ITABUNA</strong><span>Av. Aziz Maron, 380 – Centro</span></div>' +
          '<div class="addr-item"><strong>ITACARÉ</strong><span>Rua Castelo Branco, 45 – Centro</span></div>' +
          '<div class="addr-item"><strong>MARAÚ</strong><span>Praça São Sebastião, 12 – Centro</span></div>' +
          '<div class="addr-item"><strong>CAMAMU</strong><span>Rua Frederico Koch, 30 – Centro</span></div>' +
          '<div class="addr-item"><strong>UNA</strong><span>Av. Central, 15 – Centro</span></div>' +
          '<div class="addr-item"><strong>URUÇUCA</strong><span>Rua Oswaldo Cruz, 8 – Centro</span></div>' +
          '<div class="addr-item"><strong>ITAJUIPE</strong><span>Praça da Independência, 20 – Centro</span></div>' +
          '<div class="addr-item"><strong>SEDE ADMINISTRATIVA</strong><span>Av. Brumado, 3000 – Vitória da Conquista</span></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
  }
}

// ── Form Masks ──
function initMasks() {
  document.querySelectorAll('[data-mask="phone"]').forEach(function (el) {
    el.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 11);
      if (v.length <= 10) {
        v = v.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/, function (_, a, b, c) {
          var r = '';
          if (a) r += '(' + a;
          if (b) r += (a.length === 2 ? ') ' : '') + b;
          if (c) r += '-' + c;
          return r;
        });
      } else {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
      }
      this.value = v;
    });
  });

  document.querySelectorAll('[data-mask="cep"]').forEach(function (el) {
    el.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').substring(0, 8);
      if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5);
      this.value = v;
    });
  });
}

// ── Form Submit → WhatsApp ──
function submitContactForm(e) {
  e.preventDefault();
  var priv = e.target.querySelector('[name="privacidade"]');
  if (!priv || !priv.checked) {
    alert('Por favor, aceite as Políticas de Privacidade para continuar.');
    return;
  }

  var cidade = localStorage.getItem('sigaon_cidade') || 'Vitória da Conquista';
  var cfg = {};
  try { cfg = (window.getSigaConfig && window.getSigaConfig()) || {}; } catch (ex) {}

  var phone = '557336136407';
  var cidadeCfg = cfg.cidades && cfg.cidades[cidade];
  if (cidadeCfg && cidadeCfg.whatsapp) {
    var m = cidadeCfg.whatsapp.match(/wa\.me\/(\d+)/);
    if (m) phone = m[1];
  } else if (cfg.links && cfg.links.whatsapp_geral) {
    var m2 = cfg.links.whatsapp_geral.match(/wa\.me\/(\d+)/);
    if (m2) phone = m2[1];
  }

  var get = function (name) {
    var el = e.target.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : '';
  };

  var msg = 'Olá! Nova mensagem via site SigaOn+ Fibra.\n';
  msg += 'Cidade: ' + cidade + '\n';
  var nome = get('nome'); if (nome) msg += 'Nome: ' + nome + '\n';
  var tel = get('telefone'); if (tel) msg += 'Telefone: ' + tel + '\n';
  var email = get('email'); if (email) msg += 'E-mail: ' + email + '\n';
  var cep = get('cep'); if (cep) msg += 'CEP: ' + cep + '\n';
  var end = get('endereco'); if (end) msg += 'Endereço: ' + end + '\n';
  var setor = get('setor'); if (setor) msg += 'Setor/Área: ' + setor + '\n';
  var assunto = get('assunto'); if (assunto) msg += 'Mensagem: ' + assunto;

  e.target.reset();
  window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
}
