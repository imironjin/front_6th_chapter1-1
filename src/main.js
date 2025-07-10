import NotFoundPage from "./pages/404.js";
import ProductDetailPage from "./pages/product-detail.js";
import ProductListPage from "./pages/product-list.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 라우트 정의
const routes = [
  {
    path: "/",
    view: () => ProductListPage(),
  },
  {
    path: "/product/:id",
    view: () => ProductDetailPage(),
  },
  {
    path: "/404",
    view: () => NotFoundPage(),
  },
];

/** 현재 뷰 인스턴스 */
let currentViewInstance = null;

/** 라우터 렌더 함수 */
function renderRoute() {
  const path = location.pathname;
  let route = routes.find((r) => r.path === path);

  // exact match가 없으면, dynamic route 처리
  if (!route) {
    route = routes.find((r) => {
      if (r.path.includes("/:")) {
        const basePath = r.path.split("/:")[0];
        return path.startsWith(basePath);
      }
      return false;
    });
  }

  // 라우트 정의에 없으면 404 페이지로 이동
  if (!route) {
    console.error("404 Not Found");
    history.replaceState(null, "", "/404");
    return renderRoute();
  }

  // unmount 이전 페이지
  if (currentViewInstance?.unmount) {
    currentViewInstance.unmount();
  }

  // mount 새 페이지
  const viewInstance = route.view();
  currentViewInstance = viewInstance;

  const root = document.getElementById("root");
  currentViewInstance.mount(root);
}

/** 링크 클릭 이벤트 핸들러 */
function handleLinkClick(event) {
  const link = event.target.closest("a");
  if (!link || link.origin !== location.origin) return;

  event.preventDefault();
  history.pushState(null, "", link.pathname);
  renderRoute();
}

/** 라우터 초기화 */
function initRouter() {
  window.addEventListener("popstate", renderRoute);
  document.addEventListener("click", handleLinkClick);
  renderRoute();
}

function main() {
  initRouter();
}

// 실행
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
