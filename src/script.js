const button = document.querySelector("button");
button.addEventListener("click", async () => {
  let currentDiv = document.querySelector("container");
  currentDiv ? currentDiv.remove() : currentDiv;
  const main = document.querySelector("main");
  const regex = /\s/g;
  const input = document.querySelector("textarea");
  main.remove();
  let appnames = input.value.split("\n");
  for (let i = 0; i < appnames.length; i++) {
    if (appnames[i]) {
      appnameUrlEncoded = appnames[i].replace(regex, "%20");
      let response = await fetch(
        `https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/services/SingleApp.xsodata/InputFilterParam(InpFilterValue='${appnameUrlEncoded}')/Results`
      );
      let data = await response.text();

      let parser = new DOMParser();
      let doc = parser.parseFromString(data, "text/xml");
      addToDom(doc, appnames[i]);
    }
  }
});

function addToDom(doc, appname) {
  const appnames = doc.getElementsByTagName("d:AppName");
  const services = doc.getElementsByTagName("d:ODataServicesCombined");

  let index;
  for (let i = 0; i < appnames.length; i++) {
    if (appnames[i].innerHTML == appname.trim()) {
      index = i;
      break;
    }
  }
  let oDataServices = services[index].innerHTML;
  oDataServices = oDataServices.split("$");

  for (let i = 0; i < oDataServices.length; i++) {
    if (oDataServices[i] == " * ") {
      oDataServices = oDataServices.slice(0, i);
      break;
    }
    if (!oDataServices[i].trim() || oDataServices[i] == ",") {
      oDataServices.splice(i, 1);
    }
  }
  let div = document.createElement("div");
  div.classList.add("container");
  let h2 = document.createElement("h2");
  h2.innerText = appname;

  // h2.addEventListener("click",(e) => {
  //     e.target.nextSibling.classList.toggle("extended");
  //     e.target.classList.toggle("selected");
  // })
  div.appendChild(h2);
  let pdiv = document.createElement("div");
  pdiv.classList.add("pdiv");
  for (let i = 0; i < oDataServices.length; i++) {
    if (oDataServices[i]) {
      let p = document.createElement("p");
      p.innerText = oDataServices[i];
      pdiv.appendChild(p);
    }
  }
  div.appendChild(pdiv);

  document.body.appendChild(div);
}
