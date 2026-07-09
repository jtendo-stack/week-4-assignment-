const cartItems = [];

function formatCurrency(amount) {
    return `ugx ${amount.toLocaleString()}`;
}

function updateCart() {
    const cartList = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    cartList.innerHTML = '';

    let total = 0;
    cartItems.forEach((item, index) => {
        const li = document.createElement('li');

        const itemText = document.createElement('span');
        itemText.textContent = `${item.name} - ${item.option} - ${formatCurrency(item.price)}`;

        const actions = document.createElement('div');
        actions.className = 'cart-item-actions';

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-item';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            cartItems.splice(index, 1);
            updateCart();
        });

        actions.appendChild(removeButton);
        li.appendChild(itemText);
        li.appendChild(actions);
        cartList.appendChild(li);

        total += item.price;
    });

    totalEl.textContent = total.toLocaleString();
}

function handleAddToCart(event) {
    const button = event.currentTarget;
    const card = button.closest('.product-card');
    if (!card) return;

    const name = button.dataset.name;
    const select = card.querySelector('select.product-options');
    const selectedOption = select ? select.options[select.selectedIndex] : null;
    const optionText = selectedOption ? selectedOption.text : 'Default item';
    const price = selectedOption ? Number(selectedOption.value) : 0;

    cartItems.push({
        name,
        option: optionText,
        price,
    });

    updateCart();
}

function attachCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

function handleCheckout() {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const paymentMethod = document.getElementById('payment-method').value;
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const messageEl = document.getElementById('checkout-message');

    if (cartItems.length === 0) {
        messageEl.textContent = 'Your cart is empty. Add items before checkout.';
        return;
    }

    if (!paymentMethod) {
        messageEl.textContent = 'Please select a mobile money payment method.';
        return;
    }

    if (!phoneNumber) {
        messageEl.textContent = 'Please enter your mobile money phone number.';
        return;
    }

    const thankYouText = document.getElementById('thankyou-text');
    const modal = document.getElementById('thankyou-modal');
    thankYouText.textContent = `Thank you for shopping with us! Your payment of ${formatCurrency(total)} via ${paymentMethod} will be processed shortly.`;
    modal.classList.add('active');

    cartItems.length = 0;
    updateCart();
    messageEl.textContent = '';
}

function closeModal() {
    const modal = document.getElementById('thankyou-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function filterProducts(event) {
    const searchTerm = event.target.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const select = card.querySelector('select.product-options');
        const options = Array.from(select?.options || []).map(option => option.text.toLowerCase()).join(' ');
        const cardText = `${title} ${options}`;

        const matches = searchTerm === '' || cardText.includes(searchTerm);
        card.style.display = matches ? '' : 'none';
    });
}

function attachCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
}

function attachSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
}

function attachModalClose() {
    const closeModalButton = document.getElementById('close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    const modal = document.getElementById('thankyou-modal');
    if (modal) {
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    attachCartButtons();
    attachCheckoutButton();
    attachSearch();
    attachModalClose();
    updateCart();
});
