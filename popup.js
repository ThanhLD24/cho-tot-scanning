// let btnToggle = document.getElementById("btnToggle");

// btnToggle.addEventListener("click", async () => {
//   chrome.storage.local.get("running", (result) => {
//     if (result.running) {
//       chrome.storage.local.set({ running: false }, () => {
//         if (configInterval != null) clearInterval(scanInterval);
//       });
//     } else {
//       chrome.storage.local.set({ running: true }, () => {
//         startInterval();
//       });
//     }
//   });
// });

chrome.storage.onChanged.addListener((changes, areas) => {
  if ("running" in changes) {
    document.getElementById("msg").innerText = changes.running.newValue
      ? "Scan feature is running"
      : "Scan feature is turn off";
  }
});

async function handleScanning() {
  try {
    console.log("ok...");
    var currentTab = await getCurrentTab();
    console.log(currentTab.url);
    console.log(currentTab.id);
    if (
      currentTab.url ===
      "https://www.chotot.com/ha-noi/mua-ban-dien-thoai/apple-iphone-11-br1-md1955"
    ) {
      console.log("passed");
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id, allFrames: true },
          function: findTitleAndReport,
        },
        (result) => {
          // chrome.tabs.reload(
          //   currentTab.id
          // );
          chrome.notifications.create("ok", {
            title: "Just wanted to notify you",
            message: "How great it is!",
            iconUrl: chrome.runtime.getURL("images/get_started16.png"),
            type: "basic",
          });
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

var scanInterval = null;
function startInterval() {
  scanInterval = setInterval(handleScanning, 5000);
}

async function getCurrentTab() {
  let queryOptions = { active: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function findTitleAndReport() {
  console.log("findTitleAndReport");
  var links = document.getElementsByClassName("adItem___2GCVQ");
  var titles = document.getElementsByClassName("adTitle___3SoJh");
  var prices = document.getElementsByClassName("adPriceNormal___puYxd");

  var index = 0;
  console.log(prices);
  for (let item of titles) {
    let title = item.innerText.toLowerCase();
    let price = parseInt(
      prices[index].innerText.trim().replaceAll(".", "").replaceAll("đ", "")
    );
    if (
      (title.includes("vn") ||
        title.includes("vn/a") ||
        title.includes("vna") ||
        title.includes("việt nam") ||
        title.includes("chính hãng") ||
        title.includes("fpt") ||
        title.includes("viettel") ||
        title.includes("tgdd") ||
        title.includes("thế giới di động") ||
        title.includes("viet nam") ||
        title.includes("vietnam") ||
        title.includes("viet tel") ||
        title.includes("the gioi di dong") ||
        title.includes("cellphone") ||
        title.includes("bảo hành") ||
        title.includes("bao hanh") ||
        title.includes("chính hãng") ||
        title.includes("chinh hang") ||
        title.includes("2021") ||
        title.includes("2022")) &&
      price < 13000000 &&
      price > 11000000
    ) {
      console.log("got it!!! price: " + price + " - url: " + links[index].href);
    }
    index++;
  }
}

function changeBackgroundColor() {
  document.body.style.backgroundColor = "red";
}
