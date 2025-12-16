$(function () {
  // 今日日付取得
  const today = new Date();
  const formatted = today.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  $("#todayDate").text(formatted);

  // 翻訳ボタン動作
  $("#translateBtn").on("click", async () => {
    const ja = $("#diary").val();

    if (!ja) {
      alert("日記を書いてね。");
      return;
    }

    try {
      // 翻訳
      const res = await axios.post("/api/translate", {
        text: ja,
        target: "en",
      });

      $("#translated").text(res.data.translatedText);

      // Googleカレンダーへ登録
      try {
        await axios.post("/api/calendar", {
          title: "One Line Diary",
          description: res.data.translatedText,
          date: new Date().toISOString().slice(0, 10),
        });
      } catch (err) {
        // 初回OAuth対応
        if (err.response && err.response.status === 401) {
          window.location.href = "/api/calendar/auth";
          return;
        }
        throw err;
      }
    } catch (err) {
      console.error(err);
      alert("エラーが起きたよ（コンソール確認してみて）");
    }
  });
});
