const PAGE_SIZE = 10;
const COLUMNS = ['Name', 'Department', 'Experience', 'City'];

async function fetchPlaceholders() {
  const resp = await fetch('/placeholders.json');
  if (!resp.ok) return {};
  const json = await resp.json();
  const placeholders = {};
  (json.data || []).forEach((row) => {
    placeholders[row.Key] = row.Text;
  });
  return placeholders;
}

function renderRow(employee) {
  const tr = document.createElement('tr');
  COLUMNS.forEach((column) => {
    const td = document.createElement('td');
    td.textContent = employee[column] || '';
    tr.append(td);
  });
  return tr;
}

export default async function decorate(block) {
  const link = block.querySelector('a')?.href || '/employees.json';
  block.textContent = '';

  const resp = await fetch(link);
  if (!resp.ok) return;
  const { data: employees = [] } = await resp.json();

  const table = document.createElement('table');
  table.innerHTML = `<thead><tr>${COLUMNS.map((column) => `<th>${column}</th>`).join('')}</tr></thead>`;
  const tbody = document.createElement('tbody');
  table.append(tbody);
  block.append(table);

  const placeholders = await fetchPlaceholders();
  const loadMoreButton = document.createElement('button');
  loadMoreButton.type = 'button';
  loadMoreButton.className = 'employee-list-load-more button';
  loadMoreButton.textContent = placeholders.loadMore || 'Load more';

  let shown = 0;
  const showNextPage = () => {
    employees
      .slice(shown, shown + PAGE_SIZE)
      .forEach((employee) => tbody.append(renderRow(employee)));
    shown += PAGE_SIZE;
    if (shown >= employees.length) loadMoreButton.remove();
  };

  loadMoreButton.addEventListener('click', showNextPage);
  showNextPage();
  if (employees.length > PAGE_SIZE) block.append(loadMoreButton);
}
