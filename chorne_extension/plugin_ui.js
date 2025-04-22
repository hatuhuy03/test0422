// document.addEventListener("DOMContentLoaded", function () {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         let url = tabs[0].url;
//         document.getElementById("domain_url").innerText = url;

//         fetch("http://127.0.0.1:5000/check_url", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ url: url })
//         })
//         .then(response => response.json())
//         .then(data => {
//             let siteScore = document.getElementById("site_score");
//             let siteMsg = document.getElementById("site_msg");
//             let percentageContent = document.getElementById("percentage_content");
//             let featuresList = document.getElementById("features");

//             if (!data || typeof data.x === "undefined") {
//                 console.error("Dữ liệu API không hợp lệ:", data);
//                 siteMsg.innerText = "Lỗi dữ liệu từ API!";
//                 siteMsg.style.color = "gray";
//                 return;
//             }

//             let x = parseFloat(data.x);
//             let prediction = parseInt(data.prediction);
            
//             let num = x * 100;

//             if (0 <= x && x < 0.50) {
//                 num = 100 - num;
//             }
//             let txtx = num.toFixed(0);
//             percentageContent.className = `c100 center p${txtx}`;
//             siteScore.innerText=`${txtx}%`;
//             if(prediction<=1 && x>=0.65){
//                 siteMsg.innerText = ` Website này có thế an toàn! `;
//                 percentageContent.classList.remove("dark");
//                 percentageContent.classList.add("green");   
//             } else if (prediction <=0 && x<0.65){
//                 siteMsg.innerText = `Website này nguy hiểm`;
//                 percentageContent.classList.remove("dark");
//                 percentageContent.classList.add("orange");
//             }

//             featuresList.innerHTML = "";
//                 for (let [key, value] of Object.entries(data.features)) {
//                     let li = document.createElement("li");
//                     li.innerHTML = `<span class="feature-key">${key}</span>: <span class="feature-value" data-value="${value}">${value}</span>`;
//                     featuresList.appendChild(li);
//                 }

//                 featureContent.style.maxHeight = featureContent.scrollHeight + "px";
            
//         })
//         .catch(error => {
//             console.error("Lỗi khi gọi API:", error);
//             let siteMsg = document.getElementById("site_msg");
//             siteMsg.innerText = "Lỗi kết nối API!";
//             siteMsg.style.color = "gray";
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let url = tabs[0].url;
        document.getElementById("domain_url").innerText = url;

        fetch("http://127.0.0.1:5000/check_url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        })
        .then(response => response.json())
        .then(data => {
            let siteScore = document.getElementById("site_score");
            let siteMsg = document.getElementById("site_msg");
            let percentageContent = document.getElementById("percentage_content");
            let featuresList = document.getElementById("features");
            let featureContent = document.querySelector(".feature-content");
            let detailButton = document.querySelector(".collapsible");

            if (!data || typeof data.x === "undefined") {
                console.error("Dữ liệu API không hợp lệ:", data);
                siteMsg.innerText = "Lỗi dữ liệu từ API!";
                siteMsg.style.color = "gray";
                return;
            }

            let x = parseFloat(data.x);
            let prediction = parseInt(data.prediction);
            let num = x * 100;
            if (0 <= x && x < 0.50) {
                num = 100 - num;
            }
            let txtx = num.toFixed(0);

            percentageContent.className = `c100 center p${txtx}`;
            siteScore.innerText = `${txtx}%`;

            if (prediction <= 1 && x >= 0.65) {
                siteMsg.innerText = `Website an toàn`;
                percentageContent.classList.remove("dark");
                percentageContent.classList.add("green");
            } else if (prediction <= 0 && x < 0.65) {
                siteMsg.innerText = `Website nguy hiểm`;
                percentageContent.classList.remove("dark");
                percentageContent.classList.add("orange");
            }

            // Cập nhật danh sách thuộc tính website
            featuresList.innerHTML = "";
            if (data.features) {
                for (let [key, value] of Object.entries(data.features)) {
                    let li = document.createElement("li");
                    li.innerHTML = `<span class="feature-key">${key}</span>`;
                    if (value === 1) {
                        li.style.backgroundColor = "#cc0000"; 
                    } else if (value === 0) {
                        li.style.backgroundColor = "#f4c542";
                    } else {
                        li.style.backgroundColor = "#5fd400";
                    }
                    li.style.padding = "0.5rem 1rem";
                    featuresList.appendChild(li);
                }
            }

            // Sự kiện mở rộng/thu gọn danh sách thuộc tính
            detailButton.addEventListener("click", function () {
                this.classList.toggle("active");
                if (featureContent.style.maxHeight) {
                    featureContent.style.maxHeight = null;
                } else {
                    featureContent.style.maxHeight = featureContent.scrollHeight + "px";
                }
            });

        })
        .catch(error => {
            console.error("Lỗi khi gọi API:", error);
            let siteMsg = document.getElementById("site_msg");
            siteMsg.innerText = "Lỗi kết nối API!";
            siteMsg.style.color = "gray";
        });
    });
});
