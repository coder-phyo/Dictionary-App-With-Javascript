let userInput = document.querySelector(".search input");
let ul = document.querySelector("ul");
ul.style.display = "none";
let infoText = document.querySelector(".info-text");
let audio;

function showUser(data) {
  let last_phonetic = data[0].phonetics.length - 1;
  let last_meaning = data[0].meanings.length - 1;
  // audio
  audio = new Audio(`${data[0].phonetics[last_phonetic].audio}`);
  ul.style.display = "block";
  // word
  document.querySelector(".details p").innerText = ` ${data[0].word}`;
  // phonetic
  document.querySelector(
    ".details span"
  ).innerText = `${data[0].meanings[last_meaning].partOfSpeech} ${data[0].phonetics[last_phonetic].text}`;
  // meaning
  document.querySelector(
    ".meaning span"
  ).innerText = `${data[0].meanings[last_meaning].definitions[0].definition}`;
  // example
  let exampleDiv = document.querySelector(".example span");
  let example = data[0].meanings[last_meaning].definitions;
  if (exampleDiv.innerText) {
    exampleDiv.innerText = "";
  }
  example.forEach((e) => {
    if (e.example) {
      document.querySelector(".example").style.display = "block";
      exampleDiv.innerText += e.example;
    } else {
      document.querySelector(".example").style.display = "none";
    }
  });

  // synonyms
  let synonymsDiv = document.querySelector(".synonyms .list");
  let last_synonyms = data[0].meanings.length - 1;
  let synonyms = data[0].meanings[last_synonyms].synonyms[0];
  if (synonymsDiv.innerHTML) {
    document.querySelector(".synonyms .list").innerHTML = "";
  }

  if (synonyms === undefined) {
    document.querySelector(".synonyms").style.display = "none";
  } else {
    for (let i = 0; i < synonyms.length; i++) {
      let item = `<span onclick="search_synonyms('${data[0].meanings[last_synonyms].synonyms[i]}')">${data[0].meanings[last_synonyms].synonyms[i]}</span>`;
      synonymsDiv.insertAdjacentHTML("beforeend", item);
      document.querySelector(".synonyms").style.display = "block";
    }
  }
}

function showResult(result, word) {
  if (result.title) {
    infoText.style.color = "red";
    infoText.innerHTML = `We couldn't find <b>${word}</b>`;
  } else {
    infoText.style.color = "#00ffb0";
    infoText.innerHTML = "Searched" + " " + word;
    userInput.value = "";
    showUser(result);
  }
}

function searchWords(word) {
  userInput.blur();
  infoText.style.color = "#000";
  infoText.innerHTML = "Searching" + " " + word;
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then((result) => showResult(result, word));
}

userInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    searchWords(e.target.value);
  }
});

userInput.addEventListener("focus", (_) => {
  ul.style.display = "none";
  infoText.innerHTML = `Type any existing word and press enter to get meaning, example,
        synonyms, etc.`;
  infoText.style.color = "#9a9a9a";
});

document.querySelector(".fa-volume-up").addEventListener("click", (_) => {
  audio.play();
});

function search_synonyms(key) {
  searchWords(key);
}
