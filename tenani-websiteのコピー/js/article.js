// 記事詳細ページのJavaScript

// URLパラメータから記事IDを取得
function getArticleIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// 記事を表示
function displayArticle() {
    const articleId = getArticleIdFromUrl();
    
    if (!articleId) {
        // 記事IDがない場合はニュース一覧にリダイレクト
        window.location.href = './news.html';
        return;
    }
    
    const article = getArticleById(articleId);
    
    if (!article) {
        // 記事が見つからない場合は404表示
        displayNotFound();
        return;
    }
    
    // その他カテゴリーの記事は記事ページを表示しない
    if (article.category === 'other') {
        displayCategoryNotSupported();
        return;
    }
    
    // メタ情報の更新
    document.title = `${article.title} - TENANi`;
    document.querySelector('meta[name="description"]').content = article.excerpt;
    document.querySelector('meta[property="og:title"]').content = `${article.title} - TENANi`;
    document.querySelector('meta[property="og:description"]').content = article.excerpt;
    if (article.image) {
        document.querySelector('meta[property="og:image"]').content = article.image;
    }
    
    // パンくずリストの更新
    document.getElementById('breadcrumbTitle').textContent = article.title;
    
    // 記事情報の表示
    document.getElementById('articleDate').textContent = article.date;
    document.getElementById('articleCategory').textContent = article.categoryLabel;
    document.getElementById('articleCategory').className = `article-category category-${article.category}`;
    document.getElementById('articleTitle').textContent = article.title;
    document.getElementById('articleAuthor').textContent = article.author;
    
    // アイキャッチ画像の表示
    if (article.image) {
        const imageContainer = document.getElementById('featuredImageContainer');
        const image = document.getElementById('featuredImage');
        image.src = article.image;
        image.alt = article.title;
        
        // 画像の読み込みエラーハンドリング
        image.onerror = function() {
            console.error('画像の読み込みに失敗しました:', article.image);
            // プレースホルダー画像を表示
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iI2Y4ZjlmYSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNmM3NTdkIj7nlLvlg4/jgpLoqq3jgb/ovrzjgb/kuK08L3RleHQ+Cjwvc3ZnPg==';
        };
        
        // 画像の読み込み成功
        image.onload = function() {
            console.log('画像が正常に読み込まれました:', article.image);
        };
        
        imageContainer.style.display = 'block';
    }
    
    // 記事本文の表示
    document.getElementById('articleContent').innerHTML = article.content;
    
    // タグの表示
    if (article.tags && article.tags.length > 0) {
        const tagsList = document.getElementById('tagsList');
        tagsList.innerHTML = article.tags.map(tag => 
            `<a href="./news.html?tag=${encodeURIComponent(tag)}" class="tag-item">#${tag}</a>`
        ).join('');
    } else {
        document.getElementById('articleTags').style.display = 'none';
    }
    
    // 関連記事の表示
    displayRelatedArticles(article);
}

// 404表示
function displayNotFound() {
    const articleContent = document.querySelector('.article-container');
    articleContent.innerHTML = `
        <div class="not-found" style="text-align: center; padding: 4rem 0;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">404</h1>
            <p style="font-size: 1.25rem; color: #6c757d; margin-bottom: 2rem;">お探しの記事が見つかりませんでした。</p>
            <a href="./news.html" class="btn-primary">お知らせ一覧へ戻る</a>
        </div>
    `;
}

// カテゴリー非対応表示
function displayCategoryNotSupported() {
    const articleContent = document.querySelector('.article-container');
    articleContent.innerHTML = `
        <div class="not-supported" style="text-align: center; padding: 4rem 0;">
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">実績報告</h2>
            <p style="font-size: 1.125rem; color: #6c757d; margin-bottom: 2rem;">実績報告の詳細はお知らせ一覧でご確認ください。</p>
            <a href="./news.html" class="btn-primary">お知らせ一覧へ戻る</a>
        </div>
    `;
}

// 関連記事の表示
function displayRelatedArticles(currentArticle) {
    const allArticles = getAllArticles();
    // 現在の記事を除外し、同じカテゴリーの記事を優先的に表示
    const relatedArticles = allArticles
        .filter(article => article.id !== currentArticle.id)
        .sort((a, b) => {
            // 同じカテゴリーの記事を優先
            if (a.category === currentArticle.category && b.category !== currentArticle.category) return -1;
            if (a.category !== currentArticle.category && b.category === currentArticle.category) return 1;
            // 日付順
            return new Date(b.date) - new Date(a.date);
        })
        .slice(0, 3);
    
    const relatedContainer = document.getElementById('relatedArticles');
    if (relatedArticles.length === 0) {
        document.querySelector('.related-articles').style.display = 'none';
        return;
    }
    
    relatedContainer.innerHTML = relatedArticles.map(article => `
        <a href="./article.html?id=${article.id}" class="related-article-item">
            <div class="related-article-date">${article.date}</div>
            <h3 class="related-article-title">${article.title}</h3>
            <span class="related-article-category category-${article.category}">${article.categoryLabel}</span>
        </a>
    `).join('');
}

// SNSシェア機能
function shareX() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.getElementById('articleTitle').textContent + ' - TENANi');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareLine() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.getElementById('articleTitle').textContent);
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        // コピー成功時の処理
        const button = event.target.closest('.share-copy');
        const originalText = button.innerHTML;
        button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg><span>コピーしました！</span>';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    });
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    // ローディング画面の非表示
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    
    // AOS初期化
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
    
    // 記事の表示
    displayArticle();
    
    // モバイルメニューの処理
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
});