# ellie-liin.com

Ellie Lin 的作品集網站，純 HTML／CSS／JS，不需要安裝任何套件或建置步驟。

## 檔案結構

- `index.html`：首頁（扇形卡片、作品、How I Work With AI）
- `about-me.html`：About 頁
- `project-ember.html`、`project-skysports.html`、`project-equivalence.html`、`project-metagigs.html`：四個 case study
- `404.html`：找不到頁面時顯示
- `assets/`：共用的樣式（site.css）、互動（site.js）、字體（fonts.css）
- `img/`：所有圖片和影片，依頁面分資料夾
- `vercel.json`：讓網址不用加 .html（例如 `/project-ember`）

## 部署到 Vercel

1. 把整個資料夾上傳到一個 GitHub repo（根目錄要直接看到 `index.html`）。
2. 在 Vercel 按 Add New → Project，匯入這個 repo。Framework Preset 選 **Other**，其他設定都不用改，按 Deploy。
3. 先用 Vercel 給的 `xxx.vercel.app` 網址檢查每一頁。
4. 沒問題後，到 Settings → Domains 加入 `ellie-liin.com`，依照畫面上的 DNS 紀錄到網域商修改。
5. 在 Framer 移除自訂網域，但保留 Framer 專案當備份。

## 之後要修改內容

- 文字直接改對應的 `.html` 檔。
- 換圖片時，把新檔案放進 `img/` 對應資料夾，再改 HTML 裡的檔名。
- 推到 GitHub 的 main 分支後，Vercel 會自動重新部署。

## 小彩蛋

- 首頁點左上角 logo 會噴出小花。
- 頁尾三朵花都點過會下花雨。
- 在鍵盤上打 `ellie` 也會下花雨。
