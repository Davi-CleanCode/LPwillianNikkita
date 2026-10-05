import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useMotionValue, useTransform } from 'motion/react';
import './styles.css';

const WHATSAPP = 'https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20o%20Dr.%20Wilian%20Nikkita%20sobre%20uma%20quest%C3%A3o%20trabalhista.';

const services = [
  ['Rescisão e verbas', 'Conferência de férias, 13º, FGTS, aviso-prévio e demais valores relacionados ao encerramento do vínculo.'],
  ['Horas extras', 'Análise de jornada, intervalos, banco de horas e possíveis diferenças relacionadas ao controle de ponto.'],
  ['Assédio no trabalho', 'Orientação diante de situações de assédio moral, discriminação ou outras violações no ambiente profissional.'],
  ['Contratos e vínculo', 'Análise de contratos, alterações de função, condições de trabalho e características da relação de emprego.'],
  ['FGTS e direitos', 'Verificação de depósitos, benefícios e outros direitos que possam estar relacionados ao vínculo trabalhista.'],
];

const faq = [
  ['Preciso sair do emprego para buscar orientação?', 'Não. É possível buscar orientação antes de tomar qualquer decisão sobre o vínculo de trabalho.'],
  ['Quais documentos devo separar?', 'Se possível, reúna contrato, holerites, registros de ponto, mensagens, documentos de rescisão e outros comprovantes relacionados ao caso.'],
  ['O atendimento pode ser online?', 'Sim. O formato e a disponibilidade são confirmados no contato inicial.'],
  ['O meu caso é analisado individualmente?', 'Sim. O contexto, os documentos e o histórico apresentados são considerados antes da orientação.'],
];

function Arrow() { return <span className="arrow">↗</span>; }

function useSceneProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scene = ref.current;
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const distance = Math.max(scene.offsetHeight - window.innerHeight, 1);
      setProgress(Math.min(Math.max(-rect.top / distance, 0), 1));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return { ref, progress };
}

function LeadFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [answers, setAnswers] = useState({ situation: '', employment: '', documents: '' });

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  if (!open) return null;

  const canSubmit = answers.situation && answers.employment && answers.documents;

  const submit = () => {
    if (!canSubmit) return;
    const message = [
      'Olá! Gostaria de falar com o Dr. Wilian Nikkita sobre uma questão trabalhista.',
      '',
      `Situação principal: ${answers.situation}`,
      `Vínculo atual: ${answers.employment}`,
      `Possui documentos relacionados: ${answers.documents}`,
    ].join('\n');

    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="lead-modal-backdrop" role="dialog" aria-modal="true" aria-label="Questionário inicial">
      <div className="lead-modal">
        <button className="lead-modal-close" onClick={onClose} aria-label="Fechar">×</button>
        <span className="eyebrow">ANTES DE FALAR</span>
        <h2>Conte rapidamente o que aconteceu.</h2>
        <p className="lead-modal-intro">Responda 3 perguntas. As respostas serão enviadas junto com sua mensagem para o WhatsApp do Dr. Wilian.</p>

        <label><span>1. Qual é o principal problema no trabalho?</span>
          <select value={answers.situation} onChange={(e) => setAnswers({ ...answers, situation: e.target.value })}>
            <option value="">Selecione uma opção</option>
            <option>Rescisão / demissão</option><option>Horas extras / jornada</option>
            <option>Assédio no trabalho</option><option>Salário / benefícios</option>
            <option>Contrato / vínculo</option><option>Outro assunto trabalhista</option>
          </select>
        </label>

        <label><span>2. Qual é o seu vínculo atual?</span>
          <select value={answers.employment} onChange={(e) => setAnswers({ ...answers, employment: e.target.value })}>
            <option value="">Selecione uma opção</option>
            <option>Estou empregado</option><option>Fui demitido</option>
            <option>Pedi demissão</option><option>Estou em aviso-prévio</option>
            <option>Não tenho certeza</option>
          </select>
        </label>

        <label><span>3. Você possui documentos relacionados ao caso?</span>
          <select value={answers.documents} onChange={(e) => setAnswers({ ...answers, documents: e.target.value })}>
            <option value="">Selecione uma opção</option>
            <option>Sim, tenho documentos</option><option>Tenho alguns documentos</option>
            <option>Ainda não tenho documentos</option>
          </select>
        </label>

        <button className="lead-submit" disabled={!canSubmit} onClick={submit}>
          Responder e falar no WhatsApp <Arrow />
        </button>
        <small>As respostas são colocadas automaticamente na mensagem do WhatsApp.</small>
      </div>
    </div>
  );
}

function LeadButton({ onOpen, children, className = '' }: { onOpen: () => void; children: React.ReactNode; className?: string }) {
  return <button type="button" className={className} onClick={onOpen}>{children}</button>;
}

function DesktopPage() {
  const { ref, progress } = useSceneProgress();
  const p = useMotionValue(0);
  const [leadOpen, setLeadOpen] = useState(false);
  useEffect(() => p.set(progress), [progress, p]);

  const heroOpacity = useTransform(p, [0, .18, .34], [1, 1, 0]);
  const heroTitleX = useTransform(p, [0, .35], [0, -170]);
  const heroTitleY = useTransform(p, [0, .35], [0, -90]);
  const heroTitleScale = useTransform(p, [0, .35], [1, .72]);
  const heroImageX = useTransform(p, [.02, .24, .55, .72], [420, 0, 0, -110]);
  const heroImageY = useTransform(p, [.02, .24, .72], [80, 0, -25]);
  const heroImageScale = useTransform(p, [.02, .24, .58, .72], [.72, 1, 1, .88]);
  const imageRotate = useTransform(p, [.02, .24, .72], [4, 0, -2]);
  const statementX = useTransform(p, [.26, .38, .62], [380, 0, -280]);
  const statementOpacity = useTransform(p, [.25, .34, .58, .68], [0, 1, 1, 0]);
  const cardsY = useTransform(p, [.54, .66, .80, .98], ['72vh', '0vh', '-38vh', '-110vh']);
  const servicesOpacity = useTransform(p, [.52, .63, 1], [0, 1, 1]);
  const navOpacity = useTransform(p, [0, .18, .3], [1, .7, 0]);
  const scrollIndicatorOpacity = useTransform(p, [.45, .58], [1, 0]);

  return (
    <div className="desktop-page">
      <section ref={ref} className="motion-scene">
        <div className="motion-sticky">
          <motion.nav style={{ opacity: navOpacity }} className="topbar">
            <a className="wordmark" href="#top" aria-label="Dr. Wilian Nikkita"><span className="wn-logo">WN</span></a>
            <div className="navlinks"><a href="#sobre">Sobre</a><a href="#atuacao">Atuação</a><a href="#processo">Processo</a><a href="#valor">Investimento</a></div>
          </motion.nav>

          <motion.div style={{ opacity: heroOpacity }} className="hero-backdrop"><div className="giant-word">DIREITO</div></motion.div>

          <motion.div style={{ opacity: heroOpacity, x: heroTitleX, y: heroTitleY, scale: heroTitleScale }} className="hero-editorial">
            <span className="eyebrow inverse">ADVOCACIA TRABALHISTA</span>
            <h1>Seu trabalho.<br /><span>Seus direitos.</span><br />Sua decisão.</h1>
            <p>Atuação focada em Direito do Trabalho, com comunicação clara e análise individual de cada situação.</p>
          </motion.div>

          <motion.div style={{ x: heroImageX, y: heroImageY, scale: heroImageScale, rotate: imageRotate }} className="portrait-frame">
            <img src="/wilian-nikkita.png" alt="Dr. Wilian Nikkita" />
            <div className="portrait-caption"><span>DR. WILIAN NIKKITA</span><b>ADVOGADO TRABALHISTA</b></div>
          </motion.div>

          <motion.div style={{ x: statementX, opacity: statementOpacity }} className="scroll-statement">
            <span>POSICIONAMENTO</span>
            <h2>Entender o problema é o primeiro passo para <em>agir com segurança.</em></h2>
            <p>Uma seção de impacto entra lateralmente no scroll. Aqui usamos a referência de movimento do projeto anterior, mas com uma composição e hierarquia próprias.</p>
          </motion.div>

          <motion.div style={{ opacity: servicesOpacity }} className="services-scene">
            <div className="services-heading"><span className="eyebrow inverse">ÁREAS DE ATUAÇÃO</span><h2>Onde posso <em>atuar?</em></h2><p>Os cartões aparecem verticalmente enquanto você continua rolando.</p></div>
            <motion.div style={{ y: cardsY }} className="vertical-cards">
              {services.map(([title, text]) => <article className="motion-service" key={title}><h3>{title}</h3><p>{text}</p><LeadButton onOpen={() => setLeadOpen(true)} className="service-link">Falar sobre este tema <Arrow /></LeadButton></article>)}
            </motion.div>
          </motion.div>

          <motion.div style={{ opacity: scrollIndicatorOpacity }} className="scroll-indicator"><span>ROLE PARA EXPLORAR</span><i /></motion.div>
        </div>
      </section>

      <section id="sobre" className="editorial-section about-section"><div className="container editorial-grid"><div><span className="eyebrow">SOBRE</span><h2>Uma advocacia construída em torno de <em>clareza.</em></h2></div><div><p>Questões trabalhistas podem envolver documentos, prazos e decisões importantes. O atendimento começa pela compreensão do contexto, organização das informações e explicação objetiva das possibilidades.</p><LeadButton onOpen={() => setLeadOpen(true)} className="text-btn">Conversar sobre meu caso <Arrow /></LeadButton></div></div></section>
      <section id="processo" className="process-section"><div className="container"><div className="process-title"><span className="eyebrow">PROCESSO</span><h2>Sem complicar.</h2><p>Um caminho simples para sair da dúvida e chegar aos próximos passos.</p></div><div className="process-list"><div><h3>Você conta</h3><p>Conte o que aconteceu, quando começou a situação e quais foram os principais acontecimentos. Você pode apresentar suas dúvidas, explicar como era sua rotina de trabalho e indicar o que mudou ao longo do vínculo.</p></div><div><h3>Nós analisamos</h3><p>Organizamos as informações e analisamos os documentos disponíveis, como contrato, holerites, registros de ponto, mensagens e documentos de rescisão. A partir desse contexto, identificamos os pontos que merecem atenção jurídica.</p></div><div><h3>Você entende</h3><p>Depois da análise, você recebe uma explicação clara sobre o cenário apresentado, as possibilidades existentes e quais podem ser os próximos passos. A decisão é tomada com mais informação e segurança.</p></div></div></div></section>
      <section className="final-cta"><div><span className="eyebrow inverse">CONTATO</span><h2>Tem uma questão trabalhista?</h2><p>Conte brevemente o que aconteceu e inicie uma conversa.</p></div><a className="solid-btn whatsapp-btn" href={WHATSAPP}>Falar no WhatsApp <Arrow /></a></section>
      <section id="faq" className="faq-section"><div className="container faq-grid"><div><span className="eyebrow">DÚVIDAS</span><h2>Antes de <em>falar.</em></h2></div><div>{faq.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></div></section>
      <footer className="footer-dark"><div className="container footer-inner"><div><div className="wordmark footer-mark"><span className="wn-logo">WN</span></div><small>Advocacia Trabalhista · OAB/UF 000.000</small></div><div><a href="#sobre">Sobre</a><a href="#atuacao">Atuação</a><a href="#valor">Investimento</a><a href="#faq">Dúvidas</a></div><a className="outline-btn light-outline" href={WHATSAPP}>WhatsApp <Arrow /></a></div><div className="container legal-note">As informações desta página são informativas e não substituem consulta jurídica individualizada.</div></footer>
    </div>
  );
}

function MobilePage() {
  const [leadOpen, setLeadOpen] = useState(false);
  return (
    <div className="mobile-page">
      <nav className="mobile-nav">
        <a className="wordmark" href="#top" aria-label="Dr. Wilian Nikkita"><span className="wn-logo">WN</span></a>
      </nav>
      <section id="top" className="mobile-hero">
        <div><span className="eyebrow inverse">ADVOCACIA TRABALHISTA</span><h1>Seu trabalho.<br /><span>Seus direitos.</span></h1>
          <p>Atuação focada em Direito do Trabalho e análise individual de cada situação.</p>
        </div>
        <img src="/wilian-nikkita.png" alt="Dr. Wilian Nikkita" />
      </section>
      <section id="atuacao" className="mobile-services">
        <span className="eyebrow inverse">ÁREAS DE ATUAÇÃO</span><h2>Onde posso <em>atuar?</em></h2>
        {services.map(([t, tx]) => <article key={t}><h3>{t}</h3><p>{tx}</p>
          <LeadButton onOpen={() => setLeadOpen(true)} className="service-link">Falar sobre este tema <Arrow /></LeadButton></article>)}
      </section>
      <section className="mobile-about"><span className="eyebrow">SOBRE</span><h2>Uma advocacia construída em torno de <em>clareza.</em></h2>
        <p>O atendimento começa pela compreensão do contexto, organização das informações e explicação objetiva das possibilidades.</p>
        <LeadButton onOpen={() => setLeadOpen(true)} className="text-btn">Conversar sobre meu caso <Arrow /></LeadButton>
      </section>
      <section className="mobile-process"><span className="eyebrow">PROCESSO</span><h2>Sem complicar.</h2>
        <div><h3>Você conta</h3><p>Conte o que aconteceu, quando começou e quais foram os principais acontecimentos. Explique também suas dúvidas e como era sua rotina de trabalho.</p></div>
        <div><h3>Nós analisamos</h3><p>Organizamos as informações e os documentos disponíveis, como contrato, holerites, registros de ponto, mensagens e documentos de rescisão.</p></div>
        <div><h3>Você entende</h3><p>Explicamos o cenário, as possibilidades e os próximos passos para que você possa decidir com mais clareza e segurança.</p></div>
      </section>
      <section className="final-cta"><div><span className="eyebrow inverse">CONTATO</span><h2>Tem uma questão trabalhista?</h2><p>Responda 3 perguntas rápidas e inicie uma conversa.</p></div>
        <LeadButton onOpen={() => setLeadOpen(true)} className="solid-btn whatsapp-btn">Falar no WhatsApp <Arrow /></LeadButton>
      </section>
      <section className="mobile-faq"><span className="eyebrow">DÚVIDAS</span><h2>Antes de <em>falar.</em></h2>
        {faq.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}
      </section>
      <footer className="mobile-footer"><div className="wordmark"><span className="wn-logo">WN</span></div><small>Advocacia Trabalhista · OAB/UF 000.000</small></footer>
      <LeadFormModal open={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  );
}

function App() { return <main><MobilePage /><DesktopPage /></main>; }
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
