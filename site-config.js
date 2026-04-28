(function () {
  var DEFAULTS = {
    links: {
      whatsapp_geral: 'https://wa.me/557336136407',
      contratos: 'https://storage.googleapis.com/wordpress_content/sites/52/2024/07/CONTRATO-DE-PRESTACAO-DE-SERVCO-DE-TELECOMUNICACOES-.pdf',
      comunicados: 'https://storage.googleapis.com/wordpress_content/sites/52/2025/11/COMUNICADO-CLIENTE-MAIS-CONECTIVIDADE.pdf',
      central: 'https://central.sigaonmais.com.br/central_assinante_web/'
    },
    banners: { slide1: '', slide2: '', slide3: '' },
    cidades: {}
  };

  var VOCE_ASSETS = {
    checkIcon:     'https://www.figma.com/api/mcp/asset/6c9d3956-30c6-4586-8b0c-725597b0a264',
    dividerLight:  'https://www.figma.com/api/mcp/asset/46559e35-d4d5-442a-80d4-58d506aabb34',
    dividerPopular:'https://www.figma.com/api/mcp/asset/3ec0ef41-3d82-4afa-a35c-bfd0fee9acde',
    btnBg:         'https://www.figma.com/api/mcp/asset/395ad4c4-1694-44de-9e72-6dd14b16fd82',
    popularBg:     'https://www.figma.com/api/mcp/asset/6440a0d0-8c95-4003-9455-4ed8e49a1cc0',
    apps: {
      bebanca:     'https://www.figma.com/api/mcp/asset/419e6e4c-fcc0-434f-9042-f31f9b833813',
      BiblioTechie:'https://www.figma.com/api/mcp/asset/0513ba2d-32b8-4ffa-8869-ac58a40a1692',
      Yplay:       'https://www.figma.com/api/mcp/asset/d6193f66-4de5-437d-9640-999370447260',
      Deezer:      'https://www.figma.com/api/mcp/asset/45674e75-61d3-49b1-b1b4-6e58902ce273'
    }
  };

  var EMPRESAS_ASSETS = {
    cardBg:  'https://www.figma.com/api/mcp/asset/47412d52-816d-4372-8806-c4d0e55c64c3',
    check:   'https://www.figma.com/api/mcp/asset/158be7a8-c6d5-499c-a1d8-6f84af0b12f2',
    btnBg:   'https://www.figma.com/api/mcp/asset/84eebd0c-26f6-4823-9816-36fa47c51b6d'
  };

  var EPRICEPLAN_ASSETS = {
    popularBg: 'https://www.figma.com/api/mcp/asset/fdce88af-63c8-459e-8bc8-3c83110742d5',
    checkIcon: 'https://www.figma.com/api/mcp/asset/e5c25c96-7d3a-4a9f-b33e-863ac82d5d59',
    btnBg:     'https://www.figma.com/api/mcp/asset/aef57ce0-1005-4092-a882-1102c5d2ae8c',
    waIcon:    'https://www.figma.com/api/mcp/asset/103adb64-cad9-4bd2-8c45-755938428df5',
    divider:   'https://www.figma.com/api/mcp/asset/463b6933-f5f3-4226-9951-50f95f4867df'
  };

  var DEFAULT_VOCE_PLANS = [
    { nome: '500 MEGAS+ TV',     velocidade: '500', preco: '99,90',  popular: false, apps: ['bebanca','BiblioTechie','Yplay'],        features: ['Instalação Gratis','Wifi Gratis'] },
    { nome: '500 MEGA + DEEZER', velocidade: '500', preco: '99,90',  popular: true,  apps: ['bebanca','BiblioTechie','Deezer','Yplay'], features: ['Instalação Gratis','Wifi Gratis'] },
    { nome: '600 MEGA TOP',      velocidade: '600', preco: '129,90', popular: false, apps: ['bebanca','BiblioTechie','Yplay','Deezer'], features: ['Instalação Gratis','Wifi Gratis'] },
    { nome: '500 MEGA TOP',      velocidade: '500', preco: '119,90', popular: false, apps: [],                                         features: ['Instalação Gratis','Wifi Gratis'] }
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

  function deepMerge(base, over) {
    var r = {};
    Object.keys(base).forEach(function (k) { r[k] = base[k]; });
    Object.keys(over).forEach(function (k) {
      if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && typeof over[k] === 'object') {
        r[k] = deepMerge(base[k], over[k]);
      } else {
        r[k] = over[k];
      }
    });
    return r;
  }

  function getConfig() {
    try {
      var raw = localStorage.getItem('sigaon_config');
      if (raw) return deepMerge(DEFAULTS, JSON.parse(raw));
    } catch (e) {}
    return DEFAULTS;
  }

  function renderVocePlans(plans, track) {
    track.innerHTML = '';
    plans.forEach(function (plan) {
      var isPopular = !!plan.popular;
      var divider = isPopular ? VOCE_ASSETS.dividerPopular : VOCE_ASSETS.dividerLight;
      var appImgs = (plan.apps || []).map(function (a) {
        return VOCE_ASSETS.apps[a]
          ? '<img src="' + VOCE_ASSETS.apps[a] + '" alt="' + a + '" />'
          : '';
      }).join('');
      var features = (plan.features || []).map(function (f) {
        return '<div class="plan-card__feature">' +
          '<img src="' + VOCE_ASSETS.checkIcon + '" alt="✓" />' +
          '<span>' + f + '</span></div>';
      }).join('');
      var btn = '<a href="#" onclick="openWA(event,\'' + plan.nome.replace(/'/g, "\\'") + '\')" class="plan-card__btn">' +
        '<img src="' + VOCE_ASSETS.btnBg + '" alt="" />' +
        '<span>Contratar Agora!</span></a>';
      var logos = '<div class="plan-card__logos">' + appImgs + '</div>';
      var dividerHtml = '<div class="plan-card__divider"><img src="' + divider + '" alt="" /></div>';

      var html;
      if (isPopular) {
        html = '<div class="plan-card plan-card--popular">' +
          '<div class="plan-card__popular-badge">Mais Popular</div>' +
          '<div class="plan-card__top">' +
            '<span class="plan-card__type plan-card__type--white">Internet Fibra</span>' +
            '<span class="plan-card__name plan-card__name--white">' + plan.nome + '</span>' +
            '<div class="plan-card__speed plan-card__speed--white">' +
              '<span class="plan-card__speed-num">' + plan.velocidade + '</span>' +
              '<span class="plan-card__speed-unit">MEGAS</span></div>' +
            '<div class="plan-card__price plan-card__price--white">' +
              '<span class="plan-card__currency">R$</span>' +
              '<span class="plan-card__value">' + plan.preco + '</span>' +
              '<span class="plan-card__period">/mês</span></div>' +
          '</div>' +
          '<div class="plan-card__inner plan-card__inner--bottom">' +
            logos + dividerHtml + features + btn +
          '</div>' +
          '<img src="' + VOCE_ASSETS.popularBg + '" alt="" class="plan-card__popular-bg" />' +
          '</div>';
      } else {
        html = '<div class="plan-card plan-card--light">' +
          '<div class="plan-card__inner">' +
            '<span class="plan-card__type">Internet Fibra</span>' +
            '<span class="plan-card__name">' + plan.nome + '</span>' +
            '<div class="plan-card__speed">' +
              '<span class="plan-card__speed-num">' + plan.velocidade + '</span>' +
              '<span class="plan-card__speed-unit">MEGAS</span></div>' +
            '<div class="plan-card__price">' +
              '<span class="plan-card__currency">R$</span>' +
              '<span class="plan-card__value">' + plan.preco + '</span>' +
              '<span class="plan-card__period">/mês</span></div>' +
            logos + dividerHtml + features + btn +
          '</div></div>';
      }
      track.insertAdjacentHTML('beforeend', html);
    });
  }

  function renderEmpresasPlans(plans, track) {
    track.innerHTML = '';
    plans.forEach(function (plan) {
      var features = (plan.features || []).map(function (f) {
        return '<div class="eplan-card__feature">' +
          '<img src="' + EMPRESAS_ASSETS.check + '" alt="✓" />' +
          '<span>' + f + '</span></div>';
      }).join('');
      var nomeSafe = plan.nome.replace(/'/g, "\\'");
      var html = '<div class="eplan-card">' +
        '<div class="eplan-card__bg"><img src="' + EMPRESAS_ASSETS.cardBg + '" alt="" /></div>' +
        '<div class="eplan-card__badge">Empresárial</div>' +
        '<div class="eplan-card__header"><h3>' + plan.nome + '</h3></div>' +
        '<div class="eplan-card__body">' +
          '<div class="eplan-card__features">' + features + '</div>' +
          '<div class="eplan-card__actions">' +
            '<a href="#" onclick="openWA(event, \'' + nomeSafe + '\')" class="eplan-card__btn">' +
              '<img src="' + EMPRESAS_ASSETS.btnBg + '" alt="" class="eplan-card__btn-bg" />' +
              '<span>Contratar via Whatsapp!</span>' +
            '</a>' +
            '<span class="eplan-card__all-benefits">CONFERIR TODOS OS BENEFÍCIOS</span>' +
          '</div>' +
        '</div></div>';
      track.insertAdjacentHTML('beforeend', html);
    });
  }

  function renderEmpresasPricePlans(plans, track) {
    track.innerHTML = '';
    plans.forEach(function (plan) {
      var isPopular = !!plan.popular;
      var feature = (plan.features && plan.features[0]) ? plan.features[0] : 'Instalação Gratis para contratos de 1 ano';
      var oldPriceHtml = plan.precoAntigo
        ? '<div class="epc-card__old-price' + (isPopular ? ' epc-card__old-price--white' : '') + '">R$' + plan.precoAntigo + '/MÊS</div>'
        : '';
      var dividerHtml = !isPopular
        ? '<div class="epc-card__divider"><img src="' + EPRICEPLAN_ASSETS.divider + '" alt="" /></div>'
        : '';
      var featureHtml = '<div class="epc-card__feature"><img src="' + EPRICEPLAN_ASSETS.checkIcon + '" alt="✓" /><span>' + feature + '</span></div>';
      var nomeSafe = plan.nome.replace(/'/g, "\\'");
      var btn = '<a href="#" onclick="openWA(event,\'' + nomeSafe + '\')" class="epc-card__btn">' +
        '<img src="' + EPRICEPLAN_ASSETS.btnBg + '" alt="" class="epc-card__btn-bg" />' +
        '<img src="' + EPRICEPLAN_ASSETS.waIcon + '" alt="" class="epc-card__btn-icon" />' +
        '<span>Contratar Agora!</span></a>';
      var actions = '<div class="epc-card__actions">' + btn + '<span class="epc-card__all-benefits">CONFERIR TODOS OS BENEFÍCIOS</span></div>';

      var html;
      if (isPopular) {
        html = '<div class="epc-card epc-card--popular">' +
          '<div class="epc-card__popular-bg"><img src="' + EPRICEPLAN_ASSETS.popularBg + '" alt="" /></div>' +
          '<div class="epc-card__popular-badge">Mais Popular</div>' +
          '<div class="epc-card__top">' +
            '<span class="epc-card__type epc-card__type--white">Internet Fibra</span>' +
            '<div class="epc-card__speed epc-card__speed--white">' +
              '<span class="epc-card__speed-num">' + plan.velocidade + '</span>' +
              '<span class="epc-card__speed-unit">MEGAS</span></div>' +
            oldPriceHtml +
            '<div class="epc-card__price epc-card__price--white">' +
              '<span class="epc-card__currency">R$</span>' +
              '<span class="epc-card__value">' + plan.preco + '</span>' +
              '<span class="epc-card__period">/mês</span></div>' +
          '</div>' +
          '<div class="epc-card__bottom">' + featureHtml + actions + '</div>' +
          '</div>';
      } else {
        html = '<div class="epc-card">' +
          '<div class="epc-card__inner">' +
            '<div class="epc-card__info">' +
              '<span class="epc-card__type">Internet Fibra</span>' +
              '<div class="epc-card__speed">' +
                '<span class="epc-card__speed-num">' + plan.velocidade + '</span>' +
                '<span class="epc-card__speed-unit">MEGAS</span></div>' +
              oldPriceHtml +
              '<div class="epc-card__price">' +
                '<span class="epc-card__currency">R$</span>' +
                '<span class="epc-card__value">' + plan.preco + '</span>' +
                '<span class="epc-card__period">/mês</span></div>' +
              dividerHtml + featureHtml +
            '</div>' +
            actions +
          '</div>' +
          '<div class="epc-card__border"></div>' +
          '</div>';
      }
      track.insertAdjacentHTML('beforeend', html);
    });
  }

  window.getSigaConfig = getConfig;
  window.renderVocePlans = renderVocePlans;
  window.renderEmpresasPlans = renderEmpresasPlans;
  window.renderEmpresasPricePlans = renderEmpresasPricePlans;

  document.addEventListener('DOMContentLoaded', function () {
    var cfg = getConfig();

    // Central do cliente
    document.querySelectorAll('a.topbar__assinante').forEach(function (el) {
      if (cfg.links.central) el.href = cfg.links.central;
    });

    // Footer links
    document.querySelectorAll('.footer__info a').forEach(function (el) {
      var t = el.textContent.trim();
      if (t === 'Contratos' && cfg.links.contratos) {
        el.href = cfg.links.contratos; el.target = '_blank'; el.rel = 'noopener';
      }
      if (t === 'Comunicados' && cfg.links.comunicados) {
        el.href = cfg.links.comunicados; el.target = '_blank'; el.rel = 'noopener';
      }
    });

    // Banner sync
    var b = cfg.banners;
    var filesRaw = localStorage.getItem('sigaon_banners_files');
    var files = {};
    try { if (filesRaw) files = JSON.parse(filesRaw); } catch (e) {}

    var slide1 = files.slide1 || b.slide1 || '';

    // All pages now use .sobre-hero__slide or .atend-hero__slide — sync slide1 everywhere
    if (slide1) {
      document.querySelectorAll('.sobre-hero__slide img, .atend-hero__slide img').forEach(function (img) {
        img.src = slide1;
      });
    }

    // Historia photo (sobre nós)
    var historiaUrl = files.historia || b.historia || '';
    if (historiaUrl) {
      var historiaImg = document.querySelector('.historia__photo-img');
      if (historiaImg) historiaImg.src = historiaUrl;
    }

    // Dynamic plan rendering — city-specific if saved, defaults if no config; hidden if explicitly empty
    var cidade = localStorage.getItem('sigaon_cidade') || 'Vitória da Conquista';
    var cidadeCfg = cfg.cidades && cfg.cidades[cidade];

    function applyPlans(trackId, sectionSelector, cityPlans, defaults, renderFn) {
      var tk = document.getElementById(trackId);
      if (!tk) return;
      var plans = (cidadeCfg && cityPlans !== undefined) ? cityPlans : defaults;
      var section = sectionSelector ? document.querySelector(sectionSelector) : null;
      if (!plans || !plans.length) {
        if (section) section.style.display = 'none';
        return;
      }
      if (section) section.style.display = '';
      renderFn(plans, tk);
    }

    applyPlans('plansTrack',      'section.plans',               cidadeCfg && cidadeCfg.planosVoce,          DEFAULT_VOCE_PLANS,          renderVocePlans);
    applyPlans('eplansTrack',     '.eplans__carousel-wrapper',   cidadeCfg && cidadeCfg.planosEmpresas,      DEFAULT_EMPRESAS_PLANS,      renderEmpresasPlans);
    applyPlans('epricePlansTrack','.epc-section',                cidadeCfg && cidadeCfg.planosEmpresasFibra, DEFAULT_EMPRESAS_PRICE_PLANS, renderEmpresasPricePlans);
  });
})();
