// Hisham Chisti — Realtor® website interactions
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky nav shadow + back-to-top
const nav = document.getElementById('nav');
const topFab = document.querySelector('.top-fab');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
  topFab.classList.toggle('show', window.scrollY > 700);
}, { passive: true });

// Mobile menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, dur = 1400, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-CA');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(el => cio.observe(el));

// Mortgage calculator (monthly payment, Canadian semi-annual compounding approx. via nominal rate)
function calcMortgage() {
  const price = Math.max(+document.getElementById('mcPrice').value || 0, 0);
  const down = Math.min(Math.max(+document.getElementById('mcDown').value || 0, 0), price);
  const ratePct = Math.max(+document.getElementById('mcRate').value || 0, 0);
  const years = +document.getElementById('mcYears').value || 25;
  const principal = price - down;
  const n = years * 12;
  // Convert nominal annual rate with semi-annual compounding to monthly rate (Canadian standard)
  const j2 = ratePct / 100;
  const monthlyRate = Math.pow(1 + j2 / 2, 2 / 12) - 1;
  let payment;
  if (principal <= 0) payment = 0;
  else if (monthlyRate === 0) payment = principal / n;
  else payment = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n));
  document.getElementById('mcResult').textContent = '$' + Math.round(payment).toLocaleString('en-CA');
  document.getElementById('mcLoan').textContent = principal > 0
    ? 'Mortgage amount: $' + principal.toLocaleString('en-CA') + ' • ' + years + ' years • ' + ratePct + '%'
    : 'No mortgage needed at this down payment.';
}
['mcPrice','mcDown','mcRate','mcYears'].forEach(id => {
  document.getElementById(id).addEventListener('input', calcMortgage);
  document.getElementById(id).addEventListener('change', calcMortgage);
});
calcMortgage();

// Lead form -> opens visitor's email app, pre-filled (nothing stored on the site)
document.getElementById('leadForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const intent = document.getElementById('fIntent').value;
  const msg = document.getElementById('fMsg').value.trim();
  const subject = encodeURIComponent('Website enquiry — ' + intent + ' — ' + name);
  const body = encodeURIComponent(
    'Hi Hisham,\n\nName: ' + name + '\nPhone: ' + phone + '\nI want to: ' + intent + '\n\n' + msg + '\n\nPlease call me back. Thank you!'
  );
  window.location.href = 'mailto:realtorhisham@gmail.com?subject=' + subject + '&body=' + body;
  document.getElementById('formNote').textContent = '✅ Your email app should open now with everything filled in — just press Send. Or call 647-979-8911.';
});
