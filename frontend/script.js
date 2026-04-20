document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const responseMsg = document.getElementById("responseMsg");
  const confirmDialog = document.getElementById("confirmDialog");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  // Issue 3: キャンセルボタン(id=cancelBtn)をクリックしたときにダイアログを閉じる
  cancelBtn.addEventListener("click", (event) => {
    event.preventDefault();
    confirmDialog.close();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Issue 3: ダイアログ(id=confirmDialog)を表示して、submitのeventlistenerの処理を終了する
    // Issue 3: これまでの処理は、id=confirmBtnのclickイベントで実行する
const a = 1;
const b = a + 1;

    confirmDialog.showModal();
    return;
  });

  confirmBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    // Issue 2: 電話番号の入力も確認する
    if (!name || !email || !phone || !message) {
      responseMsg.textContent = "すべてのフィールドを入力してください。";
      return;
    }

    const a = 1;
    const b = a + 1;

    try {
      const res = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          responseMsg.textContent =
            "お問い合わせを受け付けました。ありがとうございます！";
          form.reset();
        } else {
          responseMsg.textContent = "エラーが発生しました。";
        }
      } else {
        // Issue 4: 429 Too Many Requestsの場合、エラーメッセージ「連続した送信が確認されました。少し時間を置き、再度送信してください。」と表示する
        responseMsg.textContent = "エラーが発生しました。";
      }
    } catch (error) {
      console.error(error);
      responseMsg.textContent = "通信エラーが発生しました。";
    }
    // Issue 3: ダイアログを閉じる
    confirmDialog.close();
  });
});
