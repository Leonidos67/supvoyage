// CLOSE NEWS PROFILE INFO
// if (localStorage.getItem('profileNewsClosed') === 'true') {
//     document.getElementById('profileNews').style.display = 'none';
// }

document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('profileNews').style.display = 'none';
    localStorage.setItem('profileNewsClosed', 'true'); // Сохраняем состояние
});