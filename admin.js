// ── Default config ──
var DEFAULT_CFG = {
  links: {
    whatsapp_geral: 'https://wa.me/557336136407',
    contratos: 'https://storage.googleapis.com/wordpress_content/sites/52/2024/07/CONTRATO-DE-PRESTACAO-DE-SERVCO-DE-TELECOMUNICACOES-.pdf',
    comunicados: 'https://storage.googleapis.com/wordpress_content/sites/52/2025/11/COMUNICADO-CLIENTE-MAIS-CONECTIVIDADE.pdf',
    central: 'https://central.sigaonmais.com.br/central_assinante_web/'
  },
  banners: { slide1: '', slide2: '', slide3: '' },
  cidades: {
    'Vitória da Conquista': { whatsapp: 'https://wa.me/557722020000', ativo: true },
    'Ilhéus':               { whatsapp: 'https://wa.me/557336136407', ativo: true },
    'Itabuna':              { whatsapp: 'https://wa.me/557336136407', ativo: true },
    'Maraú':                { whatsapp: 'https://wa.me/557336136407', ativo: true },
    'Una':                  { whatsapp: 'https://wa.me/557336136407', ativo: true },
    'Uruçuca':              { whatsapp: 'https://wa.me/557336136407', ativo: true },
    'Camamu':               { whatsapp: 'https://wa.me/557336136407', ativo: true },
    'Itacaré':              { whatsapp: 'https://wa.me/557336136407', ativo: true },
    'Itajuipe':             { whatsapp: 'https://wa.me/557336136407', ativo: true }
  }
};

var DEFAULT_VOCE_PLANS = [
  { nome: '500 MEGAS+ TV',    velocidade: '500', preco: '99,90',  popular: false, apps: ['bebanca','BiblioTechie','Yplay'],          features: ['Instalação Gratis','Wifi Gratis'] },
  { nome: '500 MEGA + DEEZER',velocidade: '500', preco: '99,90',  popular: true,  apps: ['bebanca','BiblioTechie','Deezer','Yplay'], features: ['Instalação Gratis','Wifi Gratis'] },
  { nome: '600 MEGA TOP',     velocidade: '600', preco: '129,90', popular: false, apps: ['bebanca','BiblioTechie','Yplay','Deezer'], features: ['Instalação Gratis','Wifi Gratis'] },
  { nome: '500 MEGA TOP',     velocidade: '500', preco: '119,90', popular: false, apps: [],                                         features: ['Instalação Gratis','Wifi Gratis'] }
];

var DEFAULT_EMPRESAS_PLANS = [
  { nome: 'Transporte de Dados', features: ['Transferência de Dados com Alta Capacidade','Segurança Avançada','Alta Disponibilidade e Redundância','Velocidade e Confiabilidade','Comunicação em Tempo Real','Integração Fácil e Escalável'] },
  { nome: 'Link Full',           features: ['Conexão Exclusiva e Dedicada','Garantia de SLA','Segurança e Confiabilidade – Link Full','Escalabilidade','Suporte para Aplicações Críticas','Personalização'] },
  { nome: 'Banda Larga Empresarial', features: ['Velocidades simétricas','Conexão 100% em rede de Fibra Óptica'] },
  { nome: 'Link Dedicado',       features: ['Exclusividade','Velocidade Simétrica – Link Dedicado','Alta Disponibilidade','Baixa Latência','Segurança'] }
];

var DEFAULT_EMPRESAS_PRICE_PLANS = [
  { nome: '350 MEGAS', velocidade: '350', precoAntigo: '149,90', preco: '129,90', popular: false, features: ['Instalação Gratis para contratos de 1 ano'] },
  { nome: '700 MEGAS', velocidade: '700', precoAntigo: '199,90', preco: '179,90', popular: true,  features: ['Instalação Gratis para contratos de 1 ano'] },
  { nome: '500 MEGAS', velocidade: '500', precoAntigo: '',        preco: '149,90', popular: false, features: ['Instalação Gratis para contratos de 1 ano'] }
];

var PASS_KEY     = 'sigaon_admin_pass';
var CFG_KEY      = 'sigaon_config';
var BANNERS_KEY  = 'sigaon_banners_files';
var DEFAULT_PASS = btoa('sigaon2025');

// Temp storage for banner files (before save)
var _bannerFiles = { slide1: null, slide2: null, slide3: null, historia: null };

// ── Auth ──
function doLogin(e) {
  e.preventDefault();
  var pass = document.getElementById('adminPass').value;
  var stored = localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
  if (btoa(pass) === stored) {
    localStorage.setItem('sigaon_admin_session', '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    loadAll();
  } else {
    document.getElementById('loginError').textContent = 'Senha incorreta. Tente novamente.';
    document.getElementById('adminPass').value = '';
  }
}

function doLogout() {
  localStorage.removeItem('sigaon_admin_session');
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminPass').value = '';
  document.getElementById('loginError').textContent = '';
}

window.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('sigaon_admin_session') === '1') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    loadAll();
  }
});

// ── Config helpers ──
function getConfig() {
  try {
    var raw = localStorage.getItem(CFG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_CFG));
}

function saveConfig(cfg) {
  localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
}

function getBannerFiles() {
  try {
    var raw = localStorage.getItem(BANNERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

// ── Tab navigation ──
function showTab(name, btn) {
  document.querySelectorAll('.tab-panel').forEach(function (p) { p.style.display = 'none'; });
  document.querySelectorAll('.nav-item').forEach(function (b) { b.classList.remove('nav-item--active'); });
  var panel = document.getElementById('tab-' + name);
  if (panel) panel.style.display = 'block';
  if (btn) btn.classList.add('nav-item--active');
}

// ── Load all fields ──
function loadAll() {
  var cfg = getConfig();
  // Links
  document.getElementById('lnk_whatsapp').value   = cfg.links.whatsapp_geral || '';
  document.getElementById('lnk_contratos').value   = cfg.links.contratos      || '';
  document.getElementById('lnk_comunicados').value = cfg.links.comunicados    || '';
  document.getElementById('lnk_central').value     = cfg.links.central        || '';
  // Banners
  document.getElementById('bn_slide1').value = cfg.banners.slide1 || '';
  document.getElementById('bn_slide2').value = cfg.banners.slide2 || '';
  document.getElementById('bn_slide3').value = cfg.banners.slide3 || '';

  var files = getBannerFiles();
  _bannerFiles = {
    slide1:   files.slide1   || null,
    slide2:   files.slide2   || null,
    slide3:   files.slide3   || null,
    historia: files.historia || null
  };
  [1, 2, 3].forEach(function (n) {
    var key = 'slide' + n;
    var fileData = _bannerFiles[key];
    if (fileData) {
      setBannerFileInfo(n, 'Arquivo salvo', fileData);
    } else {
      var url = cfg.banners['slide' + n] || '';
      previewBannerUrl(n, url);
    }
  });
  // Historia photo
  if (_bannerFiles.historia) {
    setBannerFileInfo('historia', 'Arquivo salvo', _bannerFiles.historia);
  } else {
    previewBannerUrl('historia', cfg.banners.historia || '');
    document.getElementById('bn_historia').value = cfg.banners.historia || '';
  }

  // Cidades
  buildCidadesTable(cfg);
  buildCidadesSelect(cfg);
}

// ── Save Links ──
function saveLinks() {
  var cfg = getConfig();
  cfg.links.whatsapp_geral = document.getElementById('lnk_whatsapp').value.trim();
  cfg.links.contratos      = document.getElementById('lnk_contratos').value.trim();
  cfg.links.comunicados    = document.getElementById('lnk_comunicados').value.trim();
  cfg.links.central        = document.getElementById('lnk_central').value.trim();
  saveConfig(cfg);
  toast('Links salvos com sucesso!', 'success');
}

function resetLinks() {
  var cfg = getConfig();
  cfg.links = JSON.parse(JSON.stringify(DEFAULT_CFG.links));
  saveConfig(cfg);
  loadAll();
  toast('Links restaurados para o padrão.', 'success');
}

// ── Banners ──
function previewBannerUrl(n, url) {
  var el = document.getElementById('preview' + n);
  if (!el) return;
  var fileKey = (n === 'historia') ? 'historia' : 'slide' + n;
  if (_bannerFiles[fileKey]) return; // file takes priority
  if (url && (url.startsWith('http') || url.startsWith('data:'))) {
    el.innerHTML = '<img src="' + url + '" alt="preview" onerror="this.parentElement.innerHTML=\'<span style=&quot;color:#c62828;font-size:12px;padding:8px;display:block&quot;>Imagem não encontrada</span>\'" />';
  } else {
    el.innerHTML = '';
  }
}

function clearBannerUrl(n) {
  var inputId = (n === 'historia') ? 'bn_historia' : 'bn_slide' + n;
  document.getElementById(inputId).value = '';
  var fileKey = (n === 'historia') ? 'historia' : 'slide' + n;
  if (!_bannerFiles[fileKey]) {
    document.getElementById('preview' + n).innerHTML = '';
  }
}

function handleBannerFile(n, input) {
  var file = input.files[0];
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) {
    toast('Arquivo muito grande (máx. 3MB). Comprima a imagem antes de enviar.', 'error');
    input.value = '';
    return;
  }
  var fileKey = (n === 'historia') ? 'historia' : 'slide' + n;
  var reader = new FileReader();
  reader.onload = function (evt) {
    var dataUrl = evt.target.result;
    _bannerFiles[fileKey] = dataUrl;
    setBannerFileInfo(n, file.name + ' (' + (file.size / 1024).toFixed(0) + ' KB)', dataUrl);
  };
  reader.readAsDataURL(file);
}

function setBannerFileInfo(n, label, dataUrl) {
  var suffix = (n === 'historia') ? '_historia' : n;
  var info    = document.getElementById('bn_file' + suffix + '_info');
  var clearBtn = document.getElementById('bn_file' + suffix + '_clear');
  if (info) info.textContent = label;
  if (clearBtn) clearBtn.style.display = 'inline-flex';
  var preview = document.getElementById('preview' + n);
  if (preview) preview.innerHTML = '<img src="' + dataUrl + '" alt="preview" />';
}

function clearBannerFile(n) {
  var fileKey = (n === 'historia') ? 'historia' : 'slide' + n;
  _bannerFiles[fileKey] = null;
  var suffix = (n === 'historia') ? '_historia' : n;
  var fileInput = document.getElementById('bn_file' + suffix);
  if (fileInput) fileInput.value = '';
  var info = document.getElementById('bn_file' + suffix + '_info');
  var clearBtn = document.getElementById('bn_file' + suffix + '_clear');
  if (info) info.textContent = '';
  if (clearBtn) clearBtn.style.display = 'none';
  var urlInputId = (n === 'historia') ? 'bn_historia' : 'bn_slide' + n;
  var url = document.getElementById(urlInputId).value.trim();
  var preview = document.getElementById('preview' + n);
  if (preview) {
    preview.innerHTML = url ? '<img src="' + url + '" alt="preview" />' : '';
  }
}

function saveBanners() {
  var cfg = getConfig();
  cfg.banners.slide1   = document.getElementById('bn_slide1').value.trim();
  cfg.banners.slide2   = document.getElementById('bn_slide2').value.trim();
  cfg.banners.slide3   = document.getElementById('bn_slide3').value.trim();
  cfg.banners.historia = document.getElementById('bn_historia').value.trim();
  saveConfig(cfg);

  var files = getBannerFiles();
  ['slide1', 'slide2', 'slide3', 'historia'].forEach(function (key) {
    if (_bannerFiles[key] !== null) {
      if (_bannerFiles[key]) {
        files[key] = _bannerFiles[key];
      } else {
        delete files[key];
      }
    }
  });
  try {
    localStorage.setItem(BANNERS_KEY, JSON.stringify(files));
    toast('Banners salvos! As páginas do site usarão as novas imagens.', 'success');
  } catch (ex) {
    toast('Erro ao salvar: armazenamento cheio. Tente imagens menores ou use URL.', 'error');
  }
}

function clearAllBanners() {
  ['bn_slide1','bn_slide2','bn_slide3','bn_historia'].forEach(function (id) {
    document.getElementById(id).value = '';
  });
  [1, 2, 3, 'historia'].forEach(function (n) {
    var key = (n === 'historia') ? 'historia' : 'slide' + n;
    _bannerFiles[key] = null;
    clearBannerFile(n);
  });
  var cfg = getConfig();
  cfg.banners = { slide1: '', slide2: '', slide3: '', historia: '' };
  saveConfig(cfg);
  localStorage.removeItem(BANNERS_KEY);
  toast('Banners limpos. Páginas voltarão ao padrão.', 'success');
}

// ── Cidades ──
function buildCidadesTable(cfg) {
  var body = document.getElementById('cidadesBody');
  body.innerHTML = '';
  // Merge default + saved cities, show all
  var allCities = {};
  Object.keys(DEFAULT_CFG.cidades).forEach(function (c) { allCities[c] = true; });
  if (cfg.cidades) Object.keys(cfg.cidades).forEach(function (c) { allCities[c] = true; });

  Object.keys(allCities).forEach(function (city) {
    var saved   = cfg.cidades && cfg.cidades[city] ? cfg.cidades[city] : {};
    if (saved._removed) return; // skip cities marked as removed
    var def     = DEFAULT_CFG.cidades[city] || {};
    var wa      = saved.whatsapp || def.whatsapp || 'https://wa.me/557336136407';
    var ativo   = (saved.ativo !== undefined) ? saved.ativo : (def.ativo !== false);
    var isDefault = !!DEFAULT_CFG.cidades[city];
    var chkId   = 'ativo_' + city.replace(/\s/g, '_');
    var row = document.createElement('tr');
    row.dataset.city = city;
    row.innerHTML =
      '<td class="city-name">' + city + (isDefault ? '' : ' <span class="city-tag">nova</span>') + '</td>' +
      '<td><input type="text" data-city="' + city + '" data-field="whatsapp" value="' + wa + '" placeholder="https://wa.me/55..." /></td>' +
      '<td><label class="toggle"><input type="checkbox" id="' + chkId + '" data-city="' + city + '" data-field="ativo"' + (ativo ? ' checked' : '') + '><span class="toggle-slider"></span></label></td>' +
      '<td><button onclick="removeCity(\'' + city.replace(/'/g, "\\'") + '\')" class="btn-icon city-remove-btn" title="Remover cidade">✕</button></td>';
    body.appendChild(row);
  });
}

function addCity() {
  var nameInput = document.getElementById('novaCidade');
  var waInput   = document.getElementById('novaCidadeWA');
  var name = nameInput.value.trim();
  var wa   = waInput.value.trim() || 'https://wa.me/557336136407';
  if (!name) { toast('Digite o nome da cidade.', 'error'); return; }

  // Check for duplicate
  var existing = document.querySelector('#cidadesBody tr[data-city="' + name + '"]');
  if (existing) { toast('Cidade já existe na lista.', 'error'); return; }

  var cfg = getConfig();
  if (!cfg.cidades) cfg.cidades = {};
  cfg.cidades[name] = { whatsapp: wa, ativo: true };
  saveConfig(cfg);
  buildCidadesTable(cfg);
  buildCidadesSelect(cfg);
  nameInput.value = '';
  waInput.value   = '';
  toast('Cidade "' + name + '" adicionada!', 'success');
}

function removeCity(city) {
  var cfg = getConfig();
  if (!cfg.cidades) cfg.cidades = {};
  // Mark as removed so it doesn't reappear on reload
  cfg.cidades[city] = { _removed: true };
  saveConfig(cfg);
  var row = document.querySelector('#cidadesBody tr[data-city="' + city + '"]');
  if (row) row.remove();
  buildCidadesSelect(cfg);
  toast('Cidade "' + city + '" removida.', 'success');
}

function saveCidades() {
  var cfg = getConfig();
  if (!cfg.cidades) cfg.cidades = {};

  // Collect current table rows
  document.querySelectorAll('#cidadesBody tr[data-city]').forEach(function (row) {
    var city = row.dataset.city;
    if (!cfg.cidades[city]) cfg.cidades[city] = {};
    row.querySelectorAll('input[data-field]').forEach(function (el) {
      var field = el.dataset.field;
      if (field === 'ativo') {
        cfg.cidades[city].ativo = el.checked;
      } else {
        cfg.cidades[city][field] = el.value.trim();
      }
    });
  });

  // Remove cities no longer in the table
  var visibleCities = {};
  document.querySelectorAll('#cidadesBody tr[data-city]').forEach(function (r) { visibleCities[r.dataset.city] = true; });
  Object.keys(cfg.cidades).forEach(function (c) {
    if (!visibleCities[c]) delete cfg.cidades[c];
  });

  saveConfig(cfg);
  buildCidadesSelect(cfg);
  toast('Configuração de cidades salva!', 'success');
}

function resetCidades() {
  var cfg = getConfig();
  cfg.cidades = JSON.parse(JSON.stringify(DEFAULT_CFG.cidades));
  saveConfig(cfg);
  buildCidadesTable(cfg);
  buildCidadesSelect(cfg);
  toast('Cidades restauradas para o padrão.', 'success');
}

// ── Planos ──
function buildCidadesSelect(cfg) {
  var sel = document.getElementById('planos_cidade');
  var prev = sel.value;
  sel.innerHTML = '<option value="">— Selecione uma cidade —</option>';
  var all = {};
  Object.keys(DEFAULT_CFG.cidades).forEach(function (c) { all[c] = true; });
  if (cfg && cfg.cidades) Object.keys(cfg.cidades).forEach(function (c) { all[c] = true; });
  Object.keys(all).forEach(function (city) {
    var saved = cfg && cfg.cidades && cfg.cidades[city];
    if (saved && saved._removed) return; // skip removed cities
    var opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    if (city === prev) opt.selected = true;
    sel.appendChild(opt);
  });
}

function loadCityPlans(city) {
  var editor = document.getElementById('planos_editor');
  if (!city) { editor.style.display = 'none'; return; }
  editor.style.display = 'block';

  var cfg = getConfig();
  var cidadeCfg = (cfg.cidades && cfg.cidades[city]) || {};
  var vocePlans        = cidadeCfg.planosVoce          || JSON.parse(JSON.stringify(DEFAULT_VOCE_PLANS));
  var empresasFibraPlans = cidadeCfg.planosEmpresasFibra || JSON.parse(JSON.stringify(DEFAULT_EMPRESAS_PRICE_PLANS));
  var empresasPlans    = cidadeCfg.planosEmpresas      || JSON.parse(JSON.stringify(DEFAULT_EMPRESAS_PLANS));

  buildVocePlansList(vocePlans);
  buildEmpresasFibraPlansList(empresasFibraPlans);
  buildEmpresasPlansList(empresasPlans);
}

function buildVocePlansList(plans) {
  var list = document.getElementById('voce_plans_list');
  list.innerHTML = '';
  plans.forEach(function (plan, i) {
    list.appendChild(buildVocePlanCard(plan, i));
  });
}

function buildEmpresasFibraPlansList(plans) {
  var list = document.getElementById('empresas_fibra_plans_list');
  list.innerHTML = '';
  plans.forEach(function (plan, i) {
    list.appendChild(buildEmpresasFibraPlanCard(plan, i));
  });
}

function buildEmpresasPlansList(plans) {
  var list = document.getElementById('empresas_plans_list');
  list.innerHTML = '';
  plans.forEach(function (plan, i) {
    list.appendChild(buildEmpresasPlanCard(plan, i));
  });
}

function buildVocePlanCard(plan, idx) {
  var allApps = [
    { key: 'bebanca',      label: 'BeBanca'      },
    { key: 'BiblioTechie', label: 'BiblioTechie' },
    { key: 'Deezer',       label: 'Deezer'        },
    { key: 'Yplay',        label: 'Yplay'         }
  ];
  var appsHtml = allApps.map(function (app) {
    var checked = (plan.apps || []).indexOf(app.key) !== -1 ? ' checked' : '';
    return '<label class="app-check"><input type="checkbox" data-app="' + app.key + '"' + checked + '> ' + app.label + '</label>';
  }).join('');

  var div = document.createElement('div');
  div.className = 'plan-editor';
  div.dataset.type = 'voce';
  div.dataset.idx = idx;
  div.innerHTML =
    '<div class="plan-editor__header">' +
      '<span class="plan-editor__title">' + (plan.nome || 'Novo Plano') + '</span>' +
      '<button onclick="removePlanCard(this)" class="btn-icon plan-editor__remove" title="Remover plano">✕</button>' +
    '</div>' +
    '<div class="plan-editor__body">' +
      '<div class="plan-editor__row">' +
        '<div class="plan-editor__field">' +
          '<label>Nome do Plano</label>' +
          '<input type="text" data-field="nome" value="' + esc(plan.nome || '') + '" oninput="this.closest(\'.plan-editor\').querySelector(\'.plan-editor__title\').textContent=this.value||\'Novo Plano\'" />' +
        '</div>' +
        '<div class="plan-editor__field plan-editor__field--sm">' +
          '<label>Velocidade (MEGAS)</label>' +
          '<input type="text" data-field="velocidade" value="' + esc(plan.velocidade || '') + '" placeholder="500" />' +
        '</div>' +
        '<div class="plan-editor__field plan-editor__field--sm">' +
          '<label>Preço (R$)</label>' +
          '<input type="text" data-field="preco" value="' + esc(plan.preco || '') + '" placeholder="99,90" />' +
        '</div>' +
      '</div>' +
      '<div class="plan-editor__row plan-editor__row--check">' +
        '<label class="popular-check"><input type="checkbox" data-field="popular"' + (plan.popular ? ' checked' : '') + '> Marcar como Mais Popular</label>' +
      '</div>' +
      '<div class="plan-editor__field" style="margin-top:10px">' +
        '<label>Apps Incluídos</label>' +
        '<div class="apps-checks">' + appsHtml + '</div>' +
      '</div>' +
      '<div class="plan-editor__field" style="margin-top:10px">' +
        '<label>Benefícios (um por linha)</label>' +
        '<textarea data-field="features" rows="4" placeholder="Instalação Gratis&#10;Wifi Gratis">' + esc((plan.features || []).join('\n')) + '</textarea>' +
      '</div>' +
    '</div>';
  return div;
}

function buildEmpresasFibraPlanCard(plan, idx) {
  var div = document.createElement('div');
  div.className = 'plan-editor';
  div.dataset.type = 'empresas-fibra';
  div.dataset.idx = idx;
  div.innerHTML =
    '<div class="plan-editor__header">' +
      '<span class="plan-editor__title">' + (plan.nome || 'Novo Plano') + '</span>' +
      '<button onclick="removePlanCard(this)" class="btn-icon plan-editor__remove" title="Remover plano">✕</button>' +
    '</div>' +
    '<div class="plan-editor__body">' +
      '<div class="plan-editor__row">' +
        '<div class="plan-editor__field">' +
          '<label>Nome do Plano</label>' +
          '<input type="text" data-field="nome" value="' + esc(plan.nome || '') + '" oninput="this.closest(\'.plan-editor\').querySelector(\'.plan-editor__title\').textContent=this.value||\'Novo Plano\'" />' +
        '</div>' +
        '<div class="plan-editor__field plan-editor__field--sm">' +
          '<label>Velocidade (MEGAS)</label>' +
          '<input type="text" data-field="velocidade" value="' + esc(plan.velocidade || '') + '" placeholder="500" />' +
        '</div>' +
      '</div>' +
      '<div class="plan-editor__row">' +
        '<div class="plan-editor__field plan-editor__field--sm">' +
          '<label>Preço Antigo (R$) — riscado</label>' +
          '<input type="text" data-field="precoAntigo" value="' + esc(plan.precoAntigo || '') + '" placeholder="149,90" />' +
        '</div>' +
        '<div class="plan-editor__field plan-editor__field--sm">' +
          '<label>Preço Atual (R$)</label>' +
          '<input type="text" data-field="preco" value="' + esc(plan.preco || '') + '" placeholder="129,90" />' +
        '</div>' +
      '</div>' +
      '<div class="plan-editor__row plan-editor__row--check">' +
        '<label class="popular-check"><input type="checkbox" data-field="popular"' + (plan.popular ? ' checked' : '') + '> Marcar como Mais Popular</label>' +
      '</div>' +
      '<div class="plan-editor__field" style="margin-top:10px">' +
        '<label>Benefícios (um por linha)</label>' +
        '<textarea data-field="features" rows="3" placeholder="Instalação Gratis para contratos de 1 ano">' + esc((plan.features || []).join('\n')) + '</textarea>' +
      '</div>' +
    '</div>';
  return div;
}

function buildEmpresasPlanCard(plan, idx) {
  var div = document.createElement('div');
  div.className = 'plan-editor';
  div.dataset.type = 'empresas';
  div.dataset.idx = idx;
  div.innerHTML =
    '<div class="plan-editor__header">' +
      '<span class="plan-editor__title">' + (plan.nome || 'Novo Plano') + '</span>' +
      '<button onclick="removePlanCard(this)" class="btn-icon plan-editor__remove" title="Remover plano">✕</button>' +
    '</div>' +
    '<div class="plan-editor__body">' +
      '<div class="plan-editor__field">' +
        '<label>Nome do Plano</label>' +
        '<input type="text" data-field="nome" value="' + esc(plan.nome || '') + '" oninput="this.closest(\'.plan-editor\').querySelector(\'.plan-editor__title\').textContent=this.value||\'Novo Plano\'" />' +
      '</div>' +
      '<div class="plan-editor__field" style="margin-top:10px">' +
        '<label>Benefícios (um por linha)</label>' +
        '<textarea data-field="features" rows="5" placeholder="Conexão Exclusiva e Dedicada&#10;Garantia de SLA">' + esc((plan.features || []).join('\n')) + '</textarea>' +
      '</div>' +
    '</div>';
  return div;
}

function removePlanCard(btn) {
  var card = btn.closest('.plan-editor');
  if (card) card.remove();
}

function addVocePlan() {
  var list = document.getElementById('voce_plans_list');
  var idx = list.querySelectorAll('.plan-editor').length;
  list.appendChild(buildVocePlanCard({ nome: '', velocidade: '500', preco: '99,90', popular: false, apps: [], features: [] }, idx));
}

function addEmpresasFibraPlan() {
  var list = document.getElementById('empresas_fibra_plans_list');
  var idx = list.querySelectorAll('.plan-editor').length;
  list.appendChild(buildEmpresasFibraPlanCard({ nome: '', velocidade: '500', precoAntigo: '', preco: '149,90', popular: false, features: ['Instalação Gratis para contratos de 1 ano'] }, idx));
}

function addEmpresasPlan() {
  var list = document.getElementById('empresas_plans_list');
  var idx = list.querySelectorAll('.plan-editor').length;
  list.appendChild(buildEmpresasPlanCard({ nome: '', features: [] }, idx));
}

function collectVocePlans() {
  var plans = [];
  document.querySelectorAll('#voce_plans_list .plan-editor').forEach(function (card) {
    var get = function (f) {
      var el = card.querySelector('[data-field="' + f + '"]');
      return el ? el.value.trim() : '';
    };
    var popular = card.querySelector('[data-field="popular"]');
    var apps = [];
    card.querySelectorAll('[data-app]').forEach(function (cb) {
      if (cb.checked) apps.push(cb.dataset.app);
    });
    var featuresRaw = get('features');
    var features = featuresRaw ? featuresRaw.split('\n').map(function (l) { return l.trim(); }).filter(Boolean) : [];
    plans.push({
      nome: get('nome'),
      velocidade: get('velocidade'),
      preco: get('preco'),
      popular: popular ? popular.checked : false,
      apps: apps,
      features: features
    });
  });
  return plans;
}

function collectEmpresasFibraPlans() {
  var plans = [];
  document.querySelectorAll('#empresas_fibra_plans_list .plan-editor').forEach(function (card) {
    var get = function (f) { var el = card.querySelector('[data-field="' + f + '"]'); return el ? el.value.trim() : ''; };
    var popular = card.querySelector('[data-field="popular"]');
    var featsEl = card.querySelector('[data-field="features"]');
    var features = featsEl ? featsEl.value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean) : [];
    plans.push({ nome: get('nome'), velocidade: get('velocidade'), precoAntigo: get('precoAntigo'), preco: get('preco'), popular: popular ? popular.checked : false, features: features });
  });
  return plans;
}

function collectEmpresasPlans() {
  var plans = [];
  document.querySelectorAll('#empresas_plans_list .plan-editor').forEach(function (card) {
    var nome = card.querySelector('[data-field="nome"]');
    var featsEl = card.querySelector('[data-field="features"]');
    var features = featsEl ? featsEl.value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean) : [];
    plans.push({ nome: nome ? nome.value.trim() : '', features: features });
  });
  return plans;
}

function savePlanos() {
  var city = document.getElementById('planos_cidade').value;
  if (!city) { toast('Selecione uma cidade primeiro.', 'error'); return; }
  var cfg = getConfig();
  if (!cfg.cidades) cfg.cidades = {};
  if (!cfg.cidades[city]) cfg.cidades[city] = {};
  cfg.cidades[city].planosVoce          = collectVocePlans();
  cfg.cidades[city].planosEmpresasFibra = collectEmpresasFibraPlans();
  cfg.cidades[city].planosEmpresas      = collectEmpresasPlans();
  saveConfig(cfg);
  toast('Planos de ' + city + ' salvos!', 'success');
}

function resetCityPlanos() {
  var city = document.getElementById('planos_cidade').value;
  if (!city) { toast('Selecione uma cidade primeiro.', 'error'); return; }
  var cfg = getConfig();
  if (cfg.cidades && cfg.cidades[city]) {
    delete cfg.cidades[city].planosVoce;
    delete cfg.cidades[city].planosEmpresasFibra;
    delete cfg.cidades[city].planosEmpresas;
    saveConfig(cfg);
  }
  buildVocePlansList(JSON.parse(JSON.stringify(DEFAULT_VOCE_PLANS)));
  buildEmpresasFibraPlansList(JSON.parse(JSON.stringify(DEFAULT_EMPRESAS_PRICE_PLANS)));
  buildEmpresasPlansList(JSON.parse(JSON.stringify(DEFAULT_EMPRESAS_PLANS)));
  toast('Planos de ' + city + ' redefinidos para o padrão do site.', 'success');
}

// ── Change Password ──
function changeSenha() {
  var atual   = document.getElementById('passAtual').value;
  var nova    = document.getElementById('passNova').value;
  var confirm = document.getElementById('passConfirm').value;
  var stored  = localStorage.getItem(PASS_KEY) || DEFAULT_PASS;

  if (btoa(atual) !== stored) { toast('Senha atual incorreta.', 'error'); return; }
  if (!nova || nova.length < 6) { toast('A nova senha deve ter ao menos 6 caracteres.', 'error'); return; }
  if (nova !== confirm) { toast('As senhas não coincidem.', 'error'); return; }

  localStorage.setItem(PASS_KEY, btoa(nova));
  document.getElementById('passAtual').value = '';
  document.getElementById('passNova').value = '';
  document.getElementById('passConfirm').value = '';
  toast('Senha alterada com sucesso!', 'success');
}

// ── Toast ──
function toast(msg, type) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (type ? ' toast--' + type : '');
  clearTimeout(el._t);
  el._t = setTimeout(function () { el.classList.remove('show'); }, 3200);
}

// ── Helpers ──
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
