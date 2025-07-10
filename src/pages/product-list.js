import { useState } from "../utils/use-state";
import { getCategories, getProducts } from "../api/productApi";
import ProductCard from "../components/product-list/product-card";
import ProductListLoading from "../components/product-list/product-list-loading";

const ProductListPage = () => {
  let container = null;

  const [getParams, setParams, subscribeParams] = useState({
    page: 1,
    limit: 20,
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
  });

  const render = (products, categories) => {
    const params = getParams();

    if (!products) {
      container.innerHTML = ProductListLoading();
      return;
    }

    const { products: productList, pagination } = products;

    // 1depth 카테고리 버튼 (선택 안됐을 때만 표시)
    const category1Buttons = !params.category1
      ? Object.keys(categories)
          .map(
            (category1) => /* HTML */ `
              <button
                data-category1="${category1}"
                class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
          bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                ${category1}
              </button>
            `,
          )
          .join("")
      : "";

    // 2depth 카테고리 버튼 (선택된 category1 하위만 표시)
    const category2Buttons = params.category1
      ? Object.keys(categories[params.category1] || {})
          .map((category2) => {
            const isSelected = params.category2 === category2;
            return `
          <button
            data-category1="${params.category1}"
            data-category2="${category2}"
            class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
            ${
              isSelected
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }"
          >
            ${category2}
          </button>
        `;
          })
          .join("")
      : "";

    // 브레드크럼 HTML 추가
    const breadcrumbHTML = /* HTML */ `
      <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
      ${params.category1 ? /* HTML */ `<span class="text-xs text-gray-500">&gt;</span>` : ""}
      ${params.category1
        ? /* HTML */
          `<button
            data-breadcrumb="category1"
            data-category1="${params.category1}"
            class="text-xs hover:text-blue-800 hover:underline"
          >
            ${params.category1}
          </button>`
        : ""}
      ${params.category2 ? /* HTML */ `<span class="text-xs text-gray-500">&gt;</span>` : ""}
      ${params.category2
        ? /* HTML */
          `<button
            data-breadcrumb="category2"
            data-category2="${params.category2}"
            class="text-xs hover:text-blue-800 hover:underline"
          >
            ${params.category2}
          </button>`
        : ""}
    `;

    container.innerHTML = /* HTML */ `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-40">
          <div class="max-w-md mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
              <h1 class="text-xl font-bold text-gray-900">
                <a href="/" data-link="">쇼핑몰</a>
              </h1>
              <div class="flex items-center space-x-2">
                <!-- 장바구니 아이콘 -->
                <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                    ></path>
                  </svg>
                  <span
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >4</span
                  >
                </button>
              </div>
            </div>
          </div>
        </header>
        <main class="max-w-md mx-auto px-4 py-4">
          <!-- 검색 및 필터 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <!-- 검색창 -->
            <div class="mb-4">
              <div class="relative">
                <input
                  type="text"
                  id="search-input"
                  placeholder="상품명을 검색해보세요..."
                  value="${params.search}"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <!-- 필터 옵션 -->
            <div class="space-y-3">
              <!-- 카테고리 필터 -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">카테고리:</label>
                  ${breadcrumbHTML}
                </div>
                <!-- 1depth 카테고리 -->
                ${category1Buttons /* HTML */
                  ? `
                  <div class="flex flex-wrap gap-2">
                  ${category1Buttons}
                  </div>
                  `
                  : ""}
                <!-- 2depth 카테고리 -->
                ${category2Buttons
                  ? /* HTML */ `
                      <div class="space-y-2">
                        <div class="flex flex-wrap gap-2">${category2Buttons}</div>
                      </div>
                    `
                  : ""}
              </div>
              <!-- 기존 필터들 -->
              <div class="flex gap-2 items-center justify-between">
                <!-- 페이지당 상품 수 -->
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">개수:</label>
                  <select
                    id="limit-select"
                    class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="10" ${params.limit === 10 ? "selected" : ""}>10개</option>
                    <option value="20" ${params.limit === 20 ? "selected" : ""}>20개</option>
                    <option value="50" ${params.limit === 50 ? "selected" : ""}>50개</option>
                    <option value="100" ${params.limit === 100 ? "selected" : ""}>100개</option>
                  </select>
                </div>
                <!-- 정렬 -->
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">정렬:</label>
                  <select
                    id="sort-select"
                    class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="price_asc" ${params.sort === "price_asc" ? "selected" : ""}>가격 낮은순</option>
                    <option value="price_desc" ${params.sort === "price_desc" ? "selected" : ""}>가격 높은순</option>
                    <option value="name_asc" ${params.sort === "name_asc" ? "selected" : ""}>이름순</option>
                    <option value="name_desc" ${params.sort === "name_desc" ? "selected" : ""}>이름 역순</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <!-- 상품 목록 -->
          <div class="mb-6">
            <div>
              <!-- 상품 개수 정보 -->
              <div class="mb-4 text-sm text-gray-600">
                총 <span class="font-medium text-gray-900">${pagination.total}개</span>의 상품
              </div>
              <!-- 상품 그리드 -->
              <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                ${productList.map((product) => ProductCard(product)).join("")}
              </div>

              <div class="text-center py-4 text-sm text-gray-500">모든 상품을 확인했습니다</div>
            </div>
          </div>
        </main>
        <footer class="bg-white shadow-sm sticky top-0 z-40">
          <div class="max-w-md mx-auto py-8 text-center text-gray-500">
            <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
          </div>
        </footer>
      </div>
    `;
  };

  const loadAndRender = async (showLoading = true) => {
    if (showLoading) {
      render(null, null);
    }

    try {
      const [products, categories] = await Promise.all([getProducts(getParams()), getCategories()]);

      render(products, categories);
    } catch (error) {
      console.error("상품 로딩 실패:", error);
      container.innerHTML = /* html */ `
        <p class="text-red-500 mb-4">상품을 불러오는 데 실패했습니다.</p>
        <button id="retry-btn">재시도</button>
      `;

      const retryBtn = document.getElementById("retry-btn");
      retryBtn?.addEventListener("click", loadAndRender);
    }
  };

  const mount = (target) => {
    container = target;
    loadAndRender(true); // 최초 렌더 시 로딩 표시

    // 상태 변화 시 재호출
    subscribeParams(() => loadAndRender(false));

    // 이벤트 리스너 등록
    container.addEventListener("change", (e) => {
      if (e.target.id === "limit-select") {
        setParams({ limit: parseInt(e.target.value, 10) });
      } else if (e.target.id === "sort-select") {
        setParams({ sort: e.target.value });
      }
    });

    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("category1-filter-btn")) {
        setParams({
          category1: e.target.dataset.category1,
          category2: "",
        });
      } else if (e.target.classList.contains("category2-filter-btn")) {
        setParams({
          category2: e.target.dataset.category2,
        });
      } else if (e.target.dataset.breadcrumb === "reset") {
        setParams({
          category1: "",
          category2: "",
        });
      } else if (e.target.dataset.breadcrumb === "category1") {
        setParams({
          category1: e.target.dataset.category1,
          category2: "",
        });
      } else if (e.target.dataset.breadcrumb === "category2") {
        setParams({
          category1: getParams().category1,
          category2: e.target.dataset.category2,
        });
      }

      const card = e.target.closest(".product-card");
      if (card) {
        const productId = card.dataset.productId;
        if (productId) {
          history.pushState(null, "", `/product/${productId}`);
          const popStateEvent = new PopStateEvent("popstate", { state: null });
          dispatchEvent(popStateEvent);
        }
      }
    });

    container.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.target.id === "search-input") {
        setParams({ search: e.target.value });
      }
    });
  };

  const unmount = () => {
    if (container) container.innerHTML = "";
  };

  return {
    mount,
    render,
    unmount,
  };
};

export default ProductListPage;
