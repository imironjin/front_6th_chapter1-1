import { getProducts } from "../api/productApi";
import ProductCard from "../components/product-list/product-card";
import ProductListLoading from "../components/product-list/product-list-loading";

export default function ProductListPage() {
  let container = null;

  const params = {
    page: 1,
    limit: 20,
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
  };

  const loadAndRender = async () => {
    container.innerHTML = ProductListLoading();
    try {
      const products = await getProducts(params);
      console.log(products);
      render(products);
    } catch (error) {
      console.error("상품 로딩 실패:", error);
      container.innerHTML = /* html */ `
        <p class="text-red-500 mb-4">상품을 불러오는 데 실패했습니다.</p>
        <button id="retry-btn">재시도</button>
      `;

      const retryBtn = document.getElementById("retry-btn");

      if (retryBtn) {
        retryBtn.addEventListener("click", loadAndRender);
      }
    }
  };

  const mount = async (target) => {
    container = target;

    loadAndRender();

    // 선택 변경 시 즉시 목록에 반영된다
    container.addEventListener("change", (e) => {
      if (e.target.id === "limit-select") {
        // e.target.value의 경우 string이기 때문에 형변환
        params.limit = parseInt(e.target.value, 10);
        loadAndRender();
      } else if (e.target.id === "sort-select") {
        params.sort = e.target.value;
        loadAndRender();
      }
    });

    // 정렬 변경 시 목록에 반영된다
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("category1-filter-btn")) {
        params.category1 = e.target.dataset.category1;
        params.category2 = ""; // 1depth 선택 시 2depth 초기화
        loadAndRender();
      } else if (e.target.classList.contains("category2-filter-btn")) {
        params.category2 = e.target.dataset.category2;
        loadAndRender();
      } else if (e.target.dataset.breadcrumb === "reset") {
        // 전체 카테고리로 리셋
        params.category1 = "";
        params.category2 = "";
        loadAndRender();
      }
    });

    // Enter 키로 검색이 수행할 수 있으며, 검색어와 일치하는 상품들만 목록에 표시된다
    container.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.target.id === "search-input") {
        params.search = e.target.value;
        loadAndRender();
      }
    });
  };

  const render = (products) => {
    const { products: productList, pagination } = products;

    container.innerHTML = /* HTML */ `
      <div class="bg-gray-50">
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
                  <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
                </div>
                <!-- 1depth 카테고리 -->
                <div class="flex flex-wrap gap-2">
                  <button
                    data-category1="생활/건강"
                    class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    생활/건강
                  </button>
                  <button
                    data-category1="디지털/가전"
                    class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    디지털/가전
                  </button>
                </div>
                <!-- 2depth 카테고리 -->
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

  const unmount = () => {
    if (container) container.innerHTML = "";
  };

  return { mount, render, unmount };
}
