setTimeout(async function() {
    const url = window.location.href;

    try {
        const response = await fetch("http://127.0.0.1:5000/check_url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();
        console.log("Response from API:", data);
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}, 1000);
