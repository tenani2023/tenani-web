// =====================================================
// TENANi - お知らせページ JavaScript
// ニュースフィルタリング、ページネーション管理
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    // ===== グローバル変数 =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');
    const newsGrid = document.getElementById('newsGrid');
    const paginationNumbers = document.querySelector('.pagination-numbers');
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    // ローディング画面を非表示
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 800);
    }
    
    // ===== AOSの初期化 =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // ===== カテゴリーフィルター =====
    let currentFilter = 'all';
    
    // 日付順にソートする関数
    function sortNewsByDate() {
        const newsContainer = document.getElementById('newsGrid');
        const newsArray = Array.from(newsItems);
        
        // 日付を抽出してソート
        newsArray.sort((a, b) => {
            const dateA = extractDate(a);
            const dateB = extractDate(b);
            return dateB - dateA; // 新しい順
        });
        
        // DOMを再配置
        newsArray.forEach(item => {
            newsContainer.appendChild(item);
        });
    }
    
    // 日付を抽出する関数
    function extractDate(newsItem) {
        const year = parseInt(newsItem.querySelector('.year').textContent);
        const monthDay = newsItem.querySelector('.month-day').textContent;
        const [month, day] = monthDay.split('.').map(num => parseInt(num));
        return new Date(year, month - 1, day);
    }
    
    // 初期ソート
    sortNewsByDate();
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // アクティブ状態の更新
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // フィルタリング
            filterNews(filter);
            currentFilter = filter;
            
            // ページをリセット
            currentPage = 1;
            updatePagination();
        });
    });
    
    function filterNews(category) {
        newsItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'grid';
                // アニメーションの再適用
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // ===== ページネーション =====
    let currentPage = 1;
    const itemsPerPage = 6;
    const totalPages = 10; // 仮の総ページ数
    
    function updatePagination() {
        // ページ番号の更新
        if (paginationNumbers) {
            paginationNumbers.innerHTML = '';
            
            // 最初のページ
            if (currentPage > 3) {
                addPageNumber(1);
                if (currentPage > 4) {
                    const dots = document.createElement('span');
                    dots.className = 'pagination-dots';
                    dots.textContent = '...';
                    paginationNumbers.appendChild(dots);
                }
            }
            
            // 現在のページ周辺
            for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
                addPageNumber(i);
            }
            
            // 最後のページ
            if (currentPage < totalPages - 2) {
                if (currentPage < totalPages - 3) {
                    const dots = document.createElement('span');
                    dots.className = 'pagination-dots';
                    dots.textContent = '...';
                    paginationNumbers.appendChild(dots);
                }
                addPageNumber(totalPages);
            }
        }
        
        // ボタンの有効/無効
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages;
        }
    }
    
    function addPageNumber(number) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'pagination-number';
        pageBtn.textContent = number;
        
        if (number === currentPage) {
            pageBtn.classList.add('active');
        }
        
        pageBtn.addEventListener('click', function() {
            currentPage = number;
            updatePagination();
            loadNewsPage(currentPage);
        });
        
        paginationNumbers.appendChild(pageBtn);
    }
    
    // 前へ/次へボタン
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
                loadNewsPage(currentPage);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
                loadNewsPage(currentPage);
            }
        });
    }
    
    // ページ読み込み（実際のプロジェクトではAjaxで実装）
    function loadNewsPage(page) {
        // ページトップへスクロール
        window.scrollTo({
            top: document.querySelector('.news-list-section').offsetTop - 100,
            behavior: 'smooth'
        });
        
        // ここでAjaxリクエストを送信してニュースを取得
        console.log(`Loading page ${page} with filter ${currentFilter}`);
    }
    
    // ===== ニュース記事のホバーエフェクト =====
    newsItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // ===== スムーススクロール =====
    const header = document.querySelector('.header');
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== モバイルメニュー =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // ===== 宇宙エフェクト（控えめ） =====
    function createSpaceParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(255, 255, 255, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '-10px';
        particle.style.zIndex = '1';
        
        document.body.appendChild(particle);
        
        const duration = Math.random() * 3000 + 2000;
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                particle.style.top = progress * (window.innerHeight + 20) - 10 + 'px';
                particle.style.opacity = 1 - progress;
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        animate();
    }
    
    // 定期的にパーティクルを生成
    setInterval(createSpaceParticle, 500);
    
    // 初期化
    updatePagination();
});