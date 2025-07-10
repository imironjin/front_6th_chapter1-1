/**
 * @typedef {Object} Product
 * @property {string} title 상품명
 * @property {string} link 상품 상세 페이지 URL
 * @property {string} image 상품 이미지 URL
 * @property {string} lprice 최저가 (문자열)
 * @property {string} hprice 최고가 (문자열, 빈 문자열일 수 있음)
 * @property {string} mallName 쇼핑몰 이름
 * @property {string} productId 상품 ID
 * @property {string} productType 상품 유형 (숫자 문자열)
 * @property {string} brand 브랜드명 (빈 문자열일 수 있음)
 * @property {string} maker 제조사 (빈 문자열일 수 있음)
 * @property {string} category1 1차 카테고리
 * @property {string} category2 2차 카테고리
 * @property {string} category3 3차 카테고리
 * @property {string} category4 4차 카테고리
 */

/**
 * @param {Product} product
 * @returns {string} 상품 카드
 */
const ProductCard = (product) => {
  return /* HTML */ `
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
      data-product-id="${product.productId}"
    >
      <!-- 상품 이미지 -->
      <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
        <img
          src="${product.image}"
          alt="${product.title}"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      <!-- 상품 정보 -->
      <div class="p-3">
        <div class="cursor-pointer product-info mb-3">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${product.title}</h3>
          <p class="text-xs text-gray-500 mb-2">${product.brand}</p>
          <p class="text-lg font-bold text-gray-900">${Number(product.lprice).toLocaleString()}원</p>
        </div>
        <!-- 장바구니 버튼 -->
        <button
          class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                         hover:bg-blue-700 transition-colors add-to-cart-btn"
          data-product-id="${product.productId}"
        >
          장바구니 담기
        </button>
      </div>
    </div>
  `;
};

export default ProductCard;
