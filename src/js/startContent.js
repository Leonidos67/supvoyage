
// JS для переключения вкладок в разделе start
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-pill');
    const tabContents = document.querySelectorAll('.tab-content-section');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const tab = this.getAttribute('data-tab');
            tabContents.forEach(cont => {
                cont.style.display = cont.id === tab ? 'block' : 'none';
            });
        });
    });
});