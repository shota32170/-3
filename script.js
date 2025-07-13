let chart = null;
window.onload = function () {
  ["x0", "y0", "xEnd"].forEach(id => {
    const slider = document.getElementById(id);
    const output = document.getElementById(id + "value");
    output.textContent = slider.value;
    slider.oninput = () => output.textContent = slider.value;
  });
};

function simulate() {
  const selectedFunc = document.querySelector('input[name="function"]:checked').value;
  const selectedMethod = document.querySelector('input[name="method"]:checked').value;
  const keisuList = Array.from(document.querySelectorAll('select[name="keisu"]')).map(e => parseFloat(e.value));
  const a = keisuList[0], b = keisuList[1], c = keisuList[2], C = keisuList[3];

  const x0 = parseFloat(document.getElementById("x0").value);
  const y0 = parseFloat(document.getElementById("y0").value);
  const xEnd = parseFloat(document.getElementById("xEnd").value);
  const h = parseFloat(document.getElementById("h").value);

  let f;
  switch (selectedFunc) {
    case "function1": f = (x, y) => a * x * x + b * x + c; break;
    case "function2": f = (x, y) => C * Math.exp(x); break;
    case "function3": f = (x, y) => y * y; break;
    case "function4": f = (x, y) => Math.sin(x); break;
    case "function5": f = (x, y) => Math.sin(y); break;
    default: alert("関数が選ばれていません"); return;
  }

  let x = x0;
  let y = y0;
  const xList = [x];
  const yList = [y];
  let log = `【${selectedMethod === "oira" ? "オイラー法" : "ルンゲクッタ法"}】\n`;
  log += `x: ${x.toFixed(2)}, y: ${y.toFixed(5)}\n`;

  while (x < xEnd) {
    if (selectedMethod === "oira") {
      y = y + h * f(x, y);
    } else if (selectedMethod === "runge") {
      const k1 = h * f(x, y);
      const k2 = h * f(x + h / 2, y + k1 / 2);
      const k3 = h * f(x + h / 2, y + k2 / 2);
      const k4 = h * f(x + h, y + k3);
      y = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    }

    x = x + h;
    xList.push(x);
    yList.push(y);
    log += `x: ${x.toFixed(2)}, y: ${y.toFixed(5)}\n`;
  }



  // Chart.jsでグラフ描画
  drawGraph(xList, yList, selectedMethod);
}

function drawGraph(xData, yData, method) {
  const ctx = document.getElementById("test").getContext("2d");

  // 以前のグラフがあれば破棄
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xData,
      datasets: [{
        label: method === "oira" ? "オイラー法" : "ルンゲクッタ法",
        data: yData,
        fill: false,
        borderColor: method === "oira" ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)",
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'x' }
        },
        y: {
          title: { display: true, text: 'y' }
        }
      }
    }
  });
}
