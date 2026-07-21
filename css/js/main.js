function showTab(tabId) {
    // Esconde todas as abas
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Remove classe ativa de todos os links
    const links = document.querySelectorAll('nav a');
    links.forEach(link => link.classList.remove('active'));

    // Mostra a aba selecionada
    const selectedTab = document.getElementById('tab-' + tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Ativa o link correto no menu
    event.target.classList.add('active');

    // Fecha menu mobile se estiver aberto
    document.querySelector('nav ul').classList.remove('show');
}

// Menu Mobile
document.getElementById('mobile-menu').addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('show');
});
