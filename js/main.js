/* ============================================
            preloader
===============================================*/
$(window).on('load', function () {
  // makes sure that whole site is loaded
  $('#preloader-gif, #preloader').fadeOut(3000, function () {});
});

//**************** variables ****************//
const fromText = document.querySelector('.from-text'),
  toText = document.querySelector('.to-text'),
  exchageIcon = document.querySelector('.exchange'),
  selectTags = document.querySelectorAll('select'),
  icons = document.querySelectorAll('.row i'),
  translateBtn = document.querySelector('button');

/**
 * @description - load countries and country codes to select tags
 */
selectTags.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected = id == 0 ? country_code == 'en-GB' ? 'selected' : '' : country_code == 'es-ES' ? 'selected' : '';
    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML('beforeend', option);
  }
});

/**
 * @description - swap textareas and languages
 */
exchageIcon.addEventListener('click', () => {
  let tempText = fromText.value,
    tempLang = selectTags[0].value;
  
  fromText.value = toText.value;
  toText.value = tempText;
  
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

/**
 * @description - if from textarea is empty, donot input text in to textarea
 */
fromText.addEventListener('keyup', () => {
  if (!fromText.value) {
    toText.value = '';
  }
});

/**
 * @description - translation
 */
translateBtn.addEventListener('click', () => {
  let text = fromText.value.trim(),
    translateFrom = selectTags[0].value,
    translateTo = selectTags[1].value;
  
  if (!text) return;
  
  toText.setAttribute('placeholder', 'Translating...');
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  
  fetch(apiUrl).then(res => res.json()).then(data => {
    toText.value = data.responseData.translatedText;
    data.matches.forEach(data => {
      if (data.id === 0) {
        toText.value = data.translation;
      }
    });
    toText.setAttribute('placeholder', 'Translation');
  });
});

/**
 * @description - copies the text from the from text or text; and speak from the from text area
 * or the to text area.
 */
icons.forEach(icon => {
  icon.addEventListener('click', ({ target }) => {
    if (!fromText.value || !toText.value) return;
    
    if (target.classList.contains('fa-copy')) {
      if (target.id == 'from-copy') {
        navigator.clipboard.writeText(fromText.value);
        
      } else {
        navigator.clipboard.writeText(toText.value);
        
      }
      
    } else {
      let utterance;
      
      if (target.id == 'from-speak') {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTags[0].value;
        
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTags[1].value;
        
      }
      speechSynthesis.speak(utterance);
    }
  });
});