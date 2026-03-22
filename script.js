/* 
   NIKE AIR ZOOM — script.js
*/

(function () {
  /* Referências */
  const root          = document.documentElement;
  const imagemTenis   = document.getElementById('imagem-tenis');
  const sliderInd     = document.getElementById('slider-indicator');
  const botoesCor     = document.querySelectorAll('.botao-cor');
  const btnCarrinho   = document.getElementById('btn-carrinho');
  const shoeGlow      = document.querySelector('.shoe-glow');

  /* 1. SELETOR DE COR
     Cada botão traz os dados via data-attributes no HTML:
     data-bg | data-dark | data-btn | data-img
  */
  const BTN_HEIGHT = 72; // height do .botao-cor em px
  const BTN_GAP    = 8;  // gap do flex em px
  const STEP       = BTN_HEIGHT + BTN_GAP; // 80px por item

  function moverIndicador(index) {
    sliderInd.style.top = `${index * STEP}px`;
  }

  function trocarCor(botao, index) {
    botoesCor.forEach(b => b.classList.remove('active'));
    botao.classList.add('active');

    /* Atualiza variáveis CSS globais — transições ficam no CSS */
    root.style.setProperty('--bg-color',   botao.dataset.bg);
    root.style.setProperty('--dark-color', botao.dataset.dark);
    root.style.setProperty('--btn-color',  botao.dataset.btn);

    moverIndicador(index);
    trocarImagem(botao.dataset.img);
  }

  botoesCor.forEach((botao, i) => {
    botao.addEventListener('click', () => trocarCor(botao, i));

    /* Acessibilidade — teclado */
    botao.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trocarCor(botao, i);
      }
    });
  });

  /* 2. TROCA DE IMAGEM com fade duplo */
  function trocarImagem(novoSrc) {
    imagemTenis.classList.remove('fade-in');
    imagemTenis.classList.add('fade-out');

    setTimeout(() => {
      imagemTenis.src = novoSrc;
      void imagemTenis.offsetWidth; // força reflow

      imagemTenis.classList.remove('fade-out');
      imagemTenis.classList.add('fade-in');

      setTimeout(() => imagemTenis.classList.remove('fade-in'), 600);
    }, 280);
  }

  /* 3. BOTÃO CARRINHO — ripple effect + feedback */
  btnCarrinho.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x    = e.clientX - rect.left - size / 2;
    const y    = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    mostrarFeedback();
  });

  function mostrarFeedback() {
    const original = btnCarrinho.innerHTML;
    btnCarrinho.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Adicionado!`;
    btnCarrinho.classList.add('added');

    setTimeout(() => {
      btnCarrinho.innerHTML = original;
      btnCarrinho.classList.remove('added');
    }, 2000);
  }

  /* 4. PARALLAX sutil no tênis ao mover o mouse */
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
    const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    imagemTenis.style.transform = `rotate(-25deg) translate(${dx * -12}px, ${dy * -8}px)`;

    if (shoeGlow) {
      shoeGlow.style.transform = `translate(${dx * 20}px, ${dy * 15}px)`;
    }
  });

  document.addEventListener('mouseleave', () => {
    imagemTenis.style.transform = 'rotate(-25deg) translate(0, 0)';
    if (shoeGlow) shoeGlow.style.transform = '';
  });

  /* 5. INICIALIZAÇÃO — posiciona o indicador no botão ativo */
  (function init() {
    const activeIndex = [...botoesCor].findIndex(b => b.classList.contains('active'));
    moverIndicador(activeIndex >= 0 ? activeIndex : 0);
  })();

})();