(function () {
    // ===== NAVIGATION SYSTEM =====
    const sections = document.querySelectorAll('.page-section');
    const navButtons = document.querySelectorAll('.nav-link');
    const heroButtons = document.querySelectorAll('.hero-actions [data-target]');
    const footerYear = document.getElementById('footer-year');

    console.log('Sections found:', sections.length);
    console.log('Nav buttons found:', navButtons.length);

    // Navigation helper
    function showSection(id) {
        console.log('Showing section:', id);
        
        sections.forEach((sec) => {
            if (sec.id === id) {
                sec.classList.add('is-active');
                console.log('Section activated:', id);
            } else {
                sec.classList.remove('is-active');
            }
        });
        
        // Render products if booking section is shown
        if (id === 'booking' && typeof renderProducts === 'function') {
            setTimeout(() => {
                console.log('Rendering products for booking page');
                renderProducts();
            }, 100);
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            console.log('Button clicked, target:', target);
            showSection(target);
        });
    });

    heroButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            console.log('Hero button clicked, target:', target);
            showSection(target);
        });
    });

    // Footer year
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear().toString();
    }

    // ===== E-Commerce Products Data =====
    const products = [
        { id: 1, name: 'Ganesh Ji - White Marble', deity: 'Ganesh', material: 'Marble', price: 8500, originalPrice: 12000, emoji: '🐘', priceRange: '5000-10000' },
        { id: 2, name: 'Shiv Ji - Brass Statue', deity: 'Shiva', material: 'Brass', price: 15000, originalPrice: 22000, emoji: '⚡', priceRange: '10000-25000' },
        { id: 3, name: 'Krishna Ji - Gold Plated', deity: 'Krishna', material: 'Gold', price: 28000, originalPrice: 40000, emoji: '🪶', priceRange: '25000+' },
        { id: 4, name: 'Hanuman Ji - Clay Murti', deity: 'Hanuman', material: 'Clay', price: 5500, originalPrice: 8000, emoji: '🙏', priceRange: '5000-10000' },
        { id: 5, name: 'Durga Maa - Wooden Art', deity: 'Durga', material: 'Wood', price: 12000, originalPrice: 18000, emoji: '👑', priceRange: '10000-25000' },
        { id: 6, name: 'Ganesh Ji - Brass', deity: 'Ganesh', material: 'Brass', price: 16500, originalPrice: 24000, emoji: '🐘', priceRange: '10000-25000' },
        { id: 7, name: 'Shiv Ji - White Marble', deity: 'Shiva', material: 'Marble', price: 18000, originalPrice: 26000, emoji: '⚡', priceRange: '10000-25000' },
        { id: 8, name: 'Ram Ji - Wooden', deity: 'Ram', material: 'Wood', price: 9500, originalPrice: 14000, emoji: '🏹', priceRange: '5000-10000' },
        { id: 9, name: 'Krishna Ji - Marble', deity: 'Krishna', material: 'Marble', price: 32000, originalPrice: 45000, emoji: '🪶', priceRange: '25000+' },
        { id: 10, name: 'Durga Maa - Gold Plated', deity: 'Durga', material: 'Gold', price: 35000, originalPrice: 50000, emoji: '👑', priceRange: '25000+' },
        { id: 11, name: 'Hanuman Ji - Brass', deity: 'Hanuman', material: 'Brass', price: 14000, originalPrice: 20000, emoji: '🙏', priceRange: '10000-25000' },
        { id: 12, name: 'Ganesh Ji - Clay', deity: 'Ganesh', material: 'Clay', price: 6000, originalPrice: 9000, emoji: '🐘', priceRange: '5000-10000' }
    ];

    // ===== ORDER MANAGEMENT SYSTEM =====
    const orders = JSON.parse(localStorage.getItem('murtiOrders')) || [];
    
    function saveOrder(orderData) {
        const orderId = 'ORDER-' + Date.now();
        const orderTimestamp = new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        const order = {
            id: orderId,
            timestamp: orderTimestamp,
            ...orderData,
            status: 'New'
        };

        orders.unshift(order);
        localStorage.setItem('murtiOrders', JSON.stringify(orders));

        // Send notification
        sendOrderNotification(order);
        
        return order;
    }

    function sendOrderNotification(order) {
        const message = `
🎉 NEW ORDER RECEIVED! 🎉

📦 Order ID: ${order.id}
👤 Customer: ${order.fullName}
📱 Phone: ${order.mobile}
📍 Address: ${order.address}
💰 Total Amount: ₹${order.totalAmount}
📦 Quantity: ${order.quantity}
🚚 Delivery: ${order.delivery}
📝 Notes: ${order.notes || 'None'}
⏰ Time: ${order.timestamp}

✅ Status: ${order.status}

Thank you for your order!`;

        console.log('📨 ORDER NOTIFICATION:', message);

        // Show browser notification
        if (Notification.permission === 'granted') {
            new Notification('🎉 नई Murti Order आई है!', {
                body: `Order ID: ${order.id}\nCustomer: ${order.fullName}\nAmount: ₹${order.totalAmount}`,
                icon: '🛕',
                tag: order.id
            });
        }

        // Display alert
        alert('✅ Order placed successfully!\n\n' + 
            `Order ID: ${order.id}\n` +
            `Amount: ₹${order.totalAmount}\n` +
            `Delivery: ${order.delivery}\n\n` +
            'You will receive WhatsApp confirmation shortly!');
    }

    // Request notification permission
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Render products function
    function renderProducts(filteredProducts = products) {
        const grid = document.getElementById('products-grid');
        if (!grid) {
            console.warn('Products grid not found');
            return;
        }

        console.log('Rendering', filteredProducts.length, 'products');
        grid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" onclick="openProductModal(${product.id})">
                <div class="product-image">
                    ${product.emoji}
                    <span class="product-badge">30% OFF</span>
                </div>
                <div class="product-info">
                    <div class="product-deity">${product.deity}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-rating">⭐⭐⭐⭐⭐ (120)</div>
                    <div class="product-material">${product.material}</div>
                    <div class="product-price-section">
                        <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
                        <span class="product-original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <button class="product-buy-btn" onclick="event.stopPropagation(); openProductModal(${product.id})">View Details</button>
                </div>
            </div>
        `).join('');
    }

    // Prompt generation logic
    const promptForm = document.getElementById('prompt-form');
    const promptOutput = document.getElementById('prompt-output');
    const copyBtn = document.getElementById('copy-prompt');
    const downloadImageBtn = document.getElementById('download-image');
    const bookThisMurtiBtn = document.getElementById('book-this-murti');

    function buildPrompt(options) {
        const { deity, material, style, pose, background } = options;

        return [
            `A highly detailed ${material} Murti of ${deity},`,
            `${pose} in ${style} style,`,
            `${background},`,
            'devotional atmosphere, intricate carving, realistic textures, 8K quality, studio lighting, high dynamic range'
        ]
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getPromptOptionsFromForm() {
        if (!promptForm) return {};
        const getValue = (name) => {
            const input = promptForm.querySelector(`input[name="${name}"]:checked`);
            return input ? input.value : '';
        };

        return {
            deity: getValue('deity'),
            material: getValue('material'),
            style: getValue('style'),
            pose: getValue('pose'),
            background: getValue('background')
        };
    }

    let lastPromptOptions = null;

    if (promptForm) {
        promptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const options = getPromptOptionsFromForm();
            lastPromptOptions = options;
            const prompt = buildPrompt(options);
            if (promptOutput) {
                promptOutput.textContent = prompt;
            }
            showSection('output');
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const text = promptOutput ? promptOutput.textContent || '' : '';
            if (!text || text.startsWith('Your divine Murti prompt will appear')) {
                return;
            }
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Prompt';
                }, 1500);
            } catch (err) {
                console.error('Copy failed', err);
            }
        });
    }

    if (downloadImageBtn) {
        downloadImageBtn.addEventListener('click', () => {
            const text = promptOutput ? promptOutput.textContent : '';
            if (!text || text.startsWith('Your divine Murti prompt')) {
                alert('Please generate a prompt first!');
                return;
            }
            const blob = new Blob([text], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'divine-murti-prompt.txt';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }

    const selectedDeityField = document.getElementById('selected-deity');
    const selectedMaterialField = document.getElementById('selected-material');

    if (bookThisMurtiBtn) {
        bookThisMurtiBtn.addEventListener('click', () => {
            if (!lastPromptOptions) {
                lastPromptOptions = getPromptOptionsFromForm();
            }
            if (lastPromptOptions) {
                if (selectedDeityField) selectedDeityField.value = lastPromptOptions.deity || '';
                if (selectedMaterialField) selectedMaterialField.value = lastPromptOptions.material || '';
            }
            showSection('booking');
        });
    }

    // Gallery data & filtering
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryPromptViewer = document.getElementById('gallery-prompt-viewer');
    const galleryPromptText = document.getElementById('gallery-prompt-text');
    const filterDeity = document.getElementById('filter-deity');
    const filterMaterial = document.getElementById('filter-material');
    const filterFestival = document.getElementById('filter-festival');

    const galleryItems = [
        {
            id: 1,
            title: 'Ganesh Ji Marble Murti',
            deity: 'ganesh',
            material: 'marble',
            festival: 'ganesh-chaturthi',
            prompt:
                'A white marble Murti of Ganesh Ji in sitting pose, traditional Indian temple style, inside a beautifully lit temple with lotus flowers around, devotional atmosphere, intricate carving, high detail, 8K quality.'
        },
        {
            id: 2,
            title: 'Shiv Ji Stone Murti',
            deity: 'shiva',
            material: 'stone',
            festival: 'none',
            prompt:
                'A dark stone Murti of Shiv Ji in standing pose with blessing gesture, temple style, plain soft background with a subtle golden aura, powerful yet calm expression, detailed textures, 8K quality.'
        },
        {
            id: 3,
            title: 'Durga Maa Brass Murti',
            deity: 'durga',
            material: 'brass',
            festival: 'navratri',
            prompt:
                'A polished brass Murti of Durga Maa in standing pose, traditional Navratri decoration in the background, golden divine aura, rich ornaments, devotional atmosphere, ultra-realistic, 8K quality.'
        },
        {
            id: 4,
            title: 'Krishna Ji Wooden Murti',
            deity: 'krishna',
            material: 'wooden',
            festival: 'none',
            prompt:
                'A beautifully carved wooden Murti of Krishna Ji in dancing pose, modern minimal background with soft warm light, subtle lotus design at the base, detailed wood grain, artistic yet devotional, 8K quality.'
        }
    ];

    function renderGallery(items) {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        items.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.dataset.deity = item.deity;
            card.dataset.material = item.material;
            card.dataset.festival = item.festival;

            card.innerHTML = `
                <div class="gallery-img-placeholder"></div>
                <div class="gallery-title">${item.title}</div>
                <div class="gallery-meta">Deity: ${item.deity.toUpperCase()} | Material: ${item.material} | Festival: ${item.festival}</div>
            `;

            card.addEventListener('click', () => {
                if (galleryPromptViewer && galleryPromptText) {
                    galleryPromptText.textContent = item.prompt;
                    galleryPromptViewer.classList.remove('hidden');
                    showSection('gallery');
                }
            });

            galleryGrid.appendChild(card);
        });
    }

    function applyGalleryFilters() {
        if (!galleryGrid) return;
        const d = filterDeity ? filterDeity.value : 'all';
        const m = filterMaterial ? filterMaterial.value : 'all';
        const f = filterFestival ? filterFestival.value : 'all';

        const filtered = galleryItems.filter((item) => {
            const matchDeity = d === 'all' || item.deity === d;
            const matchMaterial = m === 'all' || item.material === m;
            const matchFestival = f === 'all' || item.festival === f;
            return matchDeity && matchMaterial && matchFestival;
        });

        renderGallery(filtered);
    }

    if (filterDeity) filterDeity.addEventListener('change', applyGalleryFilters);
    if (filterMaterial) filterMaterial.addEventListener('change', applyGalleryFilters);
    if (filterFestival) filterFestival.addEventListener('change', applyGalleryFilters);

    renderGallery(galleryItems);

    // Order form
    const orderForm = document.getElementById('order-form');
    const orderStatus = document.getElementById('order-status');
    const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');

    function buildWhatsAppMessage() {
        const fullName = document.getElementById('full-name')?.value || '';
        const mobile = document.getElementById('mobile')?.value || '';
        const address = document.getElementById('address')?.value || '';
        const deity = selectedDeityField?.value || '';
        const material = selectedMaterialField?.value || '';
        const quantity = document.getElementById('quantity')?.value || '1';
        
        const sizeInputs = document.querySelectorAll('input[name="size"]');
        let size = '';
        sizeInputs.forEach((input) => {
            if (input.checked) size = input.value;
        });
        
        const deliveryInputs = document.querySelectorAll('input[name="delivery"]');
        let delivery = '';
        deliveryInputs.forEach((input) => {
            if (input.checked) delivery = input.value;
        });
        
        const budgetInputs = document.querySelectorAll('input[name="budget"]');
        let budget = '';
        budgetInputs.forEach((input) => {
            if (input.checked) budget = input.value;
        });
        
        const notes = document.getElementById('notes')?.value || '';

        const message = `🙏 Jai Shri Ganesh 🙏

I would like to book a Murti.

🛕 Deity Name: ${deity}
🪨 Murti Material: ${material}
📏 Murti Size: ${size}
🔢 Quantity: ${quantity}
🚚 Delivery Type: ${delivery}
📍 City / Address: ${address}
💰 Budget Range: ${budget}
📅 Festival Date / Custom Work: ${notes}

Please contact me on this number to confirm the order.

Thank you 🙏`;

        return encodeURIComponent(message);
    }

    if (whatsappOrderBtn) {
        whatsappOrderBtn.addEventListener('click', () => {
            const message = buildWhatsAppMessage();
            const whatsappURL = `https://wa.me/918878953306?text=${message}`;
            window.open(whatsappURL, '_blank');
        });
    }

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect order data
            const fullName = document.getElementById('full-name').value;
            const mobile = document.getElementById('mobile').value;
            const address = document.getElementById('address').value;
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            
            const deityValue = selectedDeityField?.value || '';
            const materialValue = selectedMaterialField?.value || '';
            
            const notes = document.getElementById('notes').value;

            // Get selected delivery type
            const deliveryInputs = document.querySelectorAll('input[name="delivery"]');
            let delivery = '';
            deliveryInputs.forEach((input) => {
                if (input.checked) delivery = input.value;
            });

            // Calculate total amount (sample calculation)
            const pricePerUnit = 10000; // Average price
            const totalAmount = pricePerUnit * quantity;

            // Save order
            const orderData = {
                fullName,
                mobile,
                address,
                deity: deityValue,
                material: materialValue,
                quantity,
                delivery,
                notes,
                totalAmount
            };

            const savedOrder = saveOrder(orderData);

            // Show success message
            if (orderStatus) {
                orderStatus.innerHTML = `
                    <div style="background: #27ae60; padding: 20px; border-radius: 8px; color: white; text-align: center;">
                        <h3 style="margin-top: 0;">✅ Order Placed Successfully!</h3>
                        <p><strong>Order ID:</strong> ${savedOrder.id}</p>
                        <p><strong>Amount:</strong> ₹${totalAmount.toLocaleString('en-IN')}</p>
                        <p>आपके ऑर्डर को प्राप्त कर लिया गया है।<br>हम आपको जल्द ही WhatsApp पर संपर्क करेंगे।</p>
                        <p>🙏 Jai Shri Ganesh 🙏</p>
                    </div>
                `;
            }

            if (selectedDeityField && selectedMaterialField) {
                const deityValue = selectedDeityField.value;
                const materialValue = selectedMaterialField.value;
                orderForm.reset();
                selectedDeityField.value = deityValue;
                selectedMaterialField.value = materialValue;
            } else {
                orderForm.reset();
            }

            // Clear form after 3 seconds
            setTimeout(() => {
                orderForm.reset();
                hideOrderForm();
            }, 3000);
        });
    }

    // Open product modal
    window.openProductModal = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('product-modal');
        if (!modal) return;

        document.getElementById('modal-product-image').innerHTML = `<span style="font-size: 8rem;">${product.emoji}</span>`;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-price').textContent = `₹${product.price.toLocaleString('en-IN')}`;

        const highlights = document.getElementById('modal-highlights');
        highlights.innerHTML = `
            <li>Premium Quality ${product.material} Material</li>
            <li>Expert Artisan Craftsmanship</li>
            <li>Perfect for Temples & Homes</li>
            <li>Certified & Authenticated</li>
            <li>Fast & Safe Delivery</li>
        `;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    // Close modal
    const closeBtn = document.querySelector('.modal-close');
    const modal = document.getElementById('product-modal');
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Show order form
    window.showOrderForm = function() {
        const orderSection = document.getElementById('order-section');
        const modal = document.getElementById('product-modal');
        if (orderSection && modal) {
            modal.classList.add('hidden');
            orderSection.classList.remove('hidden');
            document.body.style.overflow = 'auto';
            orderSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Hide order form
    window.hideOrderForm = function() {
        const orderSection = document.getElementById('order-section');
        if (orderSection) {
            orderSection.classList.add('hidden');
            renderProducts();
        }
    };

    // Filter products
    function filterProducts() {
        const deityFilter = document.getElementById('filter-deity-shop')?.value || '';
        const materialFilter = document.getElementById('filter-material-shop')?.value || '';
        const priceFilter = document.getElementById('filter-price-shop')?.value || '';

        const filtered = products.filter(product => {
            const deityMatch = !deityFilter || product.deity === deityFilter;
            const materialMatch = !materialFilter || product.material === materialFilter;
            const priceMatch = !priceFilter || product.priceRange === priceFilter;
            return deityMatch && materialMatch && priceMatch;
        });

        renderProducts(filtered);
    }

    // Add filter listeners
    const deitySelect = document.getElementById('filter-deity-shop');
    const materialSelect = document.getElementById('filter-material-shop');
    const priceSelect = document.getElementById('filter-price-shop');

    if (deitySelect) deitySelect.addEventListener('change', filterProducts);
    if (materialSelect) materialSelect.addEventListener('change', filterProducts);
    if (priceSelect) priceSelect.addEventListener('change', filterProducts);

    // Initial render
    renderProducts();

    // Order form submission
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(orderForm);
            const orderStatus = document.getElementById('order-status');
            orderStatus.textContent = '✅ Order placed successfully! Our team will contact you within 24 hours.';
            orderForm.reset();
            setTimeout(() => {
                window.hideOrderForm();
                orderStatus.textContent = '';
            }, 3000);
        });
    }

    // ===== PRODUCT EDITING FUNCTION =====
    window.editProduct = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        document.getElementById('product-name').value = product.name;
        document.getElementById('product-deity').value = product.deity;
        document.getElementById('product-material').value = product.material;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-original-price').value = product.originalPrice;
        document.getElementById('product-emoji').value = product.emoji || '🐘';
        document.getElementById('product-price-range').value = product.priceRange;
        
        alert(`✏️ Editing: ${product.name}\n\nModify the values and click "Add / Update Product" to save changes.`);
        
        // Scroll to form
        document.getElementById('add-product-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteProduct = function(index) {
        if (confirm(`❌ Are you sure you want to delete: ${products[index].name}?`)) {
            products.splice(index, 1);
            renderProducts();
            alert('✅ Product deleted successfully!');
        }
    };

    // ===== ORDERS MANAGEMENT FUNCTIONS =====
    window.displayOrders = function(filterStatus = 'all') {
        const ordersTableBody = document.getElementById('orders-table-body');
        const noOrdersMsg = document.getElementById('no-orders-msg');
        
        if (!ordersTableBody) return;

        let filteredOrders = orders;
        if (filterStatus !== 'all') {
            filteredOrders = orders.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase());
        }

        if (filteredOrders.length === 0) {
            ordersTableBody.innerHTML = '';
            if (noOrdersMsg) noOrdersMsg.style.display = 'block';
            return;
        }

        if (noOrdersMsg) noOrdersMsg.style.display = 'none';

        ordersTableBody.innerHTML = filteredOrders.map((order, index) => `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.fullName}</td>
                <td>${order.mobile}</td>
                <td>₹${order.totalAmount.toLocaleString('en-IN')}</td>
                <td>${order.deity || '-'}</td>
                <td>${order.material || '-'}</td>
                <td style="font-size: 0.85rem; color: #999;">${order.timestamp}</td>
                <td>
                    <select onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 4px 8px; background: rgba(212, 175, 55, 0.1); color: #d4af37; border: 1px solid #d4af37; border-radius: 4px; cursor: pointer;">
                        <option value="New" ${order.status === 'New' ? 'selected' : ''}>🆕 New</option>
                        <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>✅ Confirmed</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>🚚 Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>✓ Delivered</option>
                    </select>
                </td>
                <td>
                    <button class="ghost-btn" onclick="viewOrderDetails('${order.id}')" style="padding: 4px 8px; font-size: 0.8rem;">View</button>
                </td>
            </tr>
        `).join('');
    };

    window.filterOrders = function(status) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Display filtered orders
        displayOrders(status);
    };

    window.updateOrderStatus = function(orderId, newStatus) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            localStorage.setItem('murtiOrders', JSON.stringify(orders));
            
            // Show notification
            alert(`✅ Order ${orderId} status updated to: ${newStatus}`);
            displayOrders('all');
        }
    };

    window.viewOrderDetails = function(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            const details = `
╔════════════════════════════════════╗
║    🛕 MURTI ORDER DETAILS 🛕      ║
╚════════════════════════════════════╝

📦 Order ID: ${order.id}
⏰ Date & Time: ${order.timestamp}
📊 Status: ${order.status}

👤 CUSTOMER INFORMATION
├─ Name: ${order.fullName}
├─ Phone: ${order.mobile}
└─ Address: ${order.address}

🛍️ ORDER DETAILS
├─ Deity: ${order.deity}
├─ Material: ${order.material}
├─ Quantity: ${order.quantity}
└─ Delivery: ${order.delivery}

💰 PAYMENT
└─ Total Amount: ₹${order.totalAmount.toLocaleString('en-IN')}

📝 NOTES
└─ ${order.notes || 'No additional notes'}

═════════════════════════════════════

📞 Call/WhatsApp: ${order.mobile}
            `;
            alert(details);
        }
    };
})();
