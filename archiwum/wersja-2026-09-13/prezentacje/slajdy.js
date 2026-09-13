/* ============================================================
   Silnik prezentacji — Informatyka 2026/2027

   Sterowanie:
     →  ↓  spacja  PageDown   następny slajd
     ←  ↑  PageUp              poprzedni
     O  albo Enter             odkryj odpowiedź na bieżącym slajdzie
     T                         uruchom stoper (slajdy z data-stoper)
     B                         zasłoń ekran (i z powrotem)
     F                         pełny ekran
     Home / End                pierwszy / ostatni slajd

   Slajd z odliczaniem: <section class="slajd" data-stoper="3">
   Element ukryty do czasu odkrycia: class="odkryj"
   ============================================================ */
(function () {
  var scena = document.getElementById('scena');
  var slajdy = Array.prototype.slice.call(document.querySelectorAll('.slajd'));
  var i = 0, stoperId = null;

  /* --- skalowanie sceny 1280x720 do okna --- */
  function skaluj() {
    var s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    scena.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
  }
  window.addEventListener('resize', skaluj);

  /* --- nawigacja --- */
  function pokaz(n) {
    if (n < 0 || n >= slajdy.length) return;
    slajdy[i].classList.remove('aktywny');
    i = n;
    slajdy[i].classList.add('aktywny');
    scena.classList.remove('odkryte', 'stoper-widoczny');
    if (stoperId) { clearInterval(stoperId); stoperId = null; }
    aktualizujPasek();
  }
  function dalej() {
    // pierwszy raz odkrywa odpowiedź, dopiero drugi przechodzi dalej
    if (!scena.classList.contains('odkryte') && slajdy[i].querySelector('.odkryj')) { odkryj(); return; }
    pokaz(i + 1);
  }
  function wstecz() { pokaz(i - 1); }
  function odkryj() { scena.classList.add('odkryte'); aktualizujPasek(); }

  function aktualizujPasek() {
    var licz = document.getElementById('licznik');
    if (licz) licz.textContent = (i + 1) + ' / ' + slajdy.length;
    var pod = document.getElementById('podpowiedz');
    if (!pod) return;
    var ma = slajdy[i].querySelector('.odkryj');
    var st = slajdy[i].dataset.stoper;
    if (st && !scena.classList.contains('odkryte')) pod.innerHTML = '<kbd>T</kbd> uruchom odliczanie';
    else if (ma && !scena.classList.contains('odkryte')) pod.innerHTML = '<kbd>spacja</kbd> odkryj odpowiedź';
    else pod.innerHTML = '<kbd>&larr;</kbd> <kbd>&rarr;</kbd> slajdy &nbsp;·&nbsp; <kbd>B</kbd> zasłoń &nbsp;·&nbsp; <kbd>F</kbd> pełny ekran';
  }

  /* --- stoper: pokazuje slajd przez N sekund, potem zasłania ekran --- */
  function uruchomStoper() {
    var sek = parseInt(slajdy[i].dataset.stoper || '0', 10);
    if (!sek || stoperId) return;
    var pole = document.getElementById('stoper');
    var zostalo = sek;
    scena.classList.remove('zaslonieta');
    pole.textContent = zostalo;
    scena.classList.add('stoper-widoczny');
    // krótkie odliczanie startowe, potem odsłaniamy materiał
    stoperId = setInterval(function () {
      zostalo--;
      if (zostalo > 0) { pole.textContent = zostalo; return; }
      clearInterval(stoperId); stoperId = null;
      scena.classList.remove('stoper-widoczny');
      // materiał widoczny przez zadany czas, potem kurtyna
      var widok = sek;
      var odsl = setInterval(function () {
        widok--;
        if (widok > 0) return;
        clearInterval(odsl);
        scena.classList.add('zaslonieta');
      }, 1000);
    }, 1000);
  }

  function zaslon() { scena.classList.toggle('zaslonieta'); }

  function pelnyEkran() {
    var el = document.documentElement;
    if (!document.fullscreenElement) { (el.requestFullscreen || el.webkitRequestFullscreen).call(el); }
    else { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
  }

  /* --- klawiatura --- */
  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': e.preventDefault(); dalej(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': e.preventDefault(); wstecz(); break;
      case 'Enter': case 'o': case 'O': odkryj(); break;
      case 't': case 'T': uruchomStoper(); break;
      case 'b': case 'B': zaslon(); break;
      case 'f': case 'F': pelnyEkran(); break;
      case 'Home': pokaz(0); break;
      case 'End': pokaz(slajdy.length - 1); break;
      case 'Escape': if (scena.classList.contains('zaslonieta')) scena.classList.remove('zaslonieta'); break;
    }
  });

  /* --- klik myszą / pilot do prezentacji --- */
  scena.addEventListener('click', function (e) {
    if (e.target.closest('button')) return;
    dalej();
  });

  /* --- przyciski --- */
  document.addEventListener('DOMContentLoaded', function () {
    var b = {
      'btn-poprzedni': wstecz, 'btn-nastepny': dalej, 'btn-odkryj': odkryj,
      'btn-stoper': uruchomStoper, 'btn-zaslon': zaslon, 'btn-pelny': pelnyEkran
    };
    Object.keys(b).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', function (e) { e.stopPropagation(); b[id](); });
    });
  });

  skaluj();
  slajdy[0].classList.add('aktywny');
  aktualizujPasek();
})();
