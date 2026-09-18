const { JSDOM } = require("jsdom");
const http = require("http");

http.get("http://127.0.0.1:3000/watch?v=dQw4w9WgXcQ", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    const dom = new JSDOM(data, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://127.0.0.1:3000/watch?v=dQw4w9WgXcQ"
    });
    dom.window.onerror = function (msg, url, lineNo, columnNo, error) {
      console.log("JSDOM Error:", msg, error);
    };
    setTimeout(() => {
      console.log("JSDOM innerHTML length after 2s:", dom.window.document.body.innerHTML.length);
      const errBox = dom.window.document.querySelector(".bg-red-500\\\\/10");
      if (errBox) {
         console.log("Error Component found:", errBox.textContent);
      } else {
         console.log("No Error Component found.");
      }
      process.exit(0);
    }, 2000);
  });
});
