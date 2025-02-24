function createUrlElement(url, duration) {
  const li = document.createElement("li");

  const urlSpan = document.createElement("span");
  urlSpan.textContent = url;
  urlSpan.className = "url";

  const timerSpan = document.createElement("span");
  timerSpan.className = "timer";

  if (duration === 0) {
    timerSpan.textContent = "Blocked";
    li.appendChild(urlSpan);
    li.appendChild(timerSpan);
    return li;
  }

  let timeLeft = duration;

  function updateTimer() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timerSpan.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft > 0) {
      timeLeft--;
      setTimeout(updateTimer, 1000);
    } else {
      li.remove();
      removeUrlFromBlockedList(url);
    }
  }

  updateTimer();
  li.appendChild(urlSpan);
  li.appendChild(timerSpan);
  return li;
}

function addUrlToBlockedList(url, duration) {
  chrome.storage.sync.get(["blockedUrls"], (result) => {
    const blockedUrls = result.blockedUrls || [];
    blockedUrls.push({ url, duration, startTime: Date.now() });
    chrome.storage.sync.set({ blockedUrls }, () => {
      renderBlockedUrls();
    });
  });
}

function removeUrlFromBlockedList(url) {
  chrome.storage.sync.get(["blockedUrls"], (result) => {
    const blockedUrls = result.blockedUrls || [];
    const updatedBlockedUrls = blockedUrls.filter((item) => item.url !== url);
    chrome.storage.sync.set({ blockedUrls: updatedBlockedUrls }, () => {
      renderBlockedUrls();
    });
  });
}

function renderBlockedUrls() {
  chrome.storage.sync.get(["blockedUrls"], (result) => {
    const blockedUrls = result.blockedUrls || [];
    const blockedUrlsList = document.getElementById("blockedUrlsList");
    blockedUrlsList.innerHTML = "";

    blockedUrls.forEach((item) => {
      const { url, duration, startTime } = item;
      const remainingDuration = Math.max(
        duration - Math.floor((Date.now() - startTime) / 1000),
        0
      );
      const urlElement = createUrlElement(url, remainingDuration);
      blockedUrlsList.appendChild(urlElement);
    });
  });
}

const addUrlForm = document.getElementById("addUrlForm");
const urlInput = document.getElementById("urlInput");
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");

addUrlForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = urlInput.value;

  const hours = hoursInput.value ? parseInt(hoursInput.value) : 0;
  const minutes = minutesInput.value ? parseInt(minutesInput.value) : 0;
  const seconds = secondsInput.value ? parseInt(secondsInput.value) : 0;

  const hasTimeInput = hours > 0 || minutes > 0 || seconds > 0;
  const duration = hasTimeInput ? hours * 3600 + minutes * 60 + seconds : 0;

  addUrlToBlockedList(url, duration);

  urlInput.value = "";
  hoursInput.value = "0";
  minutesInput.value = "0";
  secondsInput.value = "0";
});

renderBlockedUrls();
