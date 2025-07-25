// =====================================================
// TENANi - メインJavaScript
// インタラクション、アニメーション、動的コンテンツ管理
// =====================================================

// ローディング画面を早期に非表示
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 800);
    }
});

// フォールバック: DOM読み込み後にも非表示
document.addEventListener('DOMContentLoaded', function() {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 1000);
    }
    
    // ===== グローバル変数 =====
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    // ===== ヘッダーのスクロール処理 =====
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.backgroundColor = 'rgba(128, 128, 128, 0.4)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(128, 128, 128, 0.3)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== モバイルメニュー =====
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // ===== スムーススクロール =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // モバイルメニューを閉じる
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // ===== AOSの初期化 =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // ===== サービスタブ =====
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // ボタンのアクティブ状態を切り替え
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // タブパネルの表示を切り替え
            tabPanes.forEach(pane => {
                if (pane.id === targetTab) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
    
    // ===== ポートフォリオフィルター =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.getElementById('portfolioGrid');
    const portfolioMore = document.getElementById('portfolioMore');
    const showAllBtn = document.getElementById('showAllPortfolio');
    let currentFilter = 'web';
    let showingAll = false;
    
    // ポートフォリオアイテムの表示
    function displayPortfolioItems(filter = 'web', showAll = false) {
        portfolioGrid.innerHTML = '';
        currentFilter = filter;
        showingAll = showAll;
        
        const filteredItems = filter === 'all' 
            ? portfolioData 
            : portfolioData.filter(item => item.category === filter);
        
        // IDの降順でソート（新しいものが最初に来る）
        const sortedItems = filteredItems.sort((a, b) => b.id - a.id);
        
        // 表示する個数を決定（初期は9個まで）
        const itemsToShow = showAll ? sortedItems : sortedItems.slice(0, 9);
        
        itemsToShow.forEach((item, index) => {
            const portfolioItem = createPortfolioItem(item);
            portfolioItem.style.animationDelay = `${index * 0.1}s`;
            portfolioGrid.appendChild(portfolioItem);
        });
        
        // 「もっと見る」ボタンの表示/非表示
        if (sortedItems.length > 9 && !showAll) {
            portfolioMore.style.display = 'block';
            showAllBtn.textContent = 'もっと見る';
            showAllBtn.disabled = false;
        } else if (sortedItems.length > 9 && showAll) {
            portfolioMore.style.display = 'block';
            showAllBtn.textContent = '閉じる';
            showAllBtn.disabled = false;
        } else {
            portfolioMore.style.display = 'none';
        }
    }
    
    // ポートフォリオアイテムの作成
    function createPortfolioItem(item) {
        const div = document.createElement('div');
        div.className = 'portfolio-item';
        div.setAttribute('data-aos', 'zoom-in');
        
        // カテゴリーに応じたラベル
        const categoryLabels = {
            'web': 'Web制作',
            'graphic': 'グラフィック',
            'line': 'LINE構築',
            'system': 'システム'
        };
        
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="portfolio-image" 
                 onerror="this.src='https://via.placeholder.com/400x250/CCCCCC/666666?text=${encodeURIComponent(item.title)}'">
            <div class="portfolio-info">
                <span class="portfolio-category">${categoryLabels[item.category]}</span>
                <h3 class="portfolio-title">${item.title}</h3>
                <p class="portfolio-description">${item.description}</p>
                ${item.testimonial ? `
                    <div class="portfolio-testimonial">
                        ${item.testimonial}
                    </div>
                ` : ''}
            </div>
        `;
        
        return div;
    }
    
    // フィルターボタンのイベント
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            displayPortfolioItems(filter, false); // フィルター変更時は9個制限に戻す
        });
    });
    
    // 「すべて見る」ボタンのイベント
    if (showAllBtn) {
        showAllBtn.addEventListener('click', function() {
            if (showingAll) {
                // 現在すべて表示中の場合、9件のみに戻す
                displayPortfolioItems(currentFilter, false);
            } else {
                // 現在9件のみ表示中の場合、すべて表示
                displayPortfolioItems(currentFilter, true);
            }
        });
    }
    
    // 初期表示
    if (typeof portfolioData !== 'undefined' && portfolioGrid) {
        displayPortfolioItems('web');
    }
    
    // ===== FAQ アコーディオン =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            // 同じカテゴリー内の他のアイテムを閉じる
            const category = this.closest('.faq-category');
            category.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // クリックしたアイテムをトグル
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // ===== サービス詳細モーダル =====
    const detailButtons = document.querySelectorAll('.detail-btn');
    const modal = document.getElementById('serviceModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');
    
    // サービス詳細データ
    const serviceDetails = {
        web: {
            title: 'ホームページ制作',
            icon: '🌐',
            content: `
                <h2>ホームページ制作サービス</h2>
                <p>お客様のビジネスに最適な、魅力的で使いやすいウェブサイトを制作します。</p>
                
                <h3>こんな方におすすめ</h3>
                <ul>
                    <li>ホームページを新しく作りたい</li>
                    <li>古いサイトをリニューアルしたい</li>
                    <li>スマホ対応にしたい</li>
                    <li>SEO対策を強化したい</li>
                </ul>
                
                <h3>制作の流れ</h3>
                <ol>
                    <li>ヒアリング（お客様のご要望を詳しくお聞きします）</li>
                    <li>企画・構成（サイトの設計図を作成）</li>
                    <li>デザイン制作（見た目のデザインを作成）</li>
                    <li>コーディング（実際のウェブサイトを構築）</li>
                    <li>テスト・修正（動作確認と調整）</li>
                    <li>公開・納品</li>
                </ol>
                
                <h3>料金の目安</h3>
                <p>5万円〜（ページ数や機能により変動します）</p>
            `
        },
        graphic: {
            title: 'グラフィックデザイン',
            icon: '🎨',
            content: `
                <h2>グラフィックデザインサービス</h2>
                <p>印象的で効果的なデザインで、お客様のビジネスをサポートします。</p>
                
                <h3>制作可能なアイテム</h3>
                <ul>
                    <li>名刺・ショップカード</li>
                    <li>チラシ・フライヤー</li>
                    <li>パンフレット・カタログ</li>
                    <li>ポスター</li>
                    <li>ロゴデザイン</li>
                    <li>SNS用画像</li>
                    <li>バナー広告</li>
                </ul>
                
                <h3>デザインの特徴</h3>
                <ul>
                    <li>ターゲットに響くデザイン</li>
                    <li>ブランドイメージの統一</li>
                    <li>印刷に適した高品質データ</li>
                    <li>修正対応も丁寧に</li>
                </ul>
                
                <h3>料金の目安</h3>
                <p>名刺：15,000円〜<br>チラシ：30,000円〜<br>ロゴ：50,000円〜</p>
            `
        },
        line: {
            title: 'LINE公式アカウント構築',
            icon: '💬',
            content: `
                <h2>LINE公式アカウント構築サービス</h2>
                <p>LINEを活用した顧客コミュニケーションと業務効率化を実現します。</p>
                
                <h3>できること</h3>
                <ul>
                    <li>リッチメニューのカスタマイズ</li>
                    <li>自動応答メッセージの設定</li>
                    <li>予約システムの連携</li>
                    <li>クーポン・ポイントカード機能</li>
                    <li>顧客データベースとの連携</li>
                    <li>アンケート・申込フォーム</li>
                </ul>
                
                <h3>導入のメリット</h3>
                <ul>
                    <li>顧客との距離が近くなる</li>
                    <li>リピート率の向上</li>
                    <li>業務の自動化で時間削減</li>
                    <li>マーケティング効果の向上</li>
                </ul>
                
                <h3>料金の目安</h3>
                <p>初期構築：50,000円〜<br>運用サポート：月額10,000円〜</p>
            `
        },
        ai: {
            title: 'AI業務効率化システム',
            icon: '🤖',
            content: `
                <h2>AI業務効率化システム</h2>
                <p>最新のAI技術を活用して、日々の業務を劇的に効率化します。</p>
                
                <h3>導入可能なシステム</h3>
                <ul>
                    <li>スマート顧客管理（CRM）</li>
                    <li>AIチャットボット</li>
                    <li>自動文書作成システム</li>
                    <li>タスク管理・スケジューリング</li>
                    <li>売上予測・分析ツール</li>
                    <li>在庫管理システム</li>
                </ul>
                
                <h3>期待できる効果</h3>
                <ul>
                    <li>作業時間を最大70%削減</li>
                    <li>ヒューマンエラーの削減</li>
                    <li>24時間365日の自動対応</li>
                    <li>データに基づく意思決定</li>
                </ul>
                
                <h3>料金の目安</h3>
                <p>システムにより異なります。<br>まずはご相談ください。</p>
            `
        }
    };
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            const details = serviceDetails[service];
            
            if (details) {
                modalBody.innerHTML = details.content;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // モーダルを閉じる
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // ===== お問い合わせフォーム =====
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // フォームデータの取得
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // ここで実際の送信処理を行う
        console.log('フォームデータ:', data);
        
        // 成功メッセージの表示（実際の実装では送信処理後に表示）
        alert('お問い合わせありがとうございます！\n内容を確認次第、ご連絡させていただきます。');
        
        // フォームのリセット
        this.reset();
    });
    
    // ===== パララックス効果（控えめ） =====
    const parallaxElements = document.querySelectorAll('.floating-bubble, .mascot-character');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // ===== 数値のカウントアップアニメーション =====
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const countUpObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.textContent);
                let currentValue = 0;
                const increment = endValue / 50;
                const duration = 2000;
                const stepTime = duration / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= endValue) {
                        target.textContent = endValue;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentValue);
                    }
                }, stepTime);
                
                countUpObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    // 数値要素を監視
    document.querySelectorAll('.price-number').forEach(element => {
        countUpObserver.observe(element);
    });

    // ===== 宇宙エフェクト追加機能 =====
    // 流星を動的に追加
    function createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.top = Math.random() * 60 + '%';
        star.style.animationDuration = (Math.random() * 4 + 6) + 's';
        star.style.animationDelay = Math.random() * 10 + 's';
        document.body.appendChild(star);
        
        // アニメーション終了後に要素を削除
        setTimeout(() => {
            star.remove();
        }, 15000);
    }
    
    // 定期的に流星を生成
    setInterval(createShootingStar, 8000);
    
    // カーソルトレイルエフェクト
    function createTrail(x, y) {
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        trail.style.width = '4px';
        trail.style.height = '4px';
        trail.style.background = 'radial-gradient(circle, rgba(255,107,53,0.8) 0%, transparent 70%)';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '1';
        trail.style.opacity = '1';
        trail.style.transform = 'scale(1)';
        trail.style.transition = 'all 0.5s ease-out';
        
        document.body.appendChild(trail);
        
        // フェードアウト効果
        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(0)';
        }, 10);
        
        // 要素を削除
        setTimeout(() => {
            trail.remove();
        }, 500);
    }
    
    // マウス移動時にトレイルを生成
    let trailTimeout;
    document.addEventListener('mousemove', function(e) {
        clearTimeout(trailTimeout);
        trailTimeout = setTimeout(() => {
            if (Math.random() > 0.8) { // 20%の確率でトレイルを生成
                createTrail(e.clientX, e.clientY);
            }
        }, 50);
    });
    
    // ネオングロー強化
    const glowElements = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-line, .service-card, .logo-text');
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2) drop-shadow(0 0 20px currentColor)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    });

    // ===== AIチャットボット機能 =====
    const aiChatbot = document.getElementById('floatingChatbot');
    let chatbotOpen = false;
    let chatMessages = [];

    if (aiChatbot) {
        aiChatbot.addEventListener('click', function() {
            if (!chatbotOpen) {
                openChatbot();
            }
        });
    }

    function openChatbot() {
        chatbotOpen = true;
        
        // チャットボットモーダルを作成
        const chatModal = document.createElement('div');
        chatModal.className = 'chat-modal';
        chatModal.innerHTML = `
            <div class="chat-container">
                <div class="chat-character-wrapper">
                    <img src="./images/chatbot/ai-character.png" alt="AI Assistant" class="chat-character" onerror="this.style.display='none'">
                </div>
                <div class="chat-header">
                    <div class="chat-title">
                        <div class="ai-avatar"></div>
                        <span>TENANi AI相談</span>
                    </div>
                    <button class="chat-close">&times;</button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message ai-message">
                        <div class="message-content">
                            こんにちは！TENANi AI相談です。<br>
                            お気軽にご質問ください。
                        </div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <div class="quick-questions">
                        <button class="quick-btn" data-question="ホームページ制作について">ホームページ制作について</button>
                        <button class="quick-btn" data-question="料金プランについて">料金プランについて</button>
                        <button class="quick-btn" data-question="制作期間について">制作期間について</button>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="chatInput" placeholder="メッセージを入力してください...">
                        <button class="chat-send" id="chatSend">送信</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(chatModal);
        
        // イベントリスナーを追加
        const chatClose = chatModal.querySelector('.chat-close');
        const chatInput = chatModal.querySelector('#chatInput');
        const chatSend = chatModal.querySelector('#chatSend');
        const quickButtons = chatModal.querySelectorAll('.quick-btn');
        
        chatClose.addEventListener('click', closeChatbot);
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        quickButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const question = this.getAttribute('data-question');
                sendMessage(question);
            });
        });
        
        // アニメーション
        setTimeout(() => {
            chatModal.classList.add('active');
        }, 10);
    }

    function closeChatbot() {
        const chatModal = document.querySelector('.chat-modal');
        if (chatModal) {
            chatModal.classList.remove('active');
            setTimeout(() => {
                chatModal.remove();
                chatbotOpen = false;
            }, 300);
        }
    }

    function sendMessage(message) {
        const chatInput = document.querySelector('#chatInput');
        const chatMessages = document.querySelector('#chatMessages');
        const text = message || chatInput.value.trim();
        
        if (!text) return;
        
        // ユーザーメッセージを追加
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-content">${text}</div>
        `;
        chatMessages.appendChild(userMessage);
        
        // 入力をクリア
        if (chatInput) {
            chatInput.value = '';
        }
        
        // AIの応答を生成
        setTimeout(() => {
            const aiResponse = generateAIResponse(text);
            const aiMessage = document.createElement('div');
            aiMessage.className = 'message ai-message';
            aiMessage.innerHTML = `
                <div class="message-content">${aiResponse}</div>
            `;
            chatMessages.appendChild(aiMessage);
            
            // スクロールを最下部に
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        // スクロールを最下部に
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateAIResponse(userMessage) {
        const responses = {
            'ホームページ制作について': 'ホームページ制作では、スマホ対応の見やすく使いやすいサイトを制作いたします。基本的なサイトは5万円から承っております。詳しい内容については、お気軽にお問い合わせください。',
            '料金プランについて': 'スタートプラン（5万円〜）、スタンダードプラン（30万円〜）、オーダーメイドプラン（要相談）をご用意しております。お客様のご要望に合わせて最適なプランをご提案いたします。',
            '制作期間について': 'シンプルなサイトで2〜3週間、標準的なサイトで1〜2ヶ月程度です。お急ぎの場合はご相談ください。プロジェクトの規模により変動いたします。',
        };
        
        // キーワードマッチング
        for (const [key, response] of Object.entries(responses)) {
            if (userMessage.includes(key) || userMessage.includes(key.replace('について', ''))) {
                return response;
            }
        }
        
        // 一般的な応答
        if (userMessage.includes('料金') || userMessage.includes('値段') || userMessage.includes('価格')) {
            return 'お見積りは無料で承っております。プロジェクトの内容により料金が変わりますので、詳しくはお問い合わせフォームよりご相談ください。';
        } else if (userMessage.includes('期間') || userMessage.includes('時間')) {
            return 'プロジェクトの規模により制作期間は変わります。まずはお気軽にご相談いただき、詳しい内容をお聞かせください。';
        } else {
            return 'ご質問ありがとうございます。詳しくは、お問い合わせフォームよりお気軽にご相談ください。専門スタッフが丁寧にお答えいたします。';
        }
    }

    // Character Carousel Functionality - Responsive sliding with mouse drag
    let currentSlide = 0;
    const totalCharacters = 8; // Total number of characters
    let visibleCharacters = 5; // Default: show 5 characters at once
    let maxSlides = totalCharacters - visibleCharacters;
    const slider = document.querySelector('.character-slider');
    const nextBtn = document.getElementById('nextCharacters');
    const prevBtn = document.getElementById('prevCharacters');
    const carousel = document.querySelector('.character-carousel');
    
    // Mouse drag variables
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let initialTransform = 0;
    
    // Scroll throttling variables
    let scrollTimeout = null;
    let isScrolling = false;
    
    // Function to get visible characters based on screen size
    function getVisibleCharacters() {
        if (window.innerWidth <= 480) {
            return 2; // Mobile: show 2 characters
        } else if (window.innerWidth <= 768) {
            return 3; // Tablet: show 3 characters
        } else {
            return 5; // Desktop: show 5 characters
        }
    }
    
    // Function to update carousel based on screen size
    function updateCarousel() {
        visibleCharacters = getVisibleCharacters();
        maxSlides = totalCharacters - visibleCharacters;
        
        // Reset to first slide if current slide is beyond new max
        if (currentSlide >= maxSlides) {
            currentSlide = Math.max(0, maxSlides);
        }
        
        showSlide(currentSlide);
    }
    
    function showSlide(slideIndex) {
        // Move the slider to show the selected position
        // Each character width is (100% / visibleCharacters)
        const characterWidth = 100 / visibleCharacters;
        const translateX = -(slideIndex * characterWidth);
        if (slider) {
            slider.style.transform = `translateX(${translateX}%)`;
        }
        
        // Update button states
        if (prevBtn) {
            if (slideIndex <= 0) {
                prevBtn.style.opacity = '0.5';
                prevBtn.disabled = true;
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.disabled = false;
            }
        }
        
        if (nextBtn) {
            if (slideIndex >= maxSlides) {
                nextBtn.style.opacity = '0.5';
                nextBtn.disabled = true;
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.disabled = false;
            }
        }
    }
    
    function slideNext() {
        if (currentSlide < maxSlides) {
            currentSlide++;
            showSlide(currentSlide);
        }
    }
    
    function slidePrev() {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    }
    
    // Mouse drag functionality
    function handleDragStart(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        currentX = startX;
        
        const characterWidth = 100 / visibleCharacters;
        initialTransform = -(currentSlide * characterWidth);
        
        if (slider) {
            slider.style.cursor = 'grabbing';
            slider.style.transition = 'none'; // Disable transition during drag
        }
    }
    
    function handleDragMove(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const deltaX = currentX - startX;
        const dragPercent = (deltaX / carousel.offsetWidth) * 100;
        
        if (slider) {
            slider.style.transform = `translateX(${initialTransform + dragPercent}%)`;
        }
    }
    
    function handleDragEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        const deltaX = currentX - startX;
        const threshold = carousel.offsetWidth * 0.15; // 15% of carousel width
        
        if (slider) {
            slider.style.cursor = 'grab';
            slider.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'; // Re-enable transition
        }
        
        // Determine slide direction based on drag distance
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0 && currentSlide > 0) {
                // Dragged right - go to previous slide
                slidePrev();
            } else if (deltaX < 0 && currentSlide < maxSlides) {
                // Dragged left - go to next slide
                slideNext();
            } else {
                // Snap back to current slide
                showSlide(currentSlide);
            }
        } else {
            // Snap back to current slide
            showSlide(currentSlide);
        }
    }
    
    // Add event listeners for buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', slideNext);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', slidePrev);
    }
    
    // Mouse wheel scroll functionality with throttling
    function handleWheelScroll(e) {
        // Prevent multiple rapid scroll events
        if (isScrolling) return;
        
        // Check if user is scrolling horizontally or vertically on the carousel
        const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX);
        
        // Set minimum scroll threshold to avoid accidental triggers
        const scrollThreshold = 10;
        
        // If scrolling vertically within carousel area, convert to horizontal scroll
        if (isVerticalScroll && Math.abs(e.deltaY) > scrollThreshold) {
            e.preventDefault();
            isScrolling = true;
            
            if (e.deltaY > 0) {
                // Scrolling down - go to next slide
                slideNext();
            } else {
                // Scrolling up - go to previous slide
                slidePrev();
            }
            
            // Reset scrolling flag after delay
            setTimeout(() => {
                isScrolling = false;
            }, 300);
        }
        // If scrolling horizontally, use that direction
        else if (isHorizontalScroll && Math.abs(e.deltaX) > scrollThreshold) {
            e.preventDefault();
            isScrolling = true;
            
            if (e.deltaX > 0) {
                // Scrolling right - go to next slide
                slideNext();
            } else {
                // Scrolling left - go to previous slide
                slidePrev();
            }
            
            // Reset scrolling flag after delay
            setTimeout(() => {
                isScrolling = false;
            }, 300);
        }
    }
    
    // Add mouse drag and scroll event listeners
    if (carousel) {
        // Mouse events
        carousel.addEventListener('mousedown', handleDragStart);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        
        // Mouse wheel scroll
        carousel.addEventListener('wheel', handleWheelScroll, { passive: false });
        
        // Touch events for mobile
        carousel.addEventListener('touchstart', handleDragStart, { passive: true });
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd, { passive: true });
        
        // Prevent default drag behavior on images
        carousel.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Set initial cursor
        carousel.style.cursor = 'grab';
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateCarousel();
    });
    
    // Initialize carousel
    updateCarousel();
});