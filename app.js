document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Azadi Modal Logic (index.html mostly)
    // ==========================================
    const modal = document.getElementById('azadi-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const claimBtn = document.getElementById('claim-offer-btn');

    // Show modal if not seen before
    if (modal && !localStorage.getItem('azadi_promo_seen')) {
        setTimeout(() => {
            modal.showModal();
        }, 1500);
    }

    const closeModal = () => {
        if (modal) {
            modal.close();
            localStorage.setItem('azadi_promo_seen', 'true');
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    if (claimBtn) {
        claimBtn.addEventListener('click', () => {
            localStorage.setItem('azadi_promo_code', 'AZADI14');
            alert('Promo Code AZADI14 claimed! It will be applied at checkout.');
            closeModal();
            updateCartUI(); // Update cart if we are on menu.html
        });
    }

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            const dialogDimensions = modal.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                closeModal();
            }
        });
    }

    // ==========================================
    // 2. Dynamic Cart System (menu.html)
    // ==========================================
    const cartItemsContainer = document.getElementById('cart-items');
    
    window.addToCart = (itemName, price) => {
        let cart = JSON.parse(localStorage.getItem('artisan_cart')) || [];
        let existingItem = cart.find(i => i.name === itemName);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name: itemName, price: parseFloat(price), qty: 1 });
        }
        localStorage.setItem('artisan_cart', JSON.stringify(cart));
        updateCartUI();
    };

    window.removeFromCart = (itemName) => {
        let cart = JSON.parse(localStorage.getItem('artisan_cart')) || [];
        cart = cart.filter(i => i.name !== itemName);
        localStorage.setItem('artisan_cart', JSON.stringify(cart));
        updateCartUI();
    };

    // Make "Add to Order" buttons work
    const addButtons = document.querySelectorAll('.menu-item .btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // traverse DOM to find name and price
            const card = e.target.closest('.menu-item');
            if (card) {
                const name = card.querySelector('h2, h3').textContent;
                const priceText = card.querySelector('.price').textContent;
                const price = priceText.replace('$', '');
                addToCart(name, price);
            }
        });
    });

    const updateCartUI = () => {
        if (!cartItemsContainer) return; // not on menu page

        let cart = JSON.parse(localStorage.getItem('artisan_cart')) || [];
        cartItemsContainer.innerHTML = '';
        
        let subtotal = 0;
        let totalQty = 0;

        cart.forEach(item => {
            subtotal += item.price * item.qty;
            totalQty += item.qty;

            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <span>x${item.qty}</span>
                </div>
                <div class="cart-item-price">
                    <span class="cart-price">$${(item.price * item.qty).toFixed(2)}</span>
                    <button class="btn btn-remove" onclick="removeFromCart('${item.name}')" aria-label="Remove ${item.name}">x</button>
                </div>
            `;
            cartItemsContainer.appendChild(li);
        });

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<li><div class="cart-item-info"><span>Your cart is empty.</span></div></li>';
        }

        const countEl = document.querySelector('.cart-item-count');
        if (countEl) countEl.textContent = `${totalQty} items`;

        // Promo code logic
        const promoInput = document.getElementById('promo-code');
        let discount = 0;
        
        // Auto-fill promo code if claimed
        const savedPromo = localStorage.getItem('azadi_promo_code');
        if (savedPromo && promoInput) {
            promoInput.value = savedPromo;
        }

        if (promoInput && promoInput.value.toUpperCase() === 'AZADI14') {
            discount = subtotal * 0.14;
        }

        const tax = (subtotal - discount) * 0.10; // 10% tax
        const total = subtotal - discount + tax;

        // Update Summary DOM
        const summaryRows = document.querySelectorAll('.cart-summary .summary-row');
        if (summaryRows.length >= 3) {
            summaryRows[0].querySelectorAll('span')[1].textContent = `$${subtotal.toFixed(2)}`;
            
            // Handle optional discount row
            let taxRowIndex = 1;
            if (discount > 0) {
                // Check if discount row already exists
                let discRow = document.getElementById('discount-row');
                if (!discRow) {
                    discRow = document.createElement('div');
                    discRow.className = 'summary-row';
                    discRow.id = 'discount-row';
                    discRow.style.color = 'var(--gold-dark)';
                    summaryRows[0].after(discRow);
                }
                discRow.innerHTML = `<span>Promo (AZADI14)</span><span>-$${discount.toFixed(2)}</span>`;
                taxRowIndex = 2;
            } else {
                const discRow = document.getElementById('discount-row');
                if (discRow) discRow.remove();
            }

            const updatedSummaryRows = document.querySelectorAll('.cart-summary .summary-row');
            if (updatedSummaryRows.length >= 3) {
                updatedSummaryRows[taxRowIndex].querySelectorAll('span')[1].textContent = `$${tax.toFixed(2)}`;
                updatedSummaryRows[taxRowIndex + 1].querySelector('strong').textContent = `$${total.toFixed(2)}`;
            }
        }
    };

    // Apply promo button
    const applyBtn = document.querySelector('.promo-input-group .apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const input = document.getElementById('promo-code');
            if (input && input.value.toUpperCase() === 'AZADI14') {
                localStorage.setItem('azadi_promo_code', 'AZADI14');
                alert('Promo applied successfully!');
                updateCartUI();
            } else {
                alert('Invalid promo code.');
            }
        });
    }

    // Initialize UI on load
    updateCartUI();
});

