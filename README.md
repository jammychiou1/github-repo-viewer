# Github Repository Viewer
Deployed URL: https://github-repo-viewer-jammychiou1.netlify.app/
啟動方式:
```={bash}
git clone https://github.com/jammychiou1/github-repo-viewer.git
cd github-repo-viewer
# 以下是使用 yarn 來安裝 dependencies
yarn
yarn start
```

## 作業架構

### 使用的套件

- [React Router v6](https://reactrouter.com/)
    - 用來處理 client-side routing
- [React Query](https://react-query.tanstack.com/)
    - 幫助處理 API 請求的 pagination 跟 caching，以及方便自己寫的 Component 使用 API 請求。
- [React Intersection Observer](https://github.com/thebuilder/react-intersection-observer)
    - 此套件將 [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 包裝成 Hook 或 Component 的形式。我用了這個套件來偵測什麼時候畫面捲動到最下面。
    - 用來偵測畫面是否捲動到最下面的套件還有很多，但大多數都是用 onScroll 事件，透過 dom node 高度的加加減減來計算的，我感覺這個方法感覺不是太理想。另外，在我的測試中，如果一開始 10 個 repository 加起來的高度不夠，畫面就會不能捲動，onScroll 事件也就永遠不會觸發，因此就不會載入額外更多的 repository。為了解決此問題，在更多的調查後，我發現有 Intersection Observer API 可以使用，我認為比較有效率，也能避免前述的問題。於是在考慮之後，我最後決定使用了這個套件。
- [Mock Service Worker](https://mswjs.io/)
    - 用來幫助測試需要發送 API 請求的 Component

### App.js, ReposRouting.js, UsersRouting.js
- 使用 React Router 來 parse URL 中的 username / repository name，並當作 props 來 render RepoList 或 RepoPage，也會過濾掉未知的 URL 或是不合法的 username / repository name。
- 分成多個檔案的原因，主要是設想未來可能 users/ 底下或是 users/{username}/repos/ 底下會有更多的頁面，擔心如果放在同一份檔案的話未來可能會造成檔案太大不易讀，因此先行設計成獨立的檔案。

### RepoList.js
- 繪製 Repository 列表，並且利用 React Intersection Observer 中的 Inview Component 來偵測畫面是否捲動到最下面。

### RepoPage.js
- 繪製單一 repository 的頁面。

### GithubAPIWrapper.js
- 為了配合 React Query 的要求，將對 Github 的 API 請求包成一個 function。
- 有對 Github 的 API 回傳的 json 做基本的處理，只留下需要用到的幾個 properties。

### Caching
- 由於 RepoList.js, RepoPage.js 都是透過 React Query 來發送 API 請求，而 React Query 有 caching 的功能，因此在這個 webapp 中，如果透過 RepoList 中的連結或是上下一頁的功能，而第二次造訪相同的頁面時，React Query 會使用 cache 住的資料，而不會發出重複的 API 請求。

### Tests
- 我在開發這個 webapp 的過程中，有同時撰寫了一些 test（檔名形如 xxx.test.js 的檔案）。這些 tests 讓我可以在之後修改程式碼的時候，確保不會造成之前完成的功能不會被改壞。
