export function updateUI(time, coins, combo) {
  document.getElementById("time").innerText = time;
  document.getElementById("coins").innerText = coins;
  document.getElementById("combo").innerText = combo;
}

export function showMessage(msg) {
  alert(msg);
}

export function toggleTheme() {
  document.body.classList.toggle("dark");
}