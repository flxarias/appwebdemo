(function () {
    const STORAGE_KEY = 'shoppingList';
    const HISTORY_KEY = 'productHistory';
    const productForm = document.getElementById('product-form');
    const nameInput = document.getElementById('name');
    const quantityInput = document.getElementById('quantity');
    const categoryInput = document.getElementById('category');
    const productList = document.getElementById('product-list');
    const totalCount = document.getElementById('total-count');
    const boughtCount = document.getElementById('bought-count');
    const clearBtn = document.getElementById('clear-list');
    const exportBtn = document.getElementById('export-list');

    let items = [];
    let history = {};

    // Cargar datos de localStorage al iniciar
    function loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        items = stored ? JSON.parse(stored) : [];
        const hist = localStorage.getItem(HISTORY_KEY);
        history = hist ? JSON.parse(hist) : {};
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    function render() {
        productList.innerHTML = '';
        items.forEach((item, index) => {
            const tr = document.createElement('tr');

            const tdCheck = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.bought;
            checkbox.addEventListener('change', () => toggleBought(index));
            tdCheck.appendChild(checkbox);
            tr.appendChild(tdCheck);

            const tdName = document.createElement('td');
            tdName.textContent = item.name;
            tr.appendChild(tdName);

            const tdQty = document.createElement('td');
            tdQty.textContent = item.quantity;
            tr.appendChild(tdQty);

            const tdCat = document.createElement('td');
            tdCat.textContent = item.category || '-';
            tr.appendChild(tdCat);

            const tdActions = document.createElement('td');
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Eliminar';
            delBtn.addEventListener('click', () => deleteItem(index));
            tdActions.appendChild(delBtn);
            tr.appendChild(tdActions);

            productList.appendChild(tr);
        });
        updateStats();
    }

    function updateStats() {
        totalCount.textContent = items.length;
        const bought = items.filter(i => i.bought).length;
        boughtCount.textContent = bought;
    }

    function addItem(e) {
        e.preventDefault();
        const name = nameInput.value.trim();
        const quantity = quantityInput.value.trim();
        const category = categoryInput.value;
        if (!name || !quantity) return;
        items.push({ name, quantity, category, bought: false });
        // actualizar historial
        history[name] = (history[name] || 0) + 1;
        saveData();
        render();
        productForm.reset();
    }

    function deleteItem(index) {
        items.splice(index, 1);
        saveData();
        render();
    }

    function toggleBought(index) {
        items[index].bought = !items[index].bought;
        saveData();
        render();
    }

    function clearList() {
        if (confirm('¿Vaciar toda la lista?')) {
            items = [];
            saveData();
            render();
        }
    }

    function exportList() {
        const dataStr = JSON.stringify(items, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lista-compra.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Event Listeners
    productForm.addEventListener('submit', addItem);
    clearBtn.addEventListener('click', clearList);
    exportBtn.addEventListener('click', exportList);

    // Inicializar
    loadData();
    render();
})();
