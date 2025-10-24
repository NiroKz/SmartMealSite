document.addEventListener('DOMContentLoaded', () => {
  const PRODUCTS_ENDPOINT = '/backend/api/products.php';
  const MENUS_ENDPOINT = '/backend/api/menus.php';

  const form = document.getElementById('menuForm');
  const mainSelect = document.getElementById('main_dish');
  const sideSelect = document.getElementById('side_dish');
  const submitBtn = form && form.querySelector('button[type="submit"]');

  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  async function loadProducts(){
    if (!mainSelect || !sideSelect) return;
    mainSelect.innerHTML = '<option value="">Carregando produtos...</option>';
    sideSelect.innerHTML = '<option value="">Carregando produtos...</option>';
    try {
      const res = await fetch(PRODUCTS_ENDPOINT);
      if (!res.ok) throw new Error('network');
      const products = await res.json();
      mainSelect.innerHTML = '<option value="">Selecione o produto</option>';
      sideSelect.innerHTML = '<option value="">Nenhum</option><option value="">Selecione o produto</option>';
      products.forEach(p => {
        const label = `${p.product_name}${p.unit ? ` (${p.unit})` : ''}`;
        const opt = document.createElement('option');
        opt.value = p.id_product;
        opt.textContent = label;
        mainSelect.appendChild(opt);
        const opt2 = opt.cloneNode(true);
        sideSelect.appendChild(opt2);
      });
    } catch (err) {
      console.error('Erro ao carregar produtos', err);
      mainSelect.innerHTML = '<option value="">Erro ao carregar</option>';
      sideSelect.innerHTML = '<option value="">Erro ao carregar</option>';
    }
  }

  async function submitForm(e){
    e.preventDefault();
    if (!form) return;

    const payload = {
      date_menu: form.date_menu?.value || '',
      type_meal: form.type_meal?.value || '',
      main_dish_id: form.main_dish?.value || null,
      side_dish_id: form.side_dish?.value || null,
      dessert: form.dessert?.value?.trim?.() || null,
      ingredients: form.ingredients?.value?.trim?.() || null,
      portions: form.portions ? parseInt(form.portions.value || 0, 10) : undefined,
      notes: form.notes?.value?.trim?.() || null
    };

    if (!payload.date_menu || !payload.type_meal || !payload.main_dish_id) {
      showPopup('Erro.', 'Preencha data, refeição e prato principal.');
      return;
    }

    try {
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Salvando...'; }
      const res = await fetch(MENUS_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(()=>null);
      if (res.ok) {
        showPopup('Sucesso!', 'Cardápio salvo com sucesso.');
        form.reset();
      } else {
        console.error('Erro salvar cardápio:', data);
        showPopup('Erro.', data?.message || res.statusText || 'Falha ao salvar.');
      }
    } catch (err) {
      console.error(err);
      showPopup('Erro.', 'Falha na requisição ao salvar cardápio.');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Salvar Cardápio'; }
    }
  }

  if (form) form.addEventListener('submit', submitForm);
  loadProducts();
});